import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Lock, Music, Crown, Zap, Star } from 'lucide-react';
import { getAudioUrl } from '@/utils/audioUtils';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useAudioSession } from '@/hooks/useAudioSession';

interface Verse {
  id: number;
  title: string;
  subtitle?: string;
  unlocked: boolean;
  requiredLevel: number;
  artwork?: string;
  audioPath: string | null;
  language: string;
}

interface VerseAudioCardProps {
  verse: Verse;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export function VerseAudioCard({ verse, isPlaying, onPlay, onStop }: VerseAudioCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { awardXP } = useXPSystem();
  const { initializeSession, updateMetadata, setPlaybackState } = useAudioSession();

  // Stable callback functions to prevent useEffect re-runs
  const handleEnded = useCallback(() => {
    onStop();
    awardXP('audio_completion', 10, `Completed ${verse.title}`, {
      verseId: verse.id,
      verseTitle: verse.title
    });
  }, [onStop, awardXP, verse.title, verse.id]);

  const handleError = useCallback((e: Event) => {
    console.error('Audio playback error:', e);
    onStop();
  }, [onStop]);

  const handleContextMenu = useCallback((e: Event) => e.preventDefault(), []);

  // Create audio once and keep it stable
  useEffect(() => {
    if (!verse.audioPath) return;

    const publicUrl = getAudioUrl(verse.audioPath);
    const audio = new Audio(publicUrl);
    
    // Configure audio for background playback
    audio.crossOrigin = 'anonymous';
    audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
    audio.setAttribute('disablePictureInPicture', 'true');
    audio.preload = 'metadata';
    
    // Add event listeners
    audio.addEventListener('contextmenu', handleContextMenu);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Initialize media session
    initializeSession();
    updateMetadata({
      title: verse.title,
      artist: "eL Vision Group",
      album: verse.subtitle || "Spiritual Audio",
      artwork: verse.artwork ? [
        { src: verse.artwork, sizes: '512x512', type: 'image/jpeg' }
      ] : [
        { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    });

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('contextmenu', handleContextMenu);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, [verse.audioPath, verse.title, verse.subtitle, verse.artwork, verse.id, handleContextMenu, handleEnded, handleError, initializeSession, updateMetadata]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().then(() => {
        setPlaybackState('playing');
      }).catch(error => {
        console.error('Error playing audio:', error);
        onStop();
      });
    } else {
      audio.pause();
      setPlaybackState('paused');
    }
  }, [isPlaying, setPlaybackState, onStop]);

  const handlePlayClick = () => {
    if (!verse.unlocked) return;
    
    if (isPlaying) {
      onStop();
    } else {
      onPlay();
    }
  };

  const canPlay = verse.unlocked && verse.audioPath;

  return (
    <div className="relative group cursor-pointer">
      {verse.unlocked && verse.artwork ? (
        <div>
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-xl animate-pulse"></div>
          
          {/* Main artwork container */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary/60 to-accent/60 shadow-2xl shadow-primary/40">
            <img
              src={verse.artwork}
              alt={`${verse.title} cosmic artwork`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/20"></div>
          </div>
          
          {/* Play Button Overlay */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center transition-all duration-500 cursor-pointer"
            onClick={handlePlayClick}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
              {!canPlay ? (
                <Lock className="w-6 h-6 text-white/60" />
              ) : isPlaying ? (
                // Pause icon
                <div className="flex gap-1 items-center justify-center">
                  <div className="w-1.5 h-5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-5 bg-white rounded-sm"></div>
                </div>
              ) : (
                // Play icon
                <div className="relative flex items-center justify-center">
                  <div 
                    className="w-0 h-0 ml-1"
                    style={{
                      borderLeft: '14px solid white',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Locked or No Audio Container */}
          <div className={`w-36 h-36 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-500 ${
            !verse.unlocked
              ? verse.requiredLevel === 10
                ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-400/40 shadow-lg shadow-purple-500/20"
                : "bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-400/40 shadow-lg shadow-rose-500/20"
              : "bg-gradient-to-br from-muted/20 to-background border-muted-foreground/40"
          }`}>
            <div className="text-center space-y-3">
              {!verse.unlocked ? (
                <>
                  {verse.requiredLevel === 10 ? (
                    <Zap className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
                  ) : (
                    <Crown className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
                  )}
                  <div className="relative">
                    <Lock className="w-6 h-6 text-muted-foreground mx-auto" />
                  </div>
                </>
              ) : (
                <>
                  <Music className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div className="text-xs text-muted-foreground font-medium">
                    Coming Soon
                  </div>
                </>
              )}
            </div>
          </div>
          
          {!verse.unlocked && (
            <>
              <div className={`text-xs font-bold mt-3 ${
                verse.requiredLevel === 10 ? "text-purple-400" : "text-rose-400"
              }`}>
                Locked
              </div>
              
              {/* Animated glow ring */}
              <div className={`absolute inset-0 rounded-full animate-pulse ${
                verse.requiredLevel === 10
                  ? "bg-gradient-to-r from-purple-500/10 to-violet-500/10"
                  : "bg-gradient-to-r from-rose-500/10 to-pink-500/10"
              } blur-xl`}></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}