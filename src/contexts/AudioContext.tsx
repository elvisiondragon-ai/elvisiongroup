import React, { createContext, useContext } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

interface AudioContextType {
  createProtectedAudio: (audioPath: string) => Promise<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Create protected audio - fast playback with private bucket for short verses
  const createProtectedAudio = async (audioPath: string): Promise<HTMLAudioElement> => {
    const audio = new Audio();
    
    // Check if it's already a full URL (starts with http/https)
    if (audioPath.startsWith('http')) {
      audio.src = audioPath;
    } else {
      // Use private bucket signed URL for short verses (ID 100), public for others
      const audioUrl = await getAudioUrl(audioPath);
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