import { describe, it, expect } from 'vitest';
import { recordResult, recordStoryLapse, newWordState, buildSession, formatForStage, MAX_REVIEW_PER_SESSION } from './srs';
import { addDays, toISODate, daysBetween } from './schedule';
import type { WordState } from './types';

const T0 = '2026-11-01';

function stateAt(stage: WordState['stage'], dueAt = T0): WordState {
  return { ...newWordState(T0), stage, dueAt, lapses: 0, timesSeen: 1, timesCorrect: 1, lastFormat: 'show-me', lastSeenAt: T0 };
}

describe('machine à états §5.1 — transitions succès', () => {
  it('New → D1 au 1er succès, due J+1', () => {
    const s = recordResult(newWordState(T0), 'success', 'show-me', T0);
    expect(s.stage).toBe('D1');
    expect(s.dueAt).toBe(addDays(T0, 1));
    expect(s.timesSeen).toBe(1);
    expect(s.timesCorrect).toBe(1);
  });

  it('D1 → D3, due J+2 (intervalle du stade D1 = 2)', () => {
    const s = recordResult(stateAt('D1'), 'success', 'show-me', T0);
    expect(s.stage).toBe('D3');
    expect(s.dueAt).toBe(addDays(T0, 2));
  });

  it('D3 → D7, due J+4', () => {
    const s = recordResult(stateAt('D3'), 'success', 'simon-says', T0);
    expect(s.stage).toBe('D7');
    expect(s.dueAt).toBe(addDays(T0, 4));
  });

  it('D7 → D14, due J+7', () => {
    const s = recordResult(stateAt('D7'), 'success', 'hide-seek', T0);
    expect(s.stage).toBe('D14');
    expect(s.dueAt).toBe(addDays(T0, 7));
  });

  it('D14 → D30, due J+16', () => {
    const s = recordResult(stateAt('D14'), 'success', 'say-it', T0);
    expect(s.stage).toBe('D30');
    expect(s.dueAt).toBe(addDays(T0, 16));
  });

  it('D30 → Acquired, un mot acquis reste acquis', () => {
    const s = recordResult(stateAt('D30'), 'success', 'karaoke', T0);
    expect(s.stage).toBe('Acquired');
    const s2 = recordResult(s, 'success', 'karaoke', addDays(T0, 30));
    expect(s2.stage).toBe('Acquired');
  });

  it('planning D1→D3→D7→D14→D30 correspond aux écarts cumulés attendus', () => {
    let s = newWordState(T0);
    const today = T0;
    s = recordResult(s, 'success', 'show-me', today);
    expect(daysBetween(today, s.dueAt)).toBe(1);
    s = recordResult(s, 'success', 'show-me', s.dueAt);
    expect(daysBetween(today, s.dueAt)).toBe(3);
    s = recordResult(s, 'success', 'simon-says', s.dueAt);
    expect(daysBetween(today, s.dueAt)).toBe(7);
    s = recordResult(s, 'success', 'hide-seek', s.dueAt);
    expect(daysBetween(today, s.dueAt)).toBe(14);
    s = recordResult(s, 'success', 'say-it', s.dueAt);
    expect(daysBetween(today, s.dueAt)).toBe(30);
  });
});

describe('machine à états §5.1 — transitions échec (descente d\'un cran)', () => {
  it('D1 → New', () => {
    expect(recordResult(stateAt('D1'), 'failure', 'show-me', T0).stage).toBe('New');
  });
  it('D3 → D1', () => {
    expect(recordResult(stateAt('D3'), 'failure', 'show-me', T0).stage).toBe('D1');
  });
  it('D7 → D3', () => {
    expect(recordResult(stateAt('D7'), 'failure', 'simon-says', T0).stage).toBe('D3');
  });
  it('D14 → D7', () => {
    expect(recordResult(stateAt('D14'), 'failure', 'hide-seek', T0).stage).toBe('D7');
  });
  it('D30 → D14', () => {
    expect(recordResult(stateAt('D30'), 'failure', 'say-it', T0).stage).toBe('D14');
  });
  it('Acquired → D14 (échec détecté en histoire)', () => {
    const s = recordStoryLapse(stateAt('Acquired'), T0);
    expect(s.stage).toBe('D14');
    expect(s.lapses).toBe(1);
  });
  it('un échec incrémente lapses et remet dueAt à aujourd\'hui', () => {
    const s = recordResult(stateAt('D7'), 'failure', 'simon-says', T0);
    expect(s.lapses).toBe(1);
    expect(s.dueAt).toBe(T0);
    expect(s.timesCorrect).toBe(1);
    expect(s.timesSeen).toBe(2);
  });
  it('New qui échoue reste New', () => {
    expect(recordResult(newWordState(T0), 'failure', 'show-me', T0).stage).toBe('New');
  });
});

