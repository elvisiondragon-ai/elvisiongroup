-- ===========================================
-- WAITING_PAYMENT 24-HOUR AUTO CLEANUP
-- ===========================================
-- This script creates an automatic cleanup system for waiting_payment table
-- Records older than 24 hours from created_at will be automatically deleted

-- ===========================================
-- 1. CREATE CLEANUP FUNCTION
-- ===========================================
CREATE OR REPLACE FUNCTION cleanup_waiting_payment_24h()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete records older than 24 hours
  DELETE FROM public.waiting_payment
  WHERE created_at < (NOW() - INTERVAL '24 hours');

  -- Log the cleanup (optional)
  RAISE NOTICE 'Cleaned up waiting_payment records older than 24 hours at %', NOW();
END;
$$;

-- ===========================================
-- 2. OPTION A: USING PG_CRON (if available)
-- ===========================================
-- Run cleanup every hour
-- NOTE: This requires pg_cron extension to be enabled
-- SELECT cron.schedule('cleanup-waiting-payment', '0 * * * *', 'SELECT cleanup_waiting_payment_24h();');

-- ===========================================
-- 3. OPTION B: TRIGGER-BASED CLEANUP (RECOMMENDED)
-- ===========================================
-- Create a trigger that runs cleanup on every INSERT
-- This ensures cleanup happens whenever new records are added

CREATE OR REPLACE FUNCTION trigger_cleanup_waiting_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Run cleanup on every 10th insert (to avoid too frequent cleanup)
  IF (SELECT COUNT(*) FROM public.waiting_payment) % 10 = 0 THEN
    PERFORM cleanup_waiting_payment_24h();
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS cleanup_waiting_payment_trigger ON public.waiting_payment;

-- Create trigger
CREATE TRIGGER cleanup_waiting_payment_trigger
  AFTER INSERT ON public.waiting_payment
  FOR EACH ROW
  EXECUTE FUNCTION trigger_cleanup_waiting_payment();

-- ===========================================
-- 4. MANUAL CLEANUP (run anytime)
-- ===========================================
-- You can also run this manually anytime:
-- SELECT cleanup_waiting_payment_24h();

-- ===========================================
-- 5. CHECK CLEANUP EFFECTIVENESS
-- ===========================================
-- Query to see records older than 24 hours (should be empty after cleanup)
-- SELECT * FROM public.waiting_payment
-- WHERE created_at < (NOW() - INTERVAL '24 hours');

-- Query to see all waiting_payment records with age
-- SELECT
--   id,
--   user_email,
--   status,
--   created_at,
--   NOW() - created_at as age,
--   CASE
--     WHEN created_at < (NOW() - INTERVAL '24 hours') THEN 'SHOULD BE DELETED'
--     ELSE 'VALID'
--   END as cleanup_status
-- FROM public.waiting_payment
-- ORDER BY created_at DESC;

-- ===========================================
-- 6. TEST THE CLEANUP SYSTEM
-- ===========================================
-- Insert test record older than 24 hours
-- INSERT INTO public.waiting_payment (user_email, status, created_at)
-- VALUES ('test@example.com', 'test', NOW() - INTERVAL '25 hours');

-- Run cleanup
-- SELECT cleanup_waiting_payment_24h();

-- Check if test record was deleted
-- SELECT * FROM public.waiting_payment WHERE user_email = 'test@example.com';