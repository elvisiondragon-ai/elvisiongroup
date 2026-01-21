-- Add fbc and fbp columns to global_product table to store Facebook Pixel cookies
ALTER TABLE public.global_product
ADD COLUMN fbc text,
ADD COLUMN fbp text;
