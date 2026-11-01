import type { Stage } from './stages';
import { isAcquired } from './stages';
import type { Story } from './types';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'am', 'he', 'she', 'it', 'and', 'to', 'foxy', 'what', 'does', 'sees', 'see',
  'hello', 'goodbye', 'happy', 'sad', 'hungry', 'here', 'my', 'your', 'i', 'you', 'we', 'they', 'this', 'that',
  'on', 'in', 'with', 'or', 'not', "don't", 'do', 'let', 'lets', 'sing', 'song', 'look', 'watch', 'now',
  'again', 'very', 'big', 'small', 'up', 'down', 'around', 'yes', 'no', 'want', 'wants', 'like', 'likes',
  'has', 'have', 'can', 'play', 'go', 'come', 'thank', 'please', 'sorry',
]);

/**
 * Normalise un mot de l'histoire : minuscules, sans ponctuation.
 */
export function normalizeToken(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z'-]/g, '');
}

/**
 * Liste blanche stricte (§8.1) : mots autorisés = Acquired ∪ D30 ∪ D14 ∪ mots de la session du jour.
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
      if (!allowed.has(norm)) violations.push(norm);
    }
  }
  return [...new Set(violations)];
}

export function storyWordCount(story: Story): number {
  return story.pages.reduce((acc, p) => acc + p.text.split(/\s+/).filter(Boolean).length, 0);
}
