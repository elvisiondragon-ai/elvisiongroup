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
      .from('audio-files')
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
      
      setCachedFiles(prev => { const s = new Set(prev); s.add(fileName); return s; });
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