import { Lock, Music, Crown, Zap } from 'lucide-react';
import { useProtectedAudio } from '@/contexts/AudioContext';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useState, useEffect } from 'react';

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
}

export function VerseAudioCard({ 
  verse, 
  onWarning, 
  currentPlayingVerse, 
  setCurrentPlayingVerse,
  currentVerseAudio,
  setCurrentVerseAudio
}: VerseAudioCardProps) {
  const { createProtectedAudio } = useProtectedAudio();
  const { awardXP } = useXPSystem();
  
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

    // Create new protected audio with your primitive approach
    try {
      const audio = createProtectedAudio(verse.audioPath);
      
      // Add event listeners
      audio.addEventListener('ended', () => {
        console.log('🎵 Audio ended for verse:', verse.title, 'ID:', verse.id);
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
        // Award XP based on verse type - Short verses get +1 XP, main verses get +10 XP
        const xpAmount = verse.id === 100 ? 1 : 10; // ID 100 is our reflection verse
        console.log('🏆 Awarding XP:', xpAmount, 'for verse:', verse.title);
        awardXP('verse_completion', xpAmount, `Completed ${verse.title}`);
      });

      audio.addEventListener('error', (error) => {
        console.error('Error playing audio:', error);
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
      });

      // Play audio
      await audio.play();
      setCurrentPlayingVerse(verse.id);
      setCurrentVerseAudio(audio);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurrentPlayingVerse(null);
      setCurrentVerseAudio(null);
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
    </div>
  );
}