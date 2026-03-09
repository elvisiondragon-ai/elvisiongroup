-- Secure reflections table with proper RLS policies
-- This will ensure users can only access their own reflection data

-- First, check current RLS status
SELECT
    schemaname,
    tablename,
    CASE
        WHEN pg_class.relrowsecurity = true THEN 'enabled'
        ELSE 'disabled'
    END as row_security_status
FROM pg_tables
LEFT JOIN pg_class ON pg_class.relname = pg_tables.tablename
LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace AND pg_namespace.nspname = pg_tables.schemaname
WHERE tablename IN ('reflections', 'reflections_backup');

-- Enable RLS on reflections table if not already enabled
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to recreate them properly)
DROP POLICY IF EXISTS "Users can view own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can insert own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can update own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can delete own reflections" ON public.reflections;

-- Create secure RLS policies for reflections table
-- Handle UUID/text conversion properly
CREATE POLICY "Users can view own reflections" ON public.reflections
    FOR SELECT USING (auth.uid()::text = user_id OR auth.uid() = user_id::uuid);

CREATE POLICY "Users can insert own reflections" ON public.reflections
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR auth.uid() = user_id::uuid);

CREATE POLICY "Users can update own reflections" ON public.reflections
    FOR UPDATE USING (auth.uid()::text = user_id OR auth.uid() = user_id::uuid);

CREATE POLICY "Users can delete own reflections" ON public.reflections
    FOR DELETE USING (auth.uid()::text = user_id OR auth.uid() = user_id::uuid);

-- Check if reflections_backup table exists and show its structure
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'reflections_backup'
ORDER BY ordinal_position;

-- Check for any foreign key constraints or references to reflections_backup
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND (tc.table_name = 'reflections_backup' OR ccu.table_name = 'reflections_backup');

-- Check for any indexes on reflections_backup
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'reflections_backup';

-- Check for any triggers on reflections_backup
SELECT tgname, tgtype, proname
FROM pg_trigger
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
WHERE pg_class.relname = 'reflections_backup';

-- After verifying no dependencies, drop reflections_backup table
-- UNCOMMENT the line below only after confirming no dependencies exist
-- DROP TABLE IF EXISTS public.reflections_backup CASCADE;

-- Verify reflections table security
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
WHERE tablename = 'reflections';

-- Test query to ensure RLS is working (should only return current user's data)
-- SELECT COUNT(*) as my_reflections_count FROM public.reflections;

COMMENT ON TABLE public.reflections IS 'Spiritual reflections table with RLS enabled for user data security';