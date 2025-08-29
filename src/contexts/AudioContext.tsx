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
  const startTimeRef = useRef<number | null>(null);
  const totalPlayTimeRef = useRef<number>(0);
  const { awardXP } = useXPSystem();
  const { initializeSession, updateMetadata, setPlaybackState } = useAudioSession();

  // Cleanup function to stop and remove audio
  const cleanupAudio = useCallback(() => {
    // Update total play time if currently playing
    if (startTimeRef.current && isPlaying) {
      totalPlayTimeRef.current += Date.now() - startTimeRef.current;
    }
    startTimeRef.current = null;

    if (audioRef.current) {
      // Call custom cleanup to remove orphan listeners
      if (audioRef.current.cleanup) {
        audioRef.current.cleanup();
      }
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackState('paused');
  }, [setPlaybackState, isPlaying]);

  // Handle audio completion
  const handleEnded = useCallback(() => {
    console.log('🎵 Audio ended - handleEnded triggered!', { currentTrack });
    
    // Ensure we have valid references to prevent orphan audio
    if (!currentTrack || !audioRef.current) {
      console.warn('⚠️ Orphan audio detected - missing references');
      return;
    }
    
    // Update total play time
    if (startTimeRef.current) {
      totalPlayTimeRef.current += Date.now() - startTimeRef.current;
    }
    
    if (currentTrack) {
      // Determine if it's a journal or verse based on audio file
      const isJournal = currentTrack.audioPath === 'Jurnalsyukur1.MP3';
      const totalMinutes = totalPlayTimeRef.current / (1000 * 60);
      
      console.log('🎯 Audio completion check', {
        isJournal,
        trackId: currentTrack.id,
        trackTitle: currentTrack.title,
        audioPath: currentTrack.audioPath,
        totalMinutes
      });
      
      if (isJournal) {
        // Check minimum 1-hour listening time for journal
        if (totalMinutes >= 60) {
          // Award XP for journal completion (minimum 1 hour)
          awardXP('audio_completion', 10, `Completed ${currentTrack.title} (${Math.floor(totalMinutes)} minutes)`, {
            journalId: currentTrack.id,
            journalTitle: currentTrack.title,
            listeningMinutes: Math.floor(totalMinutes)
          }).then(() => {
            console.log('✅ Journal XP awarded successfully');
          }).catch(error => {
            console.error('❌ Error awarding journal XP:', error);
          });
        } else {
          console.log('⚠️ Journal listening time insufficient:', totalMinutes, 'minutes (minimum 60 required)');
        }
      } else {
        // Award XP for verse completion
        awardXP('audio_completion', 10, `Completed ${currentTrack.title}`, {
          verseId: currentTrack.id,
          verseTitle: currentTrack.title
        }).then(() => {
          console.log('✅ Verse XP awarded successfully');
        }).catch(error => {
          console.error('❌ Error awarding verse XP:', error);
        });
      }
    }
    
    // Reset play time tracking
    totalPlayTimeRef.current = 0;
    startTimeRef.current = null;
    
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
        // Update total play time when pausing
        if (startTimeRef.current) {
          totalPlayTimeRef.current += Date.now() - startTimeRef.current;
          startTimeRef.current = null;
        }
        audioRef.current.pause();
        setIsPlaying(false);
        setPlaybackState('paused');
      } else {
        try {
          await audioRef.current.play();
          startTimeRef.current = Date.now(); // Start timing when resuming
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
      
      // Configure audio for background playback
      audio.crossOrigin = 'anonymous';
      audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
      audio.setAttribute('oncontextmenu', 'return false');
      audio.preload = 'metadata';
      
      // Add CSS style for pointer-events protection
      audio.style.pointerEvents = 'none';
      
      // Add event listeners with orphan audio prevention
      const onEnded = () => {
        console.log('🎵 Native audio ended event');
        handleEnded();
      };
      
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('contextmenu', handleContextMenu);
      
      // Store cleanup function for this specific audio instance
      audio.cleanup = () => {
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', handleError);  
        audio.removeEventListener('contextmenu', handleContextMenu);
      };

      audioRef.current = audio;
      setCurrentTrack(track);
      setCurrentTrackId(track.id);
      
      // Reset and start timing for new track
      totalPlayTimeRef.current = 0;
      startTimeRef.current = Date.now();

      // Initialize media session with handlers
      initializeSession({
        onPlay: async () => {
          if (audioRef.current && !isPlaying) {
            try {
              await audioRef.current.play();
              startTimeRef.current = Date.now(); // Start timing
              setIsPlaying(true);
              setPlaybackState('playing');
            } catch (error) {
              console.error('Error resuming audio via media session:', error);
            }
          }
        },
        onPause: () => {
          if (audioRef.current && isPlaying) {
            // Update total play time when pausing via media session
            if (startTimeRef.current) {
              totalPlayTimeRef.current += Date.now() - startTimeRef.current;
              startTimeRef.current = null;
            }
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
      // Update total play time when pausing
      if (startTimeRef.current) {
        totalPlayTimeRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
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
        startTimeRef.current = Date.now(); // Start timing when resuming
        setIsPlaying(true);
        setPlaybackState('playing');
      } catch (error) {
        console.error('Error resuming audio:', error);
      }
    }
  }, [isPlaying, setPlaybackState]);

  // Handle tab switching notification for orphan audio
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentTrackId && isPlaying) {
        // Show notification to keep focus on audio
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Audio masih berjalan! 🎵', {
            body: 'Kembali ke aplikasi untuk melanjutkan mendengarkan',
            icon: '/icon-192x192.png'
          });
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentTrackId && isPlaying) {
        e.preventDefault();
        e.returnValue = 'Audio masih berjalan. Yakin ingin keluar?';
        return 'Audio masih berjalan. Yakin ingin keluar?';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupAudio();
    };
  }, [cleanupAudio, currentTrackId, isPlaying]);

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