/**
 * Cœur TTS partagé côté serveur : la fonction Vercel Edge (api/tts.ts) et le
 * serveur de dev/preview Vite (vite.config.ts) délèguent ici. La clé API ne
 * transite que côté serveur.
 * POST body: { text } → audio/mpeg (MP3 Voxtral).
 */

export interface TtsEnv {
  MISTRAL_API_KEY?: string;
  MISTRAL_TTS_VOICE?: string;
}

export async function handleTtsRequest(request: Request, env: TtsEnv): Promise<Response> {
  if (request.method !== 'POST') return new Response('Méthode non autorisée', { status: 405 });
  const key = env.MISTRAL_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: 'MISTRAL_API_KEY non configurée côté serveur.' }), { status: 500 });
  let body: unknown;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'JSON invalide' }), { status: 400 }); }
  const rawText = typeof body === 'object' && body !== null && 'text' in body ? body.text : undefined;
  const text = String(rawText ?? '').slice(0, 500);
  if (!text) return new Response(JSON.stringify({ error: 'text requis' }), { status: 400 });
  try {
    const res = await fetch('https://api.mistral.ai/v1/audio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'voxtral-mini-tts-3-0',
        input: text,
        voice_id: env.MISTRAL_TTS_VOICE ?? 'gb_jane_neutral',
        response_format: 'mp3',
      }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
      return new Response(JSON.stringify({ error: `API Mistral: HTTP ${res.status} ${err?.error?.message ?? ''}`.trim() }), { status: 502 });
    }
    const rawBuf = await res.arrayBuffer();
    const str = new TextDecoder().decode(rawBuf.slice(0, 30));
    if (str.startsWith('{"audio_data"')) {
      const json: unknown = JSON.parse(new TextDecoder().decode(rawBuf));
      if (typeof json === 'object' && json !== null && 'audio_data' in json && typeof json.audio_data === 'string') {
        const binStr = atob(json.audio_data);
        const u8 = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) u8[i] = binStr.charCodeAt(i);
        return new Response(u8, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
      }
    }
    return new Response(rawBuf, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Appel API Mistral impossible depuis le serveur.' }), { status: 502 });
  }
}
