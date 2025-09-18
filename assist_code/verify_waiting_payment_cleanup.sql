-- ===========================================
-- VERIFY WAITING_PAYMENT CLEANUP SYSTEM
-- ===========================================

-- Check cleanup system is installed
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name LIKE '%cleanup_waiting_payment%';

-- Check trigger exists
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE trigger_name LIKE '%cleanup_waiting_payment%';

-- Check old records are cleaned (should be empty)
SELECT * FROM public.waiting_payment
WHERE created_at < (NOW() - INTERVAL '24 hours');

-- Check current valid records
SELECT
  id,
  user_email,
  status,
  created_at,
  NOW() - created_at as age
FROM public.waiting_payment
ORDER BY created_at DESC;