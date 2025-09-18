-- STEP 1: Preview what will be updated (RUN THIS FIRST)
SELECT
    p.id,
    p.user_id,
    p.display_name,
    p.user_email as current_email,
    au.email as auth_email,
    'Will update to: ' || au.email as action
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE p.user_email IS NULL AND au.email IS NOT NULL;

-- STEP 2: Update missing user_emails from auth.users (RUN AFTER CONFIRMING STEP 1)
UPDATE profiles
SET
    user_email = au.email,
    updated_at = now()
FROM auth.users au
WHERE profiles.user_id = au.id
AND profiles.user_email IS NULL
AND au.email IS NOT NULL;

-- STEP 3: Verify the fix worked
SELECT
    COUNT(*) as total_profiles,
    COUNT(user_email) as profiles_with_email,
    COUNT(*) - COUNT(user_email) as remaining_null_emails
FROM profiles;

-- STEP 4: Check if any profiles still have null emails
SELECT
    p.id,
    p.user_id,
    p.user_email,
    au.email as auth_email,
    p.created_at
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE p.user_email IS NULL;