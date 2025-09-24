-- VALIDATION: AudioTherapy.tsx total_verses requirements
-- Following rule.txt: Simple SQL to check schema/structure

-- 1. Verify total_verses exists in profiles (from rule.txt schema)
SELECT 
    'total_verses field check' as validation,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'total_verses'
  AND table_schema = 'public';

-- 2. Check current total_verses values in profiles
SELECT 
    'current total_verses data' as info,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN total_verses IS NOT NULL THEN 1 END) as profiles_with_verses_count,
    AVG(COALESCE(total_verses, 0)) as avg_verses,
    MAX(COALESCE(total_verses, 0)) as max_verses,
    MIN(COALESCE(total_verses, 0)) as min_verses
FROM profiles;

-- 3. Show sample users with total_verses data
SELECT 
    'sample total_verses data' as info,
    user_id,
    display_name,
    total_verses,
    verse4_used,
    level,
    updated_at
FROM profiles
WHERE total_verses IS NOT NULL
ORDER BY total_verses DESC
LIMIT 5;

-- 4. Check if any table stores audio completion data
-- (This would help understand if there's actual verse completion tracking)
SELECT 
    'audio completion tracking tables' as check_type,
    table_name,
    'exists' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (table_name LIKE '%audio%' 
       OR table_name LIKE '%verse%' 
       OR table_name LIKE '%completion%'
       OR table_name LIKE '%track%')
ORDER BY table_name;

-- 5. If audio_tracks table exists, check its structure
SELECT 
    'audio_tracks table structure' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'audio_tracks'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Check if there's any completion/progress tracking
SELECT 
    'completion tracking search' as info,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (column_name LIKE '%completion%' 
       OR column_name LIKE '%progress%'
       OR column_name LIKE '%finished%'
       OR column_name LIKE '%played%')
ORDER BY table_name, column_name;