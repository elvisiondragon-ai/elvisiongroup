-- Create new pro_subscriptions table with email field for easy identification
CREATE TABLE public.pro_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text NOT NULL, -- Added email field for easy identification
  subscription_type text NOT NULL DEFAULT 'trial'::text,
  status text NOT NULL DEFAULT 'pending'::text,
  trial_start_date timestamp with time zone,
  trial_end_date timestamp with time zone,
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  amount_paid numeric,
  currency text DEFAULT 'IDR'::text,
  tripay_reference text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pro_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (same as vip_subscriptions)
CREATE POLICY "Users can insert their own subscription" 
ON public.pro_subscriptions
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.pro_subscriptions
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscription" 
ON public.pro_subscriptions
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Verified admins can view subscriptions" 
ON public.pro_subscriptions
FOR SELECT 
USING ((auth.uid() = user_id) OR is_verified_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_pro_subscriptions_user_id ON public.pro_subscriptions(user_id);
CREATE INDEX idx_pro_subscriptions_email ON public.pro_subscriptions(user_email);
CREATE INDEX idx_pro_subscriptions_status ON public.pro_subscriptions(status);

-- Create updated_at trigger
CREATE TRIGGER update_pro_subscriptions_updated_at
  BEFORE UPDATE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate data from vip_subscriptions to pro_subscriptions with email lookup
INSERT INTO public.pro_subscriptions (
  id, user_id, user_email, subscription_type, status, 
  trial_start_date, trial_end_date, subscription_start_date, 
  subscription_end_date, amount_paid, currency, tripay_reference, 
  ip_address, created_at, updated_at
)
SELECT 
  v.id, v.user_id, 
  COALESCE(u.email, 'unknown@example.com') as user_email, -- Get email from auth.users
  v.subscription_type, v.status,
  v.trial_start_date, v.trial_end_date, v.subscription_start_date,
  v.subscription_end_date, v.amount_paid, v.currency, v.tripay_reference,
  v.ip_address, v.created_at, v.updated_at
FROM public.vip_subscriptions v
LEFT JOIN auth.users u ON v.user_id = u.id;