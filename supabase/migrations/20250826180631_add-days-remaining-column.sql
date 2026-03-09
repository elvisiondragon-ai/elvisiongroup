-- Add days_remaining column to pro_subscriptions table
-- This column will be auto-calculated and synced from subscription end dates

-- 1. Add the days_remaining column
ALTER TABLE public.pro_subscriptions 
ADD COLUMN IF NOT EXISTS days_remaining INTEGER;

-- 2. Create function to calculate and update days_remaining
CREATE OR REPLACE FUNCTION public.update_days_remaining()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Calculate days remaining based on subscription type
  IF NEW.subscription_type = 'trial' AND NEW.trial_end_date IS NOT NULL THEN
    NEW.days_remaining = EXTRACT(DAY FROM (NEW.trial_end_date - now()))::INTEGER;
  ELSIF NEW.subscription_type IN ('monthly', 'yearly') AND NEW.subscription_end_date IS NOT NULL THEN
    NEW.days_remaining = EXTRACT(DAY FROM (NEW.subscription_end_date - now()))::INTEGER;
  ELSE
    NEW.days_remaining = NULL;
  END IF;
  
  -- Ensure days_remaining is not negative
  IF NEW.days_remaining < 0 THEN
    NEW.days_remaining = 0;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Create trigger to auto-update days_remaining on INSERT/UPDATE
DROP TRIGGER IF EXISTS update_days_remaining_trigger ON public.pro_subscriptions;
CREATE TRIGGER update_days_remaining_trigger
  BEFORE INSERT OR UPDATE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_days_remaining();

-- 4. Update existing records with days_remaining values
UPDATE public.pro_subscriptions 
SET days_remaining = CASE
  WHEN subscription_type = 'trial' AND trial_end_date IS NOT NULL THEN
    GREATEST(0, EXTRACT(DAY FROM (trial_end_date - now()))::INTEGER)
  WHEN subscription_type IN ('monthly', 'yearly') AND subscription_end_date IS NOT NULL THEN
    GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - now()))::INTEGER)
  ELSE NULL
END;

-- 5. Create function to batch update all days_remaining (for scheduled jobs)
CREATE OR REPLACE FUNCTION public.sync_all_days_remaining()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.pro_subscriptions 
  SET days_remaining = CASE
    WHEN subscription_type = 'trial' AND trial_end_date IS NOT NULL THEN
      GREATEST(0, EXTRACT(DAY FROM (trial_end_date - now()))::INTEGER)
    WHEN subscription_type IN ('monthly', 'yearly') AND subscription_end_date IS NOT NULL THEN
      GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - now()))::INTEGER)
    ELSE NULL
  END
  WHERE (
    subscription_type = 'trial' AND trial_end_date IS NOT NULL
  ) OR (
    subscription_type IN ('monthly', 'yearly') AND subscription_end_date IS NOT NULL
  );
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;