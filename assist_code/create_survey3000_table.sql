-- Create the survey3000 table
CREATE TABLE IF NOT EXISTS public.survey3000 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question1 TEXT NOT NULL, -- Where do you feel most stuck
    question2 TEXT NOT NULL, -- Main reason for interest
    question3 TEXT NOT NULL, -- Prepared to invest
    instagram TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT,
    name TEXT NOT NULL,
    urgency_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.survey3000 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
-- We drop it first to avoid "policy already exists" errors if re-running
DROP POLICY IF EXISTS "Allow public inserts" ON public.survey3000;

CREATE POLICY "Allow public inserts" ON public.survey3000
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Grant permissions to public/anon roles
GRANT INSERT ON public.survey3000 TO anon;
GRANT INSERT ON public.survey3000 TO authenticated;