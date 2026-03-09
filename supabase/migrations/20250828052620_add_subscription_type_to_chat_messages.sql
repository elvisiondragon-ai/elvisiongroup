-- Add subscription_type column to chat_messages table for easier badge display
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS subscription_type TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.chat_messages.subscription_type IS 'User subscription type at time of message: 1_month, 1_year, or null for non-pro';

-- Update existing chat messages with subscription data from pro_subscriptions
-- Only update where we can find a matching active subscription
UPDATE public.chat_messages cm
SET subscription_type = ps.subscription_type
FROM public.pro_subscriptions ps
WHERE cm.user_id = ps.user_id 
  AND ps.status = 'active'
  AND cm.subscription_type IS NULL;