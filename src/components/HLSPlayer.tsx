import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

interface HLSPlayerProps {
  src: string;
  title: string;
  description?: string;
}

export function HLSPlayer({ src, title, description }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      // HLS.js for browsers that don't support HLS natively
      const hls = new Hls({
        debug: true, // Enable debug for testing
        enableWorker: false, // Disable web worker for easier debugging
      });
      
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed successfully');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', event, data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error - trying to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error - trying to recover');
              hls.recoverMediaError();
              break;
            default:
              console.log('Fatal error - destroying HLS');
              hls.destroy();
              break;
          }
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        console.log('HLS Fragment loaded:', data.frag.url);
      });
      
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
    } else {
      console.error('HLS is not supported in this browser');
    }

    // Audio event listeners
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [src]);

  const togglePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-secondary border-border">
      <video
        ref={videoRef}
        style={{ display: 'none' }} // Audio only - hide video element
        controls={false}
        preload="metadata"
      />
      
      <div className="space-y-4">
        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold font-orbitron text-foreground">
            {title} <span className="text-xs text-blue-400">(HLS)</span>
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div 
            className="w-full h-2 bg-muted rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-gradient-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-gradient-primary hover:opacity-90"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1"
          />
        </div>

        {/* Debug Info */}
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <p><strong>HLS Source:</strong> {src}</p>
          <p><strong>HLS Support:</strong> {Hls.isSupported() ? 'Yes' : 'Native only'}</p>
          <p><strong>Current Time:</strong> {formatTime(currentTime)}</p>
          <p><strong>Duration:</strong> {formatTime(duration)}</p>
        </div>
      </div>
    </Card>
  );
}