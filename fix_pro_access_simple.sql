-- FIX PRO ACCESS - Simple logic: Everyone in pro_subscriptions = PRO

CREATE OR REPLACE FUNCTION public.check_unified_pro_status(p_user_id uuid)
RETURNS TABLE(is_pro boolean, subscription_type text, status text, expires_at timestamp with time zone, days_remaining integer, verse_access boolean, pro_badge boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    true as is_pro,  -- Everyone in table = PRO
    ps.subscription_type,
    ps.status,
    ps.subscription_end_date as expires_at,
    999 as days_remaining,  -- Always has days
    true as verse_access,   -- Always true
    true as pro_badge       -- Always true
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$function$;