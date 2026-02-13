-- ShopAuto AI Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Add shopauto_settings column to profiles table
-- Stores AI config, shop IDs, and forwarding settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS shopauto_settings JSONB DEFAULT '{}'::jsonb;

-- 2. Remove old shope_settings column (Clean up)
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS shope_settings;

-- 3. Add functional index for webhook performance
-- Allows the backend to instantly match Shopee webhooks to the correct user
CREATE INDEX IF NOT EXISTS idx_profiles_shopauto_shop_id 
ON public.profiles ((shopauto_settings->>'shopeShopId'));

-- 3. Confirmation
COMMENT ON COLUMN public.profiles.shopauto_settings IS 'Configuration for ShopAuto AI automation features';