describe('format de rappel par stade §5.2', () => {
  it('reconnaissance d\'abord (New/D1), production ensuite (D14+)', () => {
    expect(formatForStage('New')).toBe('show-me');
    expect(formatForStage('D1')).toBe('show-me');
    expect(formatForStage('D3')).toBe('simon-says');
    expect(formatForStage('D7')).toBe('hide-seek');
    expect(formatForStage('D14')).toBe('say-it');
    expect(formatForStage('D30')).toBe('karaoke');
    expect(formatForStage('Acquired')).toBe('karaoke');
  });
});

describe('constitution d\'une session §5.3', () => {
  const mk = (id: string, stage: WordState['stage'], dueAt: string) => ({
    id,
    state: { ...stateAt(stage, dueAt) },
  });

  it('plafonne les révisions à 8', () => {
    const due = Array.from({ length: 12 }, (_, i) => mk(`w${i}`, 'D1', T0));
    const session = buildSession({ dueWords: due, newWordIds: [], fragileWordId: null, todayISO: T0 });
    const reviews = session.filter((i) => i.kind === 'review');
    expect(reviews.length).toBe(MAX_REVIEW_PER_SESSION);
  });

  it('ignore les mots non dus', () => {
    const due = [mk('a', 'D1', T0), mk('b', 'D1', addDays(T0, 5))];
    const session = buildSession({ dueWords: due, newWordIds: [], fragileWordId: null, todayISO: T0 });
    expect(session.filter((i) => i.kind === 'review').map((i) => i.wordId)).toEqual(['a']);
  });

  it('ordre : 4 reviews → nouveaux → reste + intra → histoire', () => {
    const due = Array.from({ length: 6 }, (_, i) => mk(`r${i}`, 'D1', T0));
    const session = buildSession({
      dueWords: due,
      newWordIds: ['n1', 'n2'],
      fragileWordId: 'fragile',
      todayISO: T0,
    });
    expect(session.map((i) => i.kind)).toEqual([
      'review', 'review', 'review', 'review',
      'new', 'new',
      'review', 'review',
      'intra',
      'story',
    ]);
    const intra = session.find((i) => i.kind === 'intra');
    expect(intra?.wordId).toBe('fragile');
  });

  it('trie les reviews par stade décroissant puis dueAt croissant', () => {
    const due = [
      mk('old-low', 'D1', '2026-10-01'),
      mk('high', 'D14', T0),
      mk('old-high', 'D7', '2026-10-20'),
    ];
    const session = buildSession({ dueWords: due, newWordIds: [], fragileWordId: null, todayISO: T0 });
    const ids = session.filter((i) => i.kind === 'review').map((i) => i.wordId);
    expect(ids).toEqual(['high', 'old-high', 'old-low']);
  });

  it('chaque review utilise le format du stade', () => {
    const due = [mk('a', 'D3', T0), mk('b', 'D14', T0)];
    const session = buildSession({ dueWords: due, newWordIds: [], fragileWordId: null, todayISO: T0 });
    const byId = Object.fromEntries(session.filter((i) => i.kind === 'review').map((i) => [i.wordId, i.format]));
    expect(byId.a).toBe('simon-says');
    expect(byId.b).toBe('say-it');
  });
});

describe('planning — utilitaires de dates', () => {
  it('addDays gère le passage de mois', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02');
  });
  it('toISODate format local YYYY-MM-DD', () => {
    expect(toISODate(new Date(2026, 10, 5))).toBe('2026-11-05');
  });
});
