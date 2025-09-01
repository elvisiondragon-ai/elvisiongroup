import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Pause, Play, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigationBlock } from "@/hooks/useNavigationBlock";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MeditativeStateProps {
  verse: {
    id: number;
    title: string;
    subtitle?: string;
    artwork?: string;
  };
  audio: HTMLAudioElement;
  onExit: () => void;
  onResetExit: () => void;
}

export function MeditativeState({ verse, audio, onExit, onResetExit }: MeditativeStateProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Block navigation when in meditative state
  useNavigationBlock({
    isBlocked: true,
    onNavigationAttempt: () => setShowExitDialog(true)
  });

  useEffect(() => {
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      onExit();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [audio, onExit]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleExitRequest = () => {
    setShowExitDialog(true);
  };

  const handleExitWithReset = () => {
    audio.pause();
    setShowExitDialog(false);
    onResetExit();
  };

  const handleExitWithoutReset = () => {
    setShowExitDialog(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Sacred Dark Background with Subtle Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Content - Centered and 50% width */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Sacred Header */}
        <div className="flex items-center justify-between w-full max-w-lg mb-12">
          <div className="flex items-center gap-3 text-primary mx-auto">
            <div className="w-3 h-3 bg-primary/80 rounded-full animate-pulse"></div>
            <span className="text-lg font-bold font-serif tracking-wider text-primary/90">
              ✨ Meditative State Activated ✨
            </span>
            <div className="w-3 h-3 bg-primary/80 rounded-full animate-pulse"></div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExitRequest}
            className="text-primary/60 hover:text-primary absolute top-0 right-0"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Sacred Audio Container - 50% of screen */}
        <Card className="w-full max-w-lg p-10 bg-black/40 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/30 rounded-3xl">
          <div className="text-center space-y-8">
            {/* Centered Sacred Artwork */}
            <div className="relative mx-auto flex justify-center">
              <div className="absolute inset-0 w-56 h-56 rounded-full bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 blur-2xl animate-pulse"></div>
              <div className="relative w-52 h-52 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary/40 to-accent/40 shadow-2xl shadow-primary/50">
                {verse.artwork ? (
                  <img
                    src={verse.artwork}
                    alt={`${verse.title} artwork`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Volume2 className="w-20 h-20 text-primary/60" />
                  </div>
                )}
              </div>
            </div>

            {/* Sacred Title */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wide">
                {verse.title}
              </h2>
              {verse.subtitle && (
                <p className="text-base text-primary/70 font-serif italic">{verse.subtitle}</p>
              )}
            </div>

            {/* Sacred Progress */}
            <div className="space-y-3">
              <div className="w-full bg-black/30 rounded-full h-3 border border-primary/20">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 shadow-lg shadow-primary/40"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-primary/60 font-serif">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Sacred Play/Pause Button */}
            <Button
              onClick={handlePlayPause}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent shadow-2xl shadow-primary/50 transition-all duration-500 border-2 border-primary/30"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white drop-shadow-lg" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1 drop-shadow-lg" />
              )}
            </Button>
          </div>
        </Card>

        {/* Sacred Lock Message */}
        <div className="mt-10 text-center">
          <p className="text-lg text-primary/60 font-serif italic tracking-wide">
            Sacred Focus Mode • Navigation Locked
          </p>
        </div>
      </div>

      {/* Exit Warning Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-background border border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Peringatan</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              EXP sesi ini akan di reset jika keluar tab. Fokuslah sejenak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction 
              onClick={handleExitWithReset}
              className="bg-destructive hover:bg-destructive/90 w-full"
            >
              Reset EXP dan Keluar
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={handleExitWithoutReset}
              className="border-primary/20 w-full"
            >
              Jangan Reset EXP
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}