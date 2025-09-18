-- ===========================================
-- CHECK OTHER NULL USER_ID SUBSCRIPTIONS
-- ===========================================

-- 1. Find all pro subscriptions with NULL user_id
SELECT
    id,
    user_email,
    subscription_type,
    status,
    subscription_end_date,
    days_remaining,
    'NULL user_id' as issue
FROM pro_subscriptions
WHERE user_id IS NULL
ORDER BY created_at DESC;

-- 2. Check which of these emails exist in profiles
SELECT
    ps.user_email as subscription_email,
    p.user_id as profile_user_id,
    p.display_name,
    CASE
        WHEN p.user_id IS NOT NULL THEN 'CAN_FIX'
        ELSE 'USER_NOT_REGISTERED'
    END as fix_status
FROM pro_subscriptions ps
LEFT JOIN profiles p ON ps.user_email ILIKE p.user_email
WHERE ps.user_id IS NULL;