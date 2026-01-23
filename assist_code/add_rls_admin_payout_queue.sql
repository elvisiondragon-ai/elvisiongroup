-- Enable RLS on admin_payout_queue (works for tables and views in Postgres 15+)
ALTER TABLE IF EXISTS public.admin_payout_queue ENABLE ROW LEVEL SECURITY;
ALTER VIEW IF EXISTS public.admin_payout_queue ENABLE ROW LEVEL SECURITY;

-- Minimal policy: Only verified admins can view and manage the payout queue
DROP POLICY IF EXISTS "Admins can manage payout queue" ON public.admin_payout_queue;

CREATE POLICY "Admins can manage payout queue" 
ON public.admin_payout_queue
FOR ALL
TO authenticated
USING (public.is_verified_admin(auth.uid()))
WITH CHECK (public.is_verified_admin(auth.uid()));
