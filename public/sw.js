// SIMPLE RECOVERY SERVICE WORKER - NO RACE CONDITIONS
// Purpose: Fix black screen, minimal complexity

const RECOVERY_VERSION = 'RECOVERY-v6-3oktober';
console.log('🚑 Recovery SW Loading:', RECOVERY_VERSION);

// Immediate install and activate - no waiting
self.addEventListener('install', (event) => {
  console.log('🚑 Recovery SW Installing');
  self.skipWaiting(); // Take over immediately
});

self.addEventListener('activate', (event) => {
  console.log('🚑 Recovery SW Activated - Clearing everything');
  
  event.waitUntil(
    Promise.resolve().then(() => {
      // Delete ALL caches immediately
      return caches.keys().then((cacheNames) => {
        console.log('🚑 Found caches to delete:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('🚑 Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      });
    }).then(() => {
      // Take control immediately
      return self.clients.claim();
    }).then(() => {
      // Send recovery message to all clients
      return self.clients.matchAll();
    }).then((clients) => {
      console.log('🚑 Sending recovery message to', clients.length, 'clients');
      clients.forEach((client) => {
        client.postMessage({
          type: 'RECOVERY_MODE',
          action: 'clear_and_reload',
          version: RECOVERY_VERSION
        });
      });
    }).catch((error) => {
      console.log('🚑 Recovery process error (continuing):', error);
    })
  );
});

// Simple fetch handler - no caching, just pass through
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Don't intercept external domains - let them fail naturally
  if (url.includes('facebook.net') || 
      url.includes('google-analytics.com') || 
      url.includes('googletagmanager.com')) {
    return; // Let browser handle directly, no SW intervention
  }
  
  // Only handle same-origin requests
  event.respondWith(
    fetch(event.request).catch((error) => {
      // Silent fail for same-origin services
      return new Response('', { status: 204, statusText: 'Service unavailable' });
    })
  );
});

// Simple message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'RECOVERY_PING') {
    console.log('🚑 Recovery ping received');
    event.ports[0]?.postMessage({ status: 'recovery_active', version: RECOVERY_VERSION });
  }
});

console.log('🚑 Recovery SW Script Loaded:', RECOVERY_VERSION);