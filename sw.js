// Офлайн-кэш анкеты. Версия меняется при каждой сборке — так телефон подхватывает обновления.
var V = 'obhod-20261119-a86efa';
var FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(V).then(function (c) {
    return c.match(e.request, {ignoreSearch: true}).then(function (hit) {
      if (hit) return hit;
      if (e.request.mode === 'navigate') return c.match('index.html').then(function (h) { return h || fetch(e.request); });
      return fetch(e.request);
    });
  }));
});
