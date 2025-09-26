import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';
import { indexedDBCache } from '@/utils/indexedDBCache';
import { AudioProtection } from '@/utils/audioProtection';

interface AudioContextType {
  createProtectedAudio: (audioPath: string, onLoadingChange?: (loading: boolean) => void) => Promise<HTMLAudioElement>;
  clearCache: () => Promise<void>;
  getCacheStats: () => Promise<{ cached: number; totalSize: string }>;
  isCached: (audioPath: string) => Promise<boolean>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // In-memory cache for audio blobs
  const [audioCache] = useState(new Map<string, string>());

  // Initialize audio protection on mount
  React.useEffect(() => {
    AudioProtection.monitorDownloadAttempts();
    // Track blob URLs without auto-clearing
    const clearTrackedUrls = AudioProtection.trackBlobUrls();

    // Return cleanup function to clear tracked URLs on unmount if needed
    return () => {
      // clearTrackedUrls(); // Commented out to keep URLs persistent
    };
  }, []);
  
  const clearCache = useCallback(async () => {
    // PROTECTED: Do not clear audio cache - //Nevertouch Audio-cache
    console.log('🔒 Audio cache clearing blocked - user protection active');
    
    // Only clear if explicitly requested by user (not auto-deploy)
    const userRequested = confirm('Are you sure you want to clear audio cache? Downloads will be needed again.');
    if (userRequested) {
      // Clean up blob URLs to prevent memory leaks
      audioCache.forEach(blobUrl => URL.revokeObjectURL(blobUrl));
      audioCache.clear();
      
      // Clear IndexedDB cache as well
      await indexedDBCache.clear();
    }
  }, [audioCache]);

  const getCacheStats = useCallback(async () => {
    const memoryCount = audioCache.size;
    const indexedDBStats = await indexedDBCache.getStats();
    
    return {
      cached: memoryCount,
      totalSize: `Memory: ${memoryCount} files, IndexedDB: ${indexedDBStats.count} files (${(indexedDBStats.totalSize / 1024 / 1024).toFixed(2)} MB)`
    };
  }, [audioCache]);

  const isCached = useCallback(async (audioPath: string) => {
    // Check memory cache first
    if (audioCache.has(audioPath)) {
      return true;
    }
    
    // Check IndexedDB cache
    const cacheKey = indexedDBCache.generateCacheKey(audioPath);
    const cachedBlob = await indexedDBCache.get(cacheKey);
    return cachedBlob !== null;
  }, [audioCache]);

  // Enhanced audio creation with USER-INITIATED downloads only - //Nevertouch Audio-cache
  const createProtectedAudio = useCallback(async (audioPath: string, onLoadingChange?: (loading: boolean) => void): Promise<HTMLAudioElement> => {
    // Check memory cache first
    const cachedUrl = audioCache.get(audioPath);
    if (cachedUrl) {
      console.log('🎵 Using memory cached audio:', audioPath);
      const audio = new Audio(cachedUrl);

      // Apply comprehensive protections
      audio.setAttribute('preload', 'none');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
      audio.setAttribute('disablepictureinpicture', 'true');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      audio.addEventListener('dragstart', (e) => e.preventDefault());
      audio.addEventListener('drag', (e) => e.preventDefault());

      // Override src property
      Object.defineProperty(audio, 'src', {
        value: cachedUrl,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(audio, 'currentSrc', {
        get: () => 'protected://audio-stream',
        enumerable: false,
        configurable: false
      });

      return audio;
    }

    // Check IndexedDB cache (persistent for iOS)
    const cacheKey = indexedDBCache.generateCacheKey(audioPath);
    const cachedBlob = await indexedDBCache.get(cacheKey);
    if (cachedBlob) {
      console.log('🎵 Using IndexedDB cached audio:', audioPath);
      const blobUrl = URL.createObjectURL(cachedBlob);
      
      // Store in memory cache for faster subsequent access
      audioCache.set(audioPath, blobUrl);

      const audio = new Audio(blobUrl);

      // Apply comprehensive protections
      audio.setAttribute('preload', 'none');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
      audio.setAttribute('disablepictureinpicture', 'true');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      audio.addEventListener('dragstart', (e) => e.preventDefault());
      audio.addEventListener('drag', (e) => e.preventDefault());

      // Override src property
      Object.defineProperty(audio, 'src', {
        value: blobUrl,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(audio, 'currentSrc', {
        get: () => 'protected://audio-stream',
        enumerable: false,
        configurable: false
      });

      return audio;
    }

    console.log('🎵 USER-INITIATED download/caching audio:', audioPath); // Only downloads when user plays
    
    // Show loading state for iOS cache miss - //Nevertouch Audio-cache
    onLoadingChange?.(true);
    
    try {
      // Get the URL (check if it's already a full URL)
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      
      // USER-INITIATED fetch and cache - no auto-prefetch - //Nevertouch Audio-cache
      const response = await fetch(audioUrl, {
        headers: {
          'Cache-Control': 'max-age=31536000, immutable', // 1 year cache - protected from clearing
          'Pragma': 'cache', // Keep cache persistent
          'If-Modified-Since': new Date(0).toUTCString(), // Always check if modified
        },
        cache: 'force-cache' // Use browser cache when available
      });
      if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`);
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Cache in both memory and IndexedDB
      audioCache.set(audioPath, blobUrl);
      
      // Store in IndexedDB for persistence (especially important for iOS)
      await indexedDBCache.store(cacheKey, blob, audioUrl);
      
      // Create audio element with cached blob
      const audio = new Audio(blobUrl);

      // Apply comprehensive protections
      audio.setAttribute('preload', 'none');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
      audio.setAttribute('disablepictureinpicture', 'true');
      audio.crossOrigin = 'anonymous';

      // Prevent right-click context menu
      audio.addEventListener('contextmenu', (e) => e.preventDefault());

      // Prevent drag and drop
      audio.addEventListener('dragstart', (e) => e.preventDefault());
      audio.addEventListener('drag', (e) => e.preventDefault());

      // Prevent keyboard shortcuts (Ctrl+S, etc.)
      audio.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
          e.preventDefault();
        }
      });

      // Override src property to make it non-enumerable and non-configurable
      Object.defineProperty(audio, 'src', {
        value: blobUrl,
        writable: false,
        enumerable: false,
        configurable: false
      });

      // Add protection against direct blob access
      Object.defineProperty(audio, 'currentSrc', {
        get: () => 'protected://audio-stream',
        enumerable: false,
        configurable: false
      });

      console.log('🎵 Audio cached successfully:', audioPath);
      onLoadingChange?.(false);
      return audio;
      
    } catch (error) {
      console.error('Failed to cache audio, using direct URL:', error);
      
      // Fallback to direct URL if caching fails
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      const audio = new Audio(audioUrl);

      // Apply comprehensive protections even for fallback
      audio.setAttribute('preload', 'none');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
      audio.setAttribute('disablepictureinpicture', 'true');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      audio.addEventListener('dragstart', (e) => e.preventDefault());
      audio.addEventListener('drag', (e) => e.preventDefault());

      // Override src property even for direct URLs
      Object.defineProperty(audio, 'src', {
        value: audioUrl,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(audio, 'currentSrc', {
        get: () => 'protected://audio-stream',
        enumerable: false,
        configurable: false
      });

      onLoadingChange?.(false);
      return audio;
    }
  }, [audioCache]);

  const value = {
    createProtectedAudio,
    clearCache,
    getCacheStats,
    isCached
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useProtectedAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useProtectedAudio must be used within an AudioProvider');
  }
  return context;
}