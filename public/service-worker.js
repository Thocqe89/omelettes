const CACHE_NAME = 'omelettes-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://res.cloudinary.com/deahgtn57/image/upload/v1756960044/omelett%27s/public/logo/logo.png',
  '/styles/main.css',
  '/scripts/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});