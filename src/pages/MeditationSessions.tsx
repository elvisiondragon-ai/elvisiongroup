import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowLeft, Play, Pause, Volume2, Users, Radio, Heart, Star, Sparkles, Headphones, Clock, Crown, Eye } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import faviconImage from "@/assets/favicon.png";

interface MeditationSessionsProps {
  onNavigate: (tab: string) => void;
}

export function MeditationSessions({ onNavigate }: MeditationSessionsProps) {
  const { t } = useTranslation();
  const { userProfile } = useUserProfile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [liveCount, setLiveCount] = useState(3876);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulate live audience count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
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

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
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

  return (
    <div className="min-h-screen bg-background pb-20">
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
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
                Sesi Meditasi
              </h1>
              <p className="text-sm text-muted-foreground">Weekly Live Sessions</p>
            </div>
          </div>
          <LanguageSwitcher />
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

              <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                Monday Live Session 736
              </h2>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Live Audience: <span className="text-primary font-semibold">{liveCount.toLocaleString()}</span></span>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                  <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-red-300 font-semibold">Active Listen</span>
                </div>
              </div>

              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Join our weekly guided meditation session with thousands of practitioners worldwide.
                Experience collective healing energy and spiritual alignment through the power of group consciousness.
              </p>
            </div>

            {/* Audio Player */}
            <div className="max-w-md mx-auto">
              <audio
                ref={audioRef}
                src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/live01.MP3"
                preload="metadata"
              />

              {/* Album Art */}
              <div className="relative mb-8">
                <div className="w-56 h-56 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-primary/40 relative group border-4 border-primary/20">
                  {/* Rotating background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 animate-spin" style={{ animationDuration: '20s' }}></div>

                  <img
                    src={faviconImage}
                    alt="Meditation Session"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                    style={{
                      filter: 'contrast(1.2) brightness(1.1)',
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)'
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20"></div>

                  {/* Session info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white text-center z-30">
                    <div className="text-xs opacity-90 font-medium">eL Vision Group</div>
                    <div className="font-bold text-sm">Live Meditation Session</div>
                    <div className="text-xs opacity-80 mt-1">Weekly Community Gathering</div>
                  </div>

                  {/* Floating play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-40">
                    <Button
                      size="icon"
                      onClick={togglePlayPause}
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50 shadow-2xl shadow-black/50 transition-all duration-300 hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="w-10 h-10 text-white" />
                      ) : (
                        <Play className="w-10 h-10 text-white ml-1" />
                      )}
                    </Button>
                  </div>

                  {/* Live indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1 z-30">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-xs font-semibold">LIVE</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span className="font-mono">{formatTime(currentTime)}</span>
                  <span className="text-primary font-semibold">Monday Live Session</span>
                  <span className="font-mono">{formatTime(duration)}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={handleSeek}
                    className="w-full h-3 bg-muted/50 rounded-lg appearance-none cursor-pointer slider backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPercentage}%, hsl(var(--muted)) ${progressPercentage}%, hsl(var(--muted)) 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-14 h-14 rounded-full hover:bg-primary/10 border border-primary/20 transition-all duration-300"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
                    }
                  }}
                >
                  <span className="text-sm font-semibold text-primary">-15s</span>
                </Button>

                <Button
                  size="icon"
                  onClick={togglePlayPause}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl shadow-primary/40 transform hover:scale-105 transition-all duration-300 border-2 border-white/10"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="w-14 h-14 rounded-full hover:bg-primary/10 border border-primary/20 transition-all duration-300"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
                    }
                  }}
                >
                  <span className="text-sm font-semibold text-primary">+15s</span>
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
          <h3 className="text-lg font-semibold font-orbitron mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
                  <div className="font-semibold text-primary">Monday Live Session 736</div>
                  <div className="text-sm text-muted-foreground">21.45 WIB • Live Now</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-full text-sm animate-pulse shadow-lg">
                LIVE NOW
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-muted/40">
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Next Session 737</div>
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
              <h3 className="font-semibold text-blue-300 font-orbitron">Meditation Guidelines</h3>
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

      <style jsx>{`
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