-- Create separate days_remaining table and sync from pro_subscriptions
-- This table tracks days remaining for all users including trial and paid subscriptions
-- Includes email search capability for admin queries

-- 1. Create the days_remaining table with email for searchability
CREATE TABLE IF NOT EXISTS public.days_remaining (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_id UUID REFERENCES public.pro_subscriptions(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('trial', 'monthly', 'yearly')),
  days_remaining INTEGER NOT NULL DEFAULT 0,
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  trial_start_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure one active record per user
  CONSTRAINT unique_active_user_days_remaining 
    UNIQUE (user_id) WHERE is_active = true
);

-- 2. Create indexes for performance including email search
CREATE INDEX IF NOT EXISTS idx_days_remaining_user_id ON public.days_remaining(user_id);
CREATE INDEX IF NOT EXISTS idx_days_remaining_email ON public.days_remaining(email);
CREATE INDEX IF NOT EXISTS idx_days_remaining_subscription_id ON public.days_remaining(subscription_id);
CREATE INDEX IF NOT EXISTS idx_days_remaining_active ON public.days_remaining(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_days_remaining_days ON public.days_remaining(days_remaining);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.days_remaining ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Users can view their own days_remaining" ON public.days_remaining
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own days_remaining" ON public.days_remaining
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own days_remaining" ON public.days_remaining
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Create function to sync days_remaining table from pro_subscriptions
CREATE OR REPLACE FUNCTION public.sync_days_remaining_table()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  calculated_days INTEGER;
  user_email TEXT;
BEGIN
  -- Get user email from profiles table
  SELECT email INTO user_email 
  FROM public.profiles 
  WHERE id = NEW.user_id;

  -- Calculate days remaining based on subscription type
  IF NEW.subscription_type = 'trial' AND NEW.trial_end_date IS NOT NULL THEN
    calculated_days = GREATEST(0, EXTRACT(DAY FROM (NEW.trial_end_date - now()))::INTEGER);
  ELSIF NEW.subscription_type IN ('monthly', 'yearly') AND NEW.subscription_end_date IS NOT NULL THEN
    calculated_days = GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - now()))::INTEGER);
  ELSE
    calculated_days = 0;
  END IF;

  -- Insert or update the days_remaining table
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
  )
  VALUES (
    NEW.user_id,
    user_email,
    NEW.id,
    NEW.subscription_type,
    calculated_days,
    NEW.subscription_start_date,
    NEW.subscription_end_date,
    NEW.trial_start_date,
    NEW.trial_end_date,
    NEW.is_active
  )
  ON CONFLICT (user_id) WHERE is_active = true
  DO UPDATE SET
    email = user_email,
    subscription_id = NEW.id,
    subscription_type = NEW.subscription_type,
    days_remaining = calculated_days,
    subscription_start_date = NEW.subscription_start_date,
    subscription_end_date = NEW.subscription_end_date,
    trial_start_date = NEW.trial_start_date,
    trial_end_date = NEW.trial_end_date,
    is_active = NEW.is_active,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- 6. Create trigger to automatically sync days_remaining table
DROP TRIGGER IF EXISTS sync_days_remaining_table_trigger ON public.pro_subscriptions;
CREATE TRIGGER sync_days_remaining_table_trigger
  AFTER INSERT OR UPDATE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_days_remaining_table();

-- 7. Create function for batch sync of all days_remaining records
CREATE OR REPLACE FUNCTION public.batch_sync_days_remaining_table()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER := 0;
  rec RECORD;
  calculated_days INTEGER;
  user_email TEXT;
BEGIN
  -- Loop through all active pro_subscriptions and sync to days_remaining table
  FOR rec IN 
    SELECT ps.*, p.email 
    FROM public.pro_subscriptions ps
    JOIN public.profiles p ON ps.user_id = p.id
    WHERE ps.is_active = true
  LOOP
    -- Calculate days remaining for this record
    IF rec.subscription_type = 'trial' AND rec.trial_end_date IS NOT NULL THEN
      calculated_days = GREATEST(0, EXTRACT(DAY FROM (rec.trial_end_date - now()))::INTEGER);
    ELSIF rec.subscription_type IN ('monthly', 'yearly') AND rec.subscription_end_date IS NOT NULL THEN
      calculated_days = GREATEST(0, EXTRACT(DAY FROM (rec.subscription_end_date - now()))::INTEGER);
    ELSE
      calculated_days = 0;
    END IF;

    -- Insert or update the days_remaining table
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
    )
    VALUES (
      rec.user_id,
      rec.email,
      rec.id,
      rec.subscription_type,
      calculated_days,
      rec.subscription_start_date,
      rec.subscription_end_date,
      rec.trial_start_date,
      rec.trial_end_date,
      rec.is_active
    )
    ON CONFLICT (user_id) WHERE is_active = true
    DO UPDATE SET
      email = rec.email,
      subscription_id = rec.id,
      subscription_type = rec.subscription_type,
      days_remaining = calculated_days,
      subscription_start_date = rec.subscription_start_date,
      subscription_end_date = rec.subscription_end_date,
      trial_start_date = rec.trial_start_date,
      trial_end_date = rec.trial_end_date,
      is_active = rec.is_active,
      updated_at = now();

    updated_count := updated_count + 1;
  END LOOP;

  RETURN updated_count;
END;
$$;

-- 8. Create function to get days remaining by email (for admin queries)
CREATE OR REPLACE FUNCTION public.get_days_remaining_by_email(p_email TEXT)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  subscription_type TEXT,
  days_remaining INTEGER,
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  trial_start_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dr.user_id,
    dr.email,
    dr.subscription_type,
    dr.days_remaining,
    dr.subscription_start_date,
    dr.subscription_end_date,
    dr.trial_start_date,
    dr.trial_end_date,
    dr.is_active
  FROM public.days_remaining dr
  WHERE dr.email ILIKE p_email
    AND dr.is_active = true;
END;
$$;

-- 9. Create function to get days remaining for a user by user_id (convenience function)
CREATE OR REPLACE FUNCTION public.get_user_days_remaining(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  days_left INTEGER;
BEGIN
  SELECT days_remaining INTO days_left
  FROM public.days_remaining
  WHERE user_id = p_user_id AND is_active = true;
  
  RETURN COALESCE(days_left, 0);
END;
$$;

-- 10. Initial sync of existing pro_subscriptions data
SELECT public.batch_sync_days_remaining_table();