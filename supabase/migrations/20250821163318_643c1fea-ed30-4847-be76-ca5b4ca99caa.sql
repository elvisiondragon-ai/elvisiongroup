-- Add user_email column to pro_subscriptions for easy identification
ALTER TABLE public.pro_subscriptions 
ADD COLUMN IF NOT EXISTS user_email text;

-- Populate the user_email column with emails from auth.users
UPDATE public.pro_subscriptions 
SET user_email = u.email
FROM auth.users u 
WHERE pro_subscriptions.user_id = u.id 
AND pro_subscriptions.user_email IS NULL;

-- Set default email for any records without matching users
UPDATE public.pro_subscriptions 
SET user_email = 'unknown@example.com'
WHERE user_email IS NULL;

-- Make user_email NOT NULL after populating
ALTER TABLE public.pro_subscriptions 
ALTER COLUMN user_email SET NOT NULL;

-- Add index for better performance on email searches
CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_email ON public.pro_subscriptions(user_email);

-- Create a helpful view for easy admin access showing key info
CREATE OR REPLACE VIEW public.pro_subscriptions_admin_view AS
SELECT 
  ps.id,
  ps.user_id,
  ps.user_email,
  p.display_name,
  ps.subscription_type,
  ps.status,
  ps.amount_paid,
  ps.currency,
  ps.subscription_start_date,
  ps.subscription_end_date,
  ps.trial_start_date,
  ps.trial_end_date,
  CASE 
    WHEN ps.status = 'active' AND ps.subscription_type = 'trial' AND ps.trial_end_date > now() THEN 'Active Trial'
    WHEN ps.status = 'active' AND ps.subscription_type IN ('monthly', 'yearly') AND (ps.subscription_end_date IS NULL OR ps.subscription_end_date > now()) THEN 'Active Paid'
    WHEN ps.subscription_end_date < now() OR ps.trial_end_date < now() THEN 'Expired'
    ELSE ps.status
  END as readable_status,
  ps.created_at,
  ps.updated_at
FROM public.pro_subscriptions ps
LEFT JOIN public.profiles p ON ps.user_id = p.user_id
ORDER BY ps.created_at DESC;