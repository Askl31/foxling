import type { Stage } from './stages';

export type GameFormat =
  | 'show-me'
  | 'simon-says'
  | 'hide-seek'
  | 'feed-foxy'
  | 'say-it'
  | 'karaoke'
  | 'story';

export interface WordState {
  stage: Stage;
  dueAt: string;
  lapses: number;
  lastFormat: GameFormat | null;
  timesSeen: number;
  timesCorrect: number;
  lastSeenAt: string | null;
}

export interface ChunkState {
  stage: Stage;
  dueAt: string;
  lapses: number;
  timesSeen: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: 4 | 6;
  avatarColor: string;
  passions: string[];
  sessionTargetMin: number;
  maxNewWords: number;
  showWrittenWords: boolean;
  sessionLock: boolean;
  createdAt: string;
}

export interface DayHistory {
  date: string;
  wordsReviewed: number;
  correct: number;
  newWords: number;
  durationSec: number;
}

export interface AppState {
  version: number;
  profiles: ChildProfile[];
  activeProfileId: string | null;
  wordStates: Record<string, WordState>;
  chunkStates: Record<string, ChunkState>;
  history: Record<string, DayHistory[]>;
  settings: {
    volume: number;
    voiceRate: number;
    sessionLockEnabled: boolean;
  };
}

export interface Word {
  id: string;
  text: string;
  theme: string;
  level: 1 | 2 | 3;
  kind: 'noun' | 'verb' | 'chunk' | 'number' | 'color';
  svg: string;
  gesture?: string;
  similarTo?: string[];
}

export interface Chunk {
  id: string;
  text: string;
  theme: string;
}

export interface StoryPage {
  text: string;
  svg: string;
  question?: {
    prompt: string;
    choices: string[];
    answerIndex: number;
  };
}

export interface Story {
  id: string;
  theme: string;
  title: string;
  pages: StoryPage[];
  song?: string[];
}
