-- Update a user's email directly in the auth.users table
-- IMPORTANT: This bypasses email confirmation and invalidates the user's current session.
-- Use with caution and only in the Supabase SQL Editor or a secure backend.

UPDATE auth.users
SET 
  email = 'new_email@example.com', -- Replace with the new email address
  email_confirmed_at = NOW(),      -- Confirm the new email immediately
  updated_at = NOW()
WHERE 
  email = 'old_email@example.com'; -- Replace with the user's current email address

-- Optional: If you also store user_email in your public.profiles table, update it there too.
-- This assumes user_id is the foreign key linking profiles to auth.users.
UPDATE public.profiles
SET 
  user_email = 'new_email@example.com', -- Replace with the new email address
  updated_at = NOW()
WHERE 
  user_id = (SELECT id FROM auth.users WHERE email = 'new_email@example.com'); -- Link by the newly updated email
