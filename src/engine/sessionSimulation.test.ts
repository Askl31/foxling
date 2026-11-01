import { describe, it, expect } from 'vitest';
import { buildSession, recordResult, newWordState, isSessionDoneToday } from './srs';
import { ensureFragile } from './sessionFlow';
import { pickNewWords, wordById, WORDS_ALL } from '../content/curriculum';
import { appendHistory, ensureWordState, setWordState, defaultState } from '../store/store';
import type { AppState, ChildProfile } from './types';

describe('Simulation complète de sessions et progression SRS (E2E Logic)', () => {
  const profile: ChildProfile = {
    id: 'child-1',
    name: 'Jeanne',
    age: 4,
    avatarColor: '#f76707',
    passions: ['animals'],
    sessionTargetMin: 5,
    maxNewWords: 2,
    showWrittenWords: true,
    sessionLock: true,
    createdAt: '2026-11-01',
  };

  it('Jour 1 : découverte de 2 mots nouveaux, validation et verrouillage du jour', () => {
    let state: AppState = {
      ...defaultState(),
      profiles: [profile],
      activeProfileId: profile.id,
    };

    const day1 = '2026-11-01';
    expect(isSessionDoneToday(state.history[profile.id] ?? [], day1)).toBe(false);

    // Sélection des nouveaux mots
    const candidateIds = WORDS_ALL.map((w) => w.id);
    const newWordIds = pickNewWords(candidateIds, [], profile.maxNewWords, WORDS_ALL);
    expect(newWordIds.length).toBe(2);
    const [wordA, wordB] = newWordIds;

    // Construction de la session
    const session = buildSession({
      dueWords: [],
      newWordIds,
      fragileWordId: null,
      todayISO: day1,
    });

    expect(session.length).toBeGreaterThanOrEqual(3);
    expect(session.some((s) => s.kind === 'story')).toBe(true);

    // Simulation du déroulement de chaque mini-jeu avec réponse réussie
    for (const item of session) {
      if (item.wordId) {
        state = ensureWordState(state, item.wordId);
        const ws = state.wordStates[item.wordId];
        const updated = recordResult(ws, 'success', item.format as never, day1);
        state = setWordState(state, item.wordId, updated);
      }
    }

    // Enregistrement de l'historique
    state = appendHistory(state, profile.id, {
      date: day1,
      wordsReviewed: 0,
      correct: session.filter((s) => s.wordId).length,
      newWords: 2,
      durationSec: 180,
    });

    // Vérifications fin de Jour 1
    expect(isSessionDoneToday(state.history[profile.id] ?? [], day1)).toBe(true);
    expect(state.wordStates[wordA].stage).toBe('D1');
    expect(state.wordStates[wordB].stage).toBe('D1');
    expect(state.wordStates[wordA].dueAt).toBe('2026-11-02');
  });

  it('Jour 2 : rappel des mots à J+1, gestion d\'erreur et rétrogradation', () => {
    let state: AppState = {
      ...defaultState(),
      profiles: [profile],
      activeProfileId: profile.id,
    };

    const day1 = '2026-11-01';
    const day2 = '2026-11-02';

    // Initialisation état Jour 1
    state = ensureWordState(state, 'cat');
    state = setWordState(state, 'cat', {
      ...newWordState(day1),
      stage: 'D1',
      dueAt: day2,
    });

    state = ensureWordState(state, 'dog');
    state = setWordState(state, 'dog', {
      ...newWordState(day1),
      stage: 'D1',
      dueAt: day2,
    });

    // Mots à réviser le Jour 2
    const dueWords = Object.entries(state.wordStates)
      .filter(([, ws]) => ws.dueAt <= day2)
      .map(([id, ws]) => ({ id, state: ws }));

    expect(dueWords.length).toBe(2);

    // Session Jour 2
    const session = buildSession({
      dueWords,
      newWordIds: ['sun'],
      fragileWordId: null,
      todayISO: day2,
    });

    // Jeanne réussit 'cat' mais se trompe sur 'dog'
    for (const item of session) {
      if (item.wordId === 'cat') {
        const ws = state.wordStates['cat'];
        state = setWordState(state, 'cat', recordResult(ws, 'success', item.format as never, day2));
      } else if (item.wordId === 'dog') {
        const ws = state.wordStates['dog'];
        state = setWordState(state, 'dog', recordResult(ws, 'failure', item.format as never, day2));
      } else if (item.wordId === 'sun') {
        state = ensureWordState(state, 'sun');
        const ws = state.wordStates['sun'];
        state = setWordState(state, 'sun', recordResult(ws, 'success', item.format as never, day2));
      }
    }

    // 'cat' passe à D3 (intervalle 2 jours -> 2026-11-04)
    expect(state.wordStates['cat'].stage).toBe('D3');
    expect(state.wordStates['cat'].dueAt).toBe('2026-11-04');

    // 'dog' rétrograde à New, lapses = 1, à revoir le jour même ou dès la prochaine session
    expect(state.wordStates['dog'].stage).toBe('New');
    expect(state.wordStates['dog'].lapses).toBe(1);
    expect(state.wordStates['dog'].dueAt).toBe(day2);

    // 'dog' doit maintenant être détecté comme mot fragile pour la session suivante
    state = appendHistory(state, profile.id, {
      date: day2,
      wordsReviewed: 2,
      correct: 1,
      newWords: 1,
      durationSec: 150,
    });
    const fragile = ensureFragile(state, profile.id, '2026-11-03');
    expect(fragile).toBe('dog');
  });

  it('Progression complète jusqu\'au statut Acquired', () => {
    let ws = newWordState('2026-11-01');

    // New -> D1
    ws = recordResult(ws, 'success', 'show-me', '2026-11-01');
    expect(ws.stage).toBe('D1');

    // D1 -> D3
    ws = recordResult(ws, 'success', 'show-me', '2026-11-02');
    expect(ws.stage).toBe('D3');

    // D3 -> D7
    ws = recordResult(ws, 'success', 'simon-says', '2026-11-05');
    expect(ws.stage).toBe('D7');

    // D7 -> D14
    ws = recordResult(ws, 'success', 'hide-seek', '2026-11-12');
    expect(ws.stage).toBe('D14');

    // D14 -> D30
    ws = recordResult(ws, 'success', 'say-it', '2026-11-26');
    expect(ws.stage).toBe('D30');

    // D30 -> Acquired
    ws = recordResult(ws, 'success', 'karaoke', '2026-12-26');
    expect(ws.stage).toBe('Acquired');
  });

  it('Règle anti-confusion : ne jamais présenter 2 mots proches le même jour', () => {
    // Exemples de paires proches : sheep & goat, black & brown
    const picked = pickNewWords(['sheep', 'goat', 'rabbit'], [], 2, WORDS_ALL);
    expect(picked).toContain('sheep');
    expect(picked).not.toContain('goat');
    expect(picked).toContain('rabbit');

    const pickedColors = pickNewWords(['black', 'brown', 'pink'], [], 2, WORDS_ALL);
    expect(pickedColors).toContain('black');
    expect(pickedColors).not.toContain('brown');
    expect(pickedColors).toContain('pink');
  });

  it('Tous les nouveaux mots enrichis sont accessibles avec SVG valide', () => {
    const newWords = [
      'sunny', 'windy', 'snowy',
      'bedroom', 'kitchen', 'garden',
      'book', 'cup',
      'wake', 'hug', 'listen',
      'truck', 'giraffe', 'penguin', 'turtle'
    ];

    for (const id of newWords) {
      const w = wordById(id);
      expect(w, `Word ${id} must exist in curriculum`).toBeDefined();
      expect(w?.svg.startsWith('<svg')).toBe(true);
      expect(w?.svg.includes('</svg>')).toBe(true);
    }
  });
});
