import { useCallback } from 'react';

interface MediaMetadata {
  title: string;
  artist: string;
  album: string;
  artwork: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

interface PlaybackState {
  duration: number;
  playbackRate: number;
  position: number;
}

interface MediaSessionHandlers {
  onPlay?: () => void;
  onPause?: () => void;
}

export function useAudioSession() {
  const initializeSession = useCallback((handlers?: MediaSessionHandlers) => {
    if ('mediaSession' in navigator) {
      // Connect action handlers to actual audio controls
      navigator.mediaSession.setActionHandler('play', handlers?.onPlay || null);
      navigator.mediaSession.setActionHandler('pause', handlers?.onPause || null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }

    // Request persistent audio context for better compatibility
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').catch(() => {
        // Silently fail if wake lock is not supported
      });
    }
  }, []);

  const updateMetadata = useCallback((metadata: MediaMetadata) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata(metadata);
    }
  }, []);

  const updatePlaybackState = useCallback((state: PlaybackState) => {
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      try {
        navigator.mediaSession.setPositionState({
          duration: state.duration,
          playbackRate: state.playbackRate,
          position: state.position,
        });
      } catch (error) {
        // Silently handle errors in position state updates
        console.debug('Position state update failed:', error);
      }
    }
  }, []);

  const setPlaybackState = useCallback((state: 'playing' | 'paused') => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }, []);

  return {
    initializeSession,
    updateMetadata,
    updatePlaybackState,
    setPlaybackState,
  };
}