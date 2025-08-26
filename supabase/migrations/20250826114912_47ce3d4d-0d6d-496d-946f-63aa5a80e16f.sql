-- Pro System Cleanup: Remove obsolete tables and fix webhooks

-- 1. Drop unused empty tables
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE; 
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.user_memberships CASCADE;

-- 2. Remove backward compatibility trigger that creates circular dependency  
DROP TRIGGER IF EXISTS sync_pro_achievements_trigger ON public.pro_subscriptions;
DROP FUNCTION IF EXISTS public.sync_pro_achievements();

-- 3. Remove obsolete functions
DROP FUNCTION IF EXISTS public.check_pro_status(UUID);
DROP FUNCTION IF EXISTS public.calculate_subscription_end_date(TEXT, TIMESTAMPTZ);

-- 4. Create proper subscription end date calculation for unified system
CREATE OR REPLACE FUNCTION public.calculate_subscription_end_date(
  p_subscription_type TEXT,
  p_start_date TIMESTAMPTZ DEFAULT now()
) RETURNS TIMESTAMPTZ AS $$
BEGIN
  CASE p_subscription_type
    WHEN 'trial' THEN 
      RETURN p_start_date + INTERVAL '2 days';
    WHEN 'monthly' THEN 
      RETURN p_start_date + INTERVAL '30 days';
    WHEN 'yearly' THEN 
      RETURN p_start_date + INTERVAL '365 days';
    ELSE 
      RETURN p_start_date + INTERVAL '30 days';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update pro_subscriptions with proper subscription end dates for existing records
UPDATE public.pro_subscriptions 
SET subscription_end_date = calculate_subscription_end_date(subscription_type, subscription_start_date)
WHERE subscription_end_date IS NULL 
  AND subscription_start_date IS NOT NULL 
  AND subscription_type IN ('monthly', 'yearly');

-- 6. Ensure all trial subscriptions have trial_end_date
UPDATE public.pro_subscriptions 
SET trial_end_date = trial_start_date + INTERVAL '2 days'
WHERE subscription_type = 'trial' 
  AND trial_end_date IS NULL 
  AND trial_start_date IS NOT NULL;