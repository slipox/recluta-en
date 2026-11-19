/* Recluta EN — caché offline. Las URLs de assets llevan versión para forzar la actualización. */
const CACHE = 'recluta-en-v4';
const VERSION = '1795091262795';
const ASSETS = [
  './',
  './index.html',
  './index.html?v=' + VERSION,
  './styles.css?v=' + VERSION,
  './app.js?v=' + VERSION,
  './data.js?v=' + VERSION,
  './manifest.webmanifest?v=' + VERSION,
  './icon-192.png?v=' + VERSION,
  './icon-512.png?v=' + VERSION,
  './fonts/barlow-condensed-400.woff2?v=' + VERSION,
  './fonts/barlow-condensed-600.woff2?v=' + VERSION,
  './fonts/barlow-condensed-700.woff2?v=' + VERSION
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
