import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

interface AudioContextType {
  createProtectedAudio: (audioPath: string) => HTMLAudioElement;
  currentPlayingVerse: number | null;
  currentVerseAudio: HTMLAudioElement | null;
  setCurrentPlayingVerse: (id: number | null) => void;
  setCurrentVerseAudio: (audio: HTMLAudioElement | null) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // @ts-ignore - Lovable deployment compatibility
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  // @ts-ignore - Lovable deployment compatibility
  const [currentVerseAudio, setCurrentVerseAudio] = useState<HTMLAudioElement | null>(null);

  // Create protected audio element with your primitive approach
  const createProtectedAudio = (audioPath: string): HTMLAudioElement => {
    // Check if it's already a full URL (starts with http/https)
    const audioUrl = audioPath.startsWith('http') ? audioPath : getAudioUrl(audioPath);
    const audio = new Audio(audioUrl);
    
    // Add protection - no download, no right-click
    audio.setAttribute('controlsList', 'nodownload');
    audio.addEventListener('contextmenu', (e) => e.preventDefault());
    
    return audio;
  };

  const value = {
    createProtectedAudio,
    currentPlayingVerse,
    currentVerseAudio,
    setCurrentPlayingVerse,
    setCurrentVerseAudio
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