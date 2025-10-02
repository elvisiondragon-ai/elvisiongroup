// Service Worker for background audio support + audio caching
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

const CACHE_NAME = 'audio-therapy-v3';
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

// Precache files from Vite PWA
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// Install event - cache app files + audio files
self.addEventListener('install', (event) => {
  console.log('🔧 SW Installing - Audio + PWA Cache Setup');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app files and audio files...');
      // Cache app files first
      return cache.addAll(urlsToCache).then(() => {
        // Then cache audio files (may take longer)
        return Promise.all(
          audioFilesToCache.map(url => 
            cache.add(url).catch(err => console.log(`Failed to cache ${url}:`, err))
          )
        );
      });
    }).then(() => {
      // Enable skipWaiting to activate new SW immediately when update is triggered
      return self.skipWaiting();
    })
  );
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('🚀 SW Activated - Taking control');
  event.waitUntil(
    self.clients.claim()
  );
});

// Fetch event with special handling for audio files
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Handle audio files with cache-first strategy
  if (url.includes('supabase.co/storage') && url.includes('audio-files')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving audio from cache:', url);
          return cachedResponse;
        }
        
        // If not cached, fetch and cache for next time
        console.log('Fetching and caching audio:', url);
        return fetch(event.request).then((response) => {
          // Cache the audio file for future use
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  } else {
    // Regular cache strategy for other files
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
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
