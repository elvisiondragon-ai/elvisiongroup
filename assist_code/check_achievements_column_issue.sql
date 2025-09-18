-- ===========================================
-- CHECK ACHIEVEMENTS COLUMN ISSUE
-- ===========================================

-- 1. Check what's in achievements column
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    'achievements content' as check_type
FROM profiles
WHERE achievements IS NOT NULL
AND array_length(achievements, 1) > 0
LIMIT 10;

-- 2. Find profiles with pro-related achievements
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    'has pro in achievements' as issue
FROM profiles
WHERE achievements::text ILIKE '%pro%'
OR achievements::text ILIKE '%badge%';

-- 3. Check how achievements are being set
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_definition ILIKE '%achievements%'
AND routine_definition ILIKE '%pro%';

-- 4. Check current pro badge logic in functions
SELECT
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_name LIKE '%pro%badge%'
OR routine_definition ILIKE '%pro_badge%';