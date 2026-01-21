-- Add affiliate_email column to store the email of the referrer

ALTER TABLE public.global_product 
ADD COLUMN IF NOT EXISTS affiliate_email TEXT;

ALTER TABLE public.waiting_payment 
ADD COLUMN IF NOT EXISTS affiliate_email TEXT;

ALTER TABLE public.commissions
ADD COLUMN IF NOT EXISTS affiliate_email TEXT;
