-- Analysis SQL for reflections table cleanup
-- Run these queries to understand current state before making changes

-- 1. Check current data state
SELECT
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_email IS NULL THEN 1 END) as null_user_emails,
    COUNT(CASE WHEN reflection IS NULL THEN 1 END) as null_reflections,
    COUNT(CASE WHEN content IS NULL THEN 1 END) as null_content,
    COUNT(CASE WHEN question IS NULL THEN 1 END) as null_questions
FROM reflections;

-- 2. Check duplicate data between reflection and content
SELECT
    COUNT(*) as total,
    COUNT(CASE WHEN reflection = content THEN 1 END) as matching_reflection_content,
    COUNT(CASE WHEN reflection != content OR (reflection IS NULL AND content IS NOT NULL) OR (reflection IS NOT NULL AND content IS NULL) THEN 1 END) as different_data
FROM reflections
WHERE reflection IS NOT NULL OR content IS NOT NULL;

-- 3. Check users with null emails
SELECT user_id, created_at, reflection, content, question
FROM reflections
WHERE user_email IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check if we can populate user_email from profiles table
SELECT
    r.id,
    r.user_id,
    r.user_email as current_email,
    p.user_email as profile_email
FROM reflections r
LEFT JOIN profiles p ON r.user_id::text = p.user_id::text
WHERE r.user_email IS NULL
LIMIT 10;

-- 5. Verify data consistency - are reflection and content always the same?
SELECT *
FROM reflections
WHERE (reflection IS NOT NULL AND content IS NOT NULL AND reflection != content)
   OR (reflection IS NULL AND content IS NOT NULL)
   OR (reflection IS NOT NULL AND content IS NULL)
LIMIT 10;