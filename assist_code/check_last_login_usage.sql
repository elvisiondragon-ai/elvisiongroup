-- Check current last_login_date status
SELECT
    COUNT(*) as total_users,
    COUNT(last_login_date) as users_with_login_date,
    COUNT(*) - COUNT(last_login_date) as users_without_login_date,
    ROUND((COUNT(last_login_date) * 100.0 / COUNT(*)), 2) as login_date_fill_rate
FROM profiles;

-- Check recent users who should have login dates
SELECT
    id,
    user_id,
    user_email,
    display_name,
    last_login_date,
    created_at,
    updated_at
FROM profiles
WHERE last_login_date IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Check users who DO have login dates (to see the pattern)
SELECT
    id,
    user_email,
    last_login_date,
    created_at
FROM profiles
WHERE last_login_date IS NOT NULL
ORDER BY last_login_date DESC
LIMIT 5;