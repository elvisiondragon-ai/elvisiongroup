import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

interface AudioContextType {
  createProtectedAudio: (audioPath: string) => Promise<HTMLAudioElement>;
  clearCache: () => void;
  getCacheStats: () => { cached: number; totalSize: string };
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // In-memory cache for audio blobs
  const [audioCache] = useState(new Map<string, string>());
  
  const clearCache = useCallback(() => {
    // Clean up blob URLs to prevent memory leaks
    audioCache.forEach(blobUrl => URL.revokeObjectURL(blobUrl));
    audioCache.clear();
  }, [audioCache]);

  const getCacheStats = useCallback(() => {
    const cached = audioCache.size;
    const totalSize = `${cached} files cached`;
    return { cached, totalSize };
  }, [audioCache]);

  // Enhanced audio creation with local caching
  const createProtectedAudio = useCallback(async (audioPath: string): Promise<HTMLAudioElement> => {
    // Check if already cached
    const cachedUrl = audioCache.get(audioPath);
    if (cachedUrl) {
      console.log('🎵 Using cached audio:', audioPath);
      const audio = new Audio(cachedUrl);
      
      // Apply protections
      audio.setAttribute('preload', 'metadata');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      
      return audio;
    }

    console.log('🎵 Caching audio:', audioPath);
    
    try {
      // Get the URL (check if it's already a full URL)
      const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
      
      // Fetch and cache the audio file
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`);
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Cache the blob URL
      audioCache.set(audioPath, blobUrl);
      
      // Create audio element with cached blob
      const audio = new Audio(blobUrl);
      
      // Apply protections
      audio.setAttribute('preload', 'metadata');
      audio.setAttribute('controlsList', 'nodownload noremoteplayback');
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('contextmenu', (e) => e.preventDefault());
      
      console.log('🎵 Audio cached successfully:', audioPath);
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
      
      return audio;
    }
  }, [audioCache]);

  const value = {
    createProtectedAudio,
    clearCache,
    getCacheStats
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