-- Create pro_user table for subscription management
CREATE TABLE public.pro_user (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subscription_type TEXT NOT NULL DEFAULT 'monthly',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  amount NUMERIC,
  currency TEXT DEFAULT 'IDR',
  tripay_reference TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster email lookups
CREATE INDEX idx_pro_user_email ON public.pro_user(email);
CREATE INDEX idx_pro_user_status ON public.pro_user(status);
CREATE INDEX idx_pro_user_end_date ON public.pro_user(end_date);

-- Enable Row Level Security but with team-friendly policies
ALTER TABLE public.pro_user ENABLE ROW LEVEL SECURITY;

-- Policy for team members to manage all subscriptions (no restrictions)
CREATE POLICY "Team can manage all pro_user records" 
ON public.pro_user 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Function to calculate subscription end date
CREATE OR REPLACE FUNCTION public.calculate_subscription_end_date(
  p_subscription_type TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
BEGIN
  CASE p_subscription_type
    WHEN 'daily' THEN
      RETURN p_start_date + INTERVAL '1 day';
    WHEN 'weekly' THEN
      RETURN p_start_date + INTERVAL '7 days';
    WHEN 'monthly' THEN
      RETURN p_start_date + INTERVAL '30 days';
    WHEN 'yearly' THEN
      RETURN p_start_date + INTERVAL '365 days';
    ELSE
      RETURN p_start_date + INTERVAL '30 days'; -- Default to monthly
  END CASE;
END;
$$;

-- Function to check pro status from pro_user table
CREATE OR REPLACE FUNCTION public.check_pro_status(p_user_id UUID)
RETURNS TABLE(
  is_pro BOOLEAN,
  subscription_type TEXT,
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  days_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_email TEXT;
  user_record RECORD;
  remaining_days INTEGER;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = p_user_id;
  
  IF user_email IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Get user's pro subscription
  SELECT * INTO user_record
  FROM public.pro_user
  WHERE email = user_email
  AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Calculate remaining days
  remaining_days := EXTRACT(DAY FROM (user_record.end_date - now()));
  
  -- Check if subscription is still active
  IF user_record.end_date > now() THEN
    RETURN QUERY SELECT 
      true,
      user_record.subscription_type,
      user_record.status,
      user_record.end_date,
      remaining_days;
  ELSE
    -- Update expired subscriptions
    UPDATE public.pro_user 
    SET status = 'expired', updated_at = now()
    WHERE email = user_email AND status = 'active';
    
    RETURN QUERY SELECT 
      false,
      user_record.subscription_type,
      'expired'::TEXT,
      user_record.end_date,
      remaining_days;
  END IF;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_pro_user_updated_at
  BEFORE UPDATE ON public.pro_user
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live monitoring
ALTER TABLE public.pro_user REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pro_user;