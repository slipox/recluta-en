/* Recluta EN - cache offline. Las URLs de assets llevan version para forzar la actualizacion. */
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
  './fonts/barlow-condensed-400.woff2?v=' + VERSION,
  './fonts/barlow-condensed-600.woff2?v=' + VERSION,
  './fonts/barlow-condensed-700.woff2?v=' + VERSION,
  './icons/icon-192.png?v=' + VERSION,
  './icons/icon-256.png?v=' + VERSION,
  './icons/icon-320.png?v=' + VERSION,
  './icons/icon-384.png?v=' + VERSION,
  './icons/icon-448.png?v=' + VERSION,
  './icons/icon-512.png?v=' + VERSION,
  './icons/icon-576.png?v=' + VERSION,
  './icons/icon-640.png?v=' + VERSION,
  './icons/icon-704.png?v=' + VERSION,
  './icons/icon-768.png?v=' + VERSION,
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
