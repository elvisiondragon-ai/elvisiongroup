**Subject: Investigate Audio Interruption Issue (Even with Downloaded Content)**

Hi Team,

We're observing an issue where audio playback is being interrupted or "cut" even when the audio files are downloaded and cached in the browser. This is happening across various audio content.

Based on the current codebase, specifically `src/contexts/AuthContext.tsx`, `src/pages/AudioTherapy.tsx`, and `src/components/VerseAudioCard.tsx`, here are some potential areas that might be causing this:

1.  **Idle User Handler in `AuthContext.tsx`:**
    *   The `handleVisibilityChange` listener checks `(window as any).isAudioPlaying` to prevent marking the user as idle and pausing audio when the page is hidden.
    *   **Hypothesis:** There might be a scenario where `(window as any).isAudioPlaying` is not reliably `true` when audio is playing in the background, leading the idle handler to incorrectly pause or stop the audio.

2.  **Session Refresh/Realtime Channel Rebuild in `AuthContext.tsx`:**
    *   The `rebuildChatChannel` function is triggered on `auth state change` and `TOKEN_REFRESHED` events. This involves unsubscribing and resubscribing to real-time channels, and potentially refreshing the user session.
    *   **Hypothesis:** While primarily for chat, this process, or the `refreshSession` function, might be causing a brief interruption to the overall application state or a re-render that affects the audio player, even if the audio is locally cached.

3.  **`onWarning` Dialog in `VerseAudioCard.tsx`:**
    *   The `handlePlayClick` function explicitly calls `onWarning()` which, if confirmed, pauses the `currentVerseAudio`.
    *   **Hypothesis:** Could the warning dialog be triggered unexpectedly or under conditions where it shouldn't, leading to an intentional but unwanted audio pause?

4.  **`useEffect` Cleanup in `VerseAudioCard.tsx`:**
    *   The `useEffect` that monitors `isPlaying` and `currentVerseAudio` includes logic to set `setCurrentPlayingVerse(null)` and `setCurrentVerseAudio(null)` if the audio is paused or ended.
    *   **Hypothesis:** If this `useEffect` is re-running unexpectedly due to dependency changes or other component lifecycle events, it could be prematurely stopping the audio.

**Request:**
Please investigate these areas to identify the root cause of the audio interruptions. Pay close attention to console logs related to idle detection, session changes, and audio playback events.

Let me know what you find.

Thanks!