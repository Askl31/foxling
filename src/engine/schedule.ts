import type { Stage } from './stages';
import { NEXT_STAGE } from './stages';

export const INTERVALS_DAYS: Record<Stage, number> = {
  New: 0,
  D1: 1,
  D3: 2,
  D7: 4,
  D14: 7,
  D30: 16,
  Acquired: 0,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, days: number): string {
  const d = fromISODate(iso);
  d.setTime(d.getTime() + days * DAY_MS);
  return toISODate(d);
}

export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((fromISODate(toISO).getTime() - fromISODate(fromISO).getTime()) / DAY_MS);
}

export function dueAtFor(stage: Stage, fromISO: string): string {
  const next = NEXT_STAGE[stage];
  if (!next) return fromISO;
  const interval = INTERVALS_DAYS[next] ?? 1;
  return addDays(fromISO, interval);
}
