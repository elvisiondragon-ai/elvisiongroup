-- VERSE 4 TOKEN SYSTEM FIX SUMMARY
-- Changes made to move token counting from completion to play button click

-- PROBLEM:
-- verse4_used was incremented when audio completed (ended event)
-- User wanted: increment when play button clicked, not when paused

-- SOLUTION IMPLEMENTED:
-- 1. Moved onVerse4Usage() call from 'ended' event to handlePlayClick() function
-- 2. Added early return if user exceeded free limit and not pro
-- 3. Ensured pause button (same button when playing) doesn't increment counter

-- TECHNICAL CHANGES:
-- File: /src/components/VerseAudioCard.tsx
-- Function: handlePlayClick() around line 65-160
-- 
-- BEFORE:
-- - Click play → audio starts → audio ends → increment verse4_used
-- 
-- AFTER: 
-- - Click play → increment verse4_used → audio starts (if allowed)
-- - Click pause → just pause audio (no increment)

-- VERIFICATION SQL:
-- Run this to verify the token counting works properly after the fix

-- Check current verse4_used counts
SELECT 
    verse4_used,
    COUNT(*) as user_count
FROM profiles 
WHERE verse4_used IS NOT NULL
GROUP BY verse4_used
ORDER BY verse4_used;

-- Test scenario check:
-- After fix, verse4_used should increment when:
-- 1. User clicks play button for verse 4 (first time) → count = 1
-- 2. User clicks play button for verse 4 (second time) → count = 2  
-- 3. User clicks play button for verse 4 (third time) → count = 3
-- 4. User clicks play button for verse 4 (fourth time) → blocked (unless pro)

-- Pause button should NOT increment the counter
-- Only PLAY button clicks should increment

-- Monitor with:
SELECT 
    user_id,
    verse4_used,
    updated_at
FROM profiles 
WHERE verse4_used > 0
ORDER BY updated_at DESC
LIMIT 5;