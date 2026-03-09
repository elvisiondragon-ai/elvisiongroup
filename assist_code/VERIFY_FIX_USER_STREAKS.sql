-- VERIFY AND FIX USER STREAKS
-- Find users who should have streaks but don't have proper streak_days count

-- 1. ANALYZE CURRENT STREAK STATUS
SELECT 
    user_id,
    display_name,
    streak_days,
    last_login_date,
    created_at,
    CASE 
        WHEN last_login_date = CURRENT_DATE THEN '🟢 ACTIVE TODAY'
        WHEN last_login_date = CURRENT_DATE - INTERVAL '1 day' THEN '🟡 ACTIVE YESTERDAY' 
        WHEN last_login_date < CURRENT_DATE - INTERVAL '1 day' THEN '🔴 STREAK BROKEN'
        ELSE '⚪ NO LOGIN DATE'
    END as login_status
FROM profiles 
ORDER BY streak_days DESC, last_login_date DESC
LIMIT 20;

-- 2. FIND USERS WITH ACTIVITY BUT NO PROPER STREAK
-- Check user_activities table for consecutive daily activity
WITH daily_activity AS (
    SELECT 
        user_id,
        DATE(created_at) as activity_date,
        COUNT(*) as activities_count
    FROM user_activities 
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id, DATE(created_at)
),
consecutive_days AS (
    SELECT 
        user_id,
        COUNT(DISTINCT activity_date) as active_days,
        MAX(activity_date) as last_active_date,
        MIN(activity_date) as first_active_date
    FROM daily_activity
    GROUP BY user_id
)
SELECT 
    cd.user_id,
    p.display_name,
    cd.active_days as calculated_streak,
    p.streak_days as current_streak,
    cd.last_active_date,
    CASE 
        WHEN cd.active_days > p.streak_days THEN '⬆️ STREAK UNDERCOUNT'
        WHEN cd.active_days < p.streak_days THEN '⬇️ STREAK OVERCOUNT'
        WHEN cd.active_days = p.streak_days THEN '✅ STREAK CORRECT'
        ELSE '❓ UNKNOWN'
    END as streak_status,
    (cd.active_days - p.streak_days) as difference
FROM consecutive_days cd
LEFT JOIN profiles p ON cd.user_id = p.user_id
WHERE cd.active_days != p.streak_days OR p.streak_days IS NULL
ORDER BY difference DESC;

-- 3. CHECK SPECIFIC ACTIVITY PATTERNS
-- Users who have been active recently but have low streak_days
SELECT 
    p.user_id,
    p.display_name,
    p.streak_days,
    COUNT(DISTINCT DATE(ua.created_at)) as recent_active_days,
    MAX(DATE(ua.created_at)) as last_activity_date
FROM profiles p
LEFT JOIN user_activities ua ON p.user_id = ua.user_id 
    AND ua.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY p.user_id, p.display_name, p.streak_days
HAVING COUNT(DISTINCT DATE(ua.created_at)) > p.streak_days
ORDER BY (COUNT(DISTINCT DATE(ua.created_at)) - p.streak_days) DESC;

-- 4. FIX STREAK COUNTS - UPDATE USERS WHO DESERVE HIGHER STREAKS
-- This query identifies users to update (RUN THIS CAREFULLY)
WITH streak_calculation AS (
    SELECT 
        user_id,
        COUNT(DISTINCT DATE(created_at)) as calculated_streak_days
    FROM user_activities 
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
)
SELECT 
    'UPDATE profiles SET streak_days = ' || sc.calculated_streak_days || 
    ' WHERE user_id = ''' || sc.user_id || ''';' as update_statement,
    p.display_name,
    p.streak_days as old_streak,
    sc.calculated_streak_days as new_streak,
    (sc.calculated_streak_days - p.streak_days) as streak_increase
FROM streak_calculation sc
LEFT JOIN profiles p ON sc.user_id = p.user_id
WHERE sc.calculated_streak_days > p.streak_days
ORDER BY streak_increase DESC;

-- 5. ACTUAL UPDATE COMMANDS TO FIX STREAKS
-- Copy and run these individual UPDATE statements:

-- Example UPDATE statements (generated from query #4):
-- UPDATE profiles SET streak_days = 7 WHERE user_id = 'user-id-here';
-- UPDATE profiles SET streak_days = 14 WHERE user_id = 'another-user-id';

-- 6. BULK UPDATE OPTION - AUTOMATIC STREAK CORRECTION
-- Run this to automatically fix all undercount streaks:
UPDATE profiles 
SET streak_days = (
    SELECT COUNT(DISTINCT DATE(ua.created_at))
    FROM user_activities ua 
    WHERE ua.user_id = profiles.user_id 
    AND ua.created_at >= CURRENT_DATE - INTERVAL '30 days'
),
updated_at = NOW()
WHERE user_id IN (
    SELECT p.user_id
    FROM profiles p
    LEFT JOIN (
        SELECT 
            user_id,
            COUNT(DISTINCT DATE(created_at)) as calculated_streak
        FROM user_activities 
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY user_id
    ) calc ON p.user_id = calc.user_id
    WHERE calc.calculated_streak > p.streak_days
);

-- 7. VERIFICATION QUERY AFTER FIXES
SELECT 
    COUNT(*) as total_users,
    ROUND(AVG(streak_days), 2) as avg_streak,
    MAX(streak_days) as max_streak,
    COUNT(CASE WHEN streak_days > 0 THEN 1 END) as users_with_streaks,
    COUNT(CASE WHEN streak_days >= 7 THEN 1 END) as users_week_streak,
    COUNT(CASE WHEN streak_days >= 30 THEN 1 END) as users_month_streak
FROM profiles;

-- 8. TOP STREAK USERS AFTER FIX
SELECT 
    user_id,
    display_name,
    streak_days,
    last_login_date,
    '🔥' as streak_emoji
FROM profiles 
WHERE streak_days > 0
ORDER BY streak_days DESC, last_login_date DESC
LIMIT 20;

-- 9. USERS WHO GOT STREAK INCREASES
SELECT 
    p.user_id,
    p.display_name,
    p.streak_days as current_streak,
    COUNT(DISTINCT DATE(ua.created_at)) as activity_based_streak,
    p.updated_at as last_updated
FROM profiles p
LEFT JOIN user_activities ua ON p.user_id = ua.user_id 
    AND ua.created_at >= CURRENT_DATE - INTERVAL '30 days'
WHERE p.updated_at >= CURRENT_DATE - INTERVAL '1 hour'  -- Recently updated
GROUP BY p.user_id, p.display_name, p.streak_days, p.updated_at
ORDER BY p.streak_days DESC;