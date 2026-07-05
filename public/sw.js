// Self-destroying service worker to clear aggressive browser caching
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('[Service Worker] Deleting cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Do not intercept or cache anything, let network request succeed directly
self.addEventListener('fetch', (event) => {
  return;
});

