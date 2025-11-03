Title: Audio Interruption Root Cause and Fix Report

Summary
- Issue: Audio playback was being “cut” even when files were cached/offline.
- Root cause: VerseAudioCard cleared the current audio object whenever it observed audio.paused in a useEffect. On mobile/PWA, backgrounding temporarily pauses audio; this premature cleanup destroyed the active audio reference and appeared as a cut.
- Secondary risks: Idle/visibility recovery and realtime rebuilds could trigger page reloads while audio was playing, further interrupting playback.

What Changed
1) VerseAudioCard: Removed paused-based cleanup and made playback state event-driven
   - File: src/components/VerseAudioCard.tsx
   - Removed the effect that cleared audio on “paused or ended”.
   - Now, only explicit user actions (pause click), errors, or the natural ended event reset state.
   - Added audio element listeners: play/pause/ended/error update window.isAudioPlaying and navigator.mediaSession.playbackState, and emit a custom event audio-playback-state-change for other parts of the app.
   - On resume click while the current verse is selected and the element is paused (not ended), the code resumes the existing audio instead of destroying it.

2) AuthContext: Idle guard respects active playback and reloads are deferred
   - File: src/contexts/AuthContext.tsx
   - Added helpers: isAudioActive(), requestReload(reason), clearPendingReload().
     - isAudioActive checks window.isAudioPlaying OR Media Session playbackState.
     - requestReload defers window.location.reload() while audio is active and listens for audio-playback-state-change to perform the reload once playback stops (with a 2-minute safety timeout).
   - handleVisibilityChange now logs {hidden, isAudioPlaying, mediaSessionState} and skips marking idle if audio is active; this avoids heavy reconnect/rebuild paths while audio is actually playing in background.
   - Replaced direct window.location.reload() calls in recovery paths with requestReload(...), so forced reloads never interrupt ongoing audio.
   - Added cleanup to remove any pending reload listeners on unmount.

Why This Solves the Problem
- Background pauses are normal on mobile/PWA; previously, any paused state led to clearing the audio reference, which felt like a cut. Now we only clear on user intent (pause), ended, or error, and we resume if the element is merely paused.
- Idle detection now uses real playback signals (MediaSession + audio events), preventing false “idle” during background playback. This avoids unnecessary realtime rebuilds or session churn during active listening.
- Any last-resort reloads are postponed until playback ends, eliminating forced interruptions mid-track.

Verification Plan
- Start a cached verse, background the app for 30–60s, then return. Expect audio to resume or remain resumable without state loss.
- Repeat while streaming (uncached) to verify identical behavior.
- While audio is playing, trigger conditions that previously caused reloads (e.g., network blips/realtime errors) and confirm reload defers until playback stops.

Touched Files
- src/components/VerseAudioCard.tsx
- src/contexts/AuthContext.tsx

Notes
- Diagnostics remain lightweight: [AudioDebug] logs on audio state changes and [IdleDebug] logs on visibility changes to help QA confirm correct behavior.
