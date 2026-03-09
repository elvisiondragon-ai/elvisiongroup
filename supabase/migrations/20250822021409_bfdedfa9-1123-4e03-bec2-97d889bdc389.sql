-- Drop and recreate functions to fix search_path warnings

-- Drop existing function first
DROP FUNCTION IF EXISTS public.calculate_subscription_end_date(text, timestamp with time zone);

-- Recreate with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_subscription_end_date(
  p_subscription_type text,
  p_start_date timestamp with time zone
)
RETURNS timestamp with time zone
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  CASE p_subscription_type
    WHEN 'trial' THEN
      RETURN p_start_date + INTERVAL '3 days';
    WHEN 'monthly', '1_month' THEN
      RETURN p_start_date + INTERVAL '1 month';
    WHEN 'yearly', '1_year' THEN
      RETURN p_start_date + INTERVAL '1 year';
    ELSE
      -- Default to 1 month
      RETURN p_start_date + INTERVAL '1 month';
  END CASE;
END;
$function$;

-- Update auto_sync_pro_on_subscription_change trigger function
CREATE OR REPLACE FUNCTION public.auto_sync_pro_on_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Sync pro status for the user whose subscription changed
  PERFORM public.sync_pro_status_from_subscription(COALESCE(NEW.user_id, OLD.user_id));
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;