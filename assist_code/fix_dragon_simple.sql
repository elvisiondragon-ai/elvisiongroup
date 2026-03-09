-- Simple fix: Update any remaining "dragon" messages to "Renata"
UPDATE chat_messages 
SET user_name = 'Renata'
WHERE user_id = (SELECT user_id FROM profiles WHERE user_email = 'dragon@yahoo.com')
AND user_name = 'dragon';