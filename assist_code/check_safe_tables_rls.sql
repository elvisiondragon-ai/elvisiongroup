-- Check RLS policies for SAFE tables only (excluding pro_subscriptions and waiting_payment)
-- Safe tables: audio_tracks, user_contact_info, security_audit_log, rate_limit_log, admin_activity_log, reflections, admin_roles

-- 1. Check current RLS policies for audio_tracks
SELECT 
    'audio_tracks' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'audio_tracks'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 2. Check current RLS policies for user_contact_info  
SELECT 
    'user_contact_info' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_contact_info'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 3. Check current RLS policies for security_audit_log
SELECT 
    'security_audit_log' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'security_audit_log'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 4. Check current RLS policies for rate_limit_log
SELECT 
    'rate_limit_log' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'rate_limit_log'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 5. Check current RLS policies for admin_activity_log
SELECT 
    'admin_activity_log' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'admin_activity_log'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 6. Check current RLS policies for reflections
SELECT 
    'reflections' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'reflections'
    AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 7. Check current RLS policies for admin_roles
SELECT 
    'admin_roles' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'admin_roles'
    AND schemaname = 'public'
ORDER BY cmd, policyname;