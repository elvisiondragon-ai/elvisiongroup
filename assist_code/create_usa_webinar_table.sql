-- 1. Drop existing view if it exists
DROP VIEW IF EXISTS public.usa_webinar_status;

-- 2. Create/Update the base table
CREATE TABLE IF NOT EXISTS public.usa_webinar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT,
    phone_number TEXT,
    order_id TEXT UNIQUE,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    status TEXT DEFAULT 'Active', -- Physical column for easy viewing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create a Function to auto-calculate status on every interaction
CREATE OR REPLACE FUNCTION public.sync_usa_webinar_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NOW() >= NEW.ends_at THEN
        NEW.status := 'Expired';
    ELSE
        NEW.status := 'Active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create a Trigger to run the function before any update
DROP TRIGGER IF EXISTS tr_sync_usa_webinar_status ON public.usa_webinar;
CREATE TRIGGER tr_sync_usa_webinar_status
BEFORE INSERT OR UPDATE ON public.usa_webinar
FOR EACH ROW
EXECUTE FUNCTION public.sync_usa_webinar_status();

-- 5. Enable RLS
ALTER TABLE public.usa_webinar ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "Allow service role full access" ON public.usa_webinar;
CREATE POLICY "Allow service role full access" ON public.usa_webinar
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.usa_webinar;
CREATE POLICY "Allow public read access" ON public.usa_webinar
    FOR SELECT TO anon, authenticated USING (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_usa_webinar_email ON public.usa_webinar(email);
