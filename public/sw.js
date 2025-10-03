// Service Worker for background audio support + audio caching
// Import Workbox via importScripts for service worker compatibility
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const CACHE_NAME = 'audio-therapy-v5-NUKE-3oktober';
const AUDIO_CACHE_NAME = 'audio-therapy-audio-v2-NUKE';
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

// Install event - NUCLEAR CACHE SETUP
self.addEventListener('install', (event) => {
  console.log('💥 SW Installing - NUCLEAR CACHE CLEAR v5-NUKE-3oktober');
  event.waitUntil(
    Promise.all([
      // Cache app files in main cache
      caches.open(CACHE_NAME).then((cache) => {
        console.log('💥 NUKE: Caching app files...');
        return cache.addAll(urlsToCache);
      }),
      // Force re-cache ALL audio files (nuclear approach)
      caches.open(AUDIO_CACHE_NAME).then((audioCache) => {
        console.log('💥 NUKE: Force re-caching ALL audio files...');
        return Promise.all(
          audioFilesToCache.map(url => 
            audioCache.add(url).catch(err => console.log(`Failed to cache ${url}:`, err))
          )
        );
      })
    ]).then(() => {
      // Enable skipWaiting to activate new SW immediately when update is triggered
      console.log('💥 NUKE: Force activating new SW');
      return self.skipWaiting();
    })
  );
});

// Activate event - NUCLEAR CACHE CLEAR + FORCE LOGOUT
self.addEventListener('activate', (event) => {
  console.log('💥 SW Activated - NUCLEAR CACHE CLEAR v5-NUKE-3oktober');
  event.waitUntil(
    Promise.all([
      // NUCLEAR: Delete ALL caches (including old audio)
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Keep only current caches, nuke everything else
            if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
              console.log('💥 NUKE: Deleting cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim().then(() => {
        // NUCLEAR: Force complete refresh + logout
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            console.log('💥 NUKE: Forcing complete refresh + logout');
            client.postMessage({
              type: 'NUCLEAR_CACHE_CLEAR',
              action: 'nuke_and_logout',
              version: 'v5-NUKE-3oktober'
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
