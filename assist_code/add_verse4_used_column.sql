-- Add verse4_used column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verse4_used integer DEFAULT 0;

-- Update existing users to have 0 usage count
UPDATE public.profiles 
SET verse4_used = 0 
WHERE verse4_used IS NULL;

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
  AND column_name = 'verse4_used';