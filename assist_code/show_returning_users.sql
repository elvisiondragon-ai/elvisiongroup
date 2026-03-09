-- Show the 4 returning users to see the tracking in action
SELECT
    user_email,
    created_at::date as signup_date,
    last_login_date as last_login,
    (last_login_date - created_at::date) as days_since_signup,
    streak_days,
    'Login tracking working ✅' as status
FROM profiles
WHERE last_login_date > created_at::date
AND created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY last_login_date DESC;