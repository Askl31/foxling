/**
 * Verrou d'accès sans base de données externe.
 *
 * Principe : le code parent n'est JAMAIS stocké en clair. On stocke uniquement
 * son hash SHA-256 salé (PBKDF-like simple via itérations de SHA-256).
 * La vérification se fait 100 % localement (localStorage + WebCrypto).
 *
 * Deux couches complémentaires :
 *  1. Basic Auth au niveau de la plateforme (Netlify `_headers`, déployé) :
 *     protection réseau avant même le chargement de l'app — la plus forte.
 *  2. Écran de verrouillage dans l'app (ce fichier) : code à 4+ chiffres,
 *     vérifié localement contre le hash stocké.
 */

const LOCK_KEY = 'foxling-lock-v1';
const SESSION_KEY = 'foxling-unlocked';

interface LockRecord {
  salt: string;
  hash: string;
  iterations: number;
  setAt: string;
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashCode(code: string, salt: string, iterations: number): Promise<string> {
  const enc = new TextEncoder();
  let data = enc.encode(`foxling:${salt}:${code}`);
  let digest = await crypto.subtle.digest('SHA-256', data);
  for (let i = 1; i < iterations; i++) {
    digest = await crypto.subtle.digest('SHA-256', digest);
  }
  return toHex(digest);
}

export function isLockConfigured(): boolean {
  return localStorage.getItem(LOCK_KEY) !== null;
}

export async function setLockCode(code: string): Promise<void> {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer as ArrayBuffer);
  const iterations = 20000;
  const hash = await hashCode(code, salt, iterations);
  const record: LockRecord = { salt, hash, iterations, setAt: new Date().toISOString() };
  localStorage.setItem(LOCK_KEY, JSON.stringify(record));
}

export async function verifyLockCode(code: string): Promise<boolean> {
  const raw = localStorage.getItem(LOCK_KEY);
  if (!raw) return true;
  try {
    const record = JSON.parse(raw) as LockRecord;
    const hash = await hashCode(code, record.salt, record.iterations);
    return hash === record.hash;
  } catch {
    return false;
  }
}

export function isUnlockedThisSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function markUnlocked(): void {
  sessionStorage.setItem(SESSION_KEY, '1');
}

export function removeLock(): void {
  localStorage.removeItem(LOCK_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
