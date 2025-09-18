-- ===========================================
-- REMOVE ADMIN FROM ACHIEVEMENTS ARRAY
-- ===========================================

-- 1. Check current admin achievements
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    'Before cleanup' as status
FROM profiles
WHERE achievements::text ILIKE '%admin%';

-- 2. Remove 'admin' from achievements arrays
UPDATE profiles
SET achievements = (
    SELECT ARRAY(
        SELECT element
        FROM unnest(achievements) AS element
        WHERE element != 'admin'
    )
)
WHERE achievements::text ILIKE '%admin%';

-- 3. Verify admin removed from achievements
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    'After cleanup' as status
FROM profiles
WHERE user_email IN ('dragon9@yahoo.com', 'dragon@yahoo.com');