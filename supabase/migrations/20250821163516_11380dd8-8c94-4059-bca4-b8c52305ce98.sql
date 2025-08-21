-- Disable all triggers temporarily to avoid conflicts
ALTER TABLE public.pro_subscriptions DISABLE TRIGGER ALL;

-- Add the email column and populate it
ALTER TABLE public.pro_subscriptions 
ADD COLUMN IF NOT EXISTS user_email text;

-- Re-enable only the essential triggers (not our custom ones yet)
ALTER TABLE public.pro_subscriptions ENABLE TRIGGER update_pro_subscriptions_updated_at;