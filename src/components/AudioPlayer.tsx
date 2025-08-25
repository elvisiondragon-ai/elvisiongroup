import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload, Download, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioSession } from "@/hooks/useAudioSession";
import { useOfflineAudio } from "@/hooks/useOfflineAudio";
// import Hls from 'hls.js'; // Temporarily disabled for debugging

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  // const hlsRef = useRef<Hls | null>(null); // Temporarily disabled
  const { toast } = useToast();
  const { initializeSession, updateMetadata, updatePlaybackState } = useAudioSession();
  const { 
    isDownloading, 
    downloadProgress, 
    isAudioCached, 
    cacheAudio, 
    getCachedAudioUrl 
  } = useOfflineAudio();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Setup audio URL (cached or original)
  useEffect(() => {
    if (!src) return;

    const setupAudioUrl = async () => {
      const cachedUrl = await getCachedAudioUrl(src);
      // Fallback to original URL if no cached version (for airplane mode)
      setCurrentAudioUrl(cachedUrl || src);
    };

    setupAudioUrl();
  }, [src, getCachedAudioUrl]);

  // Keep audio playing in background - no interference with audio element
  useEffect(() => {
    const handleFocus = () => {
      // Simple check without interfering with audio playback
      const audio = audioRef.current;
      if (audio) {
        // Just sync UI with actual audio state, don't change audio
        setIsPlaying(!audio.paused && !audio.ended);
        setCurrentTime(audio.currentTime);
        if (audio.duration) setDuration(audio.duration);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Setup audio element and event listeners (only once per audio URL)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudioUrl) return;

    // Initialize audio session
    initializeSession();
    
    // Temporarily disable HLS for debugging - use regular audio
    audio.src = currentAudioUrl;

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

    // Enhanced audio setup for better compatibility and background play
    audio.setAttribute('preload', 'metadata');
    audio.setAttribute('controlsList', 'nodownload noremoteplayback');
    audio.crossOrigin = 'anonymous';
    
    // Enable background audio continuation
    audio.setAttribute('data-background-audio', 'true');

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      // Temporarily disabled HLS cleanup
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudioUrl, initializeSession, updateMetadata, updatePlaybackState]);

  // Handle autoplay separately to avoid re-initializing audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudioUrl || !autoPlay) return;

    audio.play().then(() => setIsPlaying(true)).catch(() => {
      toast({
        title: "Autoplay blocked",
        description: "Click play to start the audio",
        variant: "default",
      });
    });
  }, [currentAudioUrl, autoPlay, toast]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentAudioUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (error) {
        toast({
          title: "Playback Error",
          description: "Unable to play audio file",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = async () => {
    if (!src || !title) return;
    
    const success = await cacheAudio(src, title);
    if (success) {
      // Update current audio URL to use cached version
      const cachedUrl = await getCachedAudioUrl(src);
      setCurrentAudioUrl(cachedUrl);
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
      {currentAudioUrl && (
        <audio
          ref={audioRef}
          src={currentAudioUrl}
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
        {/* Track Info & Status */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-xs text-muted-foreground">
              {isOnline ? 'Online' : 'Offline Mode'}
            </span>
          </div>
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
            disabled={!currentAudioUrl}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            onClick={togglePlayPause}
            disabled={!currentAudioUrl}
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
            disabled={!currentAudioUrl}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Download for offline */}
          {src && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download for offline use"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Download Progress */}
        {isDownloading && (
          <div className="space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              Downloading for offline use...
            </div>
            <Progress value={downloadProgress} className="h-2" />
          </div>
        )}

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

        {!currentAudioUrl && (
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