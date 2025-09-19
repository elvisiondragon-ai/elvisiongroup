-- Add phone_number column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update the handle_new_user function to support phone_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  username TEXT;
BEGIN
  -- Extract username from email, with fallback to display_name or email
  username := CASE 
    WHEN NEW.email LIKE '%@%' THEN split_part(NEW.email, '@', 1)
    ELSE COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email, 'Anonymous')
  END;
  
  INSERT INTO public.profiles (user_id, display_name, phone_number)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', username),
    NEW.raw_user_meta_data->>'phone_number'
  );
  
  RETURN NEW;
END;
$$;