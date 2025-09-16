-- Add analytics tracking columns to existing profiles table
-- This is safe and won't break existing functionality

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS analytics_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_analytics_date DATE;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.analytics_used IS 'Number of analytics reports used in current month (max 1 for free users)';
COMMENT ON COLUMN public.profiles.last_analytics_date IS 'Date when user last generated an analytics report';

-- No RLS changes needed - existing policies already cover these columns