import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioSession } from "@/hooks/useAudioSession";

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { setupMediaSession, setMediaSessionHandlers, updatePlaybackState, updatePositionState } = useAudioSession();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
      
      // Update position state for media session
      if (audio.duration && !isNaN(audio.duration)) {
        updatePositionState(audio.duration, 1, audio.currentTime);
      }
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      // Update position state during playback
      if (isPlaying && audio.duration && !isNaN(audio.duration)) {
        updatePositionState(audio.duration, 1, audio.currentTime);
      }
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    // Setup media session when audio loads
    if (src) {
      setupMediaSession({
        title: title,
        artist: 'eL Vision Group',
        album: 'Spiritual Audio'
      });

      setMediaSessionHandlers({
        play: () => togglePlayPause(),
        pause: () => togglePlayPause(),
        seekbackward: (details) => {
          const seekOffset = details.seekOffset || 10;
          if (audio) audio.currentTime = Math.max(0, audio.currentTime - seekOffset);
        },
        seekforward: (details) => {
          const seekOffset = details.seekOffset || 10;
          if (audio) audio.currentTime = Math.min(duration, audio.currentTime + seekOffset);
        },
        seekto: (details) => {
          if (audio && details.seekTime !== undefined) audio.currentTime = details.seekTime;
        }
      });
    }

    if (autoPlay && src) {
      audio.play().then(() => {
        setIsPlaying(true);
        updatePlaybackState('playing');
      }).catch(() => {
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
      updatePlaybackState('none');
    };
  }, [src, autoPlay, toast, title, setupMediaSession, setMediaSessionHandlers, updatePlaybackState, updatePositionState]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      updatePlaybackState('paused');
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        updatePlaybackState('playing');
      }).catch((error) => {
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
          onEnded={() => {
            setIsPlaying(false);
            updatePlaybackState('paused');
          }}
          onError={() => {
            updatePlaybackState('none');
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
            disabled={!src}
            className="w-12 h-12 rounded-full bg-gradient-primary hover:opacity-90"
          >
            {isPlaying ? (
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