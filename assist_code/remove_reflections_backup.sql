-- Safe removal of reflections_backup table
-- Run this only AFTER confirming the table has no dependencies

-- Step 1: Check if reflections_backup exists
SELECT
    table_name,
    table_type,
    table_schema
FROM information_schema.tables
WHERE table_name = 'reflections_backup';

-- Step 2: Check table size and row count (to understand what we're deleting)
SELECT
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE tablename = 'reflections_backup'
LIMIT 10;

-- Step 3: Show sample data (first 3 rows) to confirm it's the wrong backup
-- Only run if table exists (check Step 1 results first)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reflections_backup') THEN
        RAISE NOTICE 'reflections_backup table exists - showing sample data:';
        -- Uncomment the line below to see sample data:
        -- SELECT * FROM public.reflections_backup LIMIT 3;
    ELSE
        RAISE NOTICE 'reflections_backup table does not exist - nothing to remove';
    END IF;
END $$;

-- Step 4: Verify no foreign key dependencies point TO reflections_backup
SELECT
    tc.table_name AS referencing_table,
    kcu.column_name AS referencing_column,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'reflections_backup';

-- Step 5: Verify no foreign key dependencies point FROM reflections_backup
SELECT
    tc.table_name AS source_table,
    kcu.column_name AS source_column,
    ccu.table_name AS target_table,
    ccu.column_name AS target_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'reflections_backup';

-- Step 6: Check for any views that might reference this table
SELECT
    table_name as view_name,
    view_definition
FROM information_schema.views
WHERE view_definition ILIKE '%reflections_backup%';

-- Step 7: Check for any stored procedures/functions that reference this table
SELECT
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_definition ILIKE '%reflections_backup%';

-- Step 8: If all checks above show NO DEPENDENCIES, then it's safe to drop
-- UNCOMMENT THE LINES BELOW ONLY AFTER VERIFYING NO DEPENDENCIES:

-- BEGIN;
--
-- -- Create a final safety backup of the table structure (no data)
-- CREATE TABLE reflections_backup_structure_only AS
-- SELECT * FROM public.reflections_backup WHERE 1=0;
--
-- -- Drop the actual backup table
-- DROP TABLE public.reflections_backup CASCADE;
--
-- -- Verify it's gone
-- SELECT COUNT(*) as backup_tables_remaining
-- FROM information_schema.tables
-- WHERE table_name LIKE '%reflections_backup%';
--
-- COMMIT;

-- Step 9: Verification query (run after deletion)
-- This should return 0 if successful
-- SELECT COUNT(*) as remaining_backup_tables
-- FROM information_schema.tables
-- WHERE table_name = 'reflections_backup';