-- Final deletion of reflections_backup_20250916 table
-- Run this only after confirming RLS is working and backup is not needed

-- Step 1: Find all reflections backup tables
SELECT
    table_name,
    table_schema,
    table_type
FROM information_schema.tables
WHERE table_name LIKE 'reflections_backup%';

-- Step 2: Count rows to see how much data will be lost
SELECT
    COUNT(*) as total_rows_to_delete
FROM public.reflections_backup_20250916;

-- Step 3: Quick sample of what's in the backup (optional)
-- SELECT user_id, created_at, content FROM public.reflections_backup_20250916 LIMIT 3;

-- Step 4: Execute deletion (uncomment when ready)
-- DROP TABLE public.reflections_backup_20250916 CASCADE;

-- Step 5: Verify deletion was successful (run after uncommenting above)
-- SELECT COUNT(*) as remaining_backup_tables
-- FROM information_schema.tables
-- WHERE table_name LIKE 'reflections_backup%';