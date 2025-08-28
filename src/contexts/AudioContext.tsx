import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';
import { useAudioSession } from '@/hooks/useAudioSession';
import { useXPSystem } from '@/hooks/useXPSystem';

interface CurrentTrack {
  id: number;
  title: string;
  subtitle?: string;
  artwork?: string;
  audioPath: string;
}

interface AudioContextType {
  currentTrackId: number | null;
  isPlaying: boolean;
  playTrack: (track: CurrentTrack, onWarning?: () => Promise<boolean>) => Promise<void>;
  stopTrack: () => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { awardXP } = useXPSystem();
  const { initializeSession, updateMetadata, setPlaybackState } = useAudioSession();

  // Cleanup function to stop and remove audio
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackState('paused');
  }, [setPlaybackState]);

  // Handle audio completion
  const handleEnded = useCallback(() => {
    if (currentTrack) {
      // Determine if it's a journal or verse based on audio file
      const isJournal = currentTrack.audioPath === 'Jurnalsyukur1.MP3';
      
      if (isJournal) {
        // Award XP for journal completion
        awardXP('audio_completion', 10, `Completed ${currentTrack.title}`, {
          journalId: currentTrack.id,
          journalTitle: currentTrack.title
        });
      } else {
        // Award XP for verse completion
        awardXP('audio_completion', 10, `Completed ${currentTrack.title}`, {
          verseId: currentTrack.id,
          verseTitle: currentTrack.title
        });
      }
    }
    setCurrentTrackId(null);
    setCurrentTrack(null);
    cleanupAudio();
  }, [currentTrack, awardXP, cleanupAudio]);

  // Handle audio error
  const handleError = useCallback((e: Event) => {
    console.error('Audio playback error:', e);
    setCurrentTrackId(null);
    setCurrentTrack(null);
    cleanupAudio();
  }, [cleanupAudio]);

  // Prevent context menu (download protection)
  const handleContextMenu = useCallback((e: Event) => e.preventDefault(), []);

  // Play track function
  const playTrack = useCallback(async (track: CurrentTrack, onWarning?: () => Promise<boolean>) => {
    // If there's already a track playing, show warning
    if (currentTrackId && currentTrackId !== track.id && onWarning) {
      const shouldContinue = await onWarning();
      if (!shouldContinue) {
        return;
      }
    }

    // Stop current audio if different track
    if (currentTrackId !== track.id) {
      cleanupAudio();
    }

    // If same track and already playing/paused, just resume/pause
    if (currentTrackId === track.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPlaybackState('paused');
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setPlaybackState('playing');
        } catch (error) {
          console.error('Error resuming audio:', error);
        }
      }
      return;
    }

    // Create new audio for new track
    try {
      const publicUrl = getAudioUrl(track.audioPath);
      const audio = new Audio(publicUrl);
      
      // Configure audio for background playback with enhanced protection
      audio.crossOrigin = 'anonymous';
      audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
      audio.setAttribute('disablePictureInPicture', 'true');
      audio.setAttribute('oncontextmenu', 'return false');
      audio.preload = 'metadata';
      
      // Add CSS style for pointer-events protection
      audio.style.pointerEvents = 'none';
      
      // Add event listeners
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('contextmenu', handleContextMenu);

      audioRef.current = audio;
      setCurrentTrack(track);
      setCurrentTrackId(track.id);

      // Initialize media session with handlers
      initializeSession({
        onPlay: async () => {
          if (audioRef.current && !isPlaying) {
            try {
              await audioRef.current.play();
              setIsPlaying(true);
              setPlaybackState('playing');
            } catch (error) {
              console.error('Error resuming audio via media session:', error);
            }
          }
        },
        onPause: () => {
          if (audioRef.current && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            setPlaybackState('paused');
          }
        }
      });
      
      updateMetadata({
        title: track.title,
        artist: "eL Vision Group",
        album: track.subtitle || "Spiritual Audio",
        artwork: track.artwork ? [
          { src: track.artwork, sizes: '512x512', type: 'image/jpeg' }
        ] : [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      // Play audio
      await audio.play();
      setIsPlaying(true);
      setPlaybackState('playing');
    } catch (error) {
      console.error('Error playing audio:', error);
      cleanupAudio();
    }
  }, [currentTrackId, isPlaying, cleanupAudio, handleEnded, handleError, handleContextMenu, initializeSession, updateMetadata, setPlaybackState]);

  // Stop track function
  const stopTrack = useCallback(() => {
    setCurrentTrackId(null);
    setCurrentTrack(null);
    cleanupAudio();
  }, [cleanupAudio]);

  // Pause track function
  const pauseTrack = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlaybackState('paused');
    }
  }, [isPlaying, setPlaybackState]);

  // Resume track function
  const resumeTrack = useCallback(async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setPlaybackState('playing');
      } catch (error) {
        console.error('Error resuming audio:', error);
      }
    }
  }, [isPlaying, setPlaybackState]);

  // Only cleanup on app unmount (not on navigation)
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  const value = {
    currentTrackId,
    isPlaying,
    playTrack,
    stopTrack,
    pauseTrack,
    resumeTrack
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useGlobalAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useGlobalAudio must be used within an AudioProvider');
  }
  return context;
}