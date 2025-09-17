-- ===========================================
-- FIX FUNCTION BASED ON VERIFIED DATA
-- ===========================================
-- VERIFIED: Only 1_day, 1_week, 1_month, 1_year exist
-- NO monthly, yearly, or trial types exist

-- ===========================================
-- DROP AND RECREATE CLEAN FUNCTION
-- ===========================================
DROP FUNCTION IF EXISTS public.calculate_subscription_end_date(text, timestamp with time zone);

CREATE OR REPLACE FUNCTION public.calculate_subscription_end_date(
  p_subscription_type TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
DECLARE
  plan_duration_days INTEGER;
BEGIN
  -- Get duration from subscription_plans table
  SELECT duration_days INTO plan_duration_days
  FROM public.subscription_plans
  WHERE id = p_subscription_type
  AND is_active = true;

  -- If found, use it
  IF plan_duration_days IS NOT NULL THEN
    RETURN p_start_date + (plan_duration_days || ' days')::INTERVAL;
  END IF;

  -- If not found, this is an error - no fallback needed
  RAISE EXCEPTION 'Invalid subscription_type: %. Valid types are: 1_day, 1_week, 1_month, 1_year', p_subscription_type;
END;
$$;

-- ===========================================
-- VERIFY THE FIX WORKS FOR ALL VALID TYPES
-- ===========================================
SELECT
    sp.id as subscription_type,
    sp.duration_days as expected_days,
    EXTRACT(days FROM public.calculate_subscription_end_date(sp.id, NOW()) - NOW()) as calculated_days,
    CASE
        WHEN EXTRACT(days FROM public.calculate_subscription_end_date(sp.id, NOW()) - NOW()) = sp.duration_days
        THEN 'CORRECT ✓'
        ELSE 'ERROR ✗'
    END as verification
FROM public.subscription_plans sp
WHERE sp.is_active = true
ORDER BY sp.duration_days;