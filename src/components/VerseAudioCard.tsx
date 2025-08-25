import { useState, useEffect } from 'react';
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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { awardXP } = useXPSystem();
  const { initializeSession, updateMetadata, updatePlaybackState } = useAudioSession();

  // Handle audio creation and playback
  useEffect(() => {
    if (isPlaying && verse.audioPath && !audio) {
      const publicUrl = getAudioUrl(verse.audioPath);
      const newAudio = new Audio(publicUrl);
      newAudio.crossOrigin = 'anonymous';
      newAudio.setAttribute('controlsList', 'nodownload noremoteplayback');
      newAudio.setAttribute('preload', 'metadata');
      
      // Enable background audio continuation
      newAudio.setAttribute('data-background-audio', 'true');
      
      // Initialize audio session for background playback
      initializeSession();
      
      const handleContextMenu = (e: Event) => e.preventDefault();
      const handleLoadedData = () => {
        // Update media session metadata for background playback
        updateMetadata({
          title: verse.title,
          artist: "eL Vision Group",
          album: verse.subtitle || "Audio Therapy",
          artwork: [
            { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        });
      };
      const handleTimeUpdate = () => {
        updatePlaybackState({
          duration: newAudio.duration,
          playbackRate: newAudio.playbackRate,
          position: newAudio.currentTime
        });
      };
      const handleEnded = () => {
        onStop();
        awardXP('audio_completion', 10, `Completed ${verse.title}`, {
          verseId: verse.id,
          verseTitle: verse.title
        });
      };
      const handleError = (e: Event) => {
        console.error('Audio playback error:', e);
        onStop();
      };

      newAudio.addEventListener('contextmenu', handleContextMenu);
      newAudio.addEventListener('loadeddata', handleLoadedData);
      newAudio.addEventListener('timeupdate', handleTimeUpdate);
      newAudio.addEventListener('ended', handleEnded);
      newAudio.addEventListener('error', handleError);

      setAudio(newAudio);
      
      newAudio.play().catch(error => {
        console.error('Error playing audio:', error);
        onStop();
      });
    }

    // Cleanup when not playing
    if (!isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.load();
      setAudio(null);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('contextmenu', () => {});
        audio.removeEventListener('loadeddata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', () => {});
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load();
      }
    };
  }, [isPlaying, verse.audioPath, audio, onStop, awardXP, verse.id, verse.title, initializeSession, updateMetadata, updatePlaybackState]);

  // Separate useEffect for window focus handling - moved out of nested useEffect
  useEffect(() => {
    const handleFocus = () => {
      if (audio && isPlaying) {
        // Just sync UI with actual audio state, don't change audio
        const actuallyPlaying = !audio.paused && !audio.ended;
        if (!actuallyPlaying) {
          onStop();
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [audio, isPlaying, onStop]);

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