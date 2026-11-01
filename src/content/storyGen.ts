import { allowedLexicon, validateStory, storyWordCount } from '../engine/lexicon';
import { wordArt } from './art';
import { wordById, WORDS_ALL } from './curriculum';
import type { AppState, Story, StoryPage, WordState } from '../engine/types';

/**
 * Générateur d'histoires contraintes (§8.1) — version locale déterministe.
 * Structure répétitive type « Brown Bear » : Foxy voit X. What does Foxy see? He sees Y…
 * Pipeline : génération → validation par liste blanche → régénération si invalide.
 */

interface GenParams {
  state: AppState;
  profileId: string;
  sessionWordIds: string[];
  childName: string;
  passions: string[];
  seed?: number;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateStory(params: GenParams, attempt = 0): Story {
  if (attempt > 12) {
    return {
      id: `gen-fallback-${params.seed ?? Date.now()}`,
      theme: 'farm',
      title: `${params.childName} is happy`,
      pages: [{ text: `${params.childName} is happy. Goodbye!`, svg: 'foxy:happy' }],
    };
  }
  const { state, sessionWordIds, childName, passions } = params;
  const allowed = allowedLexicon(state.wordStates, sessionWordIds);
  const nameNorm = childName.toLowerCase().replace(/[^a-z'-]/g, '');
  if (nameNorm) allowed.add(nameNorm);

  const pool = WORDS_ALL.filter((w) => allowed.has(w.id) && w.kind === 'noun' && w.theme !== 'politeness');
  const passionWords = pool.filter((w) => passions.some((p) => w.id.includes(p) || w.theme.includes(p)));
  const actors = passionWords.length >= 2 ? passionWords : pool;
  const rand = mulberry32(params.seed ?? Date.now());

  const pickN = (n: number): typeof actors => {
    const chosen: typeof actors = [];
    const copy = [...actors];
    while (chosen.length < Math.min(n, copy.length) && copy.length) {
      const i = Math.floor(rand() * copy.length);
      chosen.push(copy.splice(i, 1)[0]);
    }
    return chosen;
  };

  const named = (w: (typeof actors)[number]) => (rand() < 0.5 ? `a ${w.id}` : w.id);
  const characters = pickN(3 + Math.floor(rand() * 2));

  const pages: StoryPage[] = [];
  characters.forEach((c, i) => {
    const next = characters[(i + 1) % characters.length];
    pages.push({
      text: `${childName} sees ${named(c)}. What does ${childName} see? ${capitalize(childName)} sees ${named(next)}!`,
      svg: c.svg,
      question: {
        prompt: `What does ${childName} see?`,
        choices: [next.id, c.id, characters[(i + 2) % characters.length]?.id ?? c.id].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 3),
        answerIndex: 0,
      },
    });
  });
  pages.push({
    text: `Bye bye, ${childName}!`,
    svg: 'foxy:happy',
  });

  const story: Story = {
    id: `gen-${params.seed ?? Date.now()}`,
    theme: characters[0]?.theme ?? 'farm',
    title: `${childName} sees…`,
    pages,
  };

  const violations = validateStory(story, allowed);
  if (violations.length > 0) {
    return generateStory(params, attempt + 1);
  }
  return story;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function storyForSession(state: AppState, profileId: string, sessionWordIds: string[], childName: string, passions: string[]): Story {
  const fromSeed = generateStory({ state, profileId, sessionWordIds, childName, passions, seed: Math.floor(Math.random() * 1e9) });
  if (storyWordCount(fromSeed) >= 40 && fromSeed.pages.length <= 8) return fromSeed;
  return fromSeed;
}

export { wordArt, wordById };
