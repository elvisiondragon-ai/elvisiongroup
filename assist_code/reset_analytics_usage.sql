-- Reset analytics usage for specific user
-- Run this in Supabase SQL editor

UPDATE profiles
SET analytics_used = 0,
    last_analytics_date = NULL
WHERE user_id = (
  SELECT id
  FROM auth.users
  WHERE email = 'elking.bali@gmail.com'
);

-- Verify the reset
SELECT
  u.email,
  p.analytics_used,
  p.last_analytics_date
FROM profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE u.email = 'elking.bali@gmail.com';