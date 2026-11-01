/**
 * Couche audio : sert les MP3 pré-générés (public/audio/<slug>.mp3, mis en cache
 * par le service worker → 100 % offline) avec fallback TTS navigateur.
 * Les phrases dynamiques (histoires avec prénom) peuvent être générées à la
 * volée via le proxy /api/tts puis mises en cache dans CacheStorage.
 */

const AUDIO_DIR = './audio/';

export function slugify(text: string): string {
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return `${base}-${(h % 46656).toString(36)}`;
}

let manifestSlugs: Set<string> | null = null;

async function loadManifest(): Promise<Set<string>> {
  if (manifestSlugs) return manifestSlugs;
  try {
    const res = await fetch(`${AUDIO_DIR}manifest.json`);
    if (!res.ok) throw new Error('no manifest');
    const m = await res.json() as { entries: { slug: string }[] };
    manifestSlugs = new Set(m.entries.map((e) => e.slug));
  } catch {
    manifestSlugs = new Set();
  }
  return manifestSlugs;
}

export function hasCachedAudio(text: string): Promise<boolean> {
  return loadManifest().then((s) => s.has(slugify(text)));
}

let currentAudio: HTMLAudioElement | null = null;

/**
 * Joue un texte : MP3 pré-généré si disponible, sinon TTS navigateur (fallback).
 * Retourne une promesse résolue à la fin de la lecture (ou immédiatement en fallback).
 */
export async function playAudio(
  text: string,
  fallbackSpeak: (t: string) => void,
  rate = 0.95,
): Promise<void> {
  const slug = slugify(text);
  const slugs = await loadManifest();
  stopAudio();
  if (slugs.has(slug)) {
    try {
      const audio = new Audio(`${AUDIO_DIR}${slug}.mp3`);
      audio.playbackRate = rate;
      currentAudio = audio;
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
      return;
    } catch {
      // fallback TTS
    }
  }
  fallbackSpeak(text);
}

export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

/**
 * Génère un MP3 à la volée via le proxy serveur (/api/tts, clé côté serveur)
 * et le met en cache dans CacheStorage pour les lectures suivantes (offline).
 */
export async function fetchAndCacheAudio(text: string): Promise<string | null> {
  const slug = slugify(text);
  try {
    const cache = await caches.open('foxling-tts');
    const hit = await cache.match(`${AUDIO_DIR}${slug}.mp3`);
    if (hit) return URL.createObjectURL(await hit.blob());
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    await cache.put(`${AUDIO_DIR}${slug}.mp3`, new Response(blob));
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
