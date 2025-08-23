-- EMERGENCY FIX: Remove the phone validation trigger that's blocking authentication
DROP TRIGGER IF EXISTS phone_required_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.check_phone_not_null();