-- Fix for ERROR: 42P16: cannot change data type of view column "email"
-- We must drop the view first because we are changing the underlying column type from varchar(255) (from auth.users) to text (from withdrawals)

-- 1. Drop the existing view
DROP VIEW IF EXISTS public.admin_payout_queue;

-- 2. Add affiliate_email column to withdrawals table (if not already done)
ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS affiliate_email TEXT;

-- 3. Populate existing records from auth.users (idempotent update)
UPDATE public.withdrawals w
SET affiliate_email = u.email
FROM auth.users u
WHERE w.user_id = u.id AND w.affiliate_email IS NULL;

-- 4. Recreate the view using the new column
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

-- 5. Restore permissions (RLS policies are on the table, but view needs grant)
GRANT SELECT ON public.admin_payout_queue TO authenticated;
