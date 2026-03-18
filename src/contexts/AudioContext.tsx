"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';
import { indexedDBCache } from '@/utils/indexedDBCache';

// The full-featured context type
interface AudioContextType {
  createProtectedAudio: (audioPath: string, onLoadingChange?: (loading: boolean) => void, onProgress?: (progress: number) => void) => Promise<HTMLAudioElement>;
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
    return () => {
      unsubscribe();
    };
  }, []);

  const clearCache = useCallback(async () => {
    audioCache.forEach(blobUrl => URL.revokeObjectURL(blobUrl));
    audioCache.clear();
    await indexedDBCache.clear();
    alert('Audio cache has been cleared.');
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

  const createProtectedAudio = useCallback(async (audioPath: string, onLoadingChange?: (loading: boolean) => void, onProgress?: (progress: number) => void): Promise<HTMLAudioElement> => {
    const cachedUrl = audioCache.get(audioPath);
    if (cachedUrl) {
      console.log('🎵 Using memory cached audio:', audioPath);
      return new Audio(cachedUrl);
    }

    const cacheKey = indexedDBCache.generateCacheKey(audioPath);
    const cachedBlob = await indexedDBCache.get(cacheKey);
    if (cachedBlob) {
      console.log('🎵 Using IndexedDB cached audio:', audioPath);
      const blobUrl = URL.createObjectURL(cachedBlob);
      audioCache.set(audioPath, blobUrl);
      return new Audio(blobUrl);
    }

    console.log('🎵 Caching audio via robust download:', audioPath);
    onLoadingChange?.(true);
    onProgress?.(0);

    try {
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      const response = await fetch(audioUrl);

      if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      if (!contentLength) {
        throw new Error('Content-Length header not found. Cannot cache audio.');
      }

      const total = parseInt(contentLength, 10);
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;

      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
          loaded += value.length;
          if (onProgress) {
            const progress = Math.round((loaded / total) * 100);
            onProgress(progress);
          }
        } catch (error) {
          console.error('Error reading chunk from stream', error);
          throw new Error('Failed during audio download stream.');
        }
      }

      if (loaded !== total) {
        throw new Error(`Download incomplete: expected ${total} bytes, got ${loaded} bytes.`);
      }

      const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
      await indexedDBCache.store(cacheKey, blob, audioUrl);
      
      const blobUrl = URL.createObjectURL(blob);
      audioCache.set(audioPath, blobUrl);
      console.log('🎵 Audio cached successfully:', audioPath);
      onLoadingChange?.(false);
      onProgress?.(100);
      return new Audio(blobUrl);

    } catch (error) {
      console.error('Failed to cache audio, falling back to streaming:', error);
      onLoadingChange?.(false);
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      return new Audio(audioUrl);
    }
  }, [audioCache]);

  const createStreamingAudio = useCallback((audioPath: string): HTMLAudioElement => {
    console.log('🎵 Creating streaming audio (no cache):', audioPath);
    const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
    return new Audio(audioUrl);
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

// The hook to access the context
export function useProtectedAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useProtectedAudio must be used within an AudioProvider');
  }
  return context;
}
