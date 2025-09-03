import React, { createContext, useContext } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

interface AudioContextType {
  createProtectedAudio: (audioPath: string) => HTMLAudioElement;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Create protected audio element with your primitive approach
  const createProtectedAudio = (audioPath: string): HTMLAudioElement => {
    // Check if it's already a full URL (starts with http/https)
    const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
    
    // Block empty URLs (download manager detected)
    if (!audioUrl) {
      throw new Error('Audio access denied');
    }
    
    const audio = new Audio(audioUrl);
    
    // Add protection - no download, no right-click + crossOrigin fix
    audio.setAttribute('preload', 'metadata');
    audio.setAttribute('controlsList', 'nodownload noremoteplayback');
    audio.crossOrigin = 'anonymous'; // THE MAGIC KEY - prevents IDM downloads
    audio.referrerPolicy = 'no-referrer'; // Hide referrer information
    
    // Block right-click and inspect element
    audio.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Block keyboard shortcuts for saving
    audio.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    
    // Override src property to prevent direct access
    Object.defineProperty(audio, 'currentSrc', {
      get: () => '[PROTECTED]',
      configurable: false
    });
    
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