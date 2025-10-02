-- Fix avatar URL for Made Bangli
-- Step 1: Clear the broken URL
UPDATE profiles SET avatar_url = NULL WHERE user_id = '9c03719b-0e18-4851-b6ec-0abc3981df9a';

-- Step 2: Set the correct URL (single line, no breaks)
UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/madebangli.png' WHERE user_id = '9c03719b-0e18-4851-b6ec-0abc3981df9a';

-- Step 3: Verify the fix
SELECT user_id, display_name, avatar_url FROM profiles WHERE user_id = '9c03719b-0e18-4851-b6ec-0abc3981df9a';