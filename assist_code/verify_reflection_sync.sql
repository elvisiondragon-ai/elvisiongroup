-- Verify that reflections are properly syncing with profiles table
-- Run this to ensure everything is working correctly

-- 1. Check total reflections in the system
SELECT COUNT(*) as total_reflections FROM reflections;

-- 2. Check reflections by user (top 10 most active)
SELECT
    user_id,
    COUNT(*) as reflection_count,
    MAX(created_at) as last_reflection
FROM reflections
GROUP BY user_id
ORDER BY reflection_count DESC
LIMIT 10;

-- 3. Check if profiles.total_journal matches actual reflections count
SELECT
    p.user_id,
    p.total_journal as profile_count,
    COALESCE(r.actual_count, 0) as actual_reflection_count,
    CASE
        WHEN p.total_journal = COALESCE(r.actual_count, 0) THEN '✅ Match'
        ELSE '❌ Mismatch'
    END as sync_status
FROM profiles p
LEFT JOIN (
    SELECT user_id, COUNT(*) as actual_count
    FROM reflections
    GROUP BY user_id
) r ON p.user_id = r.user_id
WHERE p.total_journal > 0 OR r.actual_count > 0
ORDER BY actual_reflection_count DESC
LIMIT 20;

-- 4. Fix any mismatched counts (run this if you see mismatches above)
/*
UPDATE profiles
SET total_journal = COALESCE((
    SELECT COUNT(*)
    FROM reflections
    WHERE reflections.user_id = profiles.user_id
), 0);
*/

-- 5. Check recent reflections to verify they're being saved
SELECT
    user_id,
    question,
    LEFT(reflection, 50) as reflection_preview,
    created_at
FROM reflections
ORDER BY created_at DESC
LIMIT 10;

-- 6. Clean up any test records if needed
DELETE FROM reflections WHERE question LIKE 'Test question%';