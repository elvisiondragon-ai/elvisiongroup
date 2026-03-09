-- Function to clean up chat message user names by removing email domains
CREATE OR REPLACE FUNCTION public.cleanup_chat_message_user_names()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update all chat messages where user_name contains @ symbol
  UPDATE public.chat_messages 
  SET user_name = CASE 
    WHEN user_name LIKE '%@%' THEN split_part(user_name, '@', 1)
    ELSE user_name
  END
  WHERE user_name LIKE '%@%';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Log the cleanup action
  PERFORM public.log_sensitive_action(
    'chat_messages_user_names_cleanup',
    'chat_messages',
    NULL,
    jsonb_build_object(
      'updated_count', updated_count,
      'cleanup_time', now()
    )
  );
  
  RETURN updated_count;
END;
$$;

-- Execute the cleanup function to fix existing chat messages
SELECT public.cleanup_chat_message_user_names();

-- Update the create_chat_message function to use cleaned profile display_name
CREATE OR REPLACE FUNCTION public.create_chat_message(p_message text, p_channel_id text DEFAULT 'community'::text, p_is_private boolean DEFAULT false, p_allowed_users uuid[] DEFAULT NULL::uuid[])
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
  
  -- Get user profile for level and pro status
  SELECT level, 'pro' = ANY(achievements) as is_pro, display_name
  INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  -- Clean the username (remove email domain if present)
  clean_username := CASE 
    WHEN user_profile.display_name LIKE '%@%' THEN split_part(user_profile.display_name, '@', 1)
    ELSE COALESCE(user_profile.display_name, 'Anonymous')
  END;
  
  -- Insert the message with cleaned username
  INSERT INTO public.chat_messages (
    user_id,
    user_name, 
    user_level,
    is_pro,
    message,
    channel_id,
    is_private,
    allowed_users
  ) VALUES (
    auth.uid(),
    clean_username,
    COALESCE(user_profile.level, 1),
    COALESCE(user_profile.is_pro, false),
    p_message,
    p_channel_id,
    p_is_private,
    p_allowed_users
  ) RETURNING id INTO message_id;
  
  -- Log the message creation
  PERFORM public.log_data_access(
    'chat_messages',
    'message_created',
    message_id,
    jsonb_build_object(
      'channel_id', p_channel_id,
      'is_private', p_is_private,
      'message_length', length(p_message),
      'username', clean_username
    )
  );
  
  RETURN message_id;
END;
$$;