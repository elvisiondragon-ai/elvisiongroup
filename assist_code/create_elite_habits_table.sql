-- Create elite_habits table for tracking exercise mindfulness activities
CREATE TABLE IF NOT EXISTS public.elite_habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add total_elite_habit column to profiles table if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_elite_habit INTEGER DEFAULT 0;

-- Enable Row Level Security (RLS)
ALTER TABLE public.elite_habits ENABLE ROW LEVEL SECURITY;

-- Create policies for elite_habits table
CREATE POLICY "Users can view own elite habits" ON public.elite_habits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own elite habits" ON public.elite_habits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own elite habits" ON public.elite_habits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own elite habits" ON public.elite_habits
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS elite_habits_user_id_idx ON public.elite_habits(user_id);
CREATE INDEX IF NOT EXISTS elite_habits_date_idx ON public.elite_habits(date);
CREATE INDEX IF NOT EXISTS elite_habits_created_at_idx ON public.elite_habits(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_elite_habits_updated_at
    BEFORE UPDATE ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();