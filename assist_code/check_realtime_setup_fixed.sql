-- Check if real-time is enabled for user_activities table (corrected query)
SELECT 
    schemaname, 
    tablename,
    c.relreplident as replica_identity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.schemaname
WHERE t.tablename = 'user_activities' AND t.schemaname = 'public';

-- Check RLS policies on user_activities table
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
WHERE tablename = 'user_activities' AND schemaname = 'public';

-- Check if user_activities table exists and structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_activities' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Enable replica identity for real-time (REQUIRED for Supabase real-time)
ALTER TABLE public.user_activities REPLICA IDENTITY FULL;

-- Check current real-time settings
SHOW wal_level;

-- Check if the table is published for real-time
SELECT * FROM pg_publication_tables WHERE tablename = 'user_activities';