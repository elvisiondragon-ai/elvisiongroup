-- FORCE FIX: Drop and recreate the table to ensure schema matches exactly
-- Warning: This will delete existing logs in this table.

DROP TABLE IF EXISTS public.pixel_events;

CREATE TABLE public.pixel_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    pixel_id TEXT,
    event_name TEXT,
    event_id TEXT,
    user_data JSONB,
    custom_data JSONB,
    page_url TEXT,
    status TEXT,
    meta_response JSONB,
    client_ip TEXT,
    user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.pixel_events ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.pixel_events TO anon, authenticated, service_role;

-- Policies
CREATE POLICY "Enable insert for all" ON public.pixel_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON public.pixel_events FOR SELECT USING (true);

-- NOTIFY: You MUST reload the Schema Cache in Supabase Dashboard -> Settings -> API after running this.
