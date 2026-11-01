/**
 * Vercel Edge Function : TTS à la demande côté serveur (clé MISTRAL_API_KEY en env Vercel).
 * POST /api/tts  body: { text } → audio/mpeg (MP3 Voxtral).
 */
export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return new Response('Méthode non autorisée', { status: 405 });
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: 'MISTRAL_API_KEY non configurée côté serveur.' }), { status: 500 });
  let body: unknown;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'JSON invalide' }), { status: 400 }); }
  const text = String((body as { text?: string })?.text ?? '').slice(0, 500);
  if (!text) return new Response(JSON.stringify({ error: 'text requis' }), { status: 400 });
  try {
    const res = await fetch('https://api.mistral.ai/v1/audio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'voxtral-mini-tts-3-0',
        input: text,
        voice_id: process.env.MISTRAL_TTS_VOICE ?? 'gb_jane_neutral',
        response_format: 'mp3',
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: `API Mistral: HTTP ${res.status} ${err?.error?.message ?? ''}`.trim() }), { status: 502 });
    }
    const buf = await res.arrayBuffer();
    return new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Appel API Mistral impossible depuis le serveur.' }), { status: 502 });
  }
}
