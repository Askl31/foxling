export type Stage = 'New' | 'D1' | 'D3' | 'D7' | 'D14' | 'D30' | 'Acquired';

export const STAGE_ORDER: Stage[] = ['New', 'D1', 'D3', 'D7', 'D14', 'D30', 'Acquired'];

export const NEXT_STAGE: Record<Stage, Stage | null> = {
  New: 'D1',
  D1: 'D3',
  D3: 'D7',
  D7: 'D14',
  D14: 'D30',
  D30: 'Acquired',
  Acquired: null,
};

export const PREV_STAGE: Record<Stage, Stage | null> = {
  New: null,
  D1: 'New',
  D3: 'D1',
  D7: 'D3',
  D14: 'D7',
  D30: 'D14',
  Acquired: 'D30',
};

export function stageIndex(stage: Stage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function isAcquired(stage: Stage): boolean {
  return stage === 'Acquired';
}
