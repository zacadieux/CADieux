/* CADieux service worker: lets the site install as an app and keep working offline */
const VERSION = 'cadieux-1.4.0-b461',
  SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'],
  THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) =>
      Promise.all([
        c.addAll(SHELL),
        fetch(THREE, {mode: 'no-cors'})
          .then((r) => c.put(THREE, r))
          .catch(() => {}),
      ]),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url === THREE) {
    /* the 3D library never changes: serve it from the cache first */
    e.respondWith(
      caches.match(req.url).then(
        (hit) =>
          hit ||
          fetch(new Request(THREE, {mode: 'no-cors'})).then((r) => {
            const copy = r.clone();
            caches.open(VERSION).then((c) => c.put(THREE, copy));
            return r;
          }),
      ),
    );
    return;
  }
  if (new URL(req.url).origin !== location.origin) return;
  /* own files: try the network so updates show up, fall back to the cache when offline */
  e.respondWith(
    fetch(req)
      .then((r) => {
        const copy = r.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return r;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('index.html'))),
  );
});
