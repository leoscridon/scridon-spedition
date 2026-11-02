// SCRIDON SPEDITION: network-first for the app shell; Supabase is never cached.
const CACHE = 'scridon-shell-v2';
const SHELL = '/scridon-spedition/';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.add(SHELL)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode !== 'navigate' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(fetch(req).catch(() => caches.match(SHELL)));
});
