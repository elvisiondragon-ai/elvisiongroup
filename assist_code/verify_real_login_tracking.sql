-- Check if login tracking is working by looking at login dates vs created dates
SELECT
    user_email,
    created_at,
    last_login_date,
    CASE
        WHEN last_login_date IS NULL THEN 'Never logged in since tracking started'
        WHEN last_login_date::date = created_at::date THEN 'Login = Signup (new user)'
        WHEN last_login_date > created_at::date THEN 'Logged in after signup ✅ (tracking working)'
        ELSE 'Old data'
    END as login_tracking_status,
    (last_login_date::date - created_at::date) as days_between_signup_and_last_login
FROM profiles
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Check specifically for returning users (login_date > signup_date)
SELECT
    COUNT(*) as returning_users_count
FROM profiles
WHERE last_login_date > created_at::date
AND created_at >= CURRENT_DATE - INTERVAL '7 days';