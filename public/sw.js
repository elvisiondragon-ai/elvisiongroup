// Service Worker ONLY for background audio - ZERO CACHING
console.log('🎵 Background Audio Service Worker - NO CACHING MODE');

// Install immediately
self.addEventListener('install', (event) => {
  console.log('🎵 Installing background audio service worker');
  self.skipWaiting();
});

// Activate immediately  
self.addEventListener('activate', (event) => {
  console.log('🎵 Activating background audio service worker');
  event.waitUntil(self.clients.claim());
});

// NO FETCH INTERCEPTION - Let all requests go through normally
// This prevents any caching while still enabling background audio

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
