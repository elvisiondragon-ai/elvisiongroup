-- FINAL DELETION: reflections_backup_20250916
-- Main reflections table confirmed healthy with active user data

-- Final confirmation before deletion
SELECT
    'ABOUT TO DELETE' as action,
    table_name,
    (SELECT COUNT(*) FROM public.reflections_backup_20250916) as rows_to_delete
FROM information_schema.tables
WHERE table_name = 'reflections_backup_20250916';

-- Execute the deletion
DROP TABLE public.reflections_backup_20250916 CASCADE;

-- Verify deletion successful
SELECT
    'DELETION COMPLETE' as status,
    COUNT(*) as remaining_backup_tables
FROM information_schema.tables
WHERE table_name LIKE 'reflections_backup%';

-- Confirm main table still intact
SELECT
    'MAIN TABLE STATUS' as check_type,
    COUNT(*) as total_reflections_remaining
FROM public.reflections;