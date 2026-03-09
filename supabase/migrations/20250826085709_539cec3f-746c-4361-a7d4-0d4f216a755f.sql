-- Consolidate Pro System - Single Source of Truth Migration
-- This migration eliminates the need for profiles.achievements and pro_user tables
-- by making pro_subscriptions the only source for pro status

-- 1. Enhance pro_subscriptions table with additional columns
ALTER TABLE public.pro_subscriptions 
ADD COLUMN IF NOT EXISTS verse_access BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS pro_badge BOOLEAN DEFAULT true;

-- 2. Create unified pro check function
CREATE OR REPLACE FUNCTION public.check_unified_pro_status(p_user_id UUID)
RETURNS TABLE(
  is_pro BOOLEAN,
  subscription_type TEXT,
  status TEXT,
  expires_at TIMESTAMPTZ,
  days_remaining INTEGER,
  verse_access BOOLEAN,
  pro_badge BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE 
      WHEN ps.status = 'active' AND (
        (ps.subscription_type = 'trial' AND ps.trial_end_date > now()) OR
        (ps.subscription_type IN ('monthly', 'yearly') AND ps.subscription_end_date > now())
      ) THEN true 
      ELSE false 
    END as is_pro,
    ps.subscription_type,
    ps.status,
    CASE
      WHEN ps.subscription_type = 'trial' THEN ps.trial_end_date
      ELSE ps.subscription_end_date
    END as expires_at,
    CASE
      WHEN ps.subscription_type = 'trial' THEN 
        EXTRACT(DAY FROM (ps.trial_end_date - now()))::INTEGER
      ELSE 
        EXTRACT(DAY FROM (ps.subscription_end_date - now()))::INTEGER
    END as days_remaining,
    COALESCE(ps.verse_access, true) as verse_access,
    COALESCE(ps.pro_badge, true) as pro_badge
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$$;

-- 3. Create auto-expire function for subscriptions
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Auto-expire trial subscriptions
  UPDATE public.pro_subscriptions
  SET status = 'expired'
  WHERE subscription_type = 'trial' 
    AND trial_end_date < now() 
    AND status = 'active';
  
  -- Auto-expire paid subscriptions
  UPDATE public.pro_subscriptions
  SET status = 'expired'
  WHERE subscription_type IN ('monthly', 'yearly') 
    AND subscription_end_date < now() 
    AND status = 'active';
END;
$$;

-- 4. Create trigger to automatically sync pro status with profiles.achievements
-- This ensures backward compatibility during transition
CREATE OR REPLACE FUNCTION public.sync_pro_achievements()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_active_pro BOOLEAN;
BEGIN
  -- Check if user has active pro subscription
  SELECT EXISTS(
    SELECT 1 FROM public.pro_subscriptions ps
    WHERE ps.user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND ps.status = 'active'
    AND (
      (ps.subscription_type = 'trial' AND ps.trial_end_date > now()) OR
      (ps.subscription_type IN ('monthly', 'yearly') AND ps.subscription_end_date > now())
    )
  ) INTO is_active_pro;
  
  -- Update profiles achievements accordingly
  IF is_active_pro THEN
    -- Add 'pro' to achievements if not present
    UPDATE public.profiles 
    SET achievements = CASE 
      WHEN 'pro' = ANY(achievements) THEN achievements
      ELSE array_append(achievements, 'pro')
    END,
    updated_at = now()
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  ELSE
    -- Remove 'pro' from achievements
    UPDATE public.profiles 
    SET achievements = array_remove(achievements, 'pro'),
        updated_at = now()
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 5. Create trigger on pro_subscriptions changes
DROP TRIGGER IF EXISTS sync_pro_achievements_trigger ON public.pro_subscriptions;
CREATE TRIGGER sync_pro_achievements_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_pro_achievements();

-- 6. Migrate existing pro_user data to pro_subscriptions if not already present
INSERT INTO public.pro_subscriptions (
  user_id,
  user_email,
  subscription_type,
  status,
  amount_paid,
  currency,
  subscription_start_date,
  subscription_end_date,
  tripay_reference,
  verse_access,
  pro_badge
)
SELECT 
  (SELECT id FROM auth.users WHERE email = pu.email LIMIT 1) as user_id,
  pu.email,
  pu.subscription_type,
  pu.status,
  pu.amount,
  pu.currency,
  pu.start_date,
  pu.end_date,
  pu.tripay_reference,
  true as verse_access,
  true as pro_badge
FROM public.pro_user pu
WHERE NOT EXISTS (
  SELECT 1 FROM public.pro_subscriptions ps 
  WHERE ps.user_email = pu.email
)
ON CONFLICT DO NOTHING;

-- 7. Update existing pro_subscriptions to have proper end dates for active subscriptions
UPDATE public.pro_subscriptions 
SET subscription_end_date = CASE
  WHEN subscription_type = 'monthly' AND subscription_start_date IS NOT NULL 
    THEN subscription_start_date + INTERVAL '30 days'
  WHEN subscription_type = 'yearly' AND subscription_start_date IS NOT NULL 
    THEN subscription_start_date + INTERVAL '365 days'
  ELSE subscription_end_date
END
WHERE subscription_end_date IS NULL 
  AND subscription_type IN ('monthly', 'yearly')
  AND status = 'active'
  AND subscription_start_date IS NOT NULL;

-- 8. Run initial expiry check
SELECT public.expire_subscriptions();

-- 9. Update can_access_verse function to use unified pro status
CREATE OR REPLACE FUNCTION public.can_access_verse(p_user_id uuid, p_verse_number integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_level INTEGER;
  pro_data RECORD;
BEGIN
  -- Get user level
  SELECT level INTO user_level
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- Get unified pro status
  SELECT * INTO pro_data
  FROM public.check_unified_pro_status(p_user_id);
  
  -- Pro users with verse access can access verses 1-4 regardless of level
  IF pro_data.is_pro AND pro_data.verse_access AND p_verse_number <= 4 THEN
    RETURN true;
  END IF;
  
  -- Level-based access for non-pro users or verses beyond 4
  CASE p_verse_number
    WHEN 1 THEN RETURN user_level >= 3;
    WHEN 2 THEN RETURN user_level >= 4; 
    WHEN 3 THEN RETURN user_level >= 4;
    WHEN 4 THEN RETURN user_level >= 5;
    ELSE RETURN false;
  END CASE;
END;
$$;