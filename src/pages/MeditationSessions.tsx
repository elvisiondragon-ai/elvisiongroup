import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ArrowLeft, Play, Pause, Volume2, Users, Radio, Heart, Star, Sparkles, Headphones, Clock, Crown, Eye, Loader2, Download } from "lucide-react";
// Removed slow UserProfileContext - now using fast auth
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAudio } from "@/contexts/AudioContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import faviconImage from "@/assets/favicon.png";

interface MeditationSessionsProps {
  onNavigate: (tab: string) => void;
}

export function MeditationSessions({ onNavigate }: MeditationSessionsProps) {
  const { t } = useTranslation();
  const { userId, user } = useAuth();
  const { createProtectedAudio, createStreamingAudio, isCached } = useProtectedAudio();
  const { toast } = useToast();

  // Log entry on component mount
  useEffect(() => {
    if (userId) {
      console.log('%c☯️ Entering Sesi Meditasi page:', 'color: green; font-weight: bold;', {
        user_id: userId, // AUTH ID
        email: user?.email || 'loading...' // AUTH email
      });
    }
  }, [userId, user?.email]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audienceCount, setAudienceCount] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const sessionData = {
    title: 'Meditasi Audio',
    description: 'Audio untuk meditasi dan relaksasi.',
    file_url: 'live02.MP3'
  };

  useEffect(() => {
    // Only clear old profile cache ONCE if it still exists
    const needsCacheClearing = !localStorage.getItem('meditation-migration-done');
    if (needsCacheClearing) {
      const oldCacheKeys = [
        'user-profile-cache',
        'user_profile_cache',
        'unified_pro_status_cache',
        'meditation-user-cache'
      ];
      oldCacheKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          console.log('🧹 One-time clearing old profile cache:', key);
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('meditation-migration-done', 'true');
      console.log('✅ Meditation cache migration completed - now using fast auth');
    }

    // No need to fetch user - AuthContext provides userId
  }, []);

  // Set audience counter to a fixed value
  useEffect(() => {
    setAudienceCount(4528);
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);



  useEffect(() => {
    const checkCacheStatus = async () => {
      if (sessionData?.file_url) {
        const cached = await isCached(sessionData.file_url);
        setIsDownloaded(cached);
      }
    };
    checkCacheStatus();
  }, [sessionData?.file_url, isCached]);

  const handleDownloadClick = async () => {
    if (!sessionData?.file_url || isDownloading || isDownloaded) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    toast({
      title: "Sedang Download Audio... 📥",
      description: "Setelah download Audio Tidak akan memakai kuota internet",
      duration: 5000,
    });
    
    try {
      await createProtectedAudio(sessionData.file_url, undefined, setDownloadProgress);
      setIsDownloaded(true);
      
      toast({
        title: "Download Selesai! 🎉",
        duration: 3000,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Gagal",
        description: "Coba lagi nanti",
        duration: 3000,
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Silakan login terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    if (!sessionData?.file_url) {
      setAudioError('Session data not available');
      return;
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      setAudioError(null);

      let audio: HTMLAudioElement;
      const cached = await isCached(sessionData.file_url);
      
      if (cached) {
        console.log('🎵 Using cached audio for instant play');
        audio = await createProtectedAudio(sessionData.file_url);
      } else {
        console.log('🎵 Using streaming audio for instant play');
        audio = createStreamingAudio(sessionData.file_url);
      }

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoadingAudio(false);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audio.addEventListener('error', () => {
        setAudioError('Failed to play audio');
        setIsLoadingAudio(false);
      });

      audio.volume = volume;
      await audio.play();

      audioRef.current = audio;
      setIsPlaying(true);

    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioError('Failed to load or play audio');
      setIsLoadingAudio(false);
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    // Apply a class to the body to hide the scrollbar when this component is mounted
    document.body.classList.add('no-scrollbar');
    return () => {
      document.body.classList.remove('no-scrollbar');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("home")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
                Sesi Meditasi
              </h1>
              <p className="text-sm text-muted-foreground">Weekly Live Sessions</p>
            </div>
          </div>

        </div>
      </div>

      {/* Hero Card - Monday Live Session */}
      <div className="px-6 mb-8">
        <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-2xl shadow-primary/20">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-accent animate-pulse"></div>
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-primary/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border border-accent/40 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 p-8">
            {/* Session Info */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 animate-pulse shadow-lg shadow-red-500/30">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full animate-pulse">
                  <span className="text-red-400 text-sm font-semibold">● LIVE</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold font-exo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                {sessionData?.title || 'Monday Live Session 737'}
              </h2>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Total Audience: <span className="text-primary font-semibold">{audienceCount.toLocaleString()}</span></span>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                  <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-red-300 font-semibold">Active Listen</span>
                </div>
              </div>

              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                {sessionData?.description || 'Join our weekly guided meditation session with thousands of practitioners worldwide. Experience collective healing energy and spiritual alignment through the power of group consciousness.'}
              </p>
            </div>

            {/* Audio Player */}
            <div className="max-w-md mx-auto">
              {/* Audio element is created programmatically via protected audio system */}

              {/* Album Art Removed */}



              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-2 mb-8 flex-col">
                {sessionData?.file_url && !isDownloaded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadClick();
                    }}
                    disabled={isDownloading}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl transform transition-all duration-300 ${
                      isDownloading 
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 hover:scale-110 active:scale-95 hover:shadow-2xl hover:shadow-gray-500/50'
                    }`}
                    title={isDownloading ? 'Mendownload...' : 'Download untuk offline'}
                  >
                    {isDownloading ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            className="text-gray-400"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth="4"
                          />
                          <path
                            className="text-white"
                            strokeDasharray={`${downloadProgress}, 100`}
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-white text-xs font-bold">{downloadProgress}%</span>
                      </div>
                    ) : (
                      <Download className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
                <Button
                  size="icon"
                  onClick={togglePlayPause}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl shadow-primary/40 transform hover:scale-105 transition-all duration-300 border-2 border-white/10"
                >
                  {isLoadingAudio ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-10 h-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" />
                  )}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Volume2 className="w-5 h-5 text-primary" />
                <div className="relative flex-1 max-w-32">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%, hsl(var(--muted)) 100%)`
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-mono w-10">{Math.round(volume * 100)}%</span>
              </div>



              {/* Error Display */}
              {audioError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <p className="text-red-400 text-sm">{audioError}</p>
                </div>
              )}

              {/* Loading Display Removed */}
            </div>

            {/* Session Benefits */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse" />
                <div className="text-sm font-semibold text-foreground">Inner Peace</div>
                <div className="text-xs text-muted-foreground mt-1">Deep Spiritual Alignment</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-500/5 border border-red-500/20 backdrop-blur-sm">
                <Heart className="w-8 h-8 mx-auto mb-3 text-red-400 animate-pulse" />
                <div className="text-sm font-semibold text-foreground">Healing Energy</div>
                <div className="text-xs text-muted-foreground mt-1">Collective Consciousness</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <div className="px-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-primary/20 shadow-lg">
          <h3 className="text-lg font-semibold font-exo mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Weekly Schedule
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-ping"></div>
                </div>
                <div>
                  <div className="font-semibold text-primary">{sessionData?.title || 'Monday Live Session 737'}</div>
                  <div className="text-sm text-muted-foreground">21.45 WIB • Live Now</div>
                </div>
              </div>
              <div className="text-muted-foreground bg-muted/50 px-3 py-1 rounded-full text-sm">
                Live
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-muted/40">
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Next Session 738</div>
                  <div className="text-sm text-muted-foreground">Monday, Next Week • 21.45 WIB</div>
                </div>
              </div>
              <div className="text-muted-foreground bg-muted/50 px-3 py-1 rounded-full text-sm">
                Scheduled
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <div className="px-6">
        <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 shadow-lg">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Headphones className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold text-blue-300 font-exo">Meditation Guidelines</h3>
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                Find a quiet, comfortable place to sit or lie down
              </p>
              <p className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-blue-400" />
                Use headphones for the best immersive experience
              </p>
              <p className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Close your eyes and focus on the guided voice
              </p>
              <p className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                Allow yourself to fully relax and surrender
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-1/6 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
        <div className="absolute top-2/6 right-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-4/6 right-1/4 w-2 h-2 bg-accent/30 rounded-full animate-pulse delay-1500"></div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)));
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)));
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
