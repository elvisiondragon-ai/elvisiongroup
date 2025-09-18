-- Add notes column to elite_habits table for blood circulation feedback
-- This allows users to record their feelings and effects after elite habit activities

-- Add notes column to existing elite_habits table
ALTER TABLE public.elite_habits 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'elite_habits' 
  AND table_schema = 'public'
ORDER BY ordinal_position;