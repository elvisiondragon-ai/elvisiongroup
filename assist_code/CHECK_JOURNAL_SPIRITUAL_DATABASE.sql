-- Check JournalSpiritual database and the "tulis renungan anda terlebih dahulu" error

-- 1. Check reflections table structure
SELECT
    'REFLECTIONS TABLE STRUCTURE' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reflections'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if reflections table exists
SELECT 
    'TABLE EXISTS CHECK' as check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reflections' AND table_schema = 'public') 
        THEN '✅ reflections table EXISTS'
        ELSE '❌ reflections table MISSING'
    END as status;

-- 3. Check RLS policies on reflections table
SELECT
    'RLS POLICIES' as info,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'reflections';

-- 4. Check if reflections table has RLS enabled
SELECT 
    'RLS STATUS' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'reflections'
AND schemaname = 'public';

-- 5. Check recent reflection entries for evira.rotorasiko37@gmail.com
SELECT 
    'EVIRA REFLECTIONS' as category,
    r.id,
    r.user_email,
    r.reflection,
    r.created_at,
    LENGTH(r.reflection) as reflection_length
FROM public.reflections r
WHERE r.user_email = 'evira.rotorasiko37@gmail.com'
ORDER BY r.created_at DESC
LIMIT 5;

-- 6. Test if user can insert into reflections table
DO $$
DECLARE
    test_user_id UUID;
    result_text TEXT;
BEGIN
    -- Get evira's user_id
    SELECT p.user_id INTO test_user_id
    FROM public.profiles p
    WHERE p.user_email = 'evira.rotorasiko37@gmail.com';
    
    IF test_user_id IS NOT NULL THEN
        -- Try to insert a test reflection (will be rolled back)
        BEGIN
            INSERT INTO public.reflections (user_id, user_email, reflection)
            VALUES (test_user_id, 'evira.rotorasiko37@gmail.com', 'TEST REFLECTION - WILL BE ROLLED BACK');
            
            result_text := '✅ INSERT would work - no database constraints blocking';
            ROLLBACK;
        EXCEPTION
            WHEN OTHERS THEN
                result_text := '❌ INSERT failed: ' || SQLERRM;
        END;
    ELSE
        result_text := '❌ User evira.rotorasiko37@gmail.com not found in profiles';
    END IF;
    
    RAISE NOTICE '%', result_text;
END $$;

-- 7. Check constraints on reflections table
SELECT
    'TABLE CONSTRAINTS' as info,
    constraint_name,
    constraint_type,
    constraint_def
FROM (
    SELECT 
        tc.constraint_name,
        tc.constraint_type,
        CASE 
            WHEN tc.constraint_type = 'CHECK' THEN cc.check_clause
            WHEN tc.constraint_type = 'FOREIGN KEY' THEN 'FK: ' || kcu.column_name
            ELSE 'Other'
        END as constraint_def
    FROM information_schema.table_constraints tc
    LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
    LEFT JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'reflections'
    AND tc.table_schema = 'public'
) constraints;

-- 8. Check for any triggers on reflections table
SELECT
    'TRIGGERS ON REFLECTIONS' as info,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'reflections'
AND trigger_schema = 'public';