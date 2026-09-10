// KrushiMitra Clean Lightweight Service Worker
const CACHE_NAME = "krushimitra-cache-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  // Bypass API and dev server internals
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.includes("@vite") ||
    url.pathname.includes("@react-refresh") ||
    url.pathname.includes(".vite")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
