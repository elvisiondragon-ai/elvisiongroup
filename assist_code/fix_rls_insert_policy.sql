-- FIX THE RLS INSERT POLICY - IT'S SHOWING NULL
-- This is likely why the frontend insert is failing

-- 1. Drop the broken INSERT policy
DROP POLICY IF EXISTS "Users can insert own elite habits" ON public.elite_habits;

-- 2. Create a proper INSERT policy that matches the user_id check
CREATE POLICY "Users can insert own elite habits" ON public.elite_habits
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Verify the policy is now correct
SELECT 'FIXED RLS POLICIES' as status,
       policyname,
       cmd,
       permissive,
       qual
FROM pg_policies
WHERE tablename = 'elite_habits' AND schemaname = 'public'
ORDER BY cmd;

-- 4. Test frontend-style insertion with proper user context
-- This simulates what happens when the frontend tries to insert
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT;
BEGIN
    -- Get a real user
    SELECT u.id, u.email INTO test_user_id, test_email
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 1;

    -- Set the auth context (this is what Supabase does automatically)
    PERFORM set_config('request.jwt.claims', json_build_object('sub', test_user_id)::text, true);

    -- Now try the insert exactly like the frontend does
    INSERT INTO public.elite_habits (
        user_id,
        exercise_type,
        duration_minutes,
        date
    ) VALUES (
        test_user_id,
        'RLS POLICY TEST',
        10,
        CURRENT_DATE::TEXT
    );

    RAISE NOTICE 'SUCCESS: RLS INSERT policy test passed for user %', test_email;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR: RLS INSERT policy test failed: %', SQLERRM;
END $$;

-- 5. Check the result
SELECT 'RLS TEST RESULT' as status,
       exercise_type,
       user_email,
       created_at
FROM public.elite_habits
WHERE exercise_type = 'RLS POLICY TEST'
ORDER BY created_at DESC;