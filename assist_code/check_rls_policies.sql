-- Check RLS policies specifically for reflections table
-- Run this in Supabase SQL Editor

-- 1. Check if RLS is enabled on reflections table
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'reflections';

-- 2. Check all RLS policies on reflections table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'reflections';

-- 3. If no INSERT policy exists, create one
-- (Uncomment and run if needed)
/*
CREATE POLICY "Users can insert their own reflections"
ON reflections
FOR INSERT
WITH CHECK (auth.uid() = user_id);
*/

-- 4. Check if auth.uid() is working properly
SELECT auth.uid() as current_user_id;

-- 5. Test a manual insert with current user
-- (Replace with actual auth.uid() from query above)
/*
INSERT INTO reflections (user_id, question, reflection)
VALUES (auth.uid(), 'Test question', 'Test reflection from SQL');
*/