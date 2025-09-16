-- DEBUG: Find what's still blocking payment_transactions inserts

-- 1. Check RLS policies (Row Level Security)
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'payment_transactions';

-- 2. Check if table exists and structure
\d public.payment_transactions

-- 3. Test direct insert as service_role
SET role service_role;
INSERT INTO public.payment_transactions (
    user_id,
    email,
    status,
    tripay_reference,
    merchant_ref,
    amount
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    'pending',
    'TEST_' || extract(epoch from now())::text,
    'MERCHANT_TEST',
    50000
);
RESET role;

-- 4. Check for BEFORE INSERT triggers
SELECT 
    trigger_name,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'payment_transactions' 
  AND trigger_schema = 'public'
  AND action_timing = 'BEFORE';

-- 5. Check foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'payment_transactions';

-- 6. Try with BYPASS RLS
SET row_security = off;
INSERT INTO public.payment_transactions (
    user_id,
    email,
    status,
    tripay_reference,
    merchant_ref,
    amount
) VALUES (
    gen_random_uuid(),
    'bypass_test@example.com',
    'pending',
    'BYPASS_TEST_' || extract(epoch from now())::text,
    'BYPASS_MERCHANT',
    25000
);
SET row_security = on;