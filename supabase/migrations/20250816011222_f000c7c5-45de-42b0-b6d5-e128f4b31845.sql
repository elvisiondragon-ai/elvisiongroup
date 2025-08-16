-- Function to clean up existing user display names by removing email domains
CREATE OR REPLACE FUNCTION public.cleanup_user_display_names()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update all profiles where display_name contains @ symbol
  UPDATE public.profiles 
  SET display_name = CASE 
    WHEN display_name LIKE '%@%' THEN split_part(display_name, '@', 1)
    ELSE display_name
  END,
  updated_at = now()
  WHERE display_name LIKE '%@%';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Log the cleanup action
  PERFORM public.log_sensitive_action(
    'user_display_names_cleanup',
    'profiles',
    NULL,
    jsonb_build_object(
      'updated_count', updated_count,
      'cleanup_time', now()
    )
  );
  
  RETURN updated_count;
END;
$$;

-- Execute the cleanup function to fix existing users
SELECT public.cleanup_user_display_names();

-- Update the existing handle_new_user function to ensure it always extracts username from email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  username TEXT;
BEGIN
  -- Extract username from email (part before @)
  username := CASE 
    WHEN NEW.email LIKE '%@%' THEN split_part(NEW.email, '@', 1)
    ELSE COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email, 'Anonymous')
  END;
  
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    username
  );
  
  RETURN NEW;
END;
$$;