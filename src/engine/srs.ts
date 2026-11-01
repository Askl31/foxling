import { NEXT_STAGE, PREV_STAGE, isAcquired, type Stage } from './stages';
import { dueAtFor, toISODate } from './schedule';
import type { GameFormat, WordState, ChildProfile } from './types';

export type ReviewOutcome = 'success' | 'failure';

export function newWordState(todayISO: string): WordState {
  return {
    stage: 'New',
    dueAt: todayISO,
    lapses: 0,
    lastFormat: null,
    timesSeen: 0,
    timesCorrect: 0,
    lastSeenAt: null,
  };
}

/**
 * Enregistre le résultat d'un rappel pour un mot.
 * Machine à états §5.1 :
 *  - succès : New→D1→D3→D7→D14→D30→Acquired, dueAt = aujourd'hui + intervalle du stade franchi
 *  - échec : le mot redescend d'un cran (D1→New, D3→D1, ...), lapses++, dueAt = aujourd'hui (à revoir bientôt)
 *  - Acquired qui échoue en histoire → D14
 */
export function recordResult(
  state: WordState,
  outcome: ReviewOutcome,
  format: GameFormat,
  todayISO: string = toISODate(new Date()),
): WordState {
  if (outcome === 'success') {
    const next = NEXT_STAGE[state.stage];
    if (!next) {
      return {
        ...state,
        timesSeen: state.timesSeen + 1,
        timesCorrect: state.timesCorrect + 1,
        lastFormat: format,
        lastSeenAt: todayISO,
      };
    }
    return {
      stage: next,
      dueAt: dueAtFor(state.stage, todayISO),
      lapses: state.lapses,
      lastFormat: format,
      timesSeen: state.timesSeen + 1,
      timesCorrect: state.timesCorrect + 1,
      lastSeenAt: todayISO,
    };
  }
  const prev = PREV_STAGE[state.stage];
  const lapsed = state.stage === 'Acquired' ? 'D14' : (prev ?? 'New');
  return {
    stage: lapsed as Stage,
    dueAt: todayISO,
    lapses: state.lapses + 1,
    lastFormat: format,
    timesSeen: state.timesSeen + 1,
    timesCorrect: state.timesCorrect,
    lastSeenAt: todayISO,
  };
}

export function recordStoryLapse(state: WordState, todayISO: string = toISODate(new Date())): WordState {
  if (!isAcquired(state.stage)) return state;
  return {
    ...state,
    stage: 'D14',
    dueAt: todayISO,
    lapses: state.lapses + 1,
    lastSeenAt: todayISO,
  };
}

/**
 * Format de rappel imposé par le stade (§5.2) : reconnaissance d'abord, production ensuite.
 */
export function formatForStage(stage: Stage): GameFormat {
  switch (stage) {
    case 'New':
    case 'D1':
      return 'show-me';
    case 'D3':
      return 'simon-says';
    case 'D7':
      return 'hide-seek';
    case 'D14':
      return 'say-it';
    case 'D30':
    case 'Acquired':
      return 'karaoke';
  }
}

export interface SessionItem {
  kind: 'review' | 'new' | 'intra' | 'story';
  wordId?: string;
  format: GameFormat | 'story';
  intra?: boolean;
}

export interface BuildSessionOptions {
  dueWords: { id: string; state: WordState }[];
  newWordIds: string[];
  fragileWordId: string | null;
  todayISO: string;
}

export const MAX_REVIEW_PER_SESSION = 8;

/**
 * Algorithme de constitution d'une session (§5.3) :
 *  review (plafond 8, triés stade décroissant puis dueAt croissant)
 *  → 4 premiers reviews → nouveaux mots → reviews restants + révision intra-session
 *  → histoire
 */
export function buildSession(opts: BuildSessionOptions): SessionItem[] {
  const due = [...opts.dueWords]
    .filter((w) => w.state.dueAt <= opts.todayISO)
    .sort((a, b) => {
      const sa = stageRank(a.state.stage);
      const sb = stageRank(b.state.stage);
      if (sa !== sb) return sa - sb;
      return a.state.dueAt.localeCompare(b.state.dueAt);
    })
    .slice(0, MAX_REVIEW_PER_SESSION);

  const items: SessionItem[] = [];
  const reviewItems = due.map((w) => ({
    kind: 'review' as const,
    wordId: w.id,
    format: formatForStage(w.state.stage),
  }));

  const first = reviewItems.slice(0, 4);
  const rest = reviewItems.slice(4);

  items.push(...first);
  for (const id of opts.newWordIds) {
    items.push({ kind: 'new', wordId: id, format: 'show-me' });
  }
  items.push(...rest);
  if (opts.fragileWordId) {
    items.push({ kind: 'intra', wordId: opts.fragileWordId, format: 'show-me', intra: true });
  }
  items.push({ kind: 'story', format: 'story' });
  return items;
}

function stageRank(stage: Stage): number {
  const order: Stage[] = ['Acquired', 'D30', 'D14', 'D7', 'D3', 'D1', 'New'];
  return order.indexOf(stage);
}

export function profileDefaults(age: 4 | 6): Pick<ChildProfile, 'age' | 'sessionTargetMin' | 'maxNewWords' | 'showWrittenWords'> {
  return age === 4
    ? { age: 4, sessionTargetMin: 5, maxNewWords: 3, showWrittenWords: false }
    : { age: 6, sessionTargetMin: 10, maxNewWords: 5, showWrittenWords: true };
}

export function isSessionDoneToday(history: { date: string }[], todayISO: string): boolean {
  return history.some((h) => h.date === todayISO);
}
