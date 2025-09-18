-- ===========================================
-- FIX TRIAL01 EMAIL TO USE REAL GMAIL
-- ===========================================

-- Update profile email from trial01@yahoo.com to real gmail armadijambi98@gmail.com
UPDATE profiles
SET user_email = 'armadijambi98@gmail.com'
WHERE user_id = 'ed675b6c-0cd8-4475-aecc-74b921c68b35'
AND user_email = 'trial01@yahoo.com';

-- Verify the fix - both emails should match now
SELECT
    p.user_email as profile_email,
    ps.user_email as subscription_email,
    'Should match armadijambi98@gmail.com' as status
FROM profiles p
JOIN pro_subscriptions ps ON p.user_id = ps.user_id
WHERE p.user_id = 'ed675b6c-0cd8-4475-aecc-74b921c68b35';