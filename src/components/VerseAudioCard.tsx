import { Lock, Music, Crown, Zap, SkipBack, SkipForward } from 'lucide-react';
import { useProtectedAudio } from '@/contexts/AudioContext';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

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
  onWarning?: () => Promise<boolean>;
  currentPlayingVerse: number | null;
  setCurrentPlayingVerse: (id: number | null) => void;
  currentVerseAudio: HTMLAudioElement | null;
  setCurrentVerseAudio: (audio: HTMLAudioElement | null) => void;
  onShowSacredNotification?: (verseName: string) => void;
}

export function VerseAudioCard({ 
  verse, 
  onWarning, 
  currentPlayingVerse, 
  setCurrentPlayingVerse,
  currentVerseAudio,
  setCurrentVerseAudio,
  onShowSacredNotification
}: VerseAudioCardProps) {
  const { createProtectedAudio } = useProtectedAudio();
  const { awardXP } = useXPSystem();
  
  // Audio state
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showDownloadNotif, setShowDownloadNotif] = useState(false);
  
  // Check if this verse is currently playing
  const isPlaying = currentPlayingVerse === verse.id;

  // Check if audio is actually playing when component mounts/updates
  useEffect(() => {
    if (isPlaying && currentVerseAudio) {
      if (currentVerseAudio.paused || currentVerseAudio.ended) {
        // Audio stopped but state says it's playing - sync the state
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
      }
    }
  }, [isPlaying, currentVerseAudio, setCurrentPlayingVerse, setCurrentVerseAudio]);

  const handlePlayClick = async () => {
    if (!verse.unlocked || !verse.audioPath) return;
    
    // If this verse is currently playing, stop it
    if (isPlaying && currentVerseAudio) {
      currentVerseAudio.pause();
      setCurrentPlayingVerse(null);
      setCurrentVerseAudio(null);
      return;
    }

    // If another verse is playing, show focus warning
    if (currentPlayingVerse && currentPlayingVerse !== verse.id && onWarning) {
      const shouldContinue = await onWarning();
      if (!shouldContinue) {
        return; // User chose to stay with current verse
      }
    }

    // Stop any currently playing verse
    if (currentVerseAudio) {
      currentVerseAudio.pause();
      setCurrentVerseAudio(null);
    }

    // Check if first time download
    const cacheKey = `verse_${verse.id}_cached`;
    const isCached = localStorage.getItem(cacheKey);
    
    if (!isCached) {
      setShowDownloadNotif(true);
    }

    // Create new protected audio with caching
    try {
      const audio = await createProtectedAudio(verse.audioPath);
      
      // Mark as cached and hide notification
      localStorage.setItem(cacheKey, 'true');
      setShowDownloadNotif(false);
      
      // Add event listeners  
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener('ended', () => {
        console.log('🎵 Audio ended for verse:', verse.title, 'ID:', verse.id);
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
        setAudioDuration(null);
        setCurrentTime(0);
        // Award XP based on verse type - Short verses get +1 XP, main verses get +10 XP
        const xpAmount = verse.id === 100 ? 1 : 10; // ID 100 is our reflection verse
        console.log('🏆 Awarding XP:', xpAmount, 'for verse:', verse.title);
        awardXP('verse_completion', xpAmount, `Completed ${verse.title}`);
      });

      audio.addEventListener('error', (error) => {
        console.error('Error playing audio:', error);
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
        setAudioDuration(null);
        setCurrentTime(0);
      });

      // Play audio first
      await audio.play();
      setCurrentPlayingVerse(verse.id);
      setCurrentVerseAudio(audio);
      
      // Show sacred notification after 5 seconds delay
      if (onShowSacredNotification) {
        setTimeout(() => {
          onShowSacredNotification(verse.title);
        }, 5000);
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurrentPlayingVerse(null);
      setCurrentVerseAudio(null);
    }
  };

  const canPlay = verse.unlocked && verse.audioPath;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    if (currentVerseAudio && audioDuration) {
      const newTime = (value[0] / 100) * audioDuration;
      currentVerseAudio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progress = audioDuration ? (currentTime / audioDuration) * 100 : 0;

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
          
          {/* Audio Controls - Show when playing */}
          {isPlaying && audioDuration && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 bg-black/80 backdrop-blur-lg rounded-lg p-2 border border-primary/20">
              <Progress 
                value={progress} 
                className="h-1 cursor-pointer bg-white/10" 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = ((e.clientX - rect.left) / rect.width) * 100;
                  handleSeek([Math.max(0, Math.min(100, percent))]);
                }}
              />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
            </div>
          )}

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
                  {(
                    <div className="relative">
                      <Lock className="w-6 h-6 text-muted-foreground mx-auto" />
                    </div>
                  )}
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
              <div className="text-sm font-bold mt-3 text-center text-red-400 flex items-center justify-center gap-1">
                {verse.requiredLevel === 2 ? (
                  <>
                    Lv 2 or Upgrade Pro
                  </>
                ) : verse.requiredLevel === 3 ? (
                  <>
                    Lv 3 or Upgrade Pro
                  </>
                ) : verse.requiredLevel === 6 ? (
                  <div className="font-[Luxurious_Script] text-sm">
                    Lv 5 or Upgrade Pro
                  </div>
                ) : verse.requiredLevel === 7 ? (
                  <>
                    Lv 6 & Pro
                  </>
                ) : verse.requiredLevel === 8 ? (
                  <>
                    Lv 7 & Pro
                  </>
                ) : verse.requiredLevel === 9 ? (
                  <>
                    Lv 8 & Pro
                  </>
                ) : verse.requiredLevel === 10 ? (
                  <>
                    Lv 9 & Pro
                  </>
                ) : verse.requiredLevel === 11 ? (
                  <>
                    Lv 10 & Pro
                  </>
                ) : "Locked"}
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
      
      {/* Simple Download Notification */}
      {showDownloadNotif && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-primary/90 text-white p-3 rounded-lg shadow-lg animate-pulse">
          <p className="text-sm text-center">Audio sedang di download agar anda lebih mudah mendengarkan nanti, tunggu sebentar...</p>
        </div>
      )}
    </div>
  );
}