import { describe, it, expect } from 'vitest';
import { STORY_BANK, storyBankFor, withChildName } from './storyBank';
import { validateStory, allowedLexicon } from '../engine/lexicon';
import { WORDS_ALL } from './curriculum';
import type { AppState } from '../engine/types';

const ALL_WORD_IDS = WORDS_ALL.map((w) => w.id);

function stateAllKnown(): AppState {
  const wordStates: AppState['wordStates'] = {};
  for (const id of ALL_WORD_IDS) wordStates[id] = { stage: 'Acquired', dueAt: '2026-01-01', lapses: 0, lastFormat: null, timesSeen: 10, timesCorrect: 10, lastSeenAt: '2026-01-01' };
  return { version: 1, profiles: [], activeProfileId: null, wordStates, chunkStates: {}, customWords: [], history: {}, settings: { volume: 1, voiceRate: 0.9, sessionLockEnabled: false } };
}

describe('banque d\'histoires pré-générées (offline, zéro LLM)', () => {
  it('contient au moins 16 histoires couvrant les 12 thèmes', () => {
    expect(STORY_BANK.length).toBeGreaterThanOrEqual(16);
    const themes = new Set(STORY_BANK.map((s) => s.theme));
    for (const t of ['farm', 'colors', 'numbers', 'body', 'actions', 'food', 'family', 'home', 'toys', 'nature', 'politeness', 'emotions', 'vehicles', 'wild']) {
      expect(themes.has(t), t).toBe(true);
    }
  });

  it('chaque histoire respecte la liste blanche (mots curriculum appris + prénom + stopwords)', () => {
    const st = stateAllKnown();
    for (const story of STORY_BANK) {
      const named = withChildName(story, 'Test');
      const allowed = allowedLexicon(st.wordStates, []);
      allowed.add('test');
      const v = validateStory(named, allowed);
      expect(v, `${story.id}: mots hors liste ${v.join(',')}`).toEqual([]);
    }
  });

  it('phrases courtes et 3–6 pages par histoire', () => {
    for (const story of STORY_BANK) {
      expect(story.pages.length).toBeGreaterThanOrEqual(3);
      expect(story.pages.length).toBeLessThanOrEqual(6);
      for (const p of story.pages) {
        const words = p.text.split('{name}').join('X').split(/\s+/).filter(Boolean).length;
        expect(words, `${story.id} « ${p.text} »`).toBeLessThanOrEqual(7);
      }
    }
  });

  it('chaque histoire a une question cliquable (sauf la dernière page)', () => {
    for (const story of STORY_BANK) {
      for (const p of story.pages.slice(0, -1)) {
        expect(p.question, story.id).toBeDefined();
        expect(p.question!.choices.length).toBeGreaterThanOrEqual(2);
        expect(p.question!.choices[p.question!.answerIndex]).toBeTruthy();
      }
    }
  });

  it('sélection déterministe : même profil + même jour = même histoire, jour suivant = autre', () => {
    const a = storyBankFor('enfant-4', '2026-11-05');
    const b = storyBankFor('enfant-4', '2026-11-05');
    expect(a.id).toBe(b.id);
    const seen = new Set<string>();
    for (let d = 1; d <= 30; d++) seen.add(storyBankFor('enfant-4', `2026-11-${String(d).padStart(2, '0')}`).id);
    expect(seen.size).toBeGreaterThanOrEqual(10);
  });

  it('le prénom est bien injecté par withChildName', () => {
    const s = withChildName(STORY_BANK[0], 'Léa');
    expect(s.pages[0].text).toContain('Léa');
    expect(s.pages[0].text).not.toContain('{name}');
  });
});

import { GENERATED_STORIES, ALL_STORIES, storyOfTheDay } from './generatedLoader';

describe('banque générée commitée (generated-stories.json)', () => {
  it('contient au moins 50 histoires pré-générées', () => {
    expect(GENERATED_STORIES.length).toBeGreaterThanOrEqual(50);
    expect(ALL_STORIES.length).toBeGreaterThanOrEqual(60);
  });

  it('chaque histoire générée respecte la liste blanche (mots curriculum + stopwords + Foxy)', () => {
    const st = stateAllKnown();
    const allowed = allowedLexicon(st.wordStates, []);
    allowed.add('foxy'); allowed.add('name');
    for (const story of GENERATED_STORIES) {
      const v = validateStory(story, allowed);
      expect(v, `${story.id}: ${v.join(',')}`).toEqual([]);
    }
  });

  it('storyOfTheDay est déterministe et injecte le prénom', () => {
    const a = storyOfTheDay('enfant-4', '2026-11-05');
    const b = storyOfTheDay('enfant-4', '2026-11-05');
    expect(a.id).toBe(b.id);
    const named = withChildName(a, 'Léa');
    expect(named.pages.some((p) => p.text.includes('Léa'))).toBe(true);
    expect(named.pages.every((p) => !p.text.includes('__NAME__'))).toBe(true);
  });
});
