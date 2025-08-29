import React, { createContext, useContext } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

// Simple context - just protection utility, no global state
interface AudioContextType {
  createProtectedAudio: (audioPath: string) => HTMLAudioElement;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Create protected audio element with your primitive approach
  const createProtectedAudio = (audioPath: string): HTMLAudioElement => {
    const publicUrl = getAudioUrl(audioPath);
    const audio = new Audio(publicUrl);
    
    // Add protection - no download, no right-click
    audio.setAttribute('controlsList', 'nodownload');
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