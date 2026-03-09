-- Test analytics tracking in database
-- Run these in Supabase SQL editor while logged in

-- 1. Check if columns exist and current values
SELECT
  user_id,
  analytics_used,
  last_analytics_date,
  created_at
FROM profiles
WHERE analytics_used IS NOT NULL
   OR last_analytics_date IS NOT NULL
LIMIT 10;

-- 2. Check your specific user (replace with your actual user_id)
-- SELECT
--   user_id,
--   analytics_used,
--   last_analytics_date,
--   created_at
-- FROM profiles
-- WHERE user_id = 'your-user-id-here';

-- 3. Test manual increment (replace with your user_id)
-- UPDATE profiles
-- SET analytics_used = 1,
--     last_analytics_date = CURRENT_DATE
-- WHERE user_id = 'your-user-id-here';

-- 4. Test month logic
SELECT
  CURRENT_DATE as today,
  DATE_TRUNC('month', CURRENT_DATE) as current_month,
  TO_CHAR(CURRENT_DATE, 'YYYY-MM') as current_month_string;

-- 5. Check all profiles with analytics data
SELECT COUNT(*) as profiles_with_analytics
FROM profiles
WHERE analytics_used > 0 OR last_analytics_date IS NOT NULL;