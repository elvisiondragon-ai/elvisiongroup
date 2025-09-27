-- Chat Schema Update: Clean Functions After Column Removal
-- File: assist_code/chat_schema_new.sql
-- Purpose: Update database functions to work with cleaned chat_messages table

-- Current chat_messages table structure after cleanup:
-- - id (uuid, primary key)
-- - user_id (uuid)
-- - user_name (text)
-- - user_level (integer)
-- - message (text)
-- - created_at (timestamp with time zone)
-- - channel_id (text)

-- Update the create_chat_message function
CREATE OR REPLACE FUNCTION create_chat_message(
  p_message TEXT,
  p_channel_id TEXT DEFAULT 'community'
) RETURNS UUID AS $$
DECLARE
  message_id UUID;
  user_profile RECORD;
  clean_username TEXT;
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(auth.uid(), 'chat_messages') THEN
    RAISE EXCEPTION 'Rate limit exceeded for chat messages';
  END IF;
  
  -- Get user profile for level and display name
  SELECT level, display_name
  INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  -- Clean the username
  clean_username := CASE 
    WHEN user_profile.display_name LIKE '%@%' THEN split_part(user_profile.display_name, '@', 1)
    ELSE COALESCE(user_profile.display_name, 'Anonymous')
  END;
  
  -- Insert ONLY the columns that exist now
  INSERT INTO public.chat_messages (
    user_id,
    user_name, 
    user_level,
    message,
    channel_id
  ) VALUES (
    auth.uid(),
    clean_username,
    COALESCE(user_profile.level, 1),
    p_message,
    p_channel_id
  ) RETURNING id INTO message_id;
  
  RETURN message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the send_chat_message function  
CREATE OR REPLACE FUNCTION send_chat_message(
  p_message TEXT,
  p_channel_id TEXT DEFAULT 'community'
) RETURNS UUID AS $$
DECLARE
  user_profile RECORD;
  clean_username TEXT;
  message_id UUID;
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(auth.uid(), 'chat_messages') THEN
    RAISE EXCEPTION 'Rate limit exceeded for chat messages';
  END IF;

  -- Get user profile for level and display name
  SELECT level, display_name
  INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Clean the username
  clean_username := CASE
    WHEN user_profile.display_name LIKE '%@%' THEN
      split_part(user_profile.display_name, '@', 1)
    ELSE COALESCE(user_profile.display_name, 'Anonymous')
  END;

  -- Insert ONLY the columns that exist now
  INSERT INTO public.chat_messages (
    user_id,
    user_name,
    user_level,
    message,
    channel_id
  ) VALUES (
    auth.uid(),
    clean_username,
    COALESCE(user_profile.level, 1),
    p_message,
    p_channel_id
  ) RETURNING id INTO message_id;

  RETURN message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if triggers need updating (these might also reference old columns)
-- You may need to update these triggers if they reference dropped columns:
-- - audit_chat_messages_trigger -> audit_chat_access()
-- - trigger_set_subscription_type -> set_message_subscription_type()

-- Drop the subscription type trigger since that column no longer exists
DROP TRIGGER IF EXISTS trigger_set_subscription_type ON chat_messages;

-- Update the audit function if needed (remove references to dropped columns)
-- Note: You'll need to check the audit_chat_access() function definition
-- and update it to only reference existing columns

-- Force PostgREST schema reload
SELECT pg_notify('pgrst', 'reload schema');

-- Verify the updated table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
ORDER BY ordinal_position;

-- Test the updated function
-- SELECT create_chat_message('Test message after schema update', 'community');