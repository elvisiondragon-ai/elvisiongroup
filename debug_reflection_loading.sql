-- Debug why reflections aren't showing in the UI
-- Run this to identify the SELECT issue

-- 1. Check what SELECT policies exist
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reflections' AND cmd = 'SELECT';

-- 2. Test SELECT as authenticated user would (this simulates the app query)
-- First, let's see what user_ids exist in reflections
SELECT DISTINCT user_id, COUNT(*) as reflection_count
FROM reflections
GROUP BY user_id
ORDER BY reflection_count DESC;

-- 3. Test if we can select reflections for a specific user
-- Replace with actual user_id from above
SELECT *
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
ORDER BY created_at DESC;

-- 4. Check if auth.uid() is working in SELECT context
-- This will show if the RLS policy can match properly
SELECT
    user_id,
    reflection,
    created_at,
    auth.uid() as current_auth_uid,
    (auth.uid() = user_id) as auth_matches
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
LIMIT 5;

-- 5. Check if there are any conflicting SELECT policies
-- Multiple SELECT policies might be blocking reads
SELECT COUNT(*) as select_policy_count
FROM pg_policies
WHERE tablename = 'reflections' AND cmd = 'SELECT';

-- 6. If auth.uid() is null, let's temporarily create a more permissive SELECT policy
-- (Uncomment if needed for testing)
/*
CREATE POLICY "Temporary debug SELECT policy"
ON reflections
FOR SELECT
TO authenticated
USING (true);
*/