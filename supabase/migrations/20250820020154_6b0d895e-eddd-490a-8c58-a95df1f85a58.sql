-- Create subscription_plans table to store available plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'IDR',
  duration_days INTEGER NOT NULL,
  payment_method_code TEXT DEFAULT 'BCAVA',
  payment_method TEXT DEFAULT 'BCA Virtual Account',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active plans
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Insert the subscription plans
INSERT INTO public.subscription_plans (id, name, description, price, duration_days, payment_method_code, payment_method) VALUES
('1_year', '1 Year Subscription', 'Annual subscription with full access', 800000, 365, 'BCAVA', 'BCA Virtual Account'),
('1_month', '1 Month Subscription', 'Monthly subscription with full access', 100000, 30, 'BCAVA', 'BCA Virtual Account'),
('1_week', '1 Week Subscription', 'Weekly subscription with full access', 30000, 7, 'BCAVA', 'BCA Virtual Account'),
('1_day', '1 Day Subscription', 'Daily subscription with full access', 4000, 1, 'BCAVA', 'BCA Virtual Account')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration_days = EXCLUDED.duration_days,
  updated_at = now();