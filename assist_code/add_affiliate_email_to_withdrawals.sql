-- 1. Add affiliate_email column to withdrawals table
ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS affiliate_email TEXT;

-- 2. Populate existing records from auth.users (if possible)
-- This runs as owner so it should have access to auth.users
UPDATE public.withdrawals w
SET affiliate_email = u.email
FROM auth.users u
WHERE w.user_id = u.id AND w.affiliate_email IS NULL;

-- 3. Update the admin_payout_queue view to use this new column
CREATE OR REPLACE VIEW admin_payout_queue AS
SELECT 
    w.id,
    p.display_name,
    w.affiliate_email as email,
    w.amount,
    w.status,
    w.bank_snapshot,
    w.created_at
FROM 
    withdrawals w
LEFT JOIN 
    profiles p ON w.user_id = p.user_id
WHERE 
    w.status = 'pending'
ORDER BY 
    w.created_at ASC;

-- 4. Ensure permissions are correct
GRANT SELECT ON public.admin_payout_queue TO authenticated;
GRANT UPDATE, INSERT, SELECT ON public.withdrawals TO authenticated;
