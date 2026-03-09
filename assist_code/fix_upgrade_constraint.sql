-- FIX UPGRADE BLOCKING: Modify constraint to allow upgrades

-- Drop old constraint that blocks upgrades
ALTER TABLE public.pro_subscriptions 
DROP CONSTRAINT unique_active_subscription_per_user;

-- Add new constraint: only ONE active per user (allows pending/expired)
ALTER TABLE public.pro_subscriptions 
ADD CONSTRAINT unique_active_subscription_per_user 
UNIQUE (user_id) 
WHERE (status = 'active');

-- Verify new constraint
SELECT 
    conname,
    pg_get_constraintdef(oid) as new_definition
FROM pg_constraint 
WHERE conname = 'unique_active_subscription_per_user';