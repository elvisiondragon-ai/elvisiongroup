-- ===========================================
-- INSTALL WAITING_PAYMENT 24-HOUR CLEANUP SYSTEM
-- ===========================================
-- This installs the missing 24-hour auto cleanup for waiting_payment table

-- 1. Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_waiting_payment_24h()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.waiting_payment
  WHERE created_at < (NOW() - INTERVAL '24 hours');

  RAISE NOTICE 'Cleaned up waiting_payment records older than 24 hours at %', NOW();
END;
$$;

-- 2. Create trigger function
CREATE OR REPLACE FUNCTION trigger_cleanup_waiting_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.waiting_payment) % 10 = 0 THEN
    PERFORM cleanup_waiting_payment_24h();
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Create trigger
CREATE TRIGGER cleanup_waiting_payment_trigger
  AFTER INSERT ON public.waiting_payment
  FOR EACH ROW
  EXECUTE FUNCTION trigger_cleanup_waiting_payment();

-- 4. Run immediate cleanup of old records
SELECT cleanup_waiting_payment_24h();