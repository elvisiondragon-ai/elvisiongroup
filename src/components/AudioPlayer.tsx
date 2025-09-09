import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioSession } from "@/hooks/useAudioSession";
import { useProtectedAudio } from "@/contexts/AudioContext";

interface AudioPlayerProps {
  title: string;
  src?: string;
  description?: string;
  autoPlay?: boolean;
}

export function AudioPlayer({ title, src, description, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { initializeSession, updateMetadata, updatePlaybackState } = useAudioSession();
  const { createProtectedAudio, isCached } = useProtectedAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    // Initialize audio session
    initializeSession();

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
      
      // Update media session metadata
      updateMetadata({
        title: title,
        artist: "eL Vision Group",
        album: description || "Audio Therapy",
        artwork: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      updatePlaybackState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    // Enhanced audio setup for better compatibility
    audio.setAttribute('preload', 'metadata');
    audio.setAttribute('controlsList', 'nodownload noremoteplayback');
    audio.crossOrigin = 'anonymous';

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay && src) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        toast({
          title: "Autoplay blocked",
          description: "Click play to start the audio",
          variant: "default",
        });
      });
    }

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, autoPlay, toast, title, description, initializeSession, updateMetadata, updatePlaybackState]);

  const togglePlayPause = async () => {
    if (!src) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Check if audio needs to be re-cached (iOS cache cleared)
      const needsRecaching = !(await isCached(src)) && audio.src && !audio.src.startsWith('blob:');
      
      if (needsRecaching) {
        try {
          // Re-create audio with loading feedback
          const newAudio = await createProtectedAudio(src, setIsLoadingAudio);
          
          // Replace the audio element source
          if (audioRef.current) {
            audioRef.current.src = newAudio.src;
            audioRef.current.load();
          }
          
          // Show notification for re-download
          toast({
            title: "Re-downloading audio",
            description: "Cache was cleared, downloading again...",
            variant: "default",
          });
        } catch (error) {
          console.error('Failed to re-cache audio:', error);
        }
      }
      
      audio.play().then(() => setIsPlaying(true)).catch((error) => {
        toast({
          title: "Playback Error",
          description: "Unable to play audio file",
          variant: "destructive",
        });
      });
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-secondary border-border">
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            toast({
              title: "Audio Error",
              description: "Failed to load audio file",
              variant: "destructive",
            });
          }}
        />
      )}
      
      <div className="space-y-4">
        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold font-orbitron text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const audio = audioRef.current;
              if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
            }}
            disabled={!src}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            onClick={togglePlayPause}
            disabled={!src || isLoadingAudio}
            className="w-12 h-12 rounded-full bg-gradient-primary hover:opacity-90"
          >
            {isLoadingAudio ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const audio = audioRef.current;
              if (audio) audio.currentTime = Math.min(duration, audio.currentTime + 10);
            }}
            disabled={!src}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <Progress 
              value={volume * 100} 
              className="h-2 cursor-pointer" 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                handleVolumeChange([percent]);
              }}
            />
          </div>
        </div>

        {!src && (
          <div className="text-center py-4">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No audio file loaded
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}