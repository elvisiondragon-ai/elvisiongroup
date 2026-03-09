-- Find where reflection data is currently stored
-- Check all possible tables that might contain user reflections

-- 1. Check all tables in the database
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Look for tables with reflection-related columns
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (column_name ILIKE '%reflection%'
       OR column_name ILIKE '%journal%'
       OR column_name ILIKE '%renungan%'
       OR column_name ILIKE '%content%'
       OR column_name ILIKE '%answer%')
ORDER BY table_name, column_name;

-- 3. Check profiles table for journal data
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Look for any other potential reflection storage
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND data_type IN ('text', 'varchar', 'character varying')
  AND table_name != 'reflections'
ORDER BY table_name;

-- 5. Check if there's data in any journal-related columns in profiles
SELECT user_id, total_journal, created_at
FROM profiles
WHERE total_journal > 0
ORDER BY total_journal DESC
LIMIT 10;

-- 6. Search for any other tables that might have user content
-- Check for tables with user_id and text content
SELECT
    t.table_name,
    string_agg(c.column_name, ', ') as columns
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND c.table_schema = 'public'
  AND (c.column_name = 'user_id' OR c.data_type IN ('text', 'varchar'))
GROUP BY t.table_name
HAVING COUNT(CASE WHEN c.column_name = 'user_id' THEN 1 END) > 0
ORDER BY t.table_name;