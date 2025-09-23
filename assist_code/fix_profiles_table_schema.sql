-- FIX PROFILES TABLE SCHEMA - ADD MISSING COLUMNS
-- Error: column "is_pro" of relation "profiles" does not exist

-- First, check current profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing records to have default values
UPDATE profiles SET is_pro = FALSE WHERE is_pro IS NULL;
UPDATE profiles SET updated_at = now() WHERE updated_at IS NULL;

-- Verify the fix
SELECT 'PROFILES TABLE FIXED' as status, COUNT(*) as row_count FROM profiles;

-- Show updated structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;