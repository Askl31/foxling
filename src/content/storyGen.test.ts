import { describe, it, expect } from 'vitest';
import { generateStory } from './storyGen';
import { validateStory, allowedLexicon } from '../engine/lexicon';
import { newWordState } from '../engine/srs';
import { toISODate } from '../engine/schedule';
import type { AppState } from '../engine/types';

const today = toISODate(new Date());

function stateWith(wordIds: string[], stage: 'Acquired' | 'D14' | 'D30'): AppState {
  const wordStates: AppState['wordStates'] = {};
  for (const id of wordIds) wordStates[id] = { ...newWordState(today), stage };
  return {
    version: 1, profiles: [], activeProfileId: null, wordStates, chunkStates: {},
    customWords: [], history: {}, settings: { volume: 1, voiceRate: 0.9, sessionLockEnabled: false },
  } as unknown as AppState;
}

describe('générateur d\'histoires §8.1', () => {
  const st = stateWith(['cat', 'dog', 'duck', 'fish', 'apple', 'milk'], 'Acquired');

  it('génère une histoire dont 100 % des mots sont dans la liste blanche', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const story = generateStory({ state: st, profileId: 'p1', sessionWordIds: [], childName: 'Léa', passions: [], seed });
      const allowed = allowedLexicon(st.wordStates, []);
      allowed.add('la'); allowed.add('tom');
      expect(validateStory(story, allowed)).toEqual([]);
    }
  });

  it('utilise le prénom de l\'enfant dans le texte', () => {
    const story = generateStory({ state: st, profileId: 'p1', sessionWordIds: [], childName: 'Léa', passions: [], seed: 7 });
    expect(story.pages[0].text).toContain('Léa');
  });

  it('structure répétitive avec question cliquable par page', () => {
    const story = generateStory({ state: st, profileId: 'p1', sessionWordIds: ['bird'], childName: 'Tom', passions: [], seed: 3 });
    expect(story.pages.length).toBeGreaterThanOrEqual(4);
    expect(story.pages.length).toBeLessThanOrEqual(8);
    for (const p of story.pages.slice(0, -1)) {
      expect(p.question).toBeDefined();
      expect(p.question!.choices.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('les mots de la session du jour sont autorisés dans l\'histoire', () => {
    const story = generateStory({ state: st, profileId: 'p1', sessionWordIds: ['bird', 'horse'], childName: 'Tom', passions: [], seed: 11 });
    const allowed = allowedLexicon(st.wordStates, ['bird', 'horse']);
    allowed.add('tom');
    expect(validateStory(story, allowed)).toEqual([]);
  });

  it('ne contient jamais un mot non appris (ex. lion) même avec beaucoup de seeds', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const story = generateStory({ state: st, profileId: 'p1', sessionWordIds: [], childName: 'Léa', passions: [], seed });
      const allowed = allowedLexicon(st.wordStates, []);
      allowed.add('la');
      const v = validateStory(story, allowed);
      expect(v).toEqual([]);
    }
  });
});
