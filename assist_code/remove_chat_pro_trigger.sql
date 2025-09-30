-- Remove the chat pro status trigger and functions

-- Drop the trigger
DROP TRIGGER IF EXISTS trigger_enrich_chat_pro_status ON public.chat_messages;

-- Drop the trigger function
DROP FUNCTION IF EXISTS enrich_chat_message_with_pro_status();

-- Drop the helper function
DROP FUNCTION IF EXISTS get_user_pro_status(UUID);