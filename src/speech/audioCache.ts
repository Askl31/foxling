/**
 * Couche audio : sert les MP3 pré-générés (public/audio/<slug>.mp3, mis en cache
 * par le service worker → 100 % offline) avec fallback TTS navigateur.
 * Les phrases dynamiques (histoires avec prénom) peuvent être générées à la
 * volée via le proxy /api/tts puis mises en cache dans CacheStorage.
 */

const meta = import.meta as unknown as { env?: { BASE_URL?: string } };
const BASE_URL = (meta.env?.BASE_URL ?? '/').replace(/\/?$/, '/');
const AUDIO_DIR = `${BASE_URL}audio/`;

export function slugify(text: string): string {
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return `${base}-${(h % 46656).toString(36)}`;
}

export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

let manifestMap: Map<string, string> | null = null;
let manifestSlugs: Set<string> | null = null;

async function loadManifest(): Promise<{ map: Map<string, string>; slugs: Set<string> }> {
  if (manifestMap && manifestSlugs) {
    return { map: manifestMap, slugs: manifestSlugs };
  }
  manifestMap = new Map();
  manifestSlugs = new Set();
  try {
    const res = await fetch(`${AUDIO_DIR}manifest.json`);
    if (!res.ok) throw new Error('no manifest');
    const m = (await res.json()) as { entries: { slug: string; text?: string }[] };
    for (const e of m.entries) {
      manifestSlugs.add(e.slug);
      manifestMap.set(e.slug, e.slug);
      if (e.text) {
        manifestMap.set(normalizeText(e.text), e.slug);
      }
    }
  } catch {
    // manifest unavailable
  }
  return { map: manifestMap, slugs: manifestSlugs };
}

export async function resolveSlug(text: string): Promise<string | null> {
  const { map, slugs } = await loadManifest();
  const norm = normalizeText(text);
  if (map.has(norm)) return map.get(norm)!;
  if (map.has(text)) return map.get(text)!;
  const directSlug = slugify(text);
  if (slugs.has(directSlug)) return directSlug;
  // Fallback on clean text (e.g. without prompt prefixes)
  const cleanNorm = norm.replace(/^(show me the|where is the|find the)\s+/, '');
  if (map.has(cleanNorm)) return map.get(cleanNorm)!;
  return null;
}

export function hasCachedAudio(text: string): Promise<boolean> {
  return resolveSlug(text).then((s) => s !== null);
}

let currentAudio: HTMLAudioElement | null = null;
let currentPlayId = 0;

/**
 * Joue un texte : MP3 pré-généré si disponible, sinon TTS navigateur (fallback).
 * Retourne une promesse résolue à la fin de la lecture (ou après bascule fallback).
 */
export async function playAudio(
  text: string,
  fallbackSpeak: (t: string) => void,
  rate = 1.0,
): Promise<void> {
  const playId = ++currentPlayId;
  stopAudio();
  const slug = await resolveSlug(text);
  if (playId !== currentPlayId) {
    // Another speak request arrived while resolving slug -> cancel to avoid double-talk / echo
    return;
  }
  if (slug) {
    try {
      const audioUrl = `${AUDIO_DIR}${slug}.mp3`;
      const audio = new Audio(audioUrl);
      // Playing pre-recorded voice at 1.0 avoids browser granular time-stretching echo/flanging
      audio.playbackRate = 1.0;
      currentAudio = audio;
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = (e) => reject(e);
        audio.play().catch((err) => reject(err));
      });
      if (currentAudio === audio) {
        currentAudio = null;
      }
      return;
    } catch {
      // Audio playback failed (decode error, network 404, or browser autoplay policy)
      // Fallback seamlessly to native browser speech synthesis:
    }
  }
  if (playId === currentPlayId) {
    fallbackSpeak(text);
  }
}

export function stopAudio(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
}

/**
 * Génère un MP3 à la volée via le proxy serveur (/api/tts, clé côté serveur)
 * et le met en cache dans CacheStorage pour les lectures suivantes (offline).
 */
export async function fetchAndCacheAudio(text: string): Promise<string | null> {
  const preSlug = await resolveSlug(text);
  const slug = preSlug ?? slugify(text);
  const url = `${AUDIO_DIR}${slug}.mp3`;
  try {
    if ('caches' in window) {
      const cache = await caches.open('foxling-tts-v2');
      const hit = await cache.match(url);
      if (hit) return URL.createObjectURL(await hit.blob());
      const pre = await caches.match(url);
      if (pre) return URL.createObjectURL(await pre.blob());
    }
    // Check if the pre-generated file exists directly
    if (preSlug) {
      return url;
    }
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    if ('caches' in window) {
      const cache = await caches.open('foxling-tts-v2');
      await cache.put(url, new Response(blob));
    }
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
