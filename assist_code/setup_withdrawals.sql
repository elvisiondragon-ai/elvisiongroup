-- 1. Add Bank Details to Profiles (so they don't have to type it every time)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS account_holder TEXT;

-- 2. Create Withdrawals Table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    bank_snapshot JSONB, -- Saves the bank details at the time of request
    proof_image TEXT, -- Optional: link to transfer proof
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own withdrawals
CREATE POLICY "Users can view own withdrawals" 
ON public.withdrawals FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can request withdrawal
CREATE POLICY "Users can request withdrawal" 
ON public.withdrawals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Create a Helper View for Admin to easily see who needs payment
-- Using display_name from profiles and joining with auth.users for email
CREATE OR REPLACE VIEW admin_payout_queue AS
SELECT 
    w.id,
    p.display_name,
    u.email,
    w.amount,
    w.status,
    w.bank_snapshot,
    w.created_at
FROM 
    withdrawals w
JOIN 
    profiles p ON w.user_id = p.user_id
JOIN
    auth.users u ON w.user_id = u.id
WHERE 
    w.status = 'pending'
ORDER BY 
    w.created_at ASC;