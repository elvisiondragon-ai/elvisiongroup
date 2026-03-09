-- Add commission_rate column to store the percentage determined by the application
-- Default to 0.30 (30%) for backward compatibility with existing rows

ALTER TABLE public.global_product 
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 0.30;

ALTER TABLE public.waiting_payment 
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 0.30;
