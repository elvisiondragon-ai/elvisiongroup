-- Add language support to audio_tracks and profiles tables
ALTER TABLE public.audio_tracks 
ADD COLUMN language TEXT DEFAULT 'id';

-- Update all existing audio tracks to be Indonesian
UPDATE public.audio_tracks 
SET language = 'id' 
WHERE language IS NULL;

-- Add preferred language to user profiles
ALTER TABLE public.profiles 
ADD COLUMN preferred_language TEXT DEFAULT 'auto';

-- Create index for better performance
CREATE INDEX idx_audio_tracks_language ON public.audio_tracks(language);
CREATE INDEX idx_audio_tracks_category_language ON public.audio_tracks(category, language);

-- Update existing audio tracks to use Indonesian folder structure
UPDATE public.audio_tracks 
SET file_path = 'indonesia/' || file_path 
WHERE file_path IS NOT NULL 
AND file_path NOT LIKE 'indonesia/%' 
AND file_path NOT LIKE 'english/%';