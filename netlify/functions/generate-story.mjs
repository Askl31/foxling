/**
 * Netlify Function : proxy sécurisé vers l'API Mistral.
 * La clé MISTRAL_API_KEY est définie dans les variables d'environnement Netlify
 * (Settings → Environment variables) et n'est JAMAIS exposée au navigateur.
 *
 * POST /.netlify/functions/generate-story
 * body: { allowedWords: string[], childName: string, passions: string[], theme: string }
 * → { story: {...} } (JSON validé côté client ensuite par validateStory)
 */
const MISTRAL_CHAT_URL = 'https://api.mistral.ai/v1/chat/completions';

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

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Méthode non autorisée' }) };
  }
  const key = process.env.MISTRAL_API_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: 'MISTRAL_API_KEY non configurée côté serveur (variables d\'environnement Netlify).' }) };
  }
  let body;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON invalide' }) };
  }
  const { allowedWords, childName, passions, theme } = body;
  if (!Array.isArray(allowedWords) || !allowedWords.length || !childName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'allowedWords et childName requis' }) };
  }
  const user = `Allowed words: ${allowedWords.join(', ')}\nChild name: ${String(childName).slice(0, 20)}\nPassions: ${(passions ?? []).join(', ') || 'none'}\nTheme: ${theme ?? 'farm'}\nWrite the story now as strict JSON.`;
  try {
    const res = await fetch(MISTRAL_CHAT_URL, {
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
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { statusCode: 502, body: JSON.stringify({ error: `API Mistral: HTTP ${res.status} ${errBody?.error?.message ?? ''}`.trim() }) };
    }
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story: data.choices[0]?.message?.content ?? '' }),
    };
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Appel API Mistral impossible depuis le serveur.' }) };
  }
};

export const config = { path: '/api/generate-story' };
