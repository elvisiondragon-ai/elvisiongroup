-- AUTO UPDATE days_remaining DAILY (CRON JOB)

-- 1. SYNC TODAY (one-time fix)
UPDATE public.pro_subscriptions 
SET 
    days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER),
    updated_at = NOW()
WHERE status = 'active';

-- 2. CREATE FUNCTION FOR DAILY SYNC
CREATE OR REPLACE FUNCTION sync_days_remaining_daily()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update all active subscriptions daily
    UPDATE public.pro_subscriptions 
    SET 
        days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER),
        updated_at = NOW()
    WHERE status = 'active';
    
    -- Log how many records updated
    RAISE NOTICE 'Updated % active subscriptions with new days_remaining', ROW_COUNT;
END;
$$;

-- 3. SET UP CRON JOB (run this in Supabase SQL Editor)
-- This runs daily at 00:01 UTC
SELECT cron.schedule('sync-days-remaining', '1 0 * * *', 'SELECT sync_days_remaining_daily();');

-- 4. CHECK IF CRON JOB EXISTS
SELECT * FROM cron.job WHERE jobname = 'sync-days-remaining';