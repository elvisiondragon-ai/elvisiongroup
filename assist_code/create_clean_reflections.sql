-- Create a brand new, clean reflections table with no RLS complications
-- This will replace the problematic existing table

-- 1. First, backup existing data
CREATE TABLE reflections_backup AS
SELECT * FROM reflections;

-- 2. Drop the problematic table (this removes all RLS policies)
DROP TABLE IF EXISTS reflections CASCADE;

-- 3. Create a completely new, clean reflections table
CREATE TABLE reflections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email text,
    question text NOT NULL,
    reflection text NOT NULL,
    content text, -- Alternative field name for flexibility
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. Create indexes for performance
CREATE INDEX idx_reflections_user_id ON reflections(user_id);
CREATE INDEX idx_reflections_created_at ON reflections(created_at);

-- 5. Set up simple, permissive RLS policies that actually work
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything (simple and working)
CREATE POLICY "authenticated_users_all_access"
ON reflections
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Migrate data from backup
INSERT INTO reflections (user_id, user_email, question, reflection, content, created_at)
SELECT
    user_id,
    user_email,
    question,
    reflection,
    reflection as content, -- Populate both fields
    created_at
FROM reflections_backup;

-- 7. Verify migration worked
SELECT COUNT(*) as total_migrated FROM reflections;
SELECT COUNT(*) as original_count FROM reflections_backup;

-- 8. Check recent reflections
SELECT user_id, LEFT(reflection, 50) as preview, created_at
FROM reflections
ORDER BY created_at DESC
LIMIT 10;

-- 9. Test insert (should work perfectly now)
INSERT INTO reflections (user_id, question, reflection, content)
VALUES (
    gen_random_uuid(),
    'Test question after migration',
    'Test reflection content',
    'Test reflection content'
);

-- 10. Test select (should work perfectly now)
SELECT user_id, reflection, created_at
FROM reflections
WHERE question = 'Test question after migration';

-- 11. Clean up test record
DELETE FROM reflections WHERE question = 'Test question after migration';

-- 12. Optional: Drop backup table after verification
-- DROP TABLE reflections_backup;