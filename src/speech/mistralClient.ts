/**
 * Client Mistral pour la GÉNÉRATION DE CONTENU UNIQUEMENT (histoires, voix),
 * jamais pendant une session enfant. Appelé depuis l'espace parent.
 *
 * Garde-fous :
 *  - la clé n'est JAMAIS persistée (sessionStorage uniquement, vidée à la fermeture de l'onglet) ;
 *  - la clé n'est JAMAIS loguée ni incluse dans un message d'erreur ;
 *  - un seul domaine est contacté : api.mistral.ai ;
 *  - chaque génération est validée localement (liste blanche) avant usage.
 */

const MISTRAL_CHAT_URL = 'https://api.mistral.ai/v1/chat/completions';
const KEY_SESSIONSTORAGE = 'foxling-mistral-key';

export function setMistralKey(key: string): void {
  const trimmed = key.trim();
  if (trimmed) sessionStorage.setItem(KEY_SESSIONSTORAGE, trimmed);
  else sessionStorage.removeItem(KEY_SESSIONSTORAGE);
}

export function hasMistralKey(): boolean {
  return sessionStorage.getItem(KEY_SESSIONSTORAGE) !== null;
}

export function clearMistralKey(): void {
  sessionStorage.removeItem(KEY_SESSIONSTORAGE);
}

export interface MistralStoryRequest {
  allowedWords: string[];
  childName: string;
  passions: string[];
  theme: string;
}

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

export async function generateStoryWithMistral(req: MistralStoryRequest): Promise<string> {
  const key = sessionStorage.getItem(KEY_SESSIONSTORAGE);
  if (!key) throw new Error('Clé Mistral non configurée (espace parent).');
  const user = `Allowed words: ${req.allowedWords.join(', ')}
Child name: ${req.childName}
Passions: ${req.passions.join(', ') || 'none'}
Theme: ${req.theme}
Write the story now as strict JSON.`;
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
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json() as { error?: { message?: string } };
      if (body.error?.message) detail = body.error.message;
    } catch { /* ignore */ }
    throw new Error(`API Mistral: ${detail}`);
  }
  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? '';
}
