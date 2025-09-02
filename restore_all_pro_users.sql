-- RESTORE ALL PRO USERS - Simple logic
-- Everyone in pro_subscriptions gets verse_access = true and pro_badge = true

UPDATE public.pro_subscriptions 
SET 
  verse_access = true,
  pro_badge = true,
  status = 'active',
  updated_at = NOW();

-- Check results
SELECT 
  COUNT(*) as total_pro_users,
  'All users in pro_subscriptions now have access and badges' as status
FROM public.pro_subscriptions;