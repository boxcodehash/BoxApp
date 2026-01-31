const CACHE_NAME = 'muzz-v2';
const assets = [
  '/MuzzSnap/',
  '/MuzzSnap/index.html',
  '/MuzzSnap/login.html',
  '/MuzzSnap/chat.html',
  '/MuzzSnap/swap.html',
  '/MuzzSnap/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
