-- Create function to manually add pro users by email
CREATE OR REPLACE FUNCTION public.add_pro_user_by_email(
  p_email TEXT,
  p_subscription_type TEXT DEFAULT 'monthly',
  p_duration_days INTEGER DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_record RECORD;
  start_date TIMESTAMPTZ;
  end_date TIMESTAMPTZ;
  result jsonb;
BEGIN
  -- Calculate dates
  start_date := now();
  end_date := start_date + (p_duration_days || ' days')::INTERVAL;
  
  -- Get user info if they exist
  SELECT u.id, p.display_name INTO user_record
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.email = p_email;
  
  -- Insert/update pro_user record
  INSERT INTO public.pro_user (
    email,
    status,
    subscription_type,
    start_date,
    end_date,
    amount,
    currency,
    payment_method
  ) VALUES (
    p_email,
    'active',
    p_subscription_type,
    start_date,
    end_date,
    CASE 
      WHEN p_subscription_type = 'yearly' THEN 1200000.00  -- 1.2M IDR yearly
      ELSE 100000.00  -- 100K IDR monthly
    END,
    'IDR',
    'Manual Grant'
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    status = 'active',
    subscription_type = EXCLUDED.subscription_type,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    amount = EXCLUDED.amount,
    updated_at = now();
  
  -- If user exists, create/update pro_subscription record and sync pro status
  IF user_record.id IS NOT NULL THEN
    -- Create pro_subscription record
    INSERT INTO public.pro_subscriptions (
      user_id,
      user_email,
      subscription_type,
      status,
      subscription_start_date,
      subscription_end_date,
      amount_paid,
      currency
    ) VALUES (
      user_record.id,
      p_email,
      p_subscription_type,
      'active',
      start_date,
      end_date,
      CASE 
        WHEN p_subscription_type = 'yearly' THEN 1200000.00
        ELSE 100000.00
      END,
      'IDR'
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      subscription_type = EXCLUDED.subscription_type,
      status = 'active',
      subscription_start_date = EXCLUDED.subscription_start_date,
      subscription_end_date = EXCLUDED.subscription_end_date,
      amount_paid = EXCLUDED.amount_paid,
      updated_at = now();
    
    -- Sync pro status to add 'pro' achievement
    PERFORM public.sync_pro_status_from_subscription(user_record.id);
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Pro status granted successfully',
      'user_found', true,
      'user_id', user_record.id,
      'display_name', user_record.display_name,
      'email', p_email,
      'subscription_type', p_subscription_type,
      'start_date', start_date,
      'end_date', end_date
    );
  ELSE
    result := jsonb_build_object(
      'success', true,
      'message', 'Pro user record created (user not yet registered)',
      'user_found', false,
      'email', p_email,
      'subscription_type', p_subscription_type,
      'start_date', start_date,
      'end_date', end_date,
      'note', 'Pro status will activate when user registers'
    );
  END IF;
  
  RETURN result;
END;
$function$;

-- Create function to check pro status by email (for VPS integration)
CREATE OR REPLACE FUNCTION public.check_pro_status(p_user_id uuid)
RETURNS TABLE(
  is_pro boolean,
  subscription_type text,
  status text,
  expires_at timestamp with time zone,
  days_remaining integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  pro_record RECORD;
  has_pro_achievement boolean;
  expires TIMESTAMPTZ;
  remaining_days INTEGER;
BEGIN
  -- Check if user has 'pro' achievement in profile
  SELECT 'pro' = ANY(achievements) INTO has_pro_achievement
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  has_pro_achievement := COALESCE(has_pro_achievement, false);
  
  -- Get active pro subscription
  SELECT * INTO pro_record
  FROM public.pro_subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Determine expiration date
  IF pro_record.subscription_type = 'trial' THEN
    expires := pro_record.trial_end_date;
  ELSE
    expires := pro_record.subscription_end_date;
  END IF;
  
  -- Calculate remaining days
  remaining_days := EXTRACT(DAY FROM (expires - now()));
  
  -- Check if expired and update status if needed
  IF expires IS NOT NULL AND expires < now() AND pro_record.status = 'active' THEN
    -- Update status to expired
    UPDATE public.pro_subscriptions 
    SET status = 'expired', updated_at = now()
    WHERE user_id = p_user_id AND status = 'active';
    
    -- Remove pro achievement
    PERFORM public.revoke_pro_status(p_user_id);
    
    RETURN QUERY SELECT false, pro_record.subscription_type, 'expired'::text, expires, remaining_days;
  ELSE
    RETURN QUERY SELECT 
      has_pro_achievement AND (expires IS NULL OR expires > now()),
      COALESCE(pro_record.subscription_type, 'none'), 
      COALESCE(pro_record.status, 'inactive'), 
      expires, 
      remaining_days;
  END IF;
END;
$function$;

-- Add the two pro users
SELECT public.add_pro_user_by_email('evira.rotorasiko37@gmail.com', 'monthly', 30);
SELECT public.add_pro_user_by_email('jraymondsusilo@gmail.com', 'yearly', 365);