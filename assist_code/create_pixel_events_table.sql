-- Create a table to log all Pixel/CAPI events for debugging
CREATE TABLE IF NOT EXISTS public.pixel_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    pixel_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_id TEXT, -- For deduplication checking
    user_data JSONB, -- The hashed or raw user data sent
    custom_data JSONB, -- Contains product info, value, currency, etc.
    page_url TEXT, -- Extracted from custom_data or user_data source_url if available
    status TEXT, -- 'sent', 'failed', 'blocked'
    meta_response JSONB, -- The raw response from Facebook Graph API
    client_ip TEXT,
    user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.pixel_events ENABLE ROW LEVEL SECURITY;

-- Allow admins to view logs (adjust policy as needed for your admin system)
-- For now, allowing authenticated users to view for debugging if they are admins
-- Or just public insert for the edge function (Edge function bypasses RLS with service key usually)

CREATE POLICY "Allow public insert for Edge Functions" ON public.pixel_events
FOR INSERT TO anon, authenticated, service_role
WITH CHECK (true);

CREATE POLICY "Allow admins to select" ON public.pixel_events
FOR SELECT TO authenticated
USING (true); -- TODO: Restrict to actual admins in production
