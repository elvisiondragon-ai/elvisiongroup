// Advanced Audio Protection Utilities

export class AudioProtection {
  // Mask blob URLs to make them harder to access
  static maskBlobUrl(blobUrl: string): string {
    return blobUrl.replace('blob:', 'protected://audio-stream/');
  }

  // Manual blob URL revocation (removed auto-revoke)
  static manualRevoke(blobUrl: string) {
    try {
      URL.revokeObjectURL(blobUrl);
      console.log('🔒 Blob URL manually revoked');
    } catch (error) {
      console.warn('Failed to revoke blob URL:', error);
    }
  }

  // Create a proxy audio element that hides the real source
  static createProxyAudio(realAudio: HTMLAudioElement): HTMLAudioElement {
    const proxy = new Proxy(realAudio, {
      get(target, prop) {
        if (prop === 'src' || prop === 'currentSrc') {
          return 'protected://audio-stream';
        }
        if (prop === 'duration' && target.duration) {
          // Slightly obfuscate duration to prevent easy identification
          return Math.floor(target.duration) + Math.random() * 0.5;
        }
        return target[prop as keyof HTMLAudioElement];
      },
      set(target, prop, value) {
        if (prop === 'src') {
          // Prevent external setting of src
          console.warn('🔒 Audio source modification blocked');
          return false;
        }
        (target as any)[prop] = value;
        return true;
      }
    });

    return proxy;
  }

  // Encrypt blob content (basic obfuscation)
  static obfuscateBlob(blob: Blob): Promise<Blob> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);

        // Simple XOR obfuscation (not real encryption, just makes it harder)
        const key = 0x7A; // Simple key
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] ^= key;
        }

        resolve(new Blob([bytes], { type: blob.type }));
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  // Deobfuscate blob content
  static deobfuscateBlob(obfuscatedBlob: Blob): Promise<Blob> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);

        // Reverse the XOR obfuscation
        const key = 0x7A; // Same key
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] ^= key;
        }

        resolve(new Blob([bytes], { type: 'audio/mpeg' }));
      };
      reader.readAsArrayBuffer(obfuscatedBlob);
    });
  }

  // Monitor for download attempts
  static monitorDownloadAttempts() {
    // Override fetch to detect blob URL access attempts
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0] as string;
      if (typeof url === 'string' && url.startsWith('blob:')) {
        console.warn('🔒 Detected blob URL access attempt:', url);
        // Could potentially block or redirect here
      }
      return originalFetch.apply(this, args);
    };

    // Monitor XMLHttpRequest for blob access
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
      const url = args[1] as string;
      if (typeof url === 'string' && url.startsWith('blob:')) {
        console.warn('🔒 Detected XHR blob access attempt:', url);
        // Could potentially block here
      }
      return originalOpen.apply(this, args);
    };
  }

  // Track blob URLs without auto-clearing
  static trackBlobUrls() {
    const originalCreateObjectURL = URL.createObjectURL;
    const blobUrls: string[] = [];

    URL.createObjectURL = function(object) {
      const url = originalCreateObjectURL.call(this, object);
      blobUrls.push(url);
      console.log('🔒 Blob URL created and tracked:', url);
      return url;
    };

    // Return function to manually clear all tracked URLs if needed
    return () => {
      blobUrls.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Failed to revoke blob URL:', error);
        }
      });
      blobUrls.length = 0;
      console.log('🔒 All tracked blob URLs cleared');
    };
  }
}