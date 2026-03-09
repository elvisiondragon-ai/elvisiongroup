-- SQL Fix for Admin Badge Implementation
-- STEP 1: First verify the is_admin columns exist (if not, create them)

-- Add is_admin column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add is_admin column to chat_messages table if it doesn't exist  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_messages' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE chat_messages ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- STEP 2: Set admin status for specific users (replace with actual admin user IDs)
-- Example: Set a specific user as admin
-- UPDATE profiles SET is_admin = TRUE WHERE user_id = 'your-admin-user-id-here';

-- STEP 3: Verify the changes
SELECT 'Profiles with admin status:' as info;
SELECT user_id, display_name, is_admin, level 
FROM profiles 
WHERE is_admin = true;

SELECT 'Chat messages schema verification:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'chat_messages' AND column_name IN ('is_admin', 'user_name', 'user_level')
ORDER BY ordinal_position;