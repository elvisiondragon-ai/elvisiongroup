-- CHECK IF COLUMNS EXIST IN PROFILES TABLE
-- Validate if total_verses_completed, current_streak, total_meditations exist

-- 1. CHECK ALL PROFILES TABLE COLUMNS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. SPECIFIC CHECK FOR DISPUTED COLUMNS
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND table_schema = 'public' 
            AND column_name = 'total_verses_completed'
        ) THEN '✅ EXISTS: total_verses_completed'
        ELSE '❌ NOT EXISTS: total_verses_completed'
    END as total_verses_completed_status;

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND table_schema = 'public' 
            AND column_name = 'current_streak'
        ) THEN '✅ EXISTS: current_streak'
        ELSE '❌ NOT EXISTS: current_streak'
    END as current_streak_status;

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND table_schema = 'public' 
            AND column_name = 'total_meditations'
        ) THEN '✅ EXISTS: total_meditations'
        ELSE '❌ NOT EXISTS: total_meditations'
    END as total_meditations_status;

-- 3. CHECK FOR SIMILAR COLUMN NAMES
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
    AND (
        column_name LIKE '%verses%' OR
        column_name LIKE '%streak%' OR
        column_name LIKE '%meditation%'
    )
ORDER BY column_name;

-- 4. SUMMARY COMPARISON
SELECT 
    'RULE.TXT vs ACTUAL SCHEMA COMPARISON' as info;

SELECT 
    'total_verses' as rule_txt_column,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND column_name = 'total_verses'
        ) THEN '✅ EXISTS'
        ELSE '❌ NOT EXISTS'
    END as actual_status;

SELECT 
    'streak_days' as rule_txt_column,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND column_name = 'streak_days'
        ) THEN '✅ EXISTS'
        ELSE '❌ NOT EXISTS'
    END as actual_status;