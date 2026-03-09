-- ===========================================
-- VERIFY ADMIN REMOVAL FROM ACHIEVEMENTS
-- ===========================================

-- 1. Verify no achievements contain 'admin' anymore
SELECT
    COUNT(*) as profiles_with_admin_achievement,
    'Should be 0' as expected_result
FROM profiles
WHERE achievements::text ILIKE '%admin%';

-- 2. Check what achievements remain (should only be level-based)
SELECT
    achievements,
    COUNT(*) as count
FROM profiles
WHERE achievements IS NOT NULL
AND array_length(achievements, 1) > 0
GROUP BY achievements
ORDER BY count DESC;

-- 3. Verify specific admin users no longer have admin in achievements
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    'Admin users cleaned' as status
FROM profiles
WHERE user_email IN ('dragon9@yahoo.com', 'dragon@yahoo.com');