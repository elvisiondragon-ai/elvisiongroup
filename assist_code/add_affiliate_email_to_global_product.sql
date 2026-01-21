-- Add affiliate_email column to public.global_product table
ALTER TABLE public.global_product
ADD COLUMN affiliate_email TEXT;

-- Populate affiliate_email for existing rows where affiliate_id is present
-- This assumes that the auth.users table has an 'email' column and
-- that affiliate_id in global_product corresponds to id in auth.users.
UPDATE public.global_product gp
SET affiliate_email = au.email
FROM auth.users au
WHERE gp.affiliate_id IS NOT NULL
AND gp.affiliate_id = au.id;
