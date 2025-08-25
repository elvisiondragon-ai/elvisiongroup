import { useEffect } from 'react';

interface MediaSessionConfig {
  title: string;
  artist?: string;
  album?: string;
  artwork?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

export const useAudioSession = () => {
  useEffect(() => {
    // Initialize audio session on mobile
    const initializeAudioSession = async () => {
      try {
        // For Capacitor apps, we'll handle this through native configuration
        console.log('Audio session initialized for background playback');
      } catch (error) {
        console.log('Audio session setup (native features not available in web):', error);
      }
    };

    initializeAudioSession();
  }, []);

  const setupMediaSession = (config: MediaSessionConfig) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: config.title,
        artist: config.artist || 'eL Vision Group',
        album: config.album || 'Spiritual Audio',
        artwork: config.artwork || [
          {
            src: '/lovable-uploads/fbd7b86c-d8ea-447e-87ad-d67254074e61.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      });
    }
  };

  const setMediaSessionHandlers = (handlers: {
    play?: () => void;
    pause?: () => void;
    seekbackward?: (details: MediaSessionActionDetails) => void;
    seekforward?: (details: MediaSessionActionDetails) => void;
    seekto?: (details: MediaSessionActionDetails) => void;
  }) => {
    if ('mediaSession' in navigator) {
      Object.entries(handlers).forEach(([action, handler]) => {
        try {
          navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler as MediaSessionActionHandler);
        } catch (error) {
          console.log(`Media session action "${action}" not supported:`, error);
        }
      });
    }
  };

  const updatePlaybackState = (state: 'playing' | 'paused' | 'none') => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  };

  const updatePositionState = (duration: number, playbackRate: number, position: number) => {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate,
          position
        });
      } catch (error) {
        console.log('Position state update failed:', error);
      }
    }
  };

  return {
    setupMediaSession,
    setMediaSessionHandlers,
    updatePlaybackState,
    updatePositionState
  };
};