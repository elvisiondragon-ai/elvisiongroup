-- Populate user_email column in public.commissions table with affiliate's email
-- This assumes that the user_email column is intended to store the email of the affiliate_user_id
-- and that auth.users table has an 'email' column.
UPDATE public.commissions c
SET user_email = au.email
FROM auth.users au
WHERE c.affiliate_user_id IS NOT NULL
AND c.affiliate_user_id = au.id
AND c.user_email IS DISTINCT FROM au.email; -- Only update if the email is different