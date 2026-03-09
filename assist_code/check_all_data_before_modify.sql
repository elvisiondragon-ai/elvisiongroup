-- CHECK ALL DATA BEFORE MODIFYING CONSTRAINT

-- Current constraint definition
SELECT conname, pg_get_constraintdef(oid) as current_constraint
FROM pg_constraint 
WHERE conname = 'unique_active_subscription_per_user';

-- All current data in table
SELECT 
    user_id,
    user_email,
    status,
    subscription_type,
    subscription_end_date,
    COUNT(*) OVER (PARTITION BY user_id) as total_per_user,
    COUNT(*) OVER (PARTITION BY user_id, status) as same_status_per_user
FROM public.pro_subscriptions 
ORDER BY user_id, status, created_at;

-- Check if new constraint would work
SELECT 
    user_id,
    status,
    COUNT(*) as count,
    CASE WHEN status = 'active' AND COUNT(*) > 1 THEN 'WOULD_FAIL' ELSE 'OK' END as new_constraint_check
FROM public.pro_subscriptions 
GROUP BY user_id, status
HAVING COUNT(*) > 1;