-- Add verse_title column to user_activities table
-- This will allow tracking which specific verse was completed

ALTER TABLE public.user_activities 
ADD COLUMN verse_title TEXT;

-- Create index for better performance when querying by verse_title
CREATE INDEX idx_user_activities_verse_title ON public.user_activities(verse_title);

-- Create composite index for activity_type and verse_title
CREATE INDEX idx_user_activities_type_verse ON public.user_activities(activity_type, verse_title);

-- Update existing audio_completion records to extract verse title from metadata if available
UPDATE public.user_activities 
SET verse_title = metadata->>'journalTitle'
WHERE activity_type = 'audio_completion' 
AND metadata->>'journalTitle' IS NOT NULL
AND verse_title IS NULL;

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_activities'
    AND table_schema = 'public'
ORDER BY ordinal_position;