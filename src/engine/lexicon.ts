import type { Stage } from './stages';
import { isAcquired } from './stages';
import type { Story } from './types';

const STOPWORDS = new Set([
  'a',
  'all',
  'am',
  'an',
  'and',
  'any',
  'are',
  'around',
  'at',
  'baa',
  'beep',
  'boing',
  'bounce',
  'bye',
  'choo',
  'close',
  'color',
  'count',
  'crunch',
  'did',
  'do',
  'does',
  "don't",
  'down',
  'each',
  'every',
  'foxy',
  'go',
  'goes',
  'he',
  'here',
  'hi',
  'how',
  'i',
  'in',
  'is',
  'it',
  'jumps',
  'let',
  'lets',
  'listen',
  'little',
  'look',
  'many',
  'meow',
  'more',
  'my',
  'nice',
  'not',
  'now',
  'of',
  'oh',
  'on',
  'oops',
  'open',
  'or',
  'other',
  'own',
  'plip',
  'plop',
  'rawr',
  'ribbit',
  'roar',
  'runs',
  'same',
  'say',
  'says',
  'see',
  'sees',
  'she',
  'so',
  'some',
  'stack',
  'swim',
  'swims',
  'thank',
  'that',
  'the',
  'there',
  'they',
  'this',
  'to',
  'too',
  'tweet',
  'up',
  'very',
  'was',
  'we',
  'what',
  'who',
  'with',
  'wow',
  'yay',
  'you',
  'your',
  'yum',
  'am',
  'ate',
  'brushes',
  'can',
  'clapped',
  'come',
  'comes',
  'could',
  'danced',
  'draws',
  'drinks',
  'eats',
  'feel',
  'feels',
  'fine',
  'friend',
  'get',
  'give',
  'gives',
  'go',
  'gone',
  'gonna',
  'good',
  'got',
  'has',
  'have',
  'home',
  'jumped',
  'like',
  'likes',
  'loves',
  'made',
  'make',
  'makes',
  'may',
  'might',
  'must',
  'need',
  'needs',
  'night',
  'plays',
  'ran',
  'reads',
  'sat',
  'should',
  'sings',
  'sky',
  'sleeps',
  'stood',
  'stopped',
  'take',
  'takes',
  'touched',
  'turned',
  'wanna',
  'want',
  'wants',
  'washes',
  'went',
  'will',
  'would',
  'zoo',
  'well',
  'tight',
  'nice',
  'soft',
  'them',
  'grows',
  'smile',
  'soon',
  'swings',
  'find',
  'finds',
]);

/**
 * Normalise un mot de l'histoire : minuscules, sans ponctuation.
 */
export function normalizeToken(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z'-]/g, '');
}

/**
 * Liste blanche stricte (§8.1) : mots autorisés = Acquired ∪ D30 ∪ D14 ∪ mots de la session du jour. Un pluriel en -s est accepté si son lemme est autorisé.
 * Les mots-outils grammaticaux de base et le nom du personnage sont toujours autorisés.
 */
export function allowedLexicon(
  wordStates: Record<string, { stage: Stage }>,
  sessionWordIds: string[] = [],
): Set<string> {
  const allowed = new Set<string>(STOPWORDS);
  for (const [id, st] of Object.entries(wordStates)) {
    if (st.stage === 'D14' || st.stage === 'D30' || isAcquired(st.stage)) {
      allowed.add(id);
    }
  }
  for (const id of sessionWordIds) allowed.add(id);
  return allowed;
}

/**
 * Validateur programmatique (§8.1) : chaque token de l'histoire doit appartenir à la liste blanche.
 * Retourne la liste des mots hors liste (vide = histoire valide).
 */
export function validateStory(story: Story, allowed: Set<string>): string[] {
  const violations: string[] = [];
  for (const page of story.pages) {
    for (const token of page.text.split(/\s+/)) {
      const norm = normalizeToken(token);
      if (!norm) continue;
      if (allowed.has(norm)) continue;
      if (norm.endsWith('s') && norm.length > 3 && allowed.has(norm.slice(0, -1))) continue;
      violations.push(norm);
    }
  }
  return [...new Set(violations)];
}

export function storyWordCount(story: Story): number {
  return story.pages.reduce((acc, p) => acc + p.text.split(/\s+/).filter(Boolean).length, 0);
}
