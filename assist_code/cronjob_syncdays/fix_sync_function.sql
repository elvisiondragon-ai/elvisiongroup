-- Fix the sync_days_remaining_daily function and run it immediately

-- 1. Drop and recreate the function with proper logging
CREATE OR REPLACE FUNCTION sync_days_remaining_daily()
RETURNS void AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Update all active subscriptions daily
    UPDATE public.pro_subscriptions 
    SET 
        days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER),
        updated_at = NOW()
    WHERE status = 'active';
    
    -- Get the count of updated rows
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    -- Log how many records updated
    RAISE NOTICE 'Updated % active subscriptions with new days_remaining', updated_count;
END;
$$ LANGUAGE plpgsql;

-- 2. Run the function immediately to fix current values
SELECT sync_days_remaining_daily();

-- 3. Verify the fix - should show minimal differences (0-1 day max)
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN ABS(days_remaining - EXTRACT(DAY FROM (subscription_end_date - NOW()))) > 1 THEN 1 END) as records_with_difference
FROM public.pro_subscriptions 
WHERE status = 'active';