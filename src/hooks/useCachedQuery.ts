import { useState, useEffect, useCallback } from 'react';
import { cacheManager, CacheKeys } from '@/utils/cacheManager';

interface UseCachedQueryOptions<T> {
  queryKey: string;
  queryFn: () => Promise<T>;
  cacheType?: 'xp' | 'level' | 'activeSubscription' | 'expiredSubscription' | 'profilePictures' | 'audioFiles' | 'audioUrls' | 'trackMetadata' | 'userProgress' | 'default';
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useCachedQuery<T>({
  queryKey,
  queryFn,
  cacheType = 'default',
  enabled = true,
  onSuccess,
  onError,
}: UseCachedQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (useCache = true) => {
    if (!enabled) return;

    // Try cache first
    if (useCache) {
      const cachedData = cacheManager.get<T>(queryKey);
      if (cachedData !== null) {
        cacheManager.trackHit();
        setData(cachedData);
        onSuccess?.(cachedData);
        return;
      }
    }

    cacheManager.trackMiss();
    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      
      // Smart caching based on data type
      if (cacheType === 'activeSubscription' && typeof result === 'object' && result !== null) {
        const isActive = (result as any).subscribed || (result as any).is_pro || false;
        cacheManager.setSubscription(queryKey, result, isActive);
      } else {
        cacheManager.set(queryKey, result, cacheType);
      }
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [queryKey, queryFn, cacheType, enabled, onSuccess, onError]);

  // Force refresh (bypass cache)
  const refetch = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  // Invalidate cache and refetch
  const invalidate = useCallback(() => {
    cacheManager.clear(queryKey);
    return fetchData(false);
  }, [queryKey, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
  };
}

// Specialized hooks for different data types
export function useCachedUserProfile(userId: string) {
  return useCachedQuery({
    queryKey: CacheKeys.userProfile(userId),
    queryFn: async () => {
      // Implementation would depend on your actual API
      throw new Error('Not implemented');
    },
    cacheType: 'profilePictures',
  });
}

export function useCachedSubscription(userId: string) {
  return useCachedQuery({
    queryKey: CacheKeys.userSubscription(userId),
    queryFn: async () => {
      // Implementation would depend on your actual API
      throw new Error('Not implemented');
    },
    cacheType: 'activeSubscription', // Will be determined dynamically
  });
}

export function useCachedAudioFile(fileName: string) {
  return useCachedQuery({
    queryKey: CacheKeys.audioFile(fileName),
    queryFn: async () => {
      // Implementation would depend on your actual API
      throw new Error('Not implemented');
    },
    cacheType: 'audioFiles',
  });
}