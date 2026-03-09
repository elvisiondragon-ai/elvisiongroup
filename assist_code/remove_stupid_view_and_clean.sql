-- REMOVE STUPID VIEW I CREATED AND UPDATE FUNCTION TO NOT RETURN days_remaining

-- Remove the stupid view
DROP VIEW IF EXISTS public.subscription_status CASCADE;

-- Update function to NOT return days_remaining
CREATE OR REPLACE FUNCTION public.check_unified_pro_status(p_user_id uuid) 
RETURNS TABLE(
  is_pro boolean, 
  subscription_type text, 
  status text, 
  expires_at timestamp with time zone, 
  verse_access boolean, 
  pro_badge boolean
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE 
      WHEN ps.status = 'active' AND ps.subscription_end_date > now() THEN true 
      ELSE false 
    END as is_pro,
    ps.subscription_type,
    ps.status,
    ps.subscription_end_date as expires_at,
    COALESCE(ps.verse_access, true) as verse_access,
    COALESCE(ps.pro_badge, true) as pro_badge
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$$;