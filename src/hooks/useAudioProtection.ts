import { useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AudioProtectionOptions {
  onUnexpectedStop?: () => void;
  onXPReset?: () => void;
}

export function useAudioProtection(options: AudioProtectionOptions = {}) {
  const lastUserAction = useRef<number>(0);
  const isUserInitiated = useRef<boolean>(false);
  const { toast } = useToast();

  // Mark that the next audio action is user-initiated
  const markUserAction = useCallback(() => {
    lastUserAction.current = Date.now();
    isUserInitiated.current = true;
  }, []);

  // Check if audio stop was user-initiated (within 1 second of user action)
  const isRecentUserAction = useCallback(() => {
    const timeSinceLastAction = Date.now() - lastUserAction.current;
    return timeSinceLastAction < 1000 && isUserInitiated.current;
  }, []);

  // Show protection dialog when audio stops unexpectedly
  const showProtectionDialog = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      // Create custom dialog
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 12px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      `;

      content.innerHTML = `
        <div style="margin-bottom: 16px; font-size: 18px; font-weight: bold; color: #1f2937;">
          🎵 Audio Terhenti
        </div>
        <div style="margin-bottom: 24px; color: #6b7280; line-height: 1.5;">
          Apakah Anda yakin untuk menghentikan musik?<br>
          <strong>XP akan diulang kembali jika dihentikan.</strong>
        </div>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="continue-btn" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
          ">
            Lanjutkan Musik
          </button>
          <button id="stop-btn" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
          ">
            Hentikan
          </button>
        </div>
      `;

      dialog.appendChild(content);
      document.body.appendChild(dialog);

      // Handle button clicks
      const continueBtn = content.querySelector('#continue-btn');
      const stopBtn = content.querySelector('#stop-btn');

      const cleanup = () => {
        document.body.removeChild(dialog);
      };

      continueBtn?.addEventListener('click', () => {
        cleanup();
        resolve(false); // Don't stop, continue playing
      });

      stopBtn?.addEventListener('click', () => {
        cleanup();
        options.onXPReset?.();
        resolve(true); // Stop audio and reset XP
      });

      // Auto-continue after 10 seconds
      setTimeout(() => {
        if (document.body.contains(dialog)) {
          cleanup();
          resolve(false);
        }
      }, 10000);
    });
  }, [options]);

  // Handle unexpected audio stop
  const handleAudioStop = useCallback(async (audio: HTMLAudioElement) => {
    // Reset user action flag
    isUserInitiated.current = false;

    // If it was a user action, allow the stop
    if (isRecentUserAction()) {
      return true;
    }

    // Check if audio ended naturally (completed)
    if (audio.ended) {
      return true;
    }

    // Check if audio was paused due to system interruption
    if (audio.paused && !audio.ended) {
      const shouldStop = await showProtectionDialog();
      
      if (!shouldStop) {
        // Try to resume playback
        try {
          await audio.play();
          toast({
            title: "Musik Dilanjutkan",
            description: "Audio telah dilanjutkan kembali",
            variant: "default",
          });
        } catch (error) {
          toast({
            title: "Gagal Melanjutkan",
            description: "Tidak dapat melanjutkan audio",
            variant: "destructive",
          });
        }
      }
      
      return shouldStop;
    }

    return true;
  }, [isRecentUserAction, showProtectionDialog, toast]);

  // Setup protection for an audio element
  const protectAudio = useCallback((audio: HTMLAudioElement) => {
    const handlePause = () => {
      // Small delay to check if this was user-initiated
      setTimeout(async () => {
        if (audio.paused && !audio.ended) {
          await handleAudioStop(audio);
        }
      }, 100);
    };

    const handleError = () => {
      toast({
        title: "Audio Error",
        description: "Terjadi kesalahan pada audio",
        variant: "destructive",
      });
    };

    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Return cleanup function
    return () => {
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [handleAudioStop, toast]);

  return {
    markUserAction,
    protectAudio,
    isRecentUserAction,
  };
}