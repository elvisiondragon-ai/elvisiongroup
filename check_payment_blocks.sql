-- CHECK WHAT'S BLOCKING payment_transactions INSERTS

-- 1. Check RLS policies on payment_transactions
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'payment_transactions';

-- 2. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'payment_transactions';

-- 3. Check triggers on payment_transactions
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'payment_transactions' 
  AND trigger_schema = 'public';

-- 4. Check table constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
  AND table_name = 'payment_transactions';

-- 5. Test insert (replace with real data)
-- INSERT INTO public.payment_transactions (
--     user_id,
--     email,
--     status,
--     tripay_reference,
--     merchant_ref,
--     amount
-- ) VALUES (
--     'test-user-id'::uuid,
--     'test@example.com',
--     'pending',
--     'TEST_REF_123',
--     'TEST_MERCHANT_123',
--     50000
-- );

-- 6. Check table permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
  AND table_name = 'payment_transactions';