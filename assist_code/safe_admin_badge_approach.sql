-- ===========================================
-- SAFE ADMIN BADGE APPROACH
-- ===========================================

-- Option 1: Add separate admin column to profiles table
ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;

-- Set admin status for dragon@yahoo.com only
UPDATE profiles
SET is_admin = true
WHERE user_email = 'dragon@yahoo.com';

-- Verify only one admin
SELECT user_email, is_admin, 'Admin users' as status
FROM profiles
WHERE is_admin = true;