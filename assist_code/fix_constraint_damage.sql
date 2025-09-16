-- Check what constraints were added and remove problematic ones

-- 1. Check current constraints on pro_subscriptions
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.pro_subscriptions'::regclass;

-- 2. Check if unique constraints are causing issues
SELECT 
  user_id,
  user_email,
  COUNT(*) as count
FROM public.pro_subscriptions
GROUP BY user_id, user_email
HAVING COUNT(*) > 1;

-- 3. Remove the problematic unique constraints
ALTER TABLE public.pro_subscriptions 
DROP CONSTRAINT IF EXISTS unique_user_subscription;

ALTER TABLE public.pro_subscriptions 
DROP CONSTRAINT IF EXISTS unique_email_subscription;

-- 4. Check current state of pro_subscriptions table
SELECT 
  COUNT(*) as total_records,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT user_email) as unique_emails
FROM public.pro_subscriptions;

-- 5. Show any records that might have been affected
SELECT 
  user_email,
  subscription_type,
  status,
  days_remaining,
  created_at
FROM public.pro_subscriptions
ORDER BY user_email, created_at DESC;