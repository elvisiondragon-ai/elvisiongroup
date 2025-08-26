-- Database cleanup: Drop packages table since subscription_plans provides complete functionality
-- Verification: No foreign key constraints found, data is redundant

DROP TABLE IF EXISTS public.packages CASCADE;

-- Verify subscription_plans has all necessary data
SELECT id, name, price, duration_days, is_active FROM public.subscription_plans;