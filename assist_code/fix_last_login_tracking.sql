-- STEP 1: Check current last_login_date status
SELECT
    COUNT(*) as total_users,
    COUNT(last_login_date) as users_with_login_date,
    COUNT(*) - COUNT(last_login_date) as users_without_login_date
FROM profiles;

-- STEP 2: Safely set last_login_date to today for recent users (created in last 30 days)
-- This assumes they logged in recently since they're new users
UPDATE profiles
SET
    last_login_date = CURRENT_DATE,
    updated_at = now()
WHERE last_login_date IS NULL
AND created_at >= CURRENT_DATE - INTERVAL '30 days';

-- STEP 3: For older users without login date, set to their created_at date
-- This is a conservative estimate
UPDATE profiles
SET
    last_login_date = created_at::date,
    updated_at = now()
WHERE last_login_date IS NULL
AND created_at < CURRENT_DATE - INTERVAL '30 days';

-- STEP 4: Verify the fix
SELECT
    COUNT(*) as total_users,
    COUNT(last_login_date) as users_with_login_date,
    COUNT(*) - COUNT(last_login_date) as remaining_null_login_dates
FROM profiles;

-- STEP 5: Check the handle_daily_login function exists and works
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_daily_login'
AND routine_schema = 'public';