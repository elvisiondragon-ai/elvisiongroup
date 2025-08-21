-- First, just add the email column and populate it
ALTER TABLE public.pro_subscriptions 
ADD COLUMN IF NOT EXISTS user_email text;

-- Populate the user_email column with emails from auth.users
UPDATE public.pro_subscriptions 
SET user_email = u.email
FROM auth.users u 
WHERE pro_subscriptions.user_id = u.id 
AND (pro_subscriptions.user_email IS NULL OR pro_subscriptions.user_email = '');

-- Set default email for any records without matching users
UPDATE public.pro_subscriptions 
SET user_email = 'unknown@example.com'
WHERE user_email IS NULL OR user_email = '';

-- Make user_email NOT NULL after populating
ALTER TABLE public.pro_subscriptions 
ALTER COLUMN user_email SET NOT NULL;