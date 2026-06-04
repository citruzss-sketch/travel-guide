const CACHE_VERSION = "v3";
const STATIC_CACHE = `travel-guide-static-${CACHE_VERSION}`;
const PAGES_CACHE = `travel-guide-pages-${CACHE_VERSION}`;
const API_CACHE = `travel-guide-api-${CACHE_VERSION}`;

const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = ["/", "/manifest.json", OFFLINE_URL];

// Install: precache critical shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge stale caches
self.addEventListener("activate", (event) => {
  const CURRENT_CACHES = [STATIC_CACHE, PAGES_CACHE, API_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !CURRENT_CACHES.includes(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Notify clients that a new SW has taken control
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ─── Fetch routing ────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/__nextjs")) return;

  // API routes → network-first (fresh data preferred, cache as fallback)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Next.js static bundles + local fonts/images → cache-first (immutable)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image/") ||
    /\.(woff2?|ttf|otf|eot|ico|svg|png|jpg|jpeg|webp|gif|css|js)$/.test(
      url.pathname
    )
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Cross-origin images (Unsplash, Pexels, Wikimedia) → cache-first
  if (
    url.origin !== self.location.origin &&
    /\.(jpg|jpeg|webp|png|gif|svg)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Skip all other cross-origin requests
  if (url.origin !== self.location.origin) return;

  // App pages (localized routes + root) → stale-while-revalidate
  if (
    url.pathname === "/" ||
    /^\/(ru|en)(\/|$)/.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request, PAGES_CACHE));
    return;
  }

  // Anything else on this origin → network-first
  event.respondWith(networkFirst(request, PAGES_CACHE));
});

// ─── Cache strategies ─────────────────────────────────────────────────────────

/**
 * Cache-first: return cached immediately; fetch + cache on miss.
 * Best for immutable assets.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response("", { status: 408 });
  }
}

/**
 * Stale-while-revalidate: serve cached immediately AND update in background.
 * Falls back to offline page for navigation when both cache and network fail.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Kick off background revalidation (don't await)
  const revalidate = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) return cached;

  // Nothing in cache — wait for network
  const fresh = await revalidate;
  if (fresh) return fresh;

  return offlineFallback(request);
}

/**
 * Network-first: try network; fall back to cache, then offline page.
 * Best for API data and frequently-changing pages.
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    return offlineFallback(request);
  }
}

/**
 * Return the pre-cached offline.html for navigation requests;
 * plain 503 text for everything else.
 */
async function offlineFallback(request) {
  if (request.mode === "navigate") {
    const staticCache = await caches.open(STATIC_CACHE);
    const page = await staticCache.match(OFFLINE_URL);
    if (page) return page;
  }
  return new Response("Offline — please reconnect", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
