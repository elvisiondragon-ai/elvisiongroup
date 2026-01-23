-- Add tracking columns to improve Pixel Match Quality

-- 1. Add columns to global_product
ALTER TABLE public.global_product
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- 2. Add user_agent to waiting_payment (ip_address already exists)
ALTER TABLE public.waiting_payment
ADD COLUMN IF NOT EXISTS user_agent TEXT;
