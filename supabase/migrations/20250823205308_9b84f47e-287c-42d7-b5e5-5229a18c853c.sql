-- EMERGENCY FIX: Remove the phone validation trigger that's blocking authentication
-- This trigger is preventing users from logging in because it requires phone numbers

DROP TRIGGER IF EXISTS phone_required_trigger ON auth.users;
DROP TRIGGER IF EXISTS phone_required_trigger ON public.users;

-- Also drop the function if it exists
DROP FUNCTION IF EXISTS public.check_phone_not_null();