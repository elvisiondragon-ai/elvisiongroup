import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CachedAudio {
  url: string;
  blob: Blob;
  title: string;
  cachedAt: number;
}

export function useOfflineAudio() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedAudios, setCachedAudios] = useState<string[]>([]);
  const { toast } = useToast();

  // Check if audio is cached
  const isAudioCached = useCallback(async (url: string): Promise<boolean> => {
    try {
      const cache = await caches.open('audio-cache-v1');
      const response = await cache.match(url);
      return !!response;
    } catch (error) {
      console.error('Error checking cache:', error);
      return false;
    }
  }, []);

  // Download and cache audio for offline use
  const cacheAudio = useCallback(async (url: string, title: string): Promise<boolean> => {
    if (!url) return false;
    
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Check if already cached
      if (await isAudioCached(url)) {
        toast({
          title: "Already Downloaded",
          description: `${title} is already available offline`,
          variant: "default",
        });
        setIsDownloading(false);
        return true;
      }

      // Download with progress tracking
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');

      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength || '0', 10);
      let loaded = 0;

      const reader = response.body?.getReader();
      const chunks = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          loaded += value.length;
          
          if (total > 0) {
            setDownloadProgress((loaded / total) * 100);
          }
        }
      }

      // Create blob and cache
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const cache = await caches.open('audio-cache-v1');
      const cachedResponse = new Response(blob, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': blob.size.toString(),
        }
      });

      await cache.put(url, cachedResponse);

      // Store metadata in localStorage
      const metadata = JSON.stringify({
        url,
        title,
        cachedAt: Date.now(),
        size: blob.size
      });
      localStorage.setItem(`audio_meta_${btoa(url)}`, metadata);

      setCachedAudios(prev => [...prev, url]);
      
      toast({
        title: "Download Complete",
        description: `${title} is now available offline`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error caching audio:', error);
      toast({
        title: "Download Failed",
        description: "Could not download audio for offline use",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [isAudioCached, toast]);

  // Get cached audio URL
  const getCachedAudioUrl = useCallback(async (originalUrl: string): Promise<string> => {
    try {
      const cache = await caches.open('audio-cache-v1');
      const response = await cache.match(originalUrl);
      
      if (response) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('Error getting cached audio:', error);
    }
    
    return originalUrl; // Fallback to original URL
  }, []);

  // Clear audio cache
  const clearAudioCache = useCallback(async () => {
    try {
      await caches.delete('audio-cache-v1');
      setCachedAudios([]);
      
      // Clear metadata from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('audio_meta_')) {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: "Cache Cleared",
        description: "All offline audio files have been removed",
        variant: "default",
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [toast]);

  // Load cached audio list on mount
  useEffect(() => {
    const loadCachedList = async () => {
      try {
        const cache = await caches.open('audio-cache-v1');
        const keys = await cache.keys();
        const urls = keys.map(request => request.url);
        setCachedAudios(urls);
      } catch (error) {
        console.error('Error loading cached list:', error);
      }
    };

    loadCachedList();
  }, []);

  return {
    isDownloading,
    downloadProgress,
    cachedAudios,
    isAudioCached,
    cacheAudio,
    getCachedAudioUrl,
    clearAudioCache,
  };
}