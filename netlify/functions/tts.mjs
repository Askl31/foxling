/**
 * Netlify Function : TTS à la demande côté serveur (clé MISTRAL_API_KEY en env Netlify).
 * POST /.netlify/functions/tts  body: { text: string }
 * → audio/mpeg (MP3 Voxtral). Le client le met en cache (CacheStorage) pour l'offline.
 * Alias déployé : /api/tts
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Méthode non autorisée' };
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return { statusCode: 500, body: JSON.stringify({ error: 'MISTRAL_API_KEY non configurée côté serveur.' }) };
  let body;
  try { body = JSON.parse(event.body ?? '{}'); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'JSON invalide' }) }; }
  const text = String(body?.text ?? '').slice(0, 500);
  if (!text) return { statusCode: 400, body: JSON.stringify({ error: 'text requis' }) };
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
      return { statusCode: 502, body: JSON.stringify({ error: `API Mistral: HTTP ${res.status} ${err?.error?.message ?? ''}`.trim() }) };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { statusCode: 200, headers: { 'Content-Type': 'audio/mpeg' }, body: buf.toString('base64'), isBase64Encoded: true };
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Appel API Mistral impossible depuis le serveur.' }) };
  }
};

export const config = { path: '/api/tts' };
