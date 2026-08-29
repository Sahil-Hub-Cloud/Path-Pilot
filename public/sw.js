// Path Pilot Service Worker
// Handles chunk caching and stale-while-revalidate for fast loading

const CACHE_NAME = 'pathpilot-v2';
const CHUNK_CACHE = 'pathpilot-chunks-v1';

// Install: skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== CHUNK_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for chunks, network-first for everything else
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Next.js static chunks: cache-first (they have content hashes, never change)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CHUNK_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            // Chunk not in cache and network failed — return a simple error
            return new Response('', { status: 408, statusText: 'Chunk unavailable' });
          });
        })
      )
    );
    return;
  }

  // HTML pages: network-first with cache fallback
  if (request.mode === 'navigate' || url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Everything else: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
