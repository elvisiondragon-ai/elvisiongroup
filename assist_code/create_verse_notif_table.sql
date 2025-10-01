-- Create verse_notif table for real-time verse completion notifications
CREATE TABLE public.verse_notif (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  verse_title TEXT NOT NULL,
  verse_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verse_notif ENABLE ROW LEVEL SECURITY;

-- RLS policy to allow all users to view verse notifications (for real-time)
CREATE POLICY "Allow viewing all verse notifications" 
ON public.verse_notif 
FOR SELECT 
USING (true);

-- RLS policy for users to insert their own notifications
CREATE POLICY "Users can create their own verse notifications" 
ON public.verse_notif 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable FULL replica identity for real-time
ALTER TABLE public.verse_notif REPLICA IDENTITY FULL;

-- Create index for better performance
CREATE INDEX idx_verse_notif_created_at ON public.verse_notif(created_at DESC);
CREATE INDEX idx_verse_notif_user_id ON public.verse_notif(user_id);

-- Verify the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'verse_notif' 
    AND table_schema = 'public'
ORDER BY ordinal_position;