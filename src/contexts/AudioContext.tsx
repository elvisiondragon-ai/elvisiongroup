import React, { createContext, useContext } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

interface AudioContextType {
  createProtectedAudio: (audioPath: string) => Promise<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Create protected audio with blob URL streaming to hide real URLs
  const createProtectedAudio = async (audioPath: string): Promise<HTMLAudioElement> => {
    // Check if it's already a full URL (starts with http/https)  
    const audioUrl = audioPath.startsWith('http') ? audioPath : await getAudioUrl(audioPath);
    
    const audio = new Audio();
    
    try {
      // Fetch audio as blob to hide real URL from network inspection
      console.log('Fetching audio as blob to hide URL...');
      const response = await fetch(audioUrl, {
        headers: {
          'Accept': 'audio/*',
          'Cache-Control': 'no-cache', // Force fresh download to blob
        },
        credentials: 'omit', // Don't send credentials
        referrerPolicy: 'no-referrer', // Hide referrer
        mode: 'cors', // Ensure CORS handling
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Use blob URL instead of direct Supabase URL
      audio.src = blobUrl;
      
      // Clean up blob URL when audio is done
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(blobUrl);
      });
      
      // Clean up on error
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(blobUrl);
      });
      
    } catch (error) {
      console.warn('Blob URL failed, fallback to direct URL:', error);
      // Fallback to direct URL with protection
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