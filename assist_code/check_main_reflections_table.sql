-- Check the main reflections table structure and data
-- This helps us understand what we're protecting with RLS

-- Step 1: Check table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reflections'
ORDER BY ordinal_position;

-- Step 2: Check current row count
SELECT COUNT(*) as total_reflections FROM public.reflections;

-- Step 3: Check RLS status on main table
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
WHERE tablename = 'reflections';

-- Step 4: Check existing RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'reflections';

-- Step 5: Sample data from main table (first 3 rows)
SELECT
    user_id,
    created_at,
    LENGTH(content) as content_length,
    LEFT(content, 50) as content_preview
FROM public.reflections
ORDER BY created_at DESC
LIMIT 3;

-- Step 6: Check user distribution
SELECT
    user_id,
    COUNT(*) as reflection_count
FROM public.reflections
GROUP BY user_id
ORDER BY reflection_count DESC
LIMIT 5;