-- VERIFICATION: Check if user_email is actually NOT NULL and all nulls were fixed

-- 1. Check if any null user_emails remain
SELECT
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_email IS NULL THEN 1 END) as null_emails_remaining,
    COUNT(CASE WHEN user_email IS NOT NULL THEN 1 END) as non_null_emails
FROM reflections;

-- 2. Check if NOT NULL constraint is applied
SELECT
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'reflections'
  AND column_name = 'user_email';

-- 3. Show sample of current data to verify emails are populated
SELECT
    id,
    user_id,
    user_email,
    LEFT(reflection, 50) || '...' as reflection_preview,
    created_at
FROM reflections
ORDER BY created_at DESC
LIMIT 5;