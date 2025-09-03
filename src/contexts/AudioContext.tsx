import React, { createContext, useContext } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

interface AudioContextType {
  createProtectedAudio: (audioPath: string) => HTMLAudioElement;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Create protected audio with minimal Web Audio API approach
  const createProtectedAudio = (audioPath: string): HTMLAudioElement => {
    // Check if it's already a full URL (starts with http/https)
    const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
    
    // Create audio element with minimal Web Audio API protection
    const audio = new Audio();
    
    // MINIMAL Web Audio API for protection without breaking playback
    if (window.AudioContext || window.webkitAudioContext) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(audioContext.destination);
      } catch (e) {
        // Fallback to regular audio if Web Audio API fails
        console.log('Web Audio API failed, using regular audio');
      }
    }
    
    // Set source AFTER Web Audio API setup
    audio.src = audioUrl;
    
    // ONLY the working protections
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