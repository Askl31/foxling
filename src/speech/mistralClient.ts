/**
 * Génération d'histoires à la demande depuis l'espace parent.
 *
 * Deux modes :
 *  - PRODUCTION (Netlify/Vercel) : appel au proxy serverless local
 *    `POST /api/generate-story`. La clé MISTRAL_API_KEY vit côté serveur
 *    (variable d'environnement de la plateforme) et n'atteint JAMAIS le navigateur.
 *  - DÉVELOPPEMENT local : si une clé est fournie manuellement, appel direct à
 *    l'API Mistral (clé en sessionStorage uniquement, jamais persistée ni loguée).
 *
 * Dans tous les cas, le résultat est validé localement (liste blanche) avant usage.
 */

const MISTRAL_CHAT_URL = 'https://api.mistral.ai/v1/chat/completions';
const PROXY_PATH = '/api/generate-story';
const KEY_SESSIONSTORAGE = 'foxling-mistral-key-dev';

const SYSTEM_PROMPT = `You write interactive stories for children aged 4-6 learning English as a second language.
Rules (strict):
- Use ONLY words from the allowed word list provided by the user. Never invent other vocabulary words.
- 4 to 6 pages. Each page: 1 short sentence (max 6 words), present simple.
- Repetitive structure (like "Brown Bear, Brown Bear, What Do You See?").
- Use the child's first name at least twice.
- Each page except the last must end with a clickable question with 2-3 short choices, one correct.
- Output STRICT JSON only, no markdown, shape:
{"title": string, "pages": [{"text": string, "imageHint": string, "question": {"prompt": string, "choices": string[], "answerIndex": number} | null}]}
imageHint must be one of: cat, dog, duck, fish, bird, cow, horse, pig, sheep, rabbit, mouse, frog, apple, banana, milk, water, bread, cheese, egg, cake, cookie, juice, sun, cloud, rain, tree, flower, rainbow, star, moon, house, bed, table, chair, door, window, ball, doll, car, teddy, blocks, bus, bike, plane, boat, train, lion, elephant, monkey, tiger, snake, bear, mummy, daddy, baby, brother, sister, grandma, grandpa, happy, sad, angry, scared, tired, hungry, hello, goodbye, foxy.`;

export function setDevMistralKey(key: string): void {
  const trimmed = key.trim();
  if (trimmed) sessionStorage.setItem(KEY_SESSIONSTORAGE, trimmed);
  else sessionStorage.removeItem(KEY_SESSIONSTORAGE);
}

export function hasDevMistralKey(): boolean {
  return sessionStorage.getItem(KEY_SESSIONSTORAGE) !== null;
}

export function clearDevMistralKey(): void {
  sessionStorage.removeItem(KEY_SESSIONSTORAGE);
}

export interface MistralStoryRequest {
  allowedWords: string[];
  childName: string;
  passions: string[];
  theme: string;
}

async function callProxy(req: MistralStoryRequest): Promise<string> {
  const res = await fetch(PROXY_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await res.json().catch(() => ({})) as { error?: string; story?: string };
  if (!res.ok) throw new Error(data.error ?? `Proxy: HTTP ${res.status}`);
  return data.story ?? '';
}

async function callDirect(req: MistralStoryRequest): Promise<string> {
  const key = sessionStorage.getItem(KEY_SESSIONSTORAGE);
  if (!key) throw new Error('Clé de développement non configurée.');
  const user = `Allowed words: ${req.allowedWords.join(', ')}\nChild name: ${req.childName}\nPassions: ${req.passions.join(', ') || 'none'}\nTheme: ${req.theme}\nWrite the story now as strict JSON.`;
  let res: Response;
  try {
    res = await fetch(MISTRAL_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 900,
        response_format: { type: 'json_object' },
      }),
    });
  } catch {
    throw new Error('Appel API Mistral impossible (réseau ?).');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`API Mistral: HTTP ${res.status} ${body.error?.message ?? ''}`.trim());
  }
  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? '';
}

export async function generateStoryWithMistral(req: MistralStoryRequest): Promise<string> {
  try {
    return await callProxy(req);
  } catch (proxyErr) {
    if (hasDevMistralKey()) {
      return callDirect(req);
    }
    throw new Error(
      `Proxy serveur indisponible (${(proxyErr as Error).message}). ` +
      'Sur Netlify/Vercel, définissez MISTRAL_API_KEY dans les variables d\'environnement du site. ' +
      'En local, collez votre clé dans ce panneau (mode développement, jamais persistée).',
    );
  }
}
