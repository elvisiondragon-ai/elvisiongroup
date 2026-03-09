-- Better verification of auth.uid() wrapping in policies
-- Check for any unwrapped auth.uid() calls (not preceded by SELECT)

SELECT 
    'admin_roles_detailed_auth_check' as test,
    policyname,
    cmd,
    -- Show the actual policy text
    qual as policy_qual,
    with_check as policy_with_check,
    -- Check for unwrapped auth.uid() - should not find "auth.uid()" without "SELECT" before it
    CASE 
        WHEN qual ~ 'auth\.uid\(\)' AND qual !~ 'SELECT\s+auth\.uid\(\)' THEN 'UNWRAPPED_AUTH_IN_QUAL'
        WHEN with_check ~ 'auth\.uid\(\)' AND with_check !~ 'SELECT\s+auth\.uid\(\)' THEN 'UNWRAPPED_AUTH_IN_WITH_CHECK'
        ELSE 'PROPERLY_WRAPPED'
    END as auth_wrapper_status
FROM pg_policies
WHERE tablename = 'admin_roles'
  AND schemaname = 'public'
ORDER BY policyname;

-- Also check what the Supabase linter is actually complaining about
-- Show all policies that contain auth functions
SELECT 
    'all_auth_functions_check' as test,
    schemaname,
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual ~ 'auth\.' THEN 'HAS_AUTH_IN_QUAL'
        WHEN with_check ~ 'auth\.' THEN 'HAS_AUTH_IN_WITH_CHECK'
        ELSE 'NO_AUTH'
    END as has_auth_function,
    qual,
    with_check
FROM pg_policies
WHERE (qual ~ 'auth\.' OR with_check ~ 'auth\.')
  AND schemaname = 'public'
  AND tablename IN ('admin_roles', 'user_contact_info', 'security_audit_log', 'rate_limit_log', 'admin_activity_log', 'reflections')
ORDER BY tablename, policyname;