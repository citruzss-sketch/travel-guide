const CACHE_NAME = "travel-guide-v1";
const STATIC_ASSETS = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
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
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  const isCityPage =
    url.pathname.match(/^\/(ru|en)\/[^/]+\/[^/]+$/) &&
    !url.pathname.includes("/api/");

  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.endsWith(".json") ||
    url.pathname === "/manifest.json";

  if (!isCityPage && !isStatic && url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (response.ok && (isCityPage || isStatic)) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        if (cached) return cached;
        return new Response("Offline", { status: 503 });
      }
    })
  );
});
