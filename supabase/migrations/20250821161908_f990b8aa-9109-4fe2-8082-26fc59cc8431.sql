-- Add pro achievement to profiles and create subscription sync system

-- Function to grant pro status to a user
CREATE OR REPLACE FUNCTION public.grant_pro_status(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Add 'pro' to achievements array if not already present
  UPDATE public.profiles 
  SET achievements = CASE 
    WHEN 'pro' = ANY(achievements) THEN achievements
    ELSE array_append(achievements, 'pro')
  END,
  updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Create profile if it doesn't exist
  IF NOT FOUND THEN
    INSERT INTO public.profiles (user_id, achievements)
    VALUES (p_user_id, ARRAY['pro'])
    ON CONFLICT (user_id) DO UPDATE SET
      achievements = CASE 
        WHEN 'pro' = ANY(excluded.achievements) THEN excluded.achievements
        ELSE array_append(profiles.achievements, 'pro')
      END,
      updated_at = now();
  END IF;
END;
$$;

-- Function to revoke pro status from a user  
CREATE OR REPLACE FUNCTION public.revoke_pro_status(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Remove 'pro' from achievements array
  UPDATE public.profiles 
  SET achievements = array_remove(achievements, 'pro'),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- Function to sync pro status based on subscription
CREATE OR REPLACE FUNCTION public.sync_pro_status_from_subscription(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  has_active_subscription boolean := false;
  sub_record RECORD;
BEGIN
  -- Check if user has active VIP subscription
  SELECT * INTO sub_record
  FROM public.vip_subscriptions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF FOUND THEN
    -- Check if subscription is active and not expired
    IF sub_record.status = 'active' THEN
      IF sub_record.subscription_type = 'trial' AND sub_record.trial_end_date > now() THEN
        has_active_subscription := true;
      ELSIF sub_record.subscription_type IN ('monthly', 'yearly') AND 
            (sub_record.subscription_end_date IS NULL OR sub_record.subscription_end_date > now()) THEN
        has_active_subscription := true;
      END IF;
    END IF;
  END IF;
  
  -- Grant or revoke pro status based on subscription
  IF has_active_subscription THEN
    PERFORM public.grant_pro_status(p_user_id);
  ELSE
    PERFORM public.revoke_pro_status(p_user_id);
  END IF;
  
  RETURN has_active_subscription;
END;
$$;

-- Function to check if user has pro achievement
CREATE OR REPLACE FUNCTION public.has_pro_achievement(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = p_user_id 
    AND 'pro' = ANY(achievements)
  );
END;
$$;

-- Trigger function to auto-sync pro status when VIP subscription changes
CREATE OR REPLACE FUNCTION public.auto_sync_pro_on_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Sync pro status for the user whose subscription changed
  PERFORM public.sync_pro_status_from_subscription(COALESCE(NEW.user_id, OLD.user_id));
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on vip_subscriptions table
DROP TRIGGER IF EXISTS trigger_auto_sync_pro ON public.vip_subscriptions;
CREATE TRIGGER trigger_auto_sync_pro
  AFTER INSERT OR UPDATE OR DELETE ON public.vip_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_sync_pro_on_subscription_change();

-- Sync pro status for all existing users with VIP subscriptions
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id FROM public.vip_subscriptions 
  LOOP
    PERFORM public.sync_pro_status_from_subscription(user_record.user_id);
  END LOOP;
END $$;