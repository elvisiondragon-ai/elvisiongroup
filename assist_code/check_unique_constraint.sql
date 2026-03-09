-- CHECK unique_active_subscription_per_user CONSTRAINT

-- What is the constraint?
SELECT 
    conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conname = 'unique_active_subscription_per_user';

-- What data it affects?
SELECT 
    user_id,
    status,
    COUNT(*) as count
FROM public.pro_subscriptions 
WHERE status = 'active'
GROUP BY user_id, status
ORDER BY count DESC;

-- What blocks upgrade?
SELECT 'Constraint blocks: INSERT with same (user_id, status=active)' as workflow;