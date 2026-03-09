-- Verify current admin messages from dragon@yahoo.com ([Admin_Renata])
-- This should show messages that will display admin badges

SELECT 
    user_id,
    user_name, 
    user_level,
    is_pro,
    is_admin,
    message,
    created_at
FROM chat_messages 
WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
   OR user_name = '[Admin_Renata]'
ORDER BY created_at DESC
LIMIT 10;