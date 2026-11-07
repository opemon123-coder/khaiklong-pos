// ขายคล่อง POS: ใช้งานได้แม้เน็ตหลุด (offline cache)
const CACHE = 'khaiklong-v2';
const ASSETS = ['./', './index.html', './qrcode.js', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const cacheable = u.origin === location.origin || u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (!cacheable) return;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});
