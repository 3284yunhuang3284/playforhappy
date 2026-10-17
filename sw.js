// Play For Happy offline support.
// Change VERSION whenever you upload a new index.html so players get the update.
const VERSION = 'play-for-happy-v7';
const APP_FILES = [
  './',
  './index.html',
  './lobby.html',
  './slots.html',
  './baccarat.html',
  './blackjack.html',
  './poker.html',
  './block-puzzle.html',
  './contact.html',
  './common.js',
  './cards.js',
  './table.css',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: serve from cache, refresh in the background
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(VERSION).then(cache =>
        cache.match(req).then(hit => {
          const fresh = fetch(req).then(res => { cache.put(req, res.clone()); return res; }).catch(() => hit);
          return hit || fresh;
        })
      )
    );
    return;
  }

  // The game's own files: network first so updates arrive, cache when offline
  if (url.origin === location.origin && !url.pathname.includes('/api/') && !url.pathname.endsWith('stats.html')) {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
  }
});
