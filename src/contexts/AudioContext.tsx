import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';
import { indexedDBCache } from '@/utils/indexedDBCache';
import { AudioProtection } from '@/utils/audioProtection';

interface AudioContextType {
  createProtectedAudio: (audioPath: string, onLoadingChange?: (loading: boolean) => void) => Promise<HTMLAudioElement>;
  createStreamingAudio: (audioPath: string) => HTMLAudioElement;
  clearCache: () => Promise<void>;
  getCacheStats: () => Promise<{ cached: number; totalSize: string }>;
  isCached: (audioPath: string) => Promise<boolean>;
  currentPlayingVerse: number | null;
  currentVerseAudio: HTMLAudioElement | null;
  setCurrentPlayingVerse: (id: number | null) => void;
  setCurrentVerseAudio: (audio: HTMLAudioElement | null) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Singleton audio manager to survive re-renders
const audioManager = {
  currentPlayingVerse: null as number | null,
  currentVerseAudio: null as HTMLAudioElement | null,
  listeners: new Set<() => void>(),

  setCurrentPlayingVerse(id: number | null) {
    this.currentPlayingVerse = id;
    this.notifyListeners();
  },

  setCurrentVerseAudio(audio: HTMLAudioElement | null) {
    if (this.currentVerseAudio && this.currentVerseAudio !== audio) {
        this.currentVerseAudio.pause();
    }
    this.currentVerseAudio = audio;
    this.notifyListeners();
  },

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },

  notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  },
};


export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioCache] = useState(new Map<string, string>());
  const [, forceUpdate] = useState(0);

  React.useEffect(() => {
    const unsubscribe = audioManager.subscribe(() => forceUpdate(n => n + 1));
    AudioProtection.monitorDownloadAttempts();
    const clearTrackedUrls = AudioProtection.trackBlobUrls();

    return () => {
      unsubscribe();
      // clearTrackedUrls(); // Commented out to keep URLs persistent
    };
  }, []);

  const clearCache = useCallback(async () => {
    console.log('🔒 Audio cache clearing blocked - user protection active');
    const userRequested = confirm('Are you sure you want to clear audio cache? Downloads will be needed again.');
    if (userRequested) {
      audioCache.forEach(blobUrl => URL.revokeObjectURL(blobUrl));
      audioCache.clear();
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
    if (audioCache.has(audioPath)) {
      return true;
    }
    const cacheKey = indexedDBCache.generateCacheKey(audioPath);
    const cachedBlob = await indexedDBCache.get(cacheKey);
    return cachedBlob !== null;
  }, [audioCache]);

  const createProtectedAudio = useCallback(async (audioPath: string, onLoadingChange?: (loading: boolean) => void): Promise<HTMLAudioElement> => {
    const cachedUrl = audioCache.get(audioPath);
    if (cachedUrl) {
      console.log('🎵 Using memory cached audio:', audioPath);
      const audio = new Audio(cachedUrl);
      // Apply protections
      return audio;
    }

    const cacheKey = indexedDBCache.generateCacheKey(audioPath);
    const cachedBlob = await indexedDBCache.get(cacheKey);
    if (cachedBlob) {
      console.log('🎵 Using IndexedDB cached audio:', audioPath);
      const blobUrl = URL.createObjectURL(cachedBlob);
      audioCache.set(audioPath, blobUrl);
      const audio = new Audio(blobUrl);
      // Apply protections
      return audio;
    }

    console.log('🎵 USER-INITIATED download/caching audio:', audioPath);
    onLoadingChange?.(true);
    try {
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      const response = await fetch(audioUrl, {
        headers: {
          'Cache-Control': 'max-age=31536000, immutable',
          'Pragma': 'cache',
          'If-Modified-Since': new Date(0).toUTCString(),
        },
        cache: 'force-cache'
      });
      if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      audioCache.set(audioPath, blobUrl);
      await indexedDBCache.store(cacheKey, blob, audioUrl);
      const audio = new Audio(blobUrl);
      // Apply protections
      console.log('🎵 Audio cached successfully:', audioPath);
      onLoadingChange?.(false);
      return audio;
    } catch (error) {
      console.error('Failed to cache audio, using direct URL:', error);
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      const audio = new Audio(audioUrl);
      // Apply protections
      onLoadingChange?.(false);
      return audio;
    }
  }, [audioCache]);

  const createStreamingAudio = useCallback((audioPath: string): HTMLAudioElement => {
    console.log('🎵 Creating streaming audio (no cache):', audioPath);
    const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
    const audio = new Audio(audioUrl);
    // Apply protections
    return audio;
  }, []);

  const value = {
    createProtectedAudio,
    createStreamingAudio,
    clearCache,
    getCacheStats,
    isCached,
    currentPlayingVerse: audioManager.currentPlayingVerse,
    currentVerseAudio: audioManager.currentVerseAudio,
    setCurrentPlayingVerse: audioManager.setCurrentPlayingVerse.bind(audioManager),
    setCurrentVerseAudio: audioManager.setCurrentVerseAudio.bind(audioManager),
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
