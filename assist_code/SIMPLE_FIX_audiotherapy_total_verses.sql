-- SIMPLE FIX: Add total_verses increment to AudioTherapy completion
-- Following rule.txt: MOST SIMPLE SOLUTION + verification

-- FRONTEND FIX NEEDED:
-- File: /src/components/VerseAudioCard.tsx
-- Line: 132 (after awardXP call)
--
-- ADD THIS SIMPLE CODE AFTER LINE 132:
--
-- // Update total_verses counter
-- const updateTotalVerses = async () => {
--   const { data: { user } } = await supabase.auth.getUser();
--   if (user) {
--     const { error } = await supabase
--       .from('profiles')
--       .update({ 
--         total_verses: COALESCE(total_verses, 0) + 1,
--         updated_at: now()
--       })
--       .eq('user_id', user.id);
--     if (error) console.error('Error updating total_verses:', error);
--   }
-- };
-- updateTotalVerses();

-- VERIFICATION SQL: Check if total_verses increments work
-- Run BEFORE fix to see current state
SELECT 
    'BEFORE FIX - Current state' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN total_verses IS NOT NULL THEN 1 END) as profiles_with_verses,
    SUM(COALESCE(total_verses, 0)) as total_verses_sum,
    AVG(COALESCE(total_verses, 0)) as avg_verses_per_user
FROM profiles;

-- Show top users by total_verses (current)
SELECT 
    'TOP USERS - Current total_verses' as info,
    display_name,
    total_verses,
    verse4_used,
    level
FROM profiles
WHERE total_verses IS NOT NULL AND total_verses > 0
ORDER BY total_verses DESC
LIMIT 5;

-- AFTER IMPLEMENTING FIX - Run this to verify increments work
-- (Wait until some users complete audio verses)
SELECT 
    'AFTER FIX - Verification' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN total_verses IS NOT NULL THEN 1 END) as profiles_with_verses,
    SUM(COALESCE(total_verses, 0)) as total_verses_sum,
    AVG(COALESCE(total_verses, 0)) as avg_verses_per_user,
    MAX(total_verses) as highest_verse_count
FROM profiles;

-- Check recent profile updates (should show total_verses increments)
SELECT 
    'RECENT UPDATES - After fix' as info,
    display_name,
    total_verses,
    updated_at
FROM profiles
WHERE updated_at > NOW() - INTERVAL '1 hour'
  AND total_verses IS NOT NULL
ORDER BY updated_at DESC
LIMIT 10;