-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-files', 'audio-files', true);

-- Create policies for audio file access
CREATE POLICY "Anyone can view audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-files');

CREATE POLICY "Authenticated users can upload audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own audio files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table for managing audio content
CREATE TABLE public.audio_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT,
  duration INTEGER, -- in seconds
  category TEXT DEFAULT 'verse', -- verse, meditation, ambient, etc.
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies for audio tracks
CREATE POLICY "Anyone can view public audio tracks" 
ON public.audio_tracks 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own audio tracks" 
ON public.audio_tracks 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create audio tracks" 
ON public.audio_tracks 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own audio tracks" 
ON public.audio_tracks 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own audio tracks" 
ON public.audio_tracks 
FOR DELETE 
USING (auth.uid() = created_by);

-- Add trigger for timestamps
CREATE TRIGGER update_audio_tracks_updated_at
BEFORE UPDATE ON public.audio_tracks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();