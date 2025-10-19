//AUDIOPLAYER.TSX
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
          <h3 className="text-lg font-semibold font-exo text-foreground">
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
/////// AUDIOUPLOAD TSX
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AudioUploadProps {
  onUploadComplete?: (audioTrack: any) => void;
}

export function AudioUpload({ onUploadComplete }: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Enhanced file validation
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
      const maxSize = 50 * 1024 * 1024; // 50MB limit
      
      // Check file type
      if (!selectedFile.type.startsWith('audio/') || !allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid audio file (MP3, WAV, OGG, M4A)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size
      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Audio file must be 50MB or smaller",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  // Enhanced input validation
  const validateInputs = (): string | null => {
    if (!file) return "Please select an audio file";
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return "Please enter a title";
    if (trimmedTitle.length > 100) return "Title must be 100 characters or less";
    
    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 500) return "Description must be 500 characters or less";
    
    // Basic sanitization check
    const hasHtml = /<[^>]*>/.test(trimmedTitle) || /<[^>]*>/.test(trimmedDescription);
    if (hasHtml) return "Title and description cannot contain HTML tags";
    
    return null;
  };

  const handleUpload = async () => {
    const validationError = validateInputs();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload audio files",
          variant: "destructive",
        });
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      // Save track info to database
      const { data: trackData, error: trackError } = await supabase
        .from('audio_tracks')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          file_path: fileName,
          file_url: publicUrl,
          category: 'verse',
          created_by: user.id,
          is_public: true,
        })
        .select()
        .single();

      if (trackError) {
        throw trackError;
      }

      toast({
        title: "Upload successful!",
        description: `"${title}" has been uploaded successfully`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('audio-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(trackData);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-secondary border-border">
      <div className="space-y-4">
        <div className="text-center">
          <Music className="h-8 w-8 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold font-exo text-foreground">
            Upload Audio Track
          </h3>
          <p className="text-sm text-muted-foreground">
            Add your MP3 files for Verse of Secret Decree
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="audio-upload">Audio File (MP3, WAV, etc.)</Label>
            <Input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {file && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter track title"
              className="mt-1"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="mt-1"
              rows={3}
              maxLength={500}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading || !file || !title.trim()}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Audio
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
///VERSE AUDIO CARD TSX
import { Lock, Music, Crown, Zap } from 'lucide-react';
import { useProtectedAudio } from '@/contexts/AudioContext';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useState, useEffect } from 'react';

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
}

export function VerseAudioCard({ 
  verse, 
  onWarning, 
  currentPlayingVerse, 
  setCurrentPlayingVerse,
  currentVerseAudio,
  setCurrentVerseAudio,
  onShowSacredNotification
}: VerseAudioCardProps) {
  const { createProtectedAudio } = useProtectedAudio();
  const { awardXP } = useXPSystem();
  
  // Check if this verse is currently playing
  const isPlaying = currentPlayingVerse === verse.id;

  // Check if audio is actually playing when component mounts/updates
  useEffect(() => {
    if (isPlaying && currentVerseAudio) {
      if (currentVerseAudio.paused || currentVerseAudio.ended) {
        // Audio stopped but state says it's playing - sync the state
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
      }
    }
  }, [isPlaying, currentVerseAudio, setCurrentPlayingVerse, setCurrentVerseAudio]);

  const handlePlayClick = async () => {
    if (!verse.unlocked || !verse.audioPath) return;
    
    // If this verse is currently playing, stop it
    if (isPlaying && currentVerseAudio) {
      currentVerseAudio.pause();
      setCurrentPlayingVerse(null);
      setCurrentVerseAudio(null);
      return;
    }

    // If another verse is playing, show focus warning
    if (currentPlayingVerse && currentPlayingVerse !== verse.id && onWarning) {
      const shouldContinue = await onWarning();
      if (!shouldContinue) {
        return; // User chose to stay with current verse
      }
    }

    // Stop any currently playing verse
    if (currentVerseAudio) {
      currentVerseAudio.pause();
      setCurrentVerseAudio(null);
    }

    // Create new protected audio with your primitive approach
    try {
      const audio = createProtectedAudio(verse.audioPath);
      
      // Add event listeners
      audio.addEventListener('ended', () => {
        console.log('🎵 Audio ended for verse:', verse.title, 'ID:', verse.id);
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
        // Award XP based on verse type - Short verses get +1 XP, main verses get +10 XP
        const xpAmount = verse.id === 100 ? 1 : 10; // ID 100 is our reflection verse
        console.log('🏆 Awarding XP:', xpAmount, 'for verse:', verse.title);
        awardXP('verse_completion', xpAmount, `Completed ${verse.title}`);
      });

      audio.addEventListener('error', (error) => {
        console.error('Error playing audio:', error);
        setCurrentPlayingVerse(null);
        setCurrentVerseAudio(null);
      });

      // Show sacred notification before playing
      if (onShowSacredNotification) {
        onShowSacredNotification(verse.title);
        // Wait a moment for notification to appear
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Play audio
      await audio.play();
      setCurrentPlayingVerse(verse.id);
      setCurrentVerseAudio(audio);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurrentPlayingVerse(null);
      setCurrentVerseAudio(null);
    }
  };

  const canPlay = verse.unlocked && verse.audioPath;

  return (
    <div className="relative group cursor-pointer">
      {verse.unlocked && verse.artwork ? (
        <div>
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-xl animate-pulse"></div>
          
          {/* Main artwork container */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary/60 to-accent/60 shadow-2xl shadow-primary/40">
            <img
              src={verse.artwork}
              alt={`${verse.title} cosmic artwork`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/20"></div>
          </div>
          
          {/* Play Button Overlay */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center transition-all duration-500 cursor-pointer"
            onClick={handlePlayClick}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
              {!canPlay ? (
                <Lock className="w-6 h-6 text-white/60" />
              ) : isPlaying ? (
                // Pause icon
                <div className="flex gap-1 items-center justify-center">
                  <div className="w-1.5 h-5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-5 bg-white rounded-sm"></div>
                </div>
              ) : (
                // Play icon
                <div className="relative flex items-center justify-center">
                  <div 
                    className="w-0 h-0 ml-1"
                    style={{
                      borderLeft: '14px solid white',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Locked or No Audio Container */}
          <div className={`w-36 h-36 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-500 ${
            !verse.unlocked
              ? verse.requiredLevel === 10
                ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-400/40 shadow-lg shadow-purple-500/20"
                : "bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-400/40 shadow-lg shadow-rose-500/20"
              : "bg-gradient-to-br from-muted/20 to-background border-muted-foreground/40"
          }`}>
            <div className="text-center space-y-3">
              {!verse.unlocked ? (
                <>
                  {verse.requiredLevel === 10 ? (
                    <Zap className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
                  ) : (
                    <Crown className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
                  )}
                  {(
                    <div className="relative">
                      <Lock className="w-6 h-6 text-muted-foreground mx-auto" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Music className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div className="text-xs text-muted-foreground font-medium">
                    Coming Soon
                  </div>
                </>
              )}
            </div>
          </div>
          
          {!verse.unlocked && (
            <>
              <div className="text-sm font-bold mt-3 text-center text-red-400 flex items-center justify-center gap-1">
                {verse.requiredLevel === 2 ? (
                  <>
                    Lv 2 or Upgrade Pro
                  </>
                ) : verse.requiredLevel === 3 ? (
                  <>
                    Lv 3 or Upgrade Pro
                  </>
                ) : verse.requiredLevel === 6 ? (
                  <div className="font-[Luxurious_Script] text-sm">
                    Lv 5 or Upgrade Pro
                  </div>
                ) : verse.requiredLevel === 7 ? (
                  <>
                    Lv 6 & Pro
                  </>
                ) : verse.requiredLevel === 8 ? (
                  <>
                    Lv 7 & Pro
                  </>
                ) : verse.requiredLevel === 9 ? (
                  <>
                    Lv 8 & Pro
                  </>
                ) : verse.requiredLevel === 10 ? (
                  <>
                    Lv 9 & Pro
                  </>
                ) : verse.requiredLevel === 11 ? (
                  <>
                    Lv 10 & Pro
                  </>
                ) : "Locked"}
              </div>
              
              {/* Animated glow ring */}
              <div className={`absolute inset-0 rounded-full animate-pulse ${
                verse.requiredLevel === 10
                  ? "bg-gradient-to-r from-purple-500/10 to-violet-500/10"
                  : "bg-gradient-to-r from-rose-500/10 to-pink-500/10"
              } blur-xl`}></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
///AUDIO CONTEXT TSX 
import React, { createContext, useContext } from 'react';
import { getAudioUrl } from '@/utils/audioUtils';

// Simple context - just protection utility, no global state
interface AudioContextType {
  createProtectedAudio: (audioPath: string) => HTMLAudioElement;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Create protected audio element with your primitive approach
  const createProtectedAudio = (audioPath: string): HTMLAudioElement => {
    const publicUrl = getAudioUrl(audioPath);
    const audio = new Audio(publicUrl);
    
    // Add protection - no download, no right-click
    audio.setAttribute('controlsList', 'nodownload');
    audio.addEventListener('contextmenu', (e) => e.preventDefault());
    
    return audio;
  };

  const value = {
    createProtectedAudio
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

  const value = {
    createProtectedAudio
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useProtectedAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useProtectedAudio must be used within an AudioProvider');
  }
  return context;
}
//USE AUDIO CACHE.TS
import { useState, useEffect, useCallback } from 'react';
import { cacheManager, CacheKeys } from '@/utils/cacheManager';
import { supabase } from '@/integrations/supabase/client';

interface AudioCacheItem {
  url: string;
  blob?: Blob;
  lastAccessed: number;
}

/**
 * Advanced Audio Caching Hook for Offline Playback
 * Implements 30-day caching strategy with intelligent preloading
 */
export function useAudioCache() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [cachedFiles, setCachedFiles] = useState<Set<string>>(new Set());

  // Get audio URL with caching
  const getCachedAudioUrl = useCallback(async (fileName: string): Promise<string> => {
    const cacheKey = CacheKeys.audioUrl(fileName);
    
    // Check cache first
    const cachedUrl = cacheManager.get<string>(cacheKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Generate new URL and cache it
    const { data } = supabase.storage
      .from('audio-tracks')
      .getPublicUrl(fileName);
    
    const publicUrl = data.publicUrl;
    cacheManager.set(cacheKey, publicUrl, 'audioUrls');
    
    return publicUrl;
  }, []);

  // Preload audio file for offline playback
  const preloadAudio = useCallback(async (fileName: string): Promise<void> => {
    const cacheKey = CacheKeys.audioFile(fileName);
    
    // Check if already cached
    const cachedBlob = cacheManager.get<Blob>(cacheKey);
    if (cachedBlob) {
      return;
    }

    try {
      const url = await getCachedAudioUrl(fileName);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Cache the blob for 30 days
      cacheManager.set(cacheKey, blob, 'audioFiles');
      
      setCachedFiles(prev => new Set([...prev, fileName]));
      setCacheSize(prev => prev + blob.size);
      
      console.log(`✅ Audio cached: ${fileName} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
      console.error(`❌ Failed to cache audio: ${fileName}`, error);
    }
  }, [getCachedAudioUrl]);

  // Get audio file from cache or network
  const getAudio = useCallback(async (fileName: string): Promise<string> => {
    const cacheKey = CacheKeys.audioFile(fileName);
    
    // Try to get cached blob first
    const cachedBlob = cacheManager.get<Blob>(cacheKey);
    if (cachedBlob) {
      return URL.createObjectURL(cachedBlob);
    }

    // Fall back to network URL
    return getCachedAudioUrl(fileName);
  }, [getCachedAudioUrl]);

  // Preload multiple audio files
  const preloadAudioFiles = useCallback(async (fileNames: string[]): Promise<void> => {
    setIsPreloading(true);
    
    try {
      // Preload in batches to avoid overwhelming the network
      const batchSize = 3;
      for (let i = 0; i < fileNames.length; i += batchSize) {
        const batch = fileNames.slice(i, i + batchSize);
        await Promise.all(batch.map(preloadAudio));
        
        // Small delay between batches
        if (i + batchSize < fileNames.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } finally {
      setIsPreloading(false);
    }
  }, [preloadAudio]);

  // Clear audio cache
  const clearAudioCache = useCallback(() => {
    cacheManager.clear('audio:*');
    setCachedFiles(new Set());
    setCacheSize(0);
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    const stats = cacheManager.getStats();
    return {
      ...stats,
      audioFiles: cachedFiles.size,
      totalSize: cacheSize,
      totalSizeMB: (cacheSize / 1024 / 1024).toFixed(2),
    };
  }, [cachedFiles.size, cacheSize]);

  return {
    getCachedAudioUrl,
    preloadAudio,
    getAudio,
    preloadAudioFiles,
    clearAudioCache,
    getCacheStats,
    isPreloading,
    cachedFiles,
    cacheSize,
  };
}

// XP Queue System for Offline Actions
interface XPQueueItem {
  activityType: string;
  xpAmount: number;
  reason?: string;
  metadata?: any;
  timestamp: number;
}

export function useXPQueue() {
  const [queue, setQueue] = useState<XPQueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add XP to queue when offline
  const queueXP = useCallback((activityType: string, xpAmount: number, reason?: string, metadata?: any) => {
    const item: XPQueueItem = {
      activityType,
      xpAmount,
      reason,
      metadata,
      timestamp: Date.now(),
    };
    
    setQueue(prev => [...prev, item]);
    
    // Store in localStorage for persistence
    const existingQueue = JSON.parse(localStorage.getItem('xp_queue') || '[]');
    localStorage.setItem('xp_queue', JSON.stringify([...existingQueue, item]));
  }, []);

  // Process queued XP when back online
  const processQueue = useCallback(async () => {
    if (queue.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Process each item in queue
      for (const item of queue) {
        try {
          // Call your actual XP award function here
          console.log('Processing queued XP:', item);
          // await awardXP(item.activityType, item.xpAmount, item.reason, item.metadata);
        } catch (error) {
          console.error('Failed to process XP item:', error, item);
        }
      }
      
      // Clear queue after successful processing
      setQueue([]);
      localStorage.removeItem('xp_queue');
      
    } finally {
      setIsProcessing(false);
    }
  }, [queue, isProcessing]);

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem('xp_queue') || '[]');
    setQueue(savedQueue);
  }, []);

  // Auto-process queue when online
  useEffect(() => {
    if (navigator.onLine && queue.length > 0) {
      processQueue();
    }
  }, [queue, processQueue]);

  return {
    queueXP,
    processQueue,
    queue,
    isProcessing,
    queueSize: queue.length,
  };
}
//USE AUDIO SESSION TS
import { useCallback } from 'react';

interface MediaMetadata {
  title: string;
  artist: string;
  album: string;
  artwork: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

interface PlaybackState {
  duration: number;
  playbackRate: number;
  position: number;
}

interface MediaSessionHandlers {
  onPlay?: () => void;
  onPause?: () => void;
}

export function useAudioSession() {
  const initializeSession = useCallback((handlers?: MediaSessionHandlers) => {
    if ('mediaSession' in navigator) {
      // Connect action handlers to actual audio controls
      navigator.mediaSession.setActionHandler('play', handlers?.onPlay || null);
      navigator.mediaSession.setActionHandler('pause', handlers?.onPause || null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }

    // Request persistent audio context for better compatibility
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').catch(() => {
        // Silently fail if wake lock is not supported
      });
    }
  }, []);

  const updateMetadata = useCallback((metadata: MediaMetadata) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata(metadata);
    }
  }, []);

  const updatePlaybackState = useCallback((state: PlaybackState) => {
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      try {
        navigator.mediaSession.setPositionState({
          duration: state.duration,
          playbackRate: state.playbackRate,
          position: state.position,
        });
      } catch (error) {
        // Silently handle errors in position state updates
        console.debug('Position state update failed:', error);
      }
    }
  }, []);

  const setPlaybackState = useCallback((state: 'playing' | 'paused') => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }, []);

  return {
    initializeSession,
    updateMetadata,
    updatePlaybackState,
    setPlaybackState,
  };
}
//AUDIO UTILS
import { supabase } from '@/integrations/supabase/client';

export const audioFiles = [
  'Jurnalsyukur1.MP3',
  'Verse 3 - Syukur.MP3', 
  'Verse1 - The Space Hill.MP3',
  'Verse2 - Lucid Beach.MP3',
  'Verse4-English.MP3',
  'Verse5 - Virtality Vortex.MP3'
];

export const getAudioUrl = (fileName: string) => {
  const { data } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};
//AUDIO TERAPHY TSX
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioUpload } from "@/components/AudioUpload";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Lock, ArrowLeft, Music, Upload as UploadIcon, Star, Zap, Crown, Shield, Gem, Flame, Eye, Sparkles, Globe, Infinity } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useXPSystem } from "@/hooks/useXPSystem";
import { usePro } from "@/hooks/usePro";
import { useMeditative } from "@/contexts/MeditativeContext";
import { VerseAudioCard } from "@/components/VerseAudioCard";
import { useProtectedAudio } from "@/contexts/AudioContext";
import { SacredFocusNotification } from "@/components/SacredFocusNotification";
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
import verseArtwork from "@/assets/verse-1-cosmic.jpg";
import verse2Artwork from "@/assets/verse-2-cosmic.jpg";
import verse3Artwork from "@/assets/verse-3-cosmic.jpg";
import verse4Artwork from "@/assets/verse-4-gold-coins.jpg";
import verse5Artwork from "@/assets/verse-5-cosmic.jpg";
import verse6Artwork from "@/assets/verse-6-cosmic.jpg";
import verse7Artwork from "@/assets/verse-7-cosmic.jpg";
import verse8Artwork from "@/assets/verse-8-cosmic.jpg";
import verse9Artwork from "@/assets/verse-9-cosmic.jpg";
import verse10Artwork from "@/assets/verse-10-cosmic.jpg";
import shortVerse1Artwork from "@/assets/shortverse1.png";

interface AudioTherapyProps {
  onNavigate: (tab: string) => void;
}

export function AudioTherapy({ onNavigate }: AudioTherapyProps) {
  const { t, i18n } = useTranslation();
  const [userLevel, setUserLevel] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningResolver, setWarningResolver] = useState<((value: boolean) => void) | null>(null);
  const [showSacredNotification, setShowSacredNotification] = useState(false);
  const [currentVerseName, setCurrentVerseName] = useState<string>("");
  const { awardXP } = useXPSystem();
  const { proStatus } = usePro();
  const { setMeditativeActive } = useMeditative();

  // Local audio state (better for XP tracking)
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [currentVerseAudio, setCurrentVerseAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === "elvisiondragon@gmail.com");
      
      if (user) {
        await fetchUserProfile(user.id);
      }
      
      await fetchAudioTracks();
      setLoading(false);
    };
    
    initializeData();
  }, []);

  // Refetch audio tracks when language changes
  useEffect(() => {
    fetchAudioTracks();
  }, [i18n.language]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('level')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setUserLevel(data.level);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchAudioTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .eq('category', 'verse')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching audio tracks:', error);
        return;
      }

      setAudioTracks(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUploadComplete = () => {
    fetchAudioTracks(); // Refresh the tracks list
    setShowUpload(false);
  };

  // Warning dialog handler
  const handleWarning = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setWarningResolver(() => resolve);
      setShowWarningDialog(true);
    });
  };

  const handleWarningResponse = (shouldContinue: boolean) => {
    if (warningResolver) {
      warningResolver(shouldContinue);
      setWarningResolver(null);
    }
    setShowWarningDialog(false);
  };


  const verses = [
    {
      id: 1,
      title: "Verse 1 - The Space Hill",
      subtitle: "Kedamaian Batin",
      unlocked: true, // Allow access to all verses - users will discover levels naturally
      requiredLevel: 2,
      artwork: verseArtwork,
      audioPath: 'Verse1 - The Space Hill.MP3',
      language: 'en'
    },
    {
      id: 2,
      title: "Verse 2 - Lucid Beach",
      subtitle: "Relaksasi seperti berada di pantai, membantu tidur nyenyak dan pikiran jernih",
      unlocked: proStatus.isPro, // Lock for non-pro users
      requiredLevel: 2,
      artwork: verse2Artwork,
      audioPath: 'Verse2 - Lucid Beach.MP3',
      language: 'id'
    },
    {
      id: 3,
      title: "Verse 3 - Syukur Meditation",
      subtitle: "Menumbuhkan rasa syukur pada titik saraf seluruh tubuh",
      unlocked: proStatus.isPro, // Lock for non-pro users
      requiredLevel: 3,
      artwork: verse3Artwork,
      audioPath: 'Verse 3 - Syukur.MP3',
      language: 'id'
    },
    {
      id: 4,
      title: "Verse 4 - Prosperity Stream",
      subtitle: "Frekuensi Kaya Raya",
      unlocked: true,
      requiredLevel: 1,
      artwork: verse4Artwork,
      audioPath: 'Verse 4 - Prosperity Stream Vol. 1.MP3',
      language: 'id'
    },
    {
      id: 41,
      title: "Verse 4 - Prosperity Stream (English)",
      subtitle: "Prosperity Stream",
      unlocked: true,
      requiredLevel: 1,
      artwork: verse4Artwork,
      audioPath: 'Verse4-English.MP3',
      language: 'en'
    },
    {
      id: 5,
      title: "Verse 5 - Vitality Vortex",
      subtitle: "Memperbaiki ulang finansial, fisik dan mental untuk hidup yang sehat",
      unlocked: proStatus.isPro, // Lock for non-pro users
      requiredLevel: 6,
      artwork: verse5Artwork,
      audioPath: 'Verse5 - Virtality Vortex.MP3',
      language: 'id'
    },
    {
      id: 6,
      title: "Verse 6 - Beautify",
      subtitle: "Memfokuskan Kecantikan fisik yang mempesona setiap orang",
      unlocked: false, // Lock for all users
      requiredLevel: 7,
      artwork: verse6Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 7,
      title: "Verse 7 - Confidence Core",
      subtitle: "Menumbuhkan keyakinan diri agar berani mengambil langkah penting",
      unlocked: false, // Lock for all users
      requiredLevel: 8,
      artwork: verse7Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 8,
      title: "Verse 8 - Love Magnet",
      subtitle: "Menarik cinta dan kasih sayang dari orang-orang di sekitar",
      unlocked: false, // Lock for all users
      requiredLevel: 9,
      artwork: verse8Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 9,
      title: "Verse 9 - Family Harmony",
      subtitle: "Menenangkan emosi dan memperkuat hubungan keluarga",
      unlocked: false, // Lock for all users
      requiredLevel: 10,
      artwork: verse9Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 10,
      title: "Verse 10 - Healing Heart",
      subtitle: "Menyembuhkan luka batin dan memulihkan kedamaian hati",
      unlocked: false, // Lock for all users
      requiredLevel: 1,
      artwork: verse10Artwork,
      audioPath: null,
      language: 'id'
    },
  ];


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
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              Verses of eL Vision
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
        <p className="text-muted-foreground text-center">
          {t('Dengarkan Pakai Headphone')}
        </p>
        
        {/* Single Tutorial Button for All Songs */}
        <div className="flex justify-center mt-6">
          <Button
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary/40 transform hover:scale-105 transition-all duration-300 border border-white/20"
            onClick={() => {
              onNavigate('tutorial');
            }}
          >
            <span className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              {t('audioTherapy.readTutorial')}
            </span>
          </Button>
        </div>
      </div>

      {/* Short Verses - Reflection */}
      <div className="px-6 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold font-exo bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Short Verses - Reflection
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
        </div>

        <Card className="relative overflow-hidden border transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-orange-500/5 via-background to-yellow-500/5 border-orange-400/30 shadow-lg shadow-orange-400/10">
          {/* Minimal Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500 via-transparent to-yellow-500"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border border-orange-400/20 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border border-yellow-400/20 rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center space-y-4 p-4">
            {/* Compact Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-lg font-semibold font-exo bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Guided to Inner Silence
                </h3>
                <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  SHORT
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80 font-medium">
                Refleksi mendalam menuju ketenangan batin
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
            </div>

            {/* Smaller Audio Player */}
            <div className="flex justify-center">
              <div className="transform scale-75">
                {/* @ts-ignore - Lovable deployment compatibility */}
                <VerseAudioCard
                  verse={{
                    id: 100,
                    title: "Guided to Inner Silence",
                    subtitle: "Refleksi mendalam menuju ketenangan batin",
                    unlocked: true,
                    requiredLevel: 1,
                    artwork: shortVerse1Artwork, // Using dedicated short verse artwork
                    audioPath: 'Jurnalsyukur1.MP3',
                    language: 'id'
                  }}
                  onWarning={handleWarning}
                  currentPlayingVerse={currentPlayingVerse}
                  setCurrentPlayingVerse={setCurrentPlayingVerse}
                  currentVerseAudio={currentVerseAudio}
                  setCurrentVerseAudio={setCurrentVerseAudio}
                  onShowSacredNotification={(verseName) => {
                    setCurrentVerseName(verseName);
                    setShowSacredNotification(true);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Verses */}
      <div className="px-6 space-y-8">
        <div className="text-center space-y-2 pt-8">
          <h2 className="text-xl font-bold font-exo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Main Verses
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>
        
        {verses.map((verse) => {

          return (
            <Card
              key={verse.id}
                  className={`relative overflow-hidden border-2 transition-all duration-500 transform hover:scale-[1.02] bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/40 shadow-2xl shadow-primary/20`}
                >
              {/* Cosmic Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-accent"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border border-primary/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border border-accent/20 rounded-full"></div>
              </div>
              
              <div className="relative z-10 text-center space-y-6 p-8">
                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-2xl font-bold font-exo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {verse.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      verse.language === 'en' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {verse.language === 'en' ? 'EN' : 'ID'}
                    </span>
                  </div>
                  {verse.subtitle && (
                    <p className="text-sm text-muted-foreground/80 font-medium">
                      {verse.subtitle}
                    </p>
                  )}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                </div>

                {/* Artwork or Lock */}
                <div className="flex justify-center">
                  {/* @ts-ignore - Lovable deployment compatibility */}
                  <VerseAudioCard
                    verse={verse}
                    onWarning={handleWarning}
                    currentPlayingVerse={currentPlayingVerse}
                    setCurrentPlayingVerse={setCurrentPlayingVerse}
                    currentVerseAudio={currentVerseAudio}
                    setCurrentVerseAudio={setCurrentVerseAudio}
                    onShowSacredNotification={(verseName) => {
                      setCurrentVerseName(verseName);
                      setShowSacredNotification(true);
                    }}
                  />
                </div>

              </div>
            </Card>
          );
        })}
      </div>

      {/* Audio Tracks Section - Show only first 2 tracks */}
      {audioTracks.length > 0 && (
        <div className="px-6 space-y-4">
          <h2 className="text-xl font-semibold font-exo text-foreground">
            {t('audioTherapy.availableTracks')}
          </h2>
          {audioTracks.slice(0, 2).map((track) => (
            <AudioPlayer
              key={track.id}
              title={track.title}
              description={track.description}
              src={track.file_url}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="px-6">
          <Card className="p-6 bg-gradient-secondary border-border">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground">{t('audioTherapy.loading')}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
      </div>

      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent className="bg-background border border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Peringatan</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Anda akan mengulang exp dari awal jika menghentikan audio ini, lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => handleWarningResponse(false)}
              className="border-muted-foreground/20"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleWarningResponse(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sacred Focus Notification */}
      <SacredFocusNotification
        isVisible={showSacredNotification}
        onClose={() => setShowSacredNotification(false)}
        verseName={currentVerseName}
      />
    </div>
  );
}
