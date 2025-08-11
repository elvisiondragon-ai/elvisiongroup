-- Create VIP subscriptions table
CREATE TABLE public.vip_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  ip_address TEXT,
  subscription_type TEXT CHECK (subscription_type IN ('trial', 'monthly', 'yearly')) NOT NULL DEFAULT 'trial',
  status TEXT CHECK (status IN ('active', 'expired', 'cancelled', 'pending')) NOT NULL DEFAULT 'pending',
  trial_start_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'IDR',
  tripay_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.vip_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tripay_reference TEXT NOT NULL UNIQUE,
  tripay_merchant_ref TEXT NOT NULL,
  payment_method TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'cancelled')) NOT NULL DEFAULT 'pending',
  payment_url TEXT,
  payment_instructions JSONB,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  callback_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vip_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for vip_subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.vip_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.vip_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.vip_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for payment_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.payment_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_vip_subscriptions_updated_at
BEFORE UPDATE ON public.vip_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to start trial
CREATE OR REPLACE FUNCTION public.start_vip_trial(p_user_id UUID, p_email TEXT, p_ip_address TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  subscription_id UUID;
  trial_end TIMESTAMPTZ;
BEGIN
  -- Calculate trial end date (3 days from now)
  trial_end := now() + INTERVAL '3 days';
  
  -- Insert or update VIP subscription
  INSERT INTO public.vip_subscriptions (
    user_id, 
    email, 
    ip_address,
    subscription_type,
    status,
    trial_start_date,
    trial_end_date
  ) VALUES (
    p_user_id, 
    p_email, 
    p_ip_address,
    'trial',
    'active',
    now(),
    trial_end
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    subscription_type = 'trial',
    status = 'active',
    trial_start_date = now(),
    trial_end_date = trial_end,
    updated_at = now()
  RETURNING id INTO subscription_id;
  
  RETURN subscription_id;
END;
$$;

-- Create function to check VIP status
CREATE OR REPLACE FUNCTION public.check_vip_status(p_user_id UUID)
RETURNS TABLE(
  is_vip BOOLEAN,
  subscription_type TEXT,
  status TEXT,
  expires_at TIMESTAMPTZ,
  days_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sub_record RECORD;
  expires TIMESTAMPTZ;
  remaining_days INTEGER;
BEGIN
  SELECT * INTO sub_record
  FROM public.vip_subscriptions
  WHERE user_id = p_user_id;
  
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
    UPDATE public.vip_subscriptions 
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