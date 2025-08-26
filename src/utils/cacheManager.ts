/**
 * Comprehensive Caching System for 70-90% API Call Reduction
 * Smart caching with different strategies per data type
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface CacheConfig {
  // EXP System - Realtime (no cache)
  xp: number;
  level: number;
  
  // Subscription Status - Smart Realtime
  activeSubscription: number; // Real-time for active
  expiredSubscription: number; // 12 hours for expired
  
  // Profile Pictures - 12 Hour Cache
  profilePictures: number; // 12 hours
  
  // Audio System - Aggressive Caching
  audioFiles: number; // 30 days
  audioUrls: number; // 30 days
  trackMetadata: number; // 6 hours
  userProgress: number; // Real-time
  
  // General API responses
  default: number; // 5 minutes default
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig = {
    xp: 0,
    level: 0,
    activeSubscription: 0,
    expiredSubscription: 12 * 60 * 60 * 1000,
    profilePictures: 12 * 60 * 60 * 1000,
    audioFiles: 30 * 24 * 60 * 60 * 1000,
    audioUrls: 30 * 24 * 60 * 60 * 1000,
    trackMetadata: 6 * 60 * 60 * 1000,
    userProgress: 0,
    default: 5 * 60 * 1000,
  };

  /**
   * Get cached data if valid, otherwise return null
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const now = Date.now();
    if (now > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * Set cache data with appropriate TTL based on data type
   */
  set<T>(key: string, data: T, cacheType?: keyof CacheConfig): void {
    const ttl = cacheType ? this.config[cacheType] : this.config.default;
    
    // Skip caching for real-time data (TTL = 0)
    if (ttl === 0) return;
    
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl,
    });
  }

  /**
   * Smart subscription caching based on status
   */
  setSubscription<T>(key: string, data: T, isActive: boolean): void {
    const cacheType = isActive ? 'activeSubscription' : 'expiredSubscription';
    this.set(key, data, cacheType);
  }

  /**
   * Clear cache for specific key or pattern
   */
  clear(keyOrPattern: string): void {
    if (keyOrPattern.includes('*')) {
      const pattern = keyOrPattern.replace('*', '');
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.includes(pattern)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.delete(keyOrPattern);
    }
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    const totalItems = this.cache.size;
    const expiredItems = Array.from(this.cache.entries()).filter(
      ([, item]) => now > item.expiry
    ).length;
    
    return {
      totalItems,
      activeItems: totalItems - expiredItems,
      expiredItems,
      hitRate: this.getHitRate(),
    };
  }

  private hitRate = { hits: 0, misses: 0 };

  private getHitRate(): number {
    const total = this.hitRate.hits + this.hitRate.misses;
    return total === 0 ? 0 : (this.hitRate.hits / total) * 100;
  }

  /**
   * Track cache hit
   */
  trackHit(): void {
    this.hitRate.hits++;
  }

  /**
   * Track cache miss
   */
  trackMiss(): void {
    this.hitRate.misses++;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const expiredKeys = Array.from(this.cache.entries())
      .filter(([, item]) => now > item.expiry)
      .map(([key]) => key);
    
    expiredKeys.forEach(key => this.cache.delete(key));
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Auto cleanup every 5 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000);

// Cache key generators
export const CacheKeys = {
  // User data
  userProfile: (userId: string) => `user:profile:${userId}`,
  userXP: (userId: string) => `user:xp:${userId}`,
  userLevel: (userId: string) => `user:level:${userId}`,
  
  // Subscription data
  userSubscription: (userId: string) => `user:subscription:${userId}`,
  proStatus: (userId: string) => `user:pro:${userId}`,
  
  // Audio data
  audioFile: (fileName: string) => `audio:file:${fileName}`,
  audioUrl: (fileName: string) => `audio:url:${fileName}`,
  trackMetadata: (trackId: string) => `audio:metadata:${trackId}`,
  userAudioProgress: (userId: string, trackId: string) => `user:audio:${userId}:${trackId}`,
  
  // Profile pictures
  profilePicture: (userId: string) => `profile:picture:${userId}`,
  
  // Chat data (no caching - real-time)
  chatMessages: (channelId: string) => `chat:messages:${channelId}`,
  
  // Leaderboard
  leaderboard: () => `leaderboard:global`,
};

export default cacheManager;