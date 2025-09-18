-- Check recent login activity (should show today's date for recent logins)
SELECT
    user_email,
    last_login_date,
    streak_days,
    created_at,
    CASE
        WHEN last_login_date = CURRENT_DATE THEN 'Logged in today ✅'
        WHEN last_login_date = CURRENT_DATE - 1 THEN 'Logged in yesterday'
        WHEN last_login_date IS NULL THEN 'Never logged in'
        ELSE 'Logged in ' || (CURRENT_DATE - last_login_date) || ' days ago'
    END as login_status
FROM profiles
ORDER BY last_login_date DESC NULLS LAST
LIMIT 10;

-- Test the function manually (replace with actual user ID)
-- SELECT handle_daily_login('your-user-id-here');