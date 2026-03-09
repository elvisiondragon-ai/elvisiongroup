-- FIX USER_EMAIL NOT NULL CONSTRAINT ERROR
-- Error: null value in column "user_email" violates not-null constraint

-- First, make user_email column nullable
ALTER TABLE profiles ALTER COLUMN user_email DROP NOT NULL;

-- Set default value for existing NULL user_email records
UPDATE profiles 
SET user_email = 'unknown@example.com' 
WHERE user_email IS NULL;

-- Verify the fix
SELECT 'USER_EMAIL CONSTRAINT FIXED' as status, 
       COUNT(*) as total_profiles,
       COUNT(CASE WHEN user_email IS NULL THEN 1 END) as null_emails
FROM profiles;

-- Show sample of fixed data
SELECT user_id, display_name, user_email, is_pro 
FROM profiles 
LIMIT 5;