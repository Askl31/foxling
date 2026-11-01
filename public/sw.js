const CACHE = 'foxling-v2';
const TTS_CACHE = 'foxling-tts';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg', './audio/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== TTS_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // MP3 pré-générés : cache-first (ils sont immuables, hashés par slug)
  if (url.pathname.startsWith('/audio/') && url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(event.request).then((hit) => hit ||
          fetch(event.request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              c.put(event.request, copy);
            }
            return res;
          })),
      ),
    );
    return;
  }

  // App shell : network-first, fallback cache (offline)
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (event.request.method === 'GET' && res.ok && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html'))),
  );
});
