self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // A simple pass-through fetch handler is required by Chrome to trigger the PWA install prompt.
  e.respondWith(fetch(e.request));
});
