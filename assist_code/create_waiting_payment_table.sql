-- Create waiting_payment table as security layer
-- Simple table with no constraints for understanding payment attempts

CREATE TABLE IF NOT EXISTS public.waiting_payment (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  user_email text,
  subscription_type text,
  amount_paid integer,
  currency text DEFAULT 'IDR',
  status text DEFAULT 'pending',
  tripay_reference text,
  ip_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.waiting_payment ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own waiting payments
CREATE POLICY "Users can view their own waiting payments" ON public.waiting_payment
  FOR SELECT USING (user_id = auth.uid());

-- Create policy for service role to do anything
CREATE POLICY "Service role can do anything on waiting_payment" ON public.waiting_payment
  FOR ALL USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_waiting_payment_user_id ON public.waiting_payment(user_id);
CREATE INDEX IF NOT EXISTS idx_waiting_payment_tripay_reference ON public.waiting_payment(tripay_reference);
CREATE INDEX IF NOT EXISTS idx_waiting_payment_status ON public.waiting_payment(status);