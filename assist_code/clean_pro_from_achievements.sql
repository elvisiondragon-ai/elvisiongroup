-- ===========================================
-- CLEAN PRO BADGES FROM ACHIEVEMENTS COLUMN
-- ===========================================

-- 1. Check current achievements with pro badges
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    'Before cleanup' as status
FROM profiles
WHERE achievements::text ILIKE '%pro%'
OR achievements::text ILIKE '%badge%'
LIMIT 5;

-- 2. Remove pro-related achievements from all profiles
-- Keep only level-based achievements, remove pro badges
UPDATE profiles
SET achievements = array(
    SELECT unnest(achievements)
    WHERE unnest(achievements) NOT ILIKE '%pro%'
    AND unnest(achievements) NOT ILIKE '%badge%'
)
WHERE achievements IS NOT NULL
AND (
    achievements::text ILIKE '%pro%'
    OR achievements::text ILIKE '%badge%'
);

-- 3. Verify cleanup - should have no pro-related achievements
SELECT
    COUNT(*) as profiles_with_pro_achievements,
    'After cleanup (should be 0)' as status
FROM profiles
WHERE achievements::text ILIKE '%pro%'
OR achievements::text ILIKE '%badge%';

-- 4. Check what achievements remain (should only be level-based)
SELECT
    achievements,
    COUNT(*) as count
FROM profiles
WHERE achievements IS NOT NULL
AND array_length(achievements, 1) > 0
GROUP BY achievements
ORDER BY count DESC;