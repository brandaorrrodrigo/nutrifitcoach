const CACHE_NAME = "nfc-cache-v1";
const PRECACHE = [
  "/",
  "/manifest.json",
  "/icon-144.png",
  "/icon-192.png",
  "/icon-256.png",
  "/icon-384.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of PRECACHE) {
        try {
          await cache.add(url);
        } catch (e) {
          // Evita quebrar a instalação por causa de um 404
          console.warn("SW: falhou ao adicionar no cache:", url, e);
        }
      }
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          return res;
        })
        .catch(() => cached || Promise.reject("offline"));
      return cached || fetchPromise;
    })
  );
});
