-- Fix the handle_new_user_trial function to include missing ip_address field
CREATE OR REPLACE FUNCTION public.handle_new_user_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get user email
  user_email := NEW.email;
  
  -- Start 3-day trial automatically (updated from 2 days)
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email,
    ip_address,
    subscription_type,
    status,
    trial_start_date,
    trial_end_date
  ) VALUES (
    NEW.id,
    user_email,
    'signup',  -- Default IP for automatic signups
    'trial',
    'active',
    now(),
    now() + INTERVAL '3 days'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent signup
    RAISE WARNING 'Failed to create trial subscription for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;