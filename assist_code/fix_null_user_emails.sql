-- INVESTIGATE NULL user_email in pro_subscriptions
-- This should not be possible - every subscription must have a user

-- 1. Check the table structure and constraints
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
AND column_name IN ('user_email', 'user_id');

-- 2. Count NULL user_emails 
SELECT 
    COUNT(*) as total_subscriptions,
    COUNT(user_email) as with_email,
    COUNT(*) - COUNT(user_email) as null_emails
FROM pro_subscriptions;

-- 3. Show NULL records with all details
SELECT 
    id,
    user_id,
    user_email,
    subscription_type,
    status,
    created_at,
    subscription_start_date,
    subscription_end_date
FROM pro_subscriptions 
WHERE user_email IS NULL
ORDER BY created_at DESC;

-- 4. Check if we can find emails from profiles table for NULL records
SELECT 
    ps.id as subscription_id,
    ps.user_id,
    ps.user_email as current_email,
    p.user_email as profile_email,
    p.display_name,
    ps.subscription_type,
    ps.status
FROM pro_subscriptions ps
LEFT JOIN profiles p ON ps.user_id = p.user_id
WHERE ps.user_email IS NULL;

-- 5. FIX: Update NULL user_emails from profiles table
UPDATE pro_subscriptions 
SET user_email = profiles.user_email
FROM profiles 
WHERE pro_subscriptions.user_id = profiles.user_id 
AND pro_subscriptions.user_email IS NULL 
AND profiles.user_email IS NOT NULL;

-- 6. Check for any remaining NULL emails after fix
SELECT 
    id,
    user_id, 
    user_email,
    subscription_type,
    status
FROM pro_subscriptions 
WHERE user_email IS NULL;

-- 7. Add NOT NULL constraint to prevent future issues
-- (Run this after confirming all NULLs are fixed)
-- ALTER TABLE pro_subscriptions 
-- ALTER COLUMN user_email SET NOT NULL;

-- 8. Verify the fix worked
SELECT 
    user_email,
    subscription_type,
    status,
    CASE 
        WHEN subscription_end_date >= CURRENT_DATE THEN EXTRACT(DAY FROM (subscription_end_date - CURRENT_DATE))
        ELSE 0 
    END as days_remaining,
    'Email fixed' as verification
FROM pro_subscriptions 
WHERE user_email IS NOT NULL
ORDER BY user_email;