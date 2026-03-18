/**
 * IndexedDB-based persistent cache for iOS
 * Provides better cache persistence than memory-based caching
 */

interface CachedAudio {
  id: string;
  blob: Blob;
  timestamp: number;
  url: string;
}

class IndexedDBCache {
  private dbName = 'ElVisionAudioCache';
  private version = 1;
  private storeName = 'audioFiles';

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Store audio blob in IndexedDB
   */
  async store(id: string, blob: Blob, url: string): Promise<void> {
    try {
      const db = await this.init();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const cachedAudio: CachedAudio = {
        id,
        blob,
        timestamp: Date.now(),
        url
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(cachedAudio);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('✅ Audio stored in IndexedDB:', id);
    } catch (error) {
      console.error('❌ Failed to store in IndexedDB:', error);
    }
  }

  /**
   * Retrieve audio blob from IndexedDB
   */
  async get(id: string): Promise<Blob | null> {
    try {
      const db = await this.init();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      return new Promise<Blob | null>((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = () => {
          const result = request.result as CachedAudio;
          if (result && this.isValid(result)) {
            console.log('✅ Audio retrieved from IndexedDB:', id);
            resolve(result.blob);
          } else {
            console.log('❌ Audio not found or expired in IndexedDB:', id);
            resolve(null);
          }
        };
        
        request.onerror = () => {
          console.error('❌ Error retrieving from IndexedDB:', request.error);
          resolve(null);
        };
      });
    } catch (error) {
      console.error('❌ Failed to retrieve from IndexedDB:', error);
      return null;
    }
  }

  /**
   * Check if cached item is still valid (30 days)
   */
  private isValid(cachedAudio: CachedAudio): boolean {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    return Date.now() - cachedAudio.timestamp < thirtyDaysInMs;
  }

  /**
   * Clear expired entries
   */
  async cleanup(): Promise<void> {
    try {
      const db = await this.init();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');

      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const range = IDBKeyRange.upperBound(thirtyDaysAgo);

      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      console.log('✅ IndexedDB cleanup completed');
    } catch (error) {
      console.error('❌ Failed to cleanup IndexedDB:', error);
    }
  }

  /**
   * Clear all cached audio
   */
  async clear(): Promise<void> {
    try {
      const db = await this.init();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('✅ IndexedDB cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear IndexedDB:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{ count: number; totalSize: number }> {
    try {
      const db = await this.init();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          const results = request.result as CachedAudio[];
          const validResults = results.filter(item => this.isValid(item));
          
          const totalSize = validResults.reduce((total, item) => total + item.blob.size, 0);
          
          resolve({
            count: validResults.length,
            totalSize
          });
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Failed to get IndexedDB stats:', error);
      return { count: 0, totalSize: 0 };
    }
  }

  /**
   * Generate cache key from URL
   */
  generateCacheKey(url: string): string {
    // Extract filename from URL and use as key
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1] || url;
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
}

// Singleton instance
export const indexedDBCache = new IndexedDBCache();

// Auto cleanup on initialization (browser only)
if (typeof window !== 'undefined') {
  indexedDBCache.cleanup().catch(console.error);
}