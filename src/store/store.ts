import { profileDefaults, newWordState } from '../engine/srs';
import { toISODate } from '../engine/schedule';
import type { AppState, ChildProfile, DayHistory, WordState, ChunkState } from '../engine/types';

const STORAGE_KEY = 'foxling-state-v1';

export function defaultState(): AppState {
  return {
    version: 1,
    profiles: [],
    activeProfileId: null,
    wordStates: {},
    chunkStates: {},
    customWords: [],
    history: {},
    settings: { volume: 0.9, voiceRate: 0.9, sessionLockEnabled: false },
  };
}

export function loadState(): AppState {
  try {
    if (typeof localStorage === 'undefined') return defaultState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    return { ...defaultState(), ...parsed, settings: { ...defaultState().settings, ...parsed.settings } };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function createProfile(state: AppState, name: string, age: 4 | 6, avatarColor: string, passions: string[]): AppState {
  const id = `enfant-${Date.now().toString(36)}`;
  const profile: ChildProfile = {
    id,
    name: name.trim() || (age === 4 ? 'Little one' : 'Big one'),
    ...profileDefaults(age),
    avatarColor,
    passions,
    sessionLock: true,
    createdAt: toISODate(new Date()),
  };
  const next: AppState = {
    ...state,
    profiles: [...state.profiles, profile],
    activeProfileId: state.activeProfileId ?? id,
    history: { ...state.history, [id]: state.history[id] ?? [] },
  };
  saveState(next);
  return next;
}

export function removeProfile(state: AppState, id: string): AppState {
  const next: AppState = {
    ...state,
    profiles: state.profiles.filter((p) => p.id !== id),
    activeProfileId: state.activeProfileId === id ? (state.profiles[0]?.id ?? null) : state.activeProfileId,
  };
  saveState(next);
  return next;
}

export function updateProfile(state: AppState, id: string, patch: Partial<ChildProfile>): AppState {
  const next: AppState = {
    ...state,
    profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  };
  saveState(next);
  return next;
}

export function ensureWordState(state: AppState, wordId: string): AppState {
  if (state.wordStates[wordId]) return state;
  const next: AppState = {
    ...state,
    wordStates: { ...state.wordStates, [wordId]: newWordState(toISODate(new Date())) },
  };
  saveState(next);
  return next;
}

export function setWordState(state: AppState, wordId: string, ws: WordState): AppState {
  const next: AppState = { ...state, wordStates: { ...state.wordStates, [wordId]: ws } };
  saveState(next);
  return next;
}

export function setChunkState(state: AppState, chunkId: string, cs: ChunkState): AppState {
  const next: AppState = { ...state, chunkStates: { ...state.chunkStates, [chunkId]: cs } };
  saveState(next);
  return next;
}

export function addCustomWord(state: AppState, ownerId: string, text: string, svgId: string): AppState {
  const id = `custom-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const exists = state.customWords.some((w) => w.id === id);
  if (exists) return state;
  const next: AppState = {
    ...state,
    customWords: [...state.customWords, { id, text: text.trim(), svg: svgId, theme: 'custom', ownerId, kind: 'noun' }],
  };
  saveState(next);
  return next;
}

export function removeCustomWord(state: AppState, id: string): AppState {
  const next: AppState = { ...state, customWords: state.customWords.filter((w) => w.id !== id) };
  saveState(next);
  return next;
}

export function customWordsFor(state: AppState, profileId: string) {
  return state.customWords.filter((w) => w.ownerId === profileId);
}

export function appendHistory(state: AppState, profileId: string, entry: DayHistory): AppState {
  const list = state.history[profileId] ?? [];
  const next: AppState = {
    ...state,
    history: { ...state.history, [profileId]: [...list.filter((h) => h.date !== entry.date), entry] },
  };
  saveState(next);
  return next;
}
