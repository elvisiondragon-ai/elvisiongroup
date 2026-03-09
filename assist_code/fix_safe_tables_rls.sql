-- Fix RLS warnings for SAFE tables only
-- 1. Drop empty audio_tracks table (safe to remove - no data, no dependencies)
-- 2. Fix admin_roles policies (auth.uid() wrapper + consolidate policies)

BEGIN;

-- ======================
-- 1. REMOVE AUDIO_TRACKS TABLE (empty, unused)
-- ======================
-- Drop all policies first
DROP POLICY IF EXISTS "Users can view their own audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Authenticated users can create audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users can update their own audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Anyone can view public audio tracks" ON public.audio_tracks;

-- Drop the table
DROP TABLE IF EXISTS public.audio_tracks;

-- ======================
-- 2. FIX ADMIN_ROLES POLICIES
-- ======================
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Super admins manage admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admin roles read access" ON public.admin_roles;

-- Create single consolidated policy for SELECT (fixes multiple permissive policies warning)
CREATE POLICY "Consolidated admin roles access" ON public.admin_roles
    FOR SELECT
    TO public
    USING (
        -- Anyone can read (replaces "Admin roles read access")
        true
        OR
        -- Super admins can also read (part of previous "Super admins manage admin roles")
        ((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean
    );

-- Create policy for INSERT/UPDATE/DELETE (super admins only)
CREATE POLICY "Super admins manage admin roles data" ON public.admin_roles
    FOR ALL
    TO public
    USING (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean)
    WITH CHECK (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

COMMIT;

-- ======================
-- VERIFICATION QUERIES
-- ======================
-- Check that audio_tracks is gone
SELECT 'audio_tracks_check' as test,
       EXISTS (
           SELECT FROM information_schema.tables 
           WHERE table_schema = 'public' 
           AND table_name = 'audio_tracks'
       ) as table_still_exists;

-- Check admin_roles policies
SELECT 'admin_roles_policies' as test,
       COUNT(*) as policy_count,
       array_agg(policyname) as policy_names
FROM pg_policies
WHERE tablename = 'admin_roles'
  AND schemaname = 'public';

-- Verify no more auth.uid() without SELECT wrapper in admin_roles
SELECT 'admin_roles_auth_check' as test,
       policyname,
       CASE 
           WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid())%' THEN 'STILL_HAS_UNWRAPPED_AUTH'
           WHEN with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid())%' THEN 'STILL_HAS_UNWRAPPED_AUTH'
           ELSE 'OK'
       END as auth_check_status
FROM pg_policies
WHERE tablename = 'admin_roles'
  AND schemaname = 'public';