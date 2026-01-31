const CACHE_NAME = 'muzz-cache-v1';

// Archivos a guardar para que funcione offline
const assets = [
  "./index.html",
  "./chat.html",
  "./swap.html",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Este evento es el que activa el botón de "Instalar" en Android
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
