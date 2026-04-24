const CACHE = 'km-portfolio-v3';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './skills.html',
  './projects.html',
  './blog.html',
  './contact.html',
  './article-1.html',
  './article-2.html',
  './article-3.html',
  './assets/css/index.css',
  './assets/js/script.js',
  './manifest.json',
  './assets/images/logo.png',
  './assets/images/profile.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('api.github.com')) {
    event.respondWith(
      fetch(event.request).catch(
        () => new Response('[]', { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
