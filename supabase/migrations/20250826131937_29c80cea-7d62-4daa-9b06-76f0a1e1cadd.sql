-- Clean up NULL user_id records and fix the sync system

-- First, delete orphaned subscription records with NULL user_id
DELETE FROM public.pro_subscriptions WHERE user_id IS NULL;

-- Make user_id not nullable in days_remaining to prevent future issues  
ALTER TABLE public.days_remaining ALTER COLUMN user_id SET NOT NULL;

-- Update sync function to handle edge cases better
CREATE OR REPLACE FUNCTION public.sync_days_remaining_table()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_email TEXT;
  calculated_days INTEGER;
  normalized_sub_type TEXT;
BEGIN
  -- Handle DELETE operations
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.days_remaining WHERE subscription_id = OLD.id;
    RETURN OLD;
  END IF;
  
  -- Skip if user_id is NULL
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get user email from user_contact_info
  SELECT decrypt_email(uci.email_encrypted) INTO user_email
  FROM user_contact_info uci 
  WHERE uci.user_id = NEW.user_id;
  
  -- Normalize subscription type
  normalized_sub_type := CASE 
    WHEN NEW.subscription_type IN ('1_day', '7_day') THEN 'trial'
    WHEN NEW.subscription_type = '30_day' THEN 'monthly'
    WHEN NEW.subscription_type = '365_day' THEN 'yearly'
    ELSE NEW.subscription_type
  END;
  
  -- Calculate days remaining
  IF normalized_sub_type = 'trial' AND NEW.trial_end_date IS NOT NULL THEN
    calculated_days = GREATEST(0, EXTRACT(DAY FROM (NEW.trial_end_date - now()))::INTEGER);
  ELSIF normalized_sub_type IN ('monthly', 'yearly') AND NEW.subscription_end_date IS NOT NULL THEN
    calculated_days = GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - now()))::INTEGER);
  ELSE
    calculated_days = 0;
  END IF;
  
  -- Update days_remaining column in pro_subscriptions
  NEW.days_remaining = calculated_days;
  
  -- Upsert to days_remaining table
  INSERT INTO public.days_remaining (
    user_id, 
    email, 
    subscription_id, 
    subscription_type, 
    days_remaining,
    subscription_start_date,
    subscription_end_date,
    trial_start_date,
    trial_end_date,
    is_active
  ) VALUES (
    NEW.user_id,
    COALESCE(user_email, NEW.user_email, 'unknown@email.com'),
    NEW.id,
    normalized_sub_type,
    calculated_days,
    NEW.subscription_start_date,
    NEW.subscription_end_date,
    NEW.trial_start_date,
    NEW.trial_end_date,
    NEW.status = 'active'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    subscription_id = EXCLUDED.subscription_id,
    subscription_type = EXCLUDED.subscription_type,
    days_remaining = EXCLUDED.days_remaining,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    trial_start_date = EXCLUDED.trial_start_date,
    trial_end_date = EXCLUDED.trial_end_date,
    is_active = EXCLUDED.is_active,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Update the sync_all function to skip NULL user_id
CREATE OR REPLACE FUNCTION public.sync_all_days_remaining()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER := 0;
  rec RECORD;
  calculated_days INTEGER;
  normalized_sub_type TEXT;
BEGIN
  -- Update all pro_subscriptions with current days_remaining (skip NULL user_id)
  FOR rec IN 
    SELECT ps.*, COALESCE(decrypt_email(uci.email_encrypted), ps.user_email, 'unknown@email.com') as email
    FROM public.pro_subscriptions ps
    LEFT JOIN public.user_contact_info uci ON uci.user_id = ps.user_id
    WHERE ps.user_id IS NOT NULL
  LOOP
    -- Normalize subscription type
    normalized_sub_type := CASE 
      WHEN rec.subscription_type IN ('1_day', '7_day') THEN 'trial'
      WHEN rec.subscription_type = '30_day' THEN 'monthly'
      WHEN rec.subscription_type = '365_day' THEN 'yearly'
      ELSE rec.subscription_type
    END;
    
    -- Calculate days remaining
    IF normalized_sub_type = 'trial' AND rec.trial_end_date IS NOT NULL THEN
      calculated_days = GREATEST(0, EXTRACT(DAY FROM (rec.trial_end_date - now()))::INTEGER);
    ELSIF normalized_sub_type IN ('monthly', 'yearly') AND rec.subscription_end_date IS NOT NULL THEN
      calculated_days = GREATEST(0, EXTRACT(DAY FROM (rec.subscription_end_date - now()))::INTEGER);
    ELSE
      calculated_days = 0;
    END IF;
    
    -- Update pro_subscriptions
    UPDATE public.pro_subscriptions 
    SET days_remaining = calculated_days
    WHERE id = rec.id;
    
    -- Upsert to days_remaining table
    INSERT INTO public.days_remaining (
      user_id, 
      email, 
      subscription_id, 
      subscription_type, 
      days_remaining,
      subscription_start_date,
      subscription_end_date,
      trial_start_date,
      trial_end_date,
      is_active
    ) VALUES (
      rec.user_id,
      rec.email,
      rec.id,
      normalized_sub_type,
      calculated_days,
      rec.subscription_start_date,
      rec.subscription_end_date,
      rec.trial_start_date,
      rec.trial_end_date,
      rec.status = 'active'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      subscription_id = EXCLUDED.subscription_id,
      subscription_type = EXCLUDED.subscription_type,
      days_remaining = EXCLUDED.days_remaining,
      subscription_start_date = EXCLUDED.subscription_start_date,
      subscription_end_date = EXCLUDED.subscription_end_date,
      trial_start_date = EXCLUDED.trial_start_date,
      trial_end_date = EXCLUDED.trial_end_date,
      is_active = EXCLUDED.is_active,
      updated_at = now();
      
    updated_count := updated_count + 1;
  END LOOP;
  
  RETURN updated_count;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS sync_days_remaining_table_trigger ON public.pro_subscriptions;
CREATE TRIGGER sync_days_remaining_table_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_days_remaining_table();

-- Now populate the table
SELECT public.sync_all_days_remaining();