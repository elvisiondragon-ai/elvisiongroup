import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';
import { indexedDBCache } from '@/utils/indexedDBCache';

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
  
  const clearCache = useCallback(async () => {
    // Clean up blob URLs to prevent memory leaks
    audioCache.forEach(blobUrl => URL.revokeObjectURL(blobUrl));
    audioCache.clear();
    
    // Clear IndexedDB cache as well
    await indexedDBCache.clear();
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

  // Enhanced audio creation with local caching and loading feedback
  const createProtectedAudio = useCallback(async (audioPath: string, onLoadingChange?: (loading: boolean) => void): Promise<HTMLAudioElement> => {
    // Check memory cache first
    const cachedUrl = audioCache.get(audioPath);
    if (cachedUrl) {
      console.log('🎵 Using memory cached audio:', audioPath);
      const audio = new Audio(cachedUrl);
      
      // Apply protections
      audio.setAttribute('preload', 'metadata');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      
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
      
      // Apply protections
      audio.setAttribute('preload', 'metadata');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      
      return audio;
    }

    console.log('🎵 Caching audio:', audioPath);
    
    // Show loading state for iOS cache miss
    onLoadingChange?.(true);
    
    try {
      // Get the URL (check if it's already a full URL)
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      
      // Fetch and cache the audio file with iOS-optimized headers
      const response = await fetch(audioUrl, {
        headers: {
          'Cache-Control': 'max-age=2592000, must-revalidate', // 30 days with validation
          'Pragma': 'no-cache', // Force validation on iOS
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
      
      // Apply protections
      audio.setAttribute('preload', 'metadata');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      
      console.log('🎵 Audio cached successfully:', audioPath);
      onLoadingChange?.(false);
      return audio;
      
    } catch (error) {
      console.error('Failed to cache audio, using direct URL:', error);
      
      // Fallback to direct URL if caching fails
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      const audio = new Audio(audioUrl);
      
      audio.setAttribute('preload', 'metadata');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      
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