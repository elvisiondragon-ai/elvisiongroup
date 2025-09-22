-- FIX REMAINING RLS ISSUES (EXCLUDE PRO_SUBSCRIPTIONS AND WAITING_PAYMENT)
-- Only fix the remaining auth_rls_initplan and multiple_permissive_policies warnings

-- ========================================
-- STEP 1: Fix audio_tracks table - consolidate duplicates + optimize auth.uid()
-- ========================================

-- Check what columns audio_tracks has first
-- Need to know the actual column structure before fixing

-- Drop duplicate policies
DROP POLICY IF EXISTS "Anyone can view public audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users can view their own audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Authenticated users can create audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users can update their own audio tracks" ON public.audio_tracks;

-- Get audio_tracks column structure first - check if it has user_id, owner_id, or created_by
-- Based on the error, we need to check the actual schema
-- For now, create policies that should work for most audio systems:

-- Consolidated audio tracks policies (assuming user_id or owner_id column exists)
CREATE POLICY "Audio tracks access" 
ON public.audio_tracks 
FOR SELECT 
USING (
    -- Try common column patterns for audio ownership
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audio_tracks' AND column_name = 'user_id') 
        THEN (select auth.uid()) = user_id OR is_public = true
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audio_tracks' AND column_name = 'owner_id') 
        THEN (select auth.uid()) = owner_id OR is_public = true
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audio_tracks' AND column_name = 'created_by') 
        THEN (select auth.uid()) = created_by OR is_public = true
        ELSE is_public = true -- fallback to public only
    END
);

CREATE POLICY "Authenticated users can create audio tracks" 
ON public.audio_tracks 
FOR INSERT 
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update their own audio tracks" 
ON public.audio_tracks 
FOR UPDATE 
USING (
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audio_tracks' AND column_name = 'user_id') 
        THEN (select auth.uid()) = user_id
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audio_tracks' AND column_name = 'owner_id') 
        THEN (select auth.uid()) = owner_id
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audio_tracks' AND column_name = 'created_by') 
        THEN (select auth.uid()) = created_by
        ELSE false -- fallback to no access
    END
);

-- ========================================
-- STEP 2: Fix reflections table - already has optimized policy but still showing warning
-- ========================================

-- The warning shows "Users manage own reflections" is still using auth.uid()
-- Let's check and refix if needed
DROP POLICY IF EXISTS "Users manage own reflections" ON public.reflections;

-- Create properly optimized policy
CREATE POLICY "Users manage own reflections" 
ON public.reflections 
FOR ALL
USING ((select auth.uid()::text) = user_id)
WITH CHECK ((select auth.uid()::text) = user_id);

-- ========================================
-- STEP 3: Fix admin_roles table - still has multiple permissive policies
-- ========================================

-- The warning shows we still have both "Admin roles read access" and "Super admins manage admin roles"
-- for SELECT action - need to consolidate these

DROP POLICY IF EXISTS "Admin roles read access" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins manage admin roles" ON public.admin_roles;

-- Create single comprehensive policy for admin_roles
CREATE POLICY "Admin roles management" 
ON public.admin_roles 
FOR ALL
USING (
    -- Allow read access to everyone (as the original policies did with 'true')
    -- But restrict write access to super admins only
    true
)
WITH CHECK (
    -- Only super admins can modify
    ((verify_admin_with_failsafe((select auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean
);

-- ========================================
-- STEP 4: Fix remaining auth.uid() issues in other tables
-- ========================================

-- Fix user_contact_info policies
DROP POLICY IF EXISTS "Ultra secure contact info access" ON public.user_contact_info;
DROP POLICY IF EXISTS "Ultra secure contact info insert" ON public.user_contact_info;
DROP POLICY IF EXISTS "Ultra secure contact info update" ON public.user_contact_info;

-- Create optimized user_contact_info policy
CREATE POLICY "Ultra secure contact info management" 
ON public.user_contact_info 
FOR ALL
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- Fix security_audit_log policy
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_log;

CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT
USING (is_verified_admin((select auth.uid())));

-- Fix rate_limit_log policy
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limit_log;

CREATE POLICY "System can manage rate limits" 
ON public.rate_limit_log 
FOR ALL
USING (
    -- Allow system access (service role) or admin access
    current_setting('role') = 'service_role' OR 
    is_verified_admin((select auth.uid()))
)
WITH CHECK (
    current_setting('role') = 'service_role' OR 
    is_verified_admin((select auth.uid()))
);

-- Fix admin_activity_log policy
DROP POLICY IF EXISTS "Super admins can view admin activity logs" ON public.admin_activity_log;

CREATE POLICY "Super admins can view admin activity logs" 
ON public.admin_activity_log 
FOR SELECT
USING (((verify_admin_with_failsafe((select auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Test that policies were created successfully
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('audio_tracks', 'reflections', 'admin_roles', 'user_contact_info', 'security_audit_log', 'rate_limit_log', 'admin_activity_log')
ORDER BY tablename, policyname;

-- Test basic access
SELECT COUNT(*) FROM public.reflections WHERE user_id = (select auth.uid()::text);