-- Fix all unwrapped auth.uid() calls in safe tables
-- Wrap auth.uid() with (SELECT auth.uid()) to fix auth_rls_initplan warnings

BEGIN;

-- ======================
-- 1. FIX ADMIN_ACTIVITY_LOG
-- ======================
DROP POLICY IF EXISTS "Super admins can view admin activity logs" ON public.admin_activity_log;

CREATE POLICY "Super admins can view admin activity logs" ON public.admin_activity_log
    FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1
            FROM admin_roles ar
            WHERE ((ar.user_id = (SELECT auth.uid())) AND (ar.role = 'super_admin'::text) AND (ar.is_active = true) AND ((ar.expires_at IS NULL) OR (ar.expires_at > now())))
        )
    );

-- ======================
-- 2. FIX RATE_LIMIT_LOG
-- ======================
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limit_log;

CREATE POLICY "System can manage rate limits" ON public.rate_limit_log
    FOR ALL
    TO public
    USING (
        ((SELECT auth.uid()) IS NULL) OR 
        (EXISTS (
            SELECT 1
            FROM profiles
            WHERE ((profiles.user_id = (SELECT auth.uid())) AND ('admin'::text = ANY (profiles.achievements)))
        ))
    );

-- ======================
-- 3. FIX SECURITY_AUDIT_LOG
-- ======================
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_log;

CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
    FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE ((profiles.user_id = (SELECT auth.uid())) AND ('admin'::text = ANY (profiles.achievements)))
        )
    );

-- ======================
-- 4. FIX USER_CONTACT_INFO
-- ======================
DROP POLICY IF EXISTS "Ultra secure contact info access" ON public.user_contact_info;
DROP POLICY IF EXISTS "Ultra secure contact info insert" ON public.user_contact_info;
DROP POLICY IF EXISTS "Ultra secure contact info update" ON public.user_contact_info;

CREATE POLICY "Ultra secure contact info access" ON public.user_contact_info
    FOR SELECT
    TO public
    USING (((SELECT auth.uid()) = user_id) AND check_sensitive_data_rate_limit((SELECT auth.uid()), 'user_contact_info'::text));

CREATE POLICY "Ultra secure contact info insert" ON public.user_contact_info
    FOR INSERT
    TO public
    WITH CHECK (((SELECT auth.uid()) = user_id) AND check_sensitive_data_rate_limit((SELECT auth.uid()), 'user_contact_info'::text));

CREATE POLICY "Ultra secure contact info update" ON public.user_contact_info
    FOR UPDATE
    TO public
    USING (((SELECT auth.uid()) = user_id) AND check_sensitive_data_rate_limit((SELECT auth.uid()), 'user_contact_info'::text));

COMMIT;

-- ======================
-- VERIFICATION QUERIES
-- ======================
-- Check for any remaining unwrapped auth.uid() calls
SELECT 
    'final_auth_check' as test,
    schemaname,
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual ~ 'auth\.uid\(\)' AND qual !~ '\(SELECT auth\.uid\(\)\)' THEN 'STILL_UNWRAPPED_IN_QUAL'
        WHEN with_check ~ 'auth\.uid\(\)' AND with_check !~ '\(SELECT auth\.uid\(\)\)' THEN 'STILL_UNWRAPPED_IN_WITH_CHECK'
        ELSE 'PROPERLY_WRAPPED'
    END as auth_wrapper_status
FROM pg_policies
WHERE (qual ~ 'auth\.' OR with_check ~ 'auth\.')
  AND schemaname = 'public'
  AND tablename IN ('admin_activity_log', 'rate_limit_log', 'security_audit_log', 'user_contact_info', 'admin_roles', 'reflections')
ORDER BY tablename, policyname;

-- Count policies per table
SELECT 
    'policy_count_check' as test,
    tablename,
    COUNT(*) as policy_count,
    array_agg(policyname ORDER BY policyname) as policy_names
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('admin_activity_log', 'rate_limit_log', 'security_audit_log', 'user_contact_info', 'admin_roles', 'reflections')
GROUP BY tablename
ORDER BY tablename;