import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Crown, Lock, Volume2 } from 'lucide-react';
import { usePro } from '@/hooks/usePro';

interface AudioPreviewProps {
  audioPath: string;
  title: string;
  onUpgradeClick: () => void;
  isUnlocked?: boolean;
  previewDuration?: number; // in seconds, default 30
}

export function AudioPreview({
  audioPath,
  title,
  onUpgradeClick,
  isUnlocked = false,
  previewDuration = 30
}: AudioPreviewProps) {
  const { proStatus } = usePro();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const canPlayFull = proStatus.isPro || isUnlocked;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      setCurrentTime(current);

      // Stop at preview limit for non-Pro users
      if (!canPlayFull && current >= previewDuration) {
        audio.pause();
        setIsPlaying(false);
        setHasReachedLimit(true);
        setShowUpgradePrompt(true);
      }
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [canPlayFull, previewDuration]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Reset if reached limit and user tries to play again
      if (hasReachedLimit && !canPlayFull) {
        audio.currentTime = 0;
        setCurrentTime(0);
        setHasReachedLimit(false);
      }

      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (duration === 0) return 0;
    const maxTime = canPlayFull ? duration : Math.min(previewDuration, duration);
    return (currentTime / maxTime) * 100;
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioPath} preload="metadata" />

      {/* Audio Player */}
      <Card className={`p-4 ${canPlayFull ? 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/30' : 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/30'}`}>
        <div className="space-y-4">
          {/* Title and Pro Indicator */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {!canPlayFull && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">
                  Preview 30s
                </span>
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
            )}
            {canPlayFull && (
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                  Pro Akses Penuh
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${canPlayFull ? 'bg-purple-500' : 'bg-amber-500'}`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>
                {canPlayFull
                  ? formatTime(duration)
                  : `${formatTime(Math.min(previewDuration, duration))} (Preview)`
                }
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={togglePlayPause}
              variant="outline"
              size="icon"
              className={`w-12 h-12 ${canPlayFull ? 'border-purple-500/50 hover:bg-purple-500/20' : 'border-amber-500/50 hover:bg-amber-500/20'}`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            <Volume2 className={`w-5 h-5 ${canPlayFull ? 'text-purple-400' : 'text-amber-400'}`} />
          </div>
        </div>
      </Card>

      {/* Upgrade Prompt for Non-Pro Users */}
      {showUpgradePrompt && !canPlayFull && (
        <Card className="p-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 animate-in slide-in-from-bottom duration-300">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-300">
                Preview Selesai
              </h3>
            </div>

            <p className="text-orange-200">
              Ingin mendengar audio lengkap? Upgrade ke Pro untuk akses penuh ke semua konten premium!
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm text-orange-300">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  <span>Akses Unlimited</span>
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  <span>Kualitas HD</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowUpgradePrompt(false)}
                variant="outline"
                className="flex-1 border-orange-500/50 text-orange-300 hover:bg-orange-800/30"
              >
                Nanti Saja
              </Button>
              <Button
                onClick={onUpgradeClick}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Pro
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Pro Benefits Preview for Free Users */}
      {!canPlayFull && !showUpgradePrompt && (
        <Card className="p-4 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 border border-purple-500/20">
          <div className="text-center space-y-2">
            <p className="text-sm text-purple-300">
              <strong>Anggota Pro</strong> mendapat akses penuh + insight mendalam
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-purple-400">
              <span>• Audio lengkap tanpa batas</span>
              <span>• Kualitas HD premium</span>
              <span>• Analytics AI</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}