/**
 * Vercel Edge Function : TTS à la demande côté serveur (clé MISTRAL_API_KEY en env Vercel).
 * POST /api/tts  body: { text } → audio/mpeg (MP3 Voxtral).
 * La logique vit dans server/ttsCore.ts, partagée avec le serveur de dev Vite.
 */
import { handleTtsRequest } from '../server/ttsCore';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleTtsRequest(request, process.env);
}
