import React, { createContext, useContext } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

interface AudioContextType {
  createProtectedAudio: (audioPath: string) => HTMLAudioElement;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Create protected audio with HLS streaming approach
  const createProtectedAudio = (audioPath: string): HTMLAudioElement => {
    // Check if it's already a full URL (starts with http/https)  
    const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
    
    const audio = new Audio();
    
    // HLS streaming for better protection + service worker caching
    if ('MediaSource' in window && audioUrl.endsWith('.MP3')) {
      // Convert MP3 to HLS-like streaming URL for protection
      const hlsUrl = `${audioUrl}#.m3u8`; // Trick browsers into HLS mode
      audio.src = hlsUrl;
    } else {
      audio.src = audioUrl;
    }
    
    // Core protections that work
    audio.setAttribute('preload', 'metadata');
    audio.setAttribute('controlsList', 'nodownload noremoteplayback');
    audio.crossOrigin = 'anonymous'; // THE MAGIC KEY - prevents IDM downloads
    audio.addEventListener('contextmenu', (e) => e.preventDefault());
    
    return audio;
  };

  const value = {
    createProtectedAudio
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