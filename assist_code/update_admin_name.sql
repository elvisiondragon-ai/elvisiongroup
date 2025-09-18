-- Update admin name from [Admin_Renata] to Renata
-- This will change both profile and all historical chat messages

-- Step 1: Update profile display name
UPDATE profiles 
SET display_name = 'Renata'
WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
  AND display_name = '[Admin_Renata]';

-- Step 2: Update all historical chat messages
UPDATE chat_messages 
SET user_name = 'Renata'
WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
  AND user_name = '[Admin_Renata]';

-- Step 3: Verify the changes
SELECT 'Profile updated:' as info;
SELECT user_id, display_name, is_admin, level 
FROM profiles 
WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';

SELECT 'Chat messages updated:' as info;
SELECT user_id, user_name, LEFT(message, 50) as message_preview, created_at
FROM chat_messages 
WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
ORDER BY created_at DESC
LIMIT 5;