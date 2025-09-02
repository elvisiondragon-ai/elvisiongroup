-- Find what blocks INSERT/UPDATE to pro_subscriptions and waiting_payment

-- 1. Check RLS policies on pro_subscriptions
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
WHERE tablename IN ('pro_subscriptions', 'waiting_payment');

-- 2. Check table constraints
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('pro_subscriptions', 'waiting_payment')
    AND tc.table_schema = 'public';

-- 3. Check triggers on both tables
SELECT 
    trigger_name,
    event_object_table,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table IN ('pro_subscriptions', 'waiting_payment')
    AND trigger_schema = 'public';

-- 4. Check foreign key constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('pro_subscriptions', 'waiting_payment');

-- 5. Check if tables have RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('pro_subscriptions', 'waiting_payment')
    AND schemaname = 'public';

-- 6. Test permissions
SELECT 
    grantee, 
    table_name, 
    privilege_type, 
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name IN ('pro_subscriptions', 'waiting_payment')
    AND table_schema = 'public';