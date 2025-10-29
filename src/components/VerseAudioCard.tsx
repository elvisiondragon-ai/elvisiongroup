import { Lock, Music, Crown, Zap, Download, Check, X, FileText } from 'lucide-react';
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
  const { createProtectedAudio, createStreamingAudio, isCached } = useProtectedAudio();
  const { awardXP } = useXPSystem();
  const { toast } = useToast();
  
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const isPlaying = currentPlayingVerse === verse.id;

  useEffect(() => {
    const checkCacheStatus = async () => {
      if (verse.audioPath) {
        const cached = await isCached(verse.audioPath);
        setIsDownloaded(cached);
      }
    };
    checkCacheStatus();
  }, [verse.audioPath, isCached]);

  useEffect(() => {
    if (isPlaying && currentVerseAudio) {
      if (currentVerseAudio.paused || currentVerseAudio.ended) {
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
      }
    }
  }, [isPlaying, currentVerseAudio, setCurrentPlayingVerse, setCurrentVerseAudio]);

  const handlePlayClick = async () => {
    if (!verse.unlocked || !verse.audioPath) return;

    if (isPlaying && currentVerseAudio) {
      currentVerseAudio.pause();
      setCurrentPlayingVerse(null);
      setCurrentVerseAudio(null);
      (window as any).isAudioPlaying = false;
      window.dispatchEvent(new CustomEvent('updateCurrentlyPlaying', { detail: null }));
      return;
    }

    if (currentPlayingVerse && currentPlayingVerse !== verse.id && onWarning) {
      const shouldContinue = await onWarning();
      if (!shouldContinue) return;
    }

    if (currentVerseAudio) {
      currentVerseAudio.pause();
      setCurrentVerseAudio(null);
      (window as any).isAudioPlaying = false;
      window.dispatchEvent(new CustomEvent('updateCurrentlyPlaying', { detail: null }));
    }

    if (verse.id === 4 && onVerse4Usage) {
      const canPlay = await onVerse4Usage();
      if (!canPlay) return;
    }

    try {
      const cached = await isCached(verse.audioPath);
      let audio: HTMLAudioElement;

      if (cached) {
        console.log('🎵 Using cached audio for instant play');
        audio = await createProtectedAudio(verse.audioPath);
      } else {
        console.log('🎵 Using streaming audio for instant play');
        audio = createStreamingAudio(verse.audioPath);
      }
      
      audio.addEventListener('loadedmetadata', () => setAudioDuration(audio.duration));
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));

      audio.addEventListener('ended', async () => {
        console.log('🎵 Audio ended for verse:', verse.title, 'ID:', verse.id);
        (window as any).isAudioPlaying = false;
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
        setAudioDuration(null);
        setCurrentTime(0);
        
        const xpAmount = 10;
        awardXP('verse_completion', xpAmount, `Completed ${verse.title}`, { verse_title: verse.title, verse_id: verse.id });
      });

      audio.addEventListener('error', (error) => {
        console.error('Error playing audio:', error);
        (window as any).isAudioPlaying = false;
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
        setAudioDuration(null);
        setCurrentTime(0);
      });

      await audio.play();
      (window as any).isAudioPlaying = true;
      setCurrentPlayingVerse(verse.id);
      setCurrentVerseAudio(audio);

      const insertVerseNotification = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          let displayName = user.user_metadata?.display_name || 'Someone';
          const { error } = await supabase.from('verse_notif').insert({ user_id: user.id, display_name: displayName, verse_title: verse.title, verse_id: verse.id });
          if (error) console.error('❌ Error inserting verse notification:', error);
        }
      };
      await insertVerseNotification();
      
      if (onShowSacredNotification) {
        setTimeout(() => onShowSacredNotification(verse.title), 3000);
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      (window as any).isAudioPlaying = false;
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

  const handleDownloadClick = async () => {
    if (!verse.unlocked || !verse.audioPath || isDownloading || isDownloaded) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    toast({ title: "Sedang Download Audio... 📥", description: "Setelah download Audio Tidak akan memakai kuota internet", duration: 5000, className: "bg-blue-100 border-blue-400 text-blue-800" });
    
    try {
      await createProtectedAudio(verse.audioPath, undefined, setDownloadProgress);
      setIsDownloaded(true);
      toast({ title: "Download Selesai! 🎉", duration: 3000, className: "bg-green-100 border-green-400 text-green-800" });
    } catch (error) {
      console.error('Download failed:', error);
      toast({ title: "Download Gagal", description: "Coba lagi nanti", duration: 3000, className: "bg-red-100 border-red-400 text-red-800" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative group cursor-pointer" data-verse-title={verse.title}>
      {verse.unlocked && verse.artwork ? (
        <div>
          <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-xl animate-pulse"></div>
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary/60 to-accent/60 shadow-2xl shadow-primary/40">
            <img src={verse.artwork} alt={`${verse.title} cosmic artwork`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/20"></div>
          </div>
          
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center transition-all duration-500 cursor-pointer" onClick={handlePlayClick}>
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
              {!canPlay ? <Lock className="w-6 h-6 text-white/60" /> : isPlaying ? (
                <div className="flex gap-1 items-center justify-center"><div className="w-1.5 h-5 bg-white rounded-sm"></div><div className="w-1.5 h-5 bg-white rounded-sm"></div></div>
              ) : (
                <div className="relative flex items-center justify-center"><div className="w-0 h-0 ml-1" style={{ borderLeft: '14px solid white', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} /></div>
              )}
            </div>
          </div>
          
          {canPlay && !isDownloaded && (
            <div className="absolute -top-6 -right-[14px] flex items-center gap-2">
              <div className="text-[10px] text-white/90 font-medium bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">Download Verses</div>
              <button onClick={(e) => { e.stopPropagation(); handleDownloadClick(); }} disabled={isDownloading} className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl transform transition-all duration-300 ${isDownloading ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 hover:scale-110 active:scale-95 hover:shadow-2xl hover:shadow-gray-500/50'}`} title={isDownloading ? 'Mendownload...' : 'Download untuk offline'}>
                {isDownloading ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-gray-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" /><path className="text-white" strokeDasharray={`${downloadProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" strokeLinecap="round" /></svg>
                    <span className="absolute text-white text-xs font-bold">{downloadProgress}%</span>
                  </div>
                ) : (
                  <Download className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          )}
          


          {isPlaying && audioDuration && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 bg-black/80 backdrop-blur-lg rounded-lg p-2 border border-primary/20">
              <Progress value={progress} className="h-1 cursor-pointer bg-white/10" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const percent = ((e.clientX - rect.left) / rect.width) * 100; handleSeek([Math.max(0, Math.min(100, percent))]); }} />
              <div className="flex justify-between text-xs text-white/60 mt-1"><span>{formatTime(currentTime)}</span><span>{formatTime(audioDuration)}</span></div>
            </div>
          )}

        </div>
      ) : (
        <div className="relative"> 
          <div className={`w-36 h-36 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-500 ${!verse.unlocked ? verse.requiredLevel === 10 ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-400/40 shadow-lg shadow-purple-500/20" : "bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-400/40 shadow-lg shadow-rose-500/20" : "bg-gradient-to-br from-muted/20 to-background border-muted-foreground/40"}`}>
            <div className="text-center space-y-3">
              {!verse.unlocked ? (
                <>{verse.requiredLevel === 10 ? <Zap className="w-12 h-12 text-purple-400 mx-auto animate-pulse" /> : <Crown className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />}<div className="relative"><Lock className="w-6 h-6 text-muted-foreground mx-auto" /></div></>
              ) : (
                <><Music className="w-12 h-12 text-muted-foreground mx-auto" /><div className="text-xs text-muted-foreground font-medium">Coming Soon</div></>
              )}
            </div>
          </div>
          
          {!verse.unlocked && (
            <>
              <div className="text-sm font-bold mt-3 text-center text-red-400 flex items-center justify-center gap-1">{/* Lock level logic */}</div>
              <div className={`absolute inset-0 rounded-full animate-pulse ${verse.requiredLevel === 10 ? "bg-gradient-to-r from-purple-500/10 to-violet-500/10" : "bg-gradient-to-r from-rose-500/10 to-pink-500/10"} blur-xl`}></div>
            </>
          )}
        </div>
      )}
      
      {showTermsModal && verse.id === 8 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">{/* Terms Modal Content */}</div>
      )}
    </div>
  );
}