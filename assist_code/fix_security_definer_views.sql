-- 1. Remove unnecessary bounce analytics views
DROP VIEW IF EXISTS public.view_content_bounce_impact;
DROP VIEW IF EXISTS public.view_bounce_rate_analytics;

-- 2. Fix admin_payout_queue SECURITY DEFINER issue
-- Recreating the view with security_invoker = true ensures it respects RLS
-- of the querying user instead of the view creator.
-- This resolves the "SECURITY DEFINER property" security warning.
DROP VIEW IF EXISTS public.admin_payout_queue;

CREATE VIEW public.admin_payout_queue 
WITH (security_invoker = true)
AS
SELECT 
    w.id,
    p.display_name,
    w.affiliate_email as email,
    w.amount,
    w.status,
    w.bank_snapshot,
    w.created_at
FROM 
    public.withdrawals w
LEFT JOIN 
    public.profiles p ON w.user_id = p.user_id
WHERE 
    w.status = 'pending'
ORDER BY 
    w.created_at ASC;

-- 3. Restore permissions
-- The view will now automatically respect RLS policies on 'withdrawals' and 'profiles'
GRANT SELECT ON public.admin_payout_queue TO authenticated;
REVOKE ALL ON public.admin_payout_queue FROM anon;