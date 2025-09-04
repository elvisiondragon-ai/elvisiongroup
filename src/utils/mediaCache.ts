/**
 * Media caching utilities for testimonial videos and images
 */

// Simple in-memory cache for video/image URLs
const mediaCache = new Map<string, string>();

/**
 * Get cached media URL with proper cache headers
 * This leverages browser HTTP cache for media files
 */
export function getCachedMediaUrl(originalUrl: string): string {
  // Check if we already have a cached blob URL for this media
  if (mediaCache.has(originalUrl)) {
    return mediaCache.get(originalUrl)!;
  }

  // For first-time access, return original URL
  // Browser will cache it automatically with HTTP cache headers
  return originalUrl;
}

/**
 * Preload and cache media file
 * Downloads media and stores as blob URL for instant subsequent access
 */
export async function preloadAndCacheMedia(url: string): Promise<string> {
  try {
    // Check if already cached
    if (mediaCache.has(url)) {
      return mediaCache.get(url)!;
    }

    // Fetch media file
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    // Create blob from response
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    // Store in cache
    mediaCache.set(url, blobUrl);
    
    return blobUrl;
  } catch (error) {
    console.warn('Failed to preload media:', error);
    // Fallback to original URL
    return url;
  }
}

/**
 * Clear media cache
 * Useful for memory management
 */
export function clearMediaCache(): void {
  // Revoke all blob URLs to free memory
  mediaCache.forEach((blobUrl) => {
    if (blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
    }
  });
  
  mediaCache.clear();
}

/**
 * Get cache size for debugging
 */
export function getCacheSize(): number {
  return mediaCache.size;
}