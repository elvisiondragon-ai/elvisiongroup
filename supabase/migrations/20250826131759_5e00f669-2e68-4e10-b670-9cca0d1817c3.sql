-- PART 2: Complete the days_remaining sync system and functions

-- Create comprehensive sync function for days_remaining table
CREATE OR REPLACE FUNCTION public.sync_days_remaining_table()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_email TEXT;
  calculated_days INTEGER;
BEGIN
  -- Get user email from user_contact_info
  SELECT decrypt_email(uci.email_encrypted) INTO user_email
  FROM user_contact_info uci 
  WHERE uci.user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  -- Use NEW record for INSERT/UPDATE operations
  IF TG_OP = 'DELETE' THEN
    -- Remove from days_remaining table
    DELETE FROM public.days_remaining WHERE subscription_id = OLD.id;
    RETURN OLD;
  END IF;
  
  -- Calculate days remaining
  IF NEW.subscription_type = 'trial' AND NEW.trial_end_date IS NOT NULL THEN
    calculated_days = GREATEST(0, EXTRACT(DAY FROM (NEW.trial_end_date - now()))::INTEGER);
  ELSIF NEW.subscription_type IN ('monthly', 'yearly') AND NEW.subscription_end_date IS NOT NULL THEN
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
    NEW.subscription_type,
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

-- Create the comprehensive trigger
CREATE TRIGGER sync_days_remaining_table_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_days_remaining_table();

-- Search function for admin dashboard
CREATE OR REPLACE FUNCTION public.get_days_remaining_by_email(search_email text)
RETURNS TABLE(
  user_id uuid,
  email text,
  display_name text,
  subscription_type text,
  days_remaining integer,
  subscription_start_date timestamptz,
  subscription_end_date timestamptz,
  trial_start_date timestamptz,
  trial_end_date timestamptz,
  is_active boolean,
  level integer,
  experience_points integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only verified admins can use this function
  IF NOT is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    dr.user_id,
    dr.email,
    p.display_name,
    dr.subscription_type,
    dr.days_remaining,
    dr.subscription_start_date,
    dr.subscription_end_date,
    dr.trial_start_date,
    dr.trial_end_date,
    dr.is_active,
    p.level,
    p.experience_points
  FROM public.days_remaining dr
  JOIN public.profiles p ON p.user_id = dr.user_id
  WHERE dr.email ILIKE '%' || search_email || '%'
  ORDER BY dr.days_remaining DESC, dr.updated_at DESC;
END;
$$;

-- Batch sync function for all records
CREATE OR REPLACE FUNCTION public.sync_all_days_remaining()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER := 0;
  rec RECORD;
  user_email TEXT;
  calculated_days INTEGER;
BEGIN
  -- Update all pro_subscriptions with current days_remaining
  FOR rec IN 
    SELECT ps.*, COALESCE(decrypt_email(uci.email_encrypted), ps.user_email, 'unknown@email.com') as email
    FROM public.pro_subscriptions ps
    LEFT JOIN public.user_contact_info uci ON uci.user_id = ps.user_id
  LOOP
    -- Calculate days remaining
    IF rec.subscription_type = 'trial' AND rec.trial_end_date IS NOT NULL THEN
      calculated_days = GREATEST(0, EXTRACT(DAY FROM (rec.trial_end_date - now()))::INTEGER);
    ELSIF rec.subscription_type IN ('monthly', 'yearly') AND rec.subscription_end_date IS NOT NULL THEN
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
      rec.subscription_type,
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

-- Populate the days_remaining table with existing data
SELECT public.sync_all_days_remaining();