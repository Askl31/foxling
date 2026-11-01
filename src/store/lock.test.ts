import { describe, it, expect, beforeEach } from 'vitest';
import { isLockConfigured, setLockCode, verifyLockCode, isUnlockedThisSession, markUnlocked, removeLock } from './lock';

const storage: Record<string, string> = {};
const session: Record<string, string> = {};
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => storage[k] ?? null,
  setItem: (k: string, v: string) => { storage[k] = v; },
  removeItem: (k: string) => { delete storage[k]; },
} as unknown as Storage;
(globalThis as unknown as { sessionStorage: Storage }).sessionStorage = {
  getItem: (k: string) => session[k] ?? null,
  setItem: (k: string, v: string) => { session[k] = v; },
  removeItem: (k: string) => { delete session[k]; },
} as unknown as Storage;

describe('verrou local (sans BDD)', () => {
  beforeEach(() => {
    removeLock();
    for (const k of Object.keys(storage)) delete storage[k];
    for (const k of Object.keys(session)) delete session[k];
  });

  it('aucun verrou configuré = accès libre', async () => {
    expect(isLockConfigured()).toBe(false);
    expect(await verifyLockCode('0000')).toBe(true);
  });

  it('le code n\'est jamais stocké en clair', async () => {
    await setLockCode('1234');
    expect(isLockConfigured()).toBe(true);
    const stored = JSON.parse(storage['foxling-lock-v1']);
    expect(stored.code).toBeUndefined();
    expect(stored.pin).toBeUndefined();
    expect(stored.salt).toBeDefined();
    expect(stored.hash).toBeDefined();
    expect(stored.salt).not.toBe('1234');
  });

  it('bon code accepté, mauvais code refusé', async () => {
    await setLockCode('4321');
    expect(await verifyLockCode('4321')).toBe(true);
    expect(await verifyLockCode('0000')).toBe(false);
    expect(await verifyLockCode('4322')).toBe(false);
  });

  it('session déverrouillée persistée uniquement dans sessionStorage', async () => {
    await setLockCode('9999');
    expect(isUnlockedThisSession()).toBe(false);
    markUnlocked();
    expect(isUnlockedThisSession()).toBe(true);
    expect(storage['foxling-unlocked']).toBeUndefined();
  });
});
