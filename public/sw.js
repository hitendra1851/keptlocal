// keptlocal service worker
//
// Strategy: cache opportunistically as the visitor browses, so a tool page
// (and the assets it needs) keeps working if they come back later without a
// connection -- close the tab, lose signal, reopen tomorrow. There is no
// build-time precache list here on purpose: this file doesn't know the
// content-hashed /_astro/* filenames a given deploy produced, so baking any
// in would go stale the moment they change. Everything is cached the first
// time it's actually requested instead.
//
// No analytics or file data ever passes through this cache: only same-origin
// GET requests are handled, and every response is exactly what the origin
// server sent (see decodePDFRawStream-adjacent principle in CompressPdf.astro:
// never fabricate, only relay).

const CACHE_NAME = "keptlocal-v1";
const OFFLINE_URL = "/offline/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Best-effort: an install failure here (e.g. offline first install)
      // shouldn't block the service worker from taking over.
      await cache.addAll([OFFLINE_URL, "/manifest.webmanifest"]).catch(() => {});
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      );
      await self.clients.claim();
    })()
  );
});

const isHashedAsset = (url) => url.pathname.startsWith("/_astro/");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only ever handle same-origin GETs. Everything else (analytics beacons,
  // cross-origin requests, POST/PUT, devtools) passes straight through.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Pages: prefer a fresh copy when online, fall back to the last cached
    // copy of that exact page, and only show the generic offline page for a
    // page that was never visited before going offline.
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const fresh = await fetch(request);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          return (
            (await cache.match(request)) ||
            (await cache.match(OFFLINE_URL)) ||
            Response.error()
          );
        }
      })()
    );
    return;
  }

  if (isHashedAsset(url)) {
    // Content-hashed and served with a long-lived immutable Cache-Control:
    // the same URL never changes contents, so cache-first is always correct.
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        cache.put(request, fresh.clone());
        return fresh;
      })()
    );
    return;
  }

  // Everything else same-origin (fonts, favicon, manifest, logo, og image):
  // serve the cached copy instantly if there is one, and refresh it in the
  // background so the next visit picks up any change.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((fresh) => {
          cache.put(request, fresh.clone());
          return fresh;
        })
        .catch(() => undefined);
      return cached || (await network) || Response.error();
    })()
  );
});
