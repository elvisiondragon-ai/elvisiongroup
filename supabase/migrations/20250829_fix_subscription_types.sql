-- Fix subscription types corrupted by Loveable AI
-- Convert all subscription_type values to our correct format

-- 1. Fix existing subscription types
UPDATE pro_subscriptions 
SET subscription_type = CASE 
  WHEN subscription_type = 'monthly' THEN '1_month'
  WHEN subscription_type = 'yearly' THEN '1_year'  
  WHEN subscription_type = 'weekly' THEN '1_week'
  WHEN subscription_type = 'daily' THEN '1_day'
  WHEN subscription_type = 'trial' THEN 'trial'
  ELSE subscription_type
END
WHERE subscription_type IN ('monthly', 'yearly', 'weekly', 'daily') 
   OR subscription_type NOT IN ('1_month', '1_year', '1_week', '1_day', 'trial');

-- 2. Also fix pro_user table if it exists
UPDATE pro_user 
SET subscription_type = CASE 
  WHEN subscription_type = 'monthly' THEN '1_month'
  WHEN subscription_type = 'yearly' THEN '1_year'  
  WHEN subscription_type = 'weekly' THEN '1_week'
  WHEN subscription_type = 'daily' THEN '1_day'
  WHEN subscription_type = 'trial' THEN 'trial'
  ELSE subscription_type
END
WHERE subscription_type IN ('monthly', 'yearly', 'weekly', 'daily') 
   OR subscription_type NOT IN ('1_month', '1_year', '1_week', '1_day', 'trial');

-- 3. Add constraint to prevent future corruption
ALTER TABLE pro_subscriptions 
DROP CONSTRAINT IF EXISTS valid_subscription_types;

ALTER TABLE pro_subscriptions 
ADD CONSTRAINT valid_subscription_types 
CHECK (subscription_type IN ('1_month', '1_year', '1_week', '1_day', 'trial'));

-- 4. Update all admin functions to use correct subscription types
CREATE OR REPLACE FUNCTION public.add_pro_user_by_email(
  p_email TEXT,
  p_subscription_type TEXT DEFAULT '1_month', -- Changed default from 'monthly'
  p_duration_days INTEGER DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_record RECORD;
  start_date TIMESTAMPTZ := now();
  end_date TIMESTAMPTZ;
BEGIN
  -- Validate subscription type
  IF p_subscription_type NOT IN ('1_month', '1_year', '1_week', '1_day', 'trial') THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Invalid subscription type. Use: 1_month, 1_year, 1_week, 1_day, or trial'
    );
  END IF;

  -- Set end date based on subscription type or duration
  CASE p_subscription_type
    WHEN '1_day' THEN end_date := start_date + INTERVAL '1 day';
    WHEN '1_week' THEN end_date := start_date + INTERVAL '1 week';
    WHEN '1_month' THEN end_date := start_date + INTERVAL '1 month';
    WHEN '1_year' THEN end_date := start_date + INTERVAL '1 year';
    WHEN 'trial' THEN end_date := start_date + INTERVAL '3 days';
    ELSE end_date := start_date + (p_duration_days || ' days')::INTERVAL;
  END CASE;

  -- Try to find existing user
  SELECT id, display_name INTO user_record 
  FROM profiles p
  JOIN auth.users au ON au.id = p.user_id
  WHERE au.email = p_email;

  -- Insert or update pro_user record
  INSERT INTO public.pro_user (
    email,
    status,
    subscription_type,
    start_date,
    end_date,
    amount,
    currency,
    created_at,
    updated_at
  ) VALUES (
    p_email,
    'active',
    p_subscription_type, -- Now uses correct format
    start_date,
    end_date,
    CASE 
      WHEN p_subscription_type = '1_year' THEN 1200000.00  -- 1.2M IDR yearly
      WHEN p_subscription_type = '1_month' THEN 100000.00  -- 100K IDR monthly
      WHEN p_subscription_type = '1_week' THEN 25000.00    -- 25K IDR weekly
      WHEN p_subscription_type = '1_day' THEN 5000.00      -- 5K IDR daily
      ELSE 0.00  -- Trial is free
    END,
    'IDR',
    now(),
    now()
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    status = 'active',
    subscription_type = EXCLUDED.subscription_type,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    amount = EXCLUDED.amount,
    updated_at = now();

  -- If user exists, also update pro_subscriptions
  IF user_record.id IS NOT NULL THEN
    INSERT INTO public.pro_subscriptions (
      user_id,
      user_email,
      subscription_type,
      status,
      subscription_start_date,
      subscription_end_date,
      amount,
      currency,
      created_at,
      updated_at
    ) VALUES (
      user_record.id,
      p_email,
      p_subscription_type, -- Now uses correct format
      'active',
      start_date,
      end_date,
      CASE 
        WHEN p_subscription_type = '1_year' THEN 1200000.00
        WHEN p_subscription_type = '1_month' THEN 100000.00
        WHEN p_subscription_type = '1_week' THEN 25000.00
        WHEN p_subscription_type = '1_day' THEN 5000.00
        ELSE 0.00
      END,
      'IDR',
      now(),
      now()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      subscription_type = EXCLUDED.subscription_type,
      status = 'active',
      subscription_start_date = EXCLUDED.subscription_start_date,
      subscription_end_date = EXCLUDED.subscription_end_date,
      amount = EXCLUDED.amount,
      updated_at = now();

    RETURN jsonb_build_object(
      'success', true,
      'message', 'Pro user activated successfully',
      'user_found', true,
      'user_id', user_record.id,
      'display_name', user_record.display_name,
      'email', p_email,
      'subscription_type', p_subscription_type,
      'start_date', start_date,
      'end_date', end_date
    );
  ELSE
    RETURN jsonb_build_object(
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
END;
$function$;