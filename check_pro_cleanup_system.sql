-- Check if pro_subscriptions auto-cleanup system is active

-- 1. Check if cleanup functions exist
SELECT 
  routine_name, 
  routine_type,
  created
FROM information_schema.routines 
WHERE routine_name IN ('cleanup_expired_pro_subscriptions', 'auto_cleanup_pro_on_update')
  AND routine_schema = 'public';

-- 2. Check if auto-cleanup trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'auto_cleanup_pro_trigger' 
  AND event_object_table = 'pro_subscriptions';

-- 3. Test current pro_subscriptions - check for any expired records
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN days_remaining <= 0 THEN 1 END) as expired_by_days,
  COUNT(CASE WHEN subscription_end_date <= now() THEN 1 END) as expired_by_date,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_records
FROM public.pro_subscriptions;

-- 4. Show specific expired records (if any)
SELECT 
  user_email,
  subscription_type,
  status,
  days_remaining,
  subscription_end_date,
  subscription_end_date <= now() as is_past_end_date
FROM public.pro_subscriptions 
WHERE days_remaining <= 0 
   OR subscription_end_date <= now() 
   OR status = 'cancelled'
ORDER BY subscription_end_date DESC;

-- 5. Test if trigger works by showing what would happen
SELECT 'If trigger is working, these records should be auto-deleted:' as message;
SELECT 
  user_email,
  'SHOULD BE DELETED - days_remaining <= 0' as reason
FROM public.pro_subscriptions 
WHERE days_remaining <= 0

UNION ALL

SELECT 
  user_email,
  'SHOULD BE DELETED - subscription_end_date passed' as reason
FROM public.pro_subscriptions 
WHERE subscription_end_date <= now()

UNION ALL

SELECT 
  user_email,
  'SHOULD BE DELETED - status cancelled' as reason  
FROM public.pro_subscriptions 
WHERE status = 'cancelled';