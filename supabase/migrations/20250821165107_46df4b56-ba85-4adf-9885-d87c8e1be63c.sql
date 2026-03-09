-- Enable RLS on pro_subscriptions table
ALTER TABLE public.pro_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pro_subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.pro_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.pro_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.pro_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Verified admins can view all subscriptions"
ON public.pro_subscriptions
FOR SELECT
USING (is_verified_admin(auth.uid()));

-- Create function to automatically start trial for new users
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
  
  -- Start 2-day trial automatically
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email,
    subscription_type,
    status,
    trial_start_date,
    trial_end_date
  ) VALUES (
    NEW.id,
    user_email,
    'trial',
    'active',
    now(),
    now() + INTERVAL '2 days'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to start trial on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_trial();

-- Update check_pro_status function to handle trial expiration
CREATE OR REPLACE FUNCTION public.check_pro_status(p_user_id uuid)
RETURNS TABLE(is_pro boolean, subscription_type text, status text, expires_at timestamp with time zone, days_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  sub_record RECORD;
  expires TIMESTAMPTZ;
  remaining_days INTEGER;
BEGIN
  SELECT * INTO sub_record
  FROM public.pro_subscriptions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Determine expiration date
  IF sub_record.subscription_type = 'trial' THEN
    expires := sub_record.trial_end_date;
  ELSE
    expires := sub_record.subscription_end_date;
  END IF;
  
  -- Calculate remaining days
  remaining_days := EXTRACT(DAY FROM (expires - now()));
  
  -- Check if expired
  IF expires < now() AND sub_record.status = 'active' THEN
    -- Update status to expired
    UPDATE public.pro_subscriptions 
    SET status = 'expired', updated_at = now()
    WHERE user_id = p_user_id;
    
    RETURN QUERY SELECT false, sub_record.subscription_type, 'expired'::TEXT, expires, remaining_days;
  ELSE
    RETURN QUERY SELECT 
      (sub_record.status = 'active'), 
      sub_record.subscription_type, 
      sub_record.status, 
      expires, 
      remaining_days;
  END IF;
END;
$$;

-- Function to check verse access based on level and pro status
CREATE OR REPLACE FUNCTION public.can_access_verse(p_user_id uuid, p_verse_number integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_level INTEGER;
  is_pro_user BOOLEAN;
  pro_status RECORD;
BEGIN
  -- Get user level
  SELECT level INTO user_level
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- Get pro status
  SELECT * INTO pro_status
  FROM public.check_pro_status(p_user_id);
  
  is_pro_user := COALESCE(pro_status.is_pro, false);
  
  -- Pro users can access verses 1-4 regardless of level
  IF is_pro_user AND p_verse_number <= 4 THEN
    RETURN true;
  END IF;
  
  -- Level-based access for non-pro users
  CASE p_verse_number
    WHEN 1 THEN RETURN user_level >= 3;
    WHEN 2 THEN RETURN user_level >= 4;
    WHEN 3 THEN RETURN user_level >= 4;
    WHEN 4 THEN RETURN user_level >= 5;
    ELSE RETURN false;
  END CASE;
END;
$$;