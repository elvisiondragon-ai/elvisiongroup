-- SIMPLIFY PAYMENT_TRANSACTIONS TABLE - KEEP ONLY ESSENTIAL COLUMNS
-- Run these queries in Supabase SQL Editor

-- 1. First, check current structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payment_transactions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Create new simplified table structure
CREATE TABLE public.payment_transactions_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    email TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'pending')),
    tripay_reference TEXT UNIQUE NOT NULL,
    merchant_ref TEXT,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Copy essential data from old table to new table
INSERT INTO public.payment_transactions_new (
    id, user_id, email, status, tripay_reference, merchant_ref, amount, created_at, updated_at
)
SELECT 
    id,
    user_id,
    COALESCE(user_email_payment, user_email, 'unknown@example.com') as email,
    CASE 
        WHEN status = 'paid' THEN 'paid'
        WHEN status = 'pending' THEN 'pending'
        ELSE 'pending'
    END as status,
    tripay_reference,
    merchant_ref,
    amount,
    created_at,
    COALESCE(updated_at, created_at) as updated_at
FROM public.payment_transactions
WHERE tripay_reference IS NOT NULL;

-- 4. Check data transfer
SELECT COUNT(*) as old_count FROM public.payment_transactions;
SELECT COUNT(*) as new_count FROM public.payment_transactions_new;

-- 5. Drop old table and rename new one
DROP TABLE public.payment_transactions;
ALTER TABLE public.payment_transactions_new RENAME TO payment_transactions;

-- 6. Add indexes for performance
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_tripay_ref ON public.payment_transactions(tripay_reference);

-- 7. Enable RLS (Row Level Security)
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
CREATE POLICY "Users can view their own transactions" ON public.payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert transactions" ON public.payment_transactions
    FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update transactions" ON public.payment_transactions
    FOR UPDATE TO service_role USING (true);

-- 9. Final structure verification
\d public.payment_transactions

-- 10. Sample data check
SELECT * FROM public.payment_transactions LIMIT 5;