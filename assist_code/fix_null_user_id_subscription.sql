-- ===========================================
-- FIX NULL USER_ID IN PRO SUBSCRIPTION
-- ===========================================

-- 1. Check the problematic record
SELECT
    id,
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_end_date,
    'NULL user_id issue' as problem
FROM pro_subscriptions
WHERE user_email = 'Mfauzin16@gmail.com';

-- 2. Check if this email exists in profiles table
SELECT
    user_id,
    display_name,
    user_email,
    created_at,
    'User exists in profiles' as status
FROM profiles
WHERE user_email ILIKE 'Mfauzin16@gmail.com';

-- 3. If user exists in profiles, update the subscription with correct user_id
UPDATE pro_subscriptions
SET user_id = (
    SELECT user_id
    FROM profiles
    WHERE user_email ILIKE 'Mfauzin16@gmail.com'
    LIMIT 1
)
WHERE user_email = 'Mfauzin16@gmail.com'
AND user_id IS NULL;

-- 4. Verify the fix
SELECT
    ps.user_id,
    ps.user_email,
    ps.subscription_type,
    ps.status,
    p.display_name,
    'Fixed - user_id matched' as status
FROM pro_subscriptions ps
JOIN profiles p ON ps.user_id = p.user_id
WHERE ps.user_email = 'Mfauzin16@gmail.com';