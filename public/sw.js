// Service Worker for background audio support - CACHING DISABLED
const CACHE_NAME = 'audio-therapy-v1';

// Install event - Clear ALL caches on install for security
self.addEventListener('install', (event) => {
  event.waitUntil(
    // Clear all caches to prevent audio URL exposure
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - Force cache clearing
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache on activate:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Clear localStorage audio cache data
      console.log('Clearing localStorage audio cache');
      // Note: localStorage is not available in service worker, 
      // but this will be handled by the main app
      return self.clients.claim();
    })
  );
});

// DISABLED: Fetch caching disabled for audio security
// self.addEventListener('fetch', (event) => {
//   // NO CACHING - Security risk for audio protection
//   event.respondWith(fetch(event.request));
// });

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
