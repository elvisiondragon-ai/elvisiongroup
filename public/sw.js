// Service Worker for background audio support
const CACHE_NAME = 'audio-therapy-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event for caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for audio continuity
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'KEEP_AUDIO_ALIVE') {
    // Keep the service worker alive for audio playback
    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(resolve, 1000);
      })
    );
  }
});

// Handle audio focus events
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus the app window when notification is clicked
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
