-- Search for "Personal Analysisx" in all database tables
-- This will help find where the "x" is coming from

-- Search in reflections table
SELECT
    'reflections' as table_name,
    id,
    user_id,
    LEFT(content, 100) as content_preview
FROM public.reflections
WHERE content ILIKE '%Personal Analytics%'
   OR content ILIKE '%Analysisx%'
LIMIT 10;

-- Search in profiles table
SELECT
    'profiles' as table_name,
    user_id,
    display_name,
    achievements
FROM public.profiles
WHERE display_name ILIKE '%Personal Analytics%'
   OR display_name ILIKE '%Analysisx%'
   OR achievements::text ILIKE '%Personal Analytics%'
   OR achievements::text ILIKE '%Analysisx%'
LIMIT 10;

-- Search in any other text columns in profiles
SELECT
    'profiles_other' as table_name,
    user_id,
    *
FROM public.profiles
WHERE CAST(profiles AS TEXT) ILIKE '%Personal Analytics%'
   OR CAST(profiles AS TEXT) ILIKE '%Analysisx%'
LIMIT 5;

-- Search in journal_entries table if it exists
SELECT
    'journal_entries' as table_name,
    id,
    user_id,
    LEFT(content, 100) as content_preview
FROM public.journal_entries
WHERE content ILIKE '%Personal Analytics%'
   OR content ILIKE '%Analysisx%'
LIMIT 10;

-- Search in any cached analytics or results tables
SELECT
    table_name,
    column_name
FROM information_schema.columns
WHERE column_name ILIKE '%analytics%'
   OR column_name ILIKE '%analysis%'
   OR table_name ILIKE '%analytics%'
   OR table_name ILIKE '%analysis%';

-- Check if there are any stored analytics results
SELECT
    table_name
FROM information_schema.tables
WHERE table_name ILIKE '%analytics%'
   OR table_name ILIKE '%analysis%'
   OR table_name ILIKE '%cache%'
   OR table_name ILIKE '%result%';