import { buildSession, recordResult, formatForStage, MAX_REVIEW_PER_SESSION, type SessionItem } from './srs';
import type { AppState } from './types';

export { buildSession, recordResult, formatForStage, MAX_REVIEW_PER_SESSION };
export type { SessionItem };

/**
 * Mot le plus fragile de la session précédente (§5.3 : révision intra-session).
 */
export function ensureFragile(state: AppState, profileId: string, todayISO: string): string | null {
  const hist = (state.history[profileId] ?? []).filter((h) => h.date < todayISO).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!hist) return null;
  const entries = Object.entries(state.wordStates)
    .filter(([, ws]) => ws.dueAt <= todayISO && (ws.lapses > 0 || ws.stage === 'New' || ws.stage === 'D1'))
    .sort((a, b) => b[1].lapses - a[1].lapses || a[1].dueAt.localeCompare(b[1].dueAt));
  return entries[0]?.[0] ?? null;
}
