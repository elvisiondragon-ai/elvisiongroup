import { Lock, Music, Crown, Zap, SkipBack, SkipForward, X, FileText } from 'lucide-react';
import { useProtectedAudio } from '@/contexts/AudioContext';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  onNavigate?: (tab: string) => void;
  onVerse4Usage?: () => Promise<boolean>;
}

export function VerseAudioCard({ 
  verse, 
  onWarning, 
  currentPlayingVerse, 
  setCurrentPlayingVerse,
  currentVerseAudio,
  setCurrentVerseAudio,
  onShowSacredNotification,
  onNavigate,
  onVerse4Usage
}: VerseAudioCardProps) {
  const { createProtectedAudio } = useProtectedAudio();
  const { awardXP } = useXPSystem();
  const { toast } = useToast();
  
  // Audio state
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showDownloadNotif, setShowDownloadNotif] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
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
    
    // If this verse is currently playing, stop it (pause - don't increment counter)
    if (isPlaying && currentVerseAudio) {
      currentVerseAudio.pause();
      setCurrentPlayingVerse(null);
      setCurrentVerseAudio(null);
      
      // Notify globally that audio stopped playing
      window.dispatchEvent(new CustomEvent('updateCurrentlyPlaying', { 
        detail: null 
      }));
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
      
      // Notify globally that audio stopped playing
      window.dispatchEvent(new CustomEvent('updateCurrentlyPlaying', { 
        detail: null 
      }));
    }

    // Increment verse 4 usage when play button is clicked (before audio starts)
    if (verse.id === 4 && onVerse4Usage) {
      const canPlay = await onVerse4Usage();
      if (!canPlay) {
        return; // User exceeded free limit and not pro
      }
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
      audio.addEventListener('ended', async () => {
        console.log('🎵 Audio ended for verse:', verse.title, 'ID:', verse.id);
        console.log('🔄 Starting verse completion process...');
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
        setAudioDuration(null);
        setCurrentTime(0);
        
        
        // Update total_verses counter FIRST in profiles
        const updateTotalVerses = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Get current count first, then increment
            const { data: profile } = await supabase
              .from('profiles')
              .select('total_verses')
              .eq('user_id', user.id)
              .single();
              
            const currentCount = profile?.total_verses || 0;
            const { error } = await supabase
              .from('profiles')
              .update({ 
                total_verses: currentCount + 1,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', user.id);
            if (error) console.error('Error updating total_verses:', error);
          }
        };
        await updateTotalVerses();

        // Award XP AFTER counter increment (XP can be blocked by daily limit)
        const xpAmount = 10; // All verses now give +10 XP
        console.log('🏆 Awarding XP:', xpAmount, 'for verse:', verse.title);
        awardXP('verse_completion', xpAmount, `Completed ${verse.title}`, {
          verse_title: verse.title,
          verse_id: verse.id
        });

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

      // Insert into verse_notif table for real-time notifications (on play button click)
      const insertVerseNotification = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Use auth display name, fallback to profiles table
          let displayName = 'Someone';
          
          // Try auth metadata first
          if (user.user_metadata?.display_name) {
            displayName = user.user_metadata.display_name;
          } else {
            // Fallback to profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', user.id)
              .single();
            displayName = profile?.display_name || 'Someone';
          }
          
          // Insert notification
          const { error } = await supabase
            .from('verse_notif')
            .insert({
              user_id: user.id,
              display_name: displayName,
              verse_title: verse.title,
              verse_id: verse.id
            });
          
          if (error) {
            console.error('❌ Error inserting verse notification:', error);
          } else {
            console.log('✅ Verse notification inserted on play:', verse.title);
          }
        }
      };
      await insertVerseNotification();
      
      
      // Show sacred notification after 3 seconds delay
      if (onShowSacredNotification) {
        setTimeout(() => {
          onShowSacredNotification(verse.title);
        }, 3000);
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
    <div className="relative group cursor-pointer" data-verse-title={verse.title}>
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
          
          {/* Most Wanted indicator for Verse 8 */}
          {verse.id === 8 && (
            <div className="absolute -top-1 -right-1 flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
                MOST WANTED
              </div>
            </div>
          )}

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
          
          {/* Most Wanted indicator for Verse 8 - also show when locked */}
          {verse.id === 8 && (
            <div className="absolute -top-1 -right-1 flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
                MOST WANTED
              </div>
            </div>
          )}
          
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
                ) : verse.requiredLevel === 4 ? (
                  <>
                    Lv 4 or Upgrade Pro
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
                    {verse.id === 8 ? (
                      <Button
                        onClick={() => onNavigate && onNavigate('payment')}
                        size="sm"
                        className="text-xs bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-medium px-3 py-1"
                      >
                        Upgrade Pro to Unlock
                      </Button>
                    ) : (
                      "Lv 8 & Pro"
                    )}
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
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary/90 text-white p-3 rounded-lg shadow-lg animate-pulse min-w-[280px] max-w-[90vw]">
          <p className="text-sm text-center">Audio sedang di download agar anda lebih mudah mendengarkan nanti, tunggu sebentar...</p>
        </div>
      )}

      {/* Terms Modal for Verse 8 */}
      {showTermsModal && verse.id === 8 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden border border-pink-500/30">
            <div className="flex items-center justify-between p-4 border-b border-pink-500/30">
              <h2 className="text-lg font-semibold text-pink-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Terms - Wajib Baca
              </h2>
              <Button 
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95"
                size="sm"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4 text-base leading-relaxed">
                <div className="bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-pink-300 mb-2 text-center">💕 Verse 8 - Love Magnet 💕</h3>
                  <p className="text-pink-200 text-center">
                    Ilmu yang sangat powerful untuk menarik cinta dan kasih sayang
                  </p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-foreground">
                    <strong className="text-yellow-400">Rate Keberhasilan:</strong> 95% dari 100 orang merasakan efek cepat, 
                    sedangkan 5% memakan waktu bertahun-tahun.
                  </p>
                  
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-orange-200 text-base">
                      ⚠️ <strong>Penting:</strong> Berdasarkan faktual di lapangan, ini adalah ilmu yang sangat powerful.
                    </p>
                  </div>
                  
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-200 text-base">
                      <strong>Pernyataan Tanggung Jawab:</strong>
                    </p>
                    <ul className="text-red-200 text-sm mt-2 space-y-1 pl-4">
                      <li>• Anda menyatakan tidak akan menyalahgunakan ilmu ini untuk merusak hubungan orang lain</li>
                      <li>• Anda menyatakan tidak akan memainkan perasaan orang lain</li>
                      <li>• eL Vision Group tidak bertanggung jawab atas perbuatan yang kami tidak setujui</li>
                      <li>• Gunakan dengan bijak dan penuh kasih sayang</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-200 text-base text-center">
                      ✨ Gunakan Love Magnet untuk menciptakan hubungan yang harmonis dan penuh cinta ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-pink-500/30">
              <Button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-medium"
                size="lg"
              >
                Setuju
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}