-- SAFE analysis of payment table policies - READ ONLY
-- This will show exactly what needs to be changed without making any changes

-- 1. Check current RLS policies for pro_subscriptions (READ ONLY)
SELECT 
    'pro_subscriptions_policies' as analysis_type,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'pro_subscriptions'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 2. Check current RLS policies for waiting_payment (READ ONLY)
SELECT 
    'waiting_payment_policies' as analysis_type,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'waiting_payment'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 3. Check reflections policy (also mentioned in warnings)
SELECT 
    'reflections_policies' as analysis_type,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'reflections'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 4. Check admin_roles policies that still have multiple permissive warnings
SELECT 
    'admin_roles_policies' as analysis_type,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'admin_roles'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 5. Show EXACTLY what the auth function pattern issues are
SELECT 
    'auth_function_analysis' as analysis_type,
    schemaname,
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual ~ 'auth\.uid\(\)' AND qual !~ '\(SELECT auth\.uid\(\)\)' THEN 'NEEDS_SELECT_WRAPPER'
        WHEN with_check ~ 'auth\.uid\(\)' AND with_check !~ '\(SELECT auth\.uid\(\)\)' THEN 'NEEDS_SELECT_WRAPPER_IN_WITH_CHECK'
        ELSE 'OK'
    END as wrapper_status,
    qual,
    with_check
FROM pg_policies
WHERE (qual ~ 'auth\.' OR with_check ~ 'auth\.')
  AND schemaname = 'public'
  AND tablename IN ('pro_subscriptions', 'waiting_payment', 'reflections', 'admin_roles')
ORDER BY tablename, policyname;