-- Check if audio_tracks table exists and its usage
-- This will help determine if it's safe to remove

-- 1. Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'audio_tracks'
) as table_exists;

-- 2. Check for foreign key references TO audio_tracks
SELECT
    tc.table_name as referencing_table,
    kcu.column_name as referencing_column,
    ccu.table_name as referenced_table,
    ccu.column_name as referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'audio_tracks';

-- 3. Check for foreign key references FROM audio_tracks
SELECT
    tc.table_name as referencing_table,
    kcu.column_name as referencing_column,
    ccu.table_name as referenced_table,
    ccu.column_name as referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'audio_tracks';

-- 4. Check for functions that reference audio_tracks
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_definition ILIKE '%audio_tracks%'
    AND routine_schema = 'public';

-- 5. Check for triggers on audio_tracks
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'audio_tracks'
    AND event_object_schema = 'public';

-- 6. Check current RLS policies on audio_tracks
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
WHERE tablename = 'audio_tracks'
    AND schemaname = 'public';

-- 7. Check if there's any data in the table
SELECT 
    COUNT(*) as row_count,
    pg_size_pretty(pg_total_relation_size('public.audio_tracks')) as table_size
FROM public.audio_tracks;