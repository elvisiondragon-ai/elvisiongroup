-- SQL to check verse4 token system schema and current data
-- Run this to understand the current implementation

-- 1. Check profiles table structure for verse4_used column
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'verse4_used';

-- 2. Check current verse4_used data distribution
SELECT 
    verse4_used,
    COUNT(*) as user_count
FROM profiles 
WHERE verse4_used IS NOT NULL
GROUP BY verse4_used
ORDER BY verse4_used;

-- 3. Check for any functions or triggers related to verse4
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%verse4%';

-- 4. Sample current data to understand the state
SELECT 
    user_id,
    verse4_used,
    created_at,
    updated_at
FROM profiles 
WHERE verse4_used > 0
ORDER BY updated_at DESC
LIMIT 10;

-- 5. Check if there are any related tables or constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'profiles' 
AND kcu.column_name = 'verse4_used';