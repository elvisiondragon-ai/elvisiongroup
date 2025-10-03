// Service Worker for background audio support + audio caching
// Import Workbox via importScripts for service worker compatibility
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const CACHE_NAME = 'audio-therapy-v4-3oktober';
const AUDIO_CACHE_NAME = 'audio-therapy-audio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Audio files to cache for offline playback
const audioFilesToCache = [
  'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Jurnalsyukur1.MP3',
  'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse%203%20-%20Syukur.MP3',
  'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse1%20-%20The%20Space%20Hill.MP3',
  'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse2%20-%20Lucid%20Beach.MP3',
  'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse4-English.MP3',
  'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse5%20-%20Virtality%20Vortex.MP3'
];

// Initialize Workbox and precache files from Vite PWA
if (workbox) {
  const { precacheAndRoute, cleanupOutdatedCaches } = workbox;
  precacheAndRoute(self.__WB_MANIFEST || []);
  cleanupOutdatedCaches();
}

// Install event - cache app files + audio files separately
self.addEventListener('install', (event) => {
  console.log('🔧 SW Installing - Audio + PWA Cache Setup v4-3oktober');
  event.waitUntil(
    Promise.all([
      // Cache app files in main cache
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching app files...');
        return cache.addAll(urlsToCache);
      }),
      // Cache audio files in separate audio cache
      caches.open(AUDIO_CACHE_NAME).then((audioCache) => {
        console.log('Checking audio cache...');
        // Only cache audio if not already cached
        return Promise.all(
          audioFilesToCache.map(url => 
            audioCache.match(url).then(cached => {
              if (!cached) {
                return audioCache.add(url).catch(err => console.log(`Failed to cache ${url}:`, err));
              }
            })
          )
        );
      })
    ]).then(() => {
      // Enable skipWaiting to activate new SW immediately when update is triggered
      return self.skipWaiting();
    })
  );
});

// Activate event - clear old caches but preserve audio
self.addEventListener('activate', (event) => {
  console.log('🚀 SW Activated - Taking control v4-3oktober');
  event.waitUntil(
    Promise.all([
      // Clear all old caches except audio
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Keep audio cache and current cache, delete everything else
            if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim().then(() => {
        // Force refresh all clients to clear white/black screen
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            console.log('🔄 Forcing client refresh for cache clear');
            client.postMessage({
              type: 'CACHE_CLEARED',
              action: 'refresh'
            });
          });
        });
      })
    ])
  );
});

// Fetch event with special handling for audio files
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Handle audio files with cache-first strategy using separate audio cache
  if (url.includes('supabase.co/storage') && url.includes('audio-files')) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then((audioCache) => {
        return audioCache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving audio from cache:', url);
            return cachedResponse;
          }
          
          // If not cached, fetch and cache for next time
          console.log('Fetching and caching audio:', url);
          return fetch(event.request).then((response) => {
            // Cache the audio file for future use in audio cache
            if (response && response.status === 200) {
              const responseClone = response.clone();
              audioCache.put(event.request, responseClone);
            }
            return response;
          }).catch((error) => {
            console.log('Audio fetch failed, app continues:', error);
            // Return a valid response to prevent blocking
            return new Response('', { status: 204, statusText: 'Audio unavailable' });
          });
        });
      })
    );
  } else {
    // Regular cache strategy for other files with error handling
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch((error) => {
          console.log('Regular fetch failed, continuing:', error);
          // Don't block the app - let it handle the error gracefully
          throw error;
        });
      })
    );
  }
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
