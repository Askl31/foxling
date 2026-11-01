import { describe, it, expect } from 'vitest';
import { allowedLexicon, validateStory, normalizeToken, storyWordCount } from './lexicon';
import type { Story } from './types';

const states = {
  cat: { stage: 'Acquired' as const },
  dog: { stage: 'D30' as const },
  duck: { stage: 'D14' as const },
  fish: { stage: 'D7' as const },
  bird: { stage: 'New' as const },
};

describe('liste blanche §8.1', () => {
  it('autorise Acquired, D30, D14 et les mots de la session', () => {
    const allowed = allowedLexicon(states, ['fish', 'bird']);
    expect(allowed.has('cat')).toBe(true);
    expect(allowed.has('dog')).toBe(true);
    expect(allowed.has('duck')).toBe(true);
    expect(allowed.has('fish')).toBe(true);
    expect(allowed.has('bird')).toBe(true);
    expect(allowed.has('horse')).toBe(false);
  });

  it('autorise toujours les mots-outils de base', () => {
    const allowed = allowedLexicon({});
    expect(allowed.has('the')).toBe(true);
    expect(allowed.has('foxy')).toBe(true);
    expect(allowed.has('what')).toBe(true);
  });
});

describe('validateur d\'histoire §8.1', () => {
  const story: Story = {
    id: 's1',
    theme: 'farm',
    title: 'Foxy sees animals',
    pages: [
      { text: 'Foxy sees a cat. What does Foxy see? He sees a dog!', svg: 'x' },
      { text: 'Foxy sees a duck. What does Foxy see? He sees a fish!', svg: 'x' },
    ],
  };

  it('valide une histoire 100 % mots autorisés', () => {
    const allowed = allowedLexicon(states, ['fish']);
    expect(validateStory(story, allowed)).toEqual([]);
  });

  it('rejette un mot hors liste blanche (échec = régénération)', () => {
    const bad: Story = {
      id: 's2',
      theme: 'farm',
      title: 'bad',
      pages: [{ text: 'Foxy sees a horse. The horse is big.', svg: 'x' }],
    };
    const allowed = allowedLexicon(states);
    expect(validateStory(bad, allowed)).toEqual(['horse', 'big']);
  });

  it('normalise la ponctuation et la casse', () => {
    expect(normalizeToken('Cat,')).toBe('cat');
    expect(normalizeToken("don't")).toBe("don't");
  });

  it('compte les mots de l\'histoire (40-70 attendus)', () => {
    expect(storyWordCount(story)).toBe(24);
  });
});
