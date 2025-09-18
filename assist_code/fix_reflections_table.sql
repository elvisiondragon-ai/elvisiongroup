-- SAFE FIX for reflections table
-- Fix user_email nulls and remove unused content + question columns

-- STEP 1: Verify we can fix all null user_emails
SELECT
    COUNT(*) as null_emails_count,
    COUNT(p.user_email) as can_be_fixed_count
FROM reflections r
LEFT JOIN profiles p ON r.user_id::text = p.user_id::text
WHERE r.user_email IS NULL;

-- STEP 2: Preview the fix - what emails will be populated
SELECT
    r.id,
    r.user_id,
    r.user_email as current_email,
    p.user_email as will_be_set_to,
    CASE
        WHEN p.user_email IS NULL THEN '❌ CANNOT FIX - NO PROFILE EMAIL'
        ELSE '✅ CAN FIX'
    END as fix_status
FROM reflections r
LEFT JOIN profiles p ON r.user_id::text = p.user_id::text
WHERE r.user_email IS NULL;

-- STEP 3: EXECUTE FIX - Update null user_emails with data from profiles
UPDATE reflections
SET user_email = p.user_email
FROM profiles p
WHERE reflections.user_id::text = p.user_id::text
  AND reflections.user_email IS NULL
  AND p.user_email IS NOT NULL;

-- STEP 4: VERIFICATION - Check if all nulls are fixed
SELECT
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_email IS NULL THEN 1 END) as remaining_null_emails,
    COUNT(CASE WHEN user_email IS NOT NULL THEN 1 END) as fixed_emails
FROM reflections;

-- STEP 5: DROP unused columns - content and question (hardcoded in frontend)
ALTER TABLE reflections DROP COLUMN IF EXISTS content;
ALTER TABLE reflections DROP COLUMN IF EXISTS question;

-- STEP 6: ADD NOT NULL constraint to user_email (after fixing nulls)
ALTER TABLE reflections ALTER COLUMN user_email SET NOT NULL;

-- STEP 7: FINAL VERIFICATION
SELECT
    COUNT(*) as total_records,
    COUNT(user_email) as non_null_emails
FROM reflections;

-- STEP 8: Verify columns are removed
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'reflections'
ORDER BY ordinal_position;