import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2, Upload } from "lucide-react";
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
  const { initializeSession, updateMetadata, updatePlaybackState } = useAudioSession();

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

    // ANTI-SCRUB PROTECTION - Multiple methods like Spotify
    const preventSeeking = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventSeekingImmediate = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      // Reset to current position if someone tries to seek
      const currentPos = audio.currentTime;
      setTimeout(() => {
        if (audio.currentTime !== currentPos) {
          audio.currentTime = currentPos;
        }
      }, 0);
      return false;
    };

    // Enhanced audio setup for better compatibility
    audio.setAttribute('preload', 'metadata');
    audio.setAttribute('controlsList', 'nodownload noremoteplayback noseek');
    audio.crossOrigin = 'anonymous';

    // Add all the anti-seek event listeners
    audio.addEventListener('seeking', preventSeekingImmediate);
    audio.addEventListener('seeked', preventSeekingImmediate);
    audio.addEventListener('loadstart', preventSeeking);
    audio.addEventListener('progress', preventSeeking);
    audio.addEventListener('ratechange', preventSeeking);

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
      // Remove anti-seek listeners
      audio.removeEventListener('seeking', preventSeekingImmediate);
      audio.removeEventListener('seeked', preventSeekingImmediate);
      audio.removeEventListener('loadstart', preventSeeking);
      audio.removeEventListener('progress', preventSeeking);
      audio.removeEventListener('ratechange', preventSeeking);

      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, autoPlay, toast, title, description, initializeSession, updateMetadata, updatePlaybackState]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((error) => {
        toast({
          title: "Playback Error",
          description: "Unable to play audio file",
          variant: "destructive",
        });
      });
    }
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
      {/* COMPLETELY HIDDEN AUDIO - NO CONTROLS POSSIBLE */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden', opacity: 0, width: 0, height: 0, overflow: 'hidden' }}>
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
            preload="none"
            controls={false}
            style={{ display: 'none !important', visibility: 'hidden !important', position: 'absolute', left: '-99999px', top: '-99999px', width: '1px', height: '1px', opacity: 0 }}
          />
        )}
      </div>
      
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

        {/* FAKE LOCKED PROGRESS BAR - COMPLETELY NON-INTERACTIVE */}
        <div className="space-y-2">
          <div 
            className="w-full bg-muted/20 rounded-full h-2 relative cursor-not-allowed"
            style={{ 
              pointerEvents: 'none', 
              userSelect: 'none', 
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            onClick={(e) => e.preventDefault()}
          >
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                pointerEvents: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
              onClick={(e) => e.preventDefault()}
            />
            {/* Invisible overlay to block all interactions */}
            <div 
              className="absolute inset-0 cursor-not-allowed"
              style={{ 
                background: 'transparent',
                pointerEvents: 'auto',
                zIndex: 10
              }}
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
              onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
              onTouchMove={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
              onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
              onDragStart={(e) => { e.preventDefault(); return false; }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls - Play/Pause Only */}
        <div className="flex items-center justify-center">
          <Button
            onClick={togglePlayPause}
            disabled={!src}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
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