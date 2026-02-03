-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL, -- 'page_view', 'impression', 'heartbeat'
    path TEXT NOT NULL,
    content_id TEXT, -- e.g. 'hero_video', 'pricing_table'
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anon inserts (public analytics)
-- Check if policy exists before creating to avoid errors in future runs (simplified here)
DROP POLICY IF EXISTS "Allow public insert to analytics_events" ON public.analytics_events;
CREATE POLICY "Allow public insert to analytics_events"
ON public.analytics_events
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow read access to analytics_events
DROP POLICY IF EXISTS "Allow read access to analytics_events" ON public.analytics_events;
CREATE POLICY "Allow read access to analytics_events"
ON public.analytics_events
FOR SELECT
TO public
USING (true);


-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_path ON public.analytics_events(path);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_content_id ON public.analytics_events(content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);

-- View for Bounce Rate Analysis
DROP VIEW IF EXISTS public.view_bounce_rate_analytics;
CREATE OR REPLACE VIEW public.view_bounce_rate_analytics AS
WITH session_stats AS (
    SELECT
        session_id,
        path,
        MIN(created_at) as session_start,
        MAX(created_at) as session_end,
        COUNT(*) as event_count,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as duration_seconds,
        COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_view_count
    FROM public.analytics_events
    GROUP BY session_id, path
)
SELECT
    path,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(DISTINCT CASE WHEN duration_seconds < 10 OR page_view_count = 1 THEN session_id END) as bounced_sessions,
    ROUND(
        (COUNT(DISTINCT CASE WHEN duration_seconds < 10 OR page_view_count = 1 THEN session_id END)::numeric / COUNT(DISTINCT session_id)::numeric) * 100,
        2
    ) as bounce_rate_percentage,
    AVG(duration_seconds) as avg_duration_seconds
FROM session_stats
GROUP BY path
ORDER BY total_sessions DESC;

-- View for Content Impact on Bounce Rate (The "Mastery" View)
DROP VIEW IF EXISTS public.view_content_bounce_impact;
CREATE OR REPLACE VIEW public.view_content_bounce_impact AS
WITH session_outcomes AS (
    -- Determine if each session bounced (Session < 10s or 1 event)
    SELECT
        session_id,
        (EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) < 10 OR COUNT(*) = 1) as is_bounce
    FROM public.analytics_events
    GROUP BY session_id
),
content_stats AS (
    SELECT 
        content_id,
        COUNT(DISTINCT CASE WHEN event_type = 'impression' AND (metadata->>'type' = 'video_view' OR metadata->>'type' = 'video_start' OR metadata IS NULL) THEN session_id END) as total_impressions,
        COUNT(DISTINCT CASE WHEN event_type = 'content_engagement' AND (metadata->>'duration')::int >= 15 THEN session_id END) as engaged_15s_users,
        COUNT(DISTINCT CASE WHEN event_type = 'content_engagement' AND (metadata->>'duration')::int >= 30 THEN session_id END) as engaged_30s_users,
        COUNT(DISTINCT CASE WHEN event_type = 'content_engagement' AND (metadata->>'duration')::int >= 60 THEN session_id END) as engaged_60s_users
    FROM public.analytics_events
    WHERE content_id IS NOT NULL
    GROUP BY content_id
),
bounce_stats AS (
    SELECT
        ae.content_id,
        COUNT(DISTINCT CASE WHEN so.is_bounce THEN ae.session_id END) as bounced_sessions_impression,
        COUNT(DISTINCT CASE WHEN so.is_bounce AND ae.event_type = 'content_engagement' AND (ae.metadata->>'duration')::int >= 15 THEN ae.session_id END) as bounced_sessions_engaged
    FROM public.analytics_events ae
    JOIN session_outcomes so ON ae.session_id = so.session_id
    WHERE ae.content_id IS NOT NULL
    GROUP BY ae.content_id
)
SELECT
    cs.content_id,
    cs.total_impressions,
    cs.engaged_15s_users,
    cs.engaged_30s_users,
    cs.engaged_60s_users,
    ROUND((cs.engaged_15s_users::numeric / NULLIF(cs.total_impressions, 0)::numeric) * 100, 1) as conversion_to_15s_pct,
    ROUND((cs.engaged_30s_users::numeric / NULLIF(cs.total_impressions, 0)::numeric) * 100, 1) as conversion_to_30s_pct,
    ROUND((cs.engaged_60s_users::numeric / NULLIF(cs.total_impressions, 0)::numeric) * 100, 1) as conversion_to_60s_pct,
    ROUND((bs.bounced_sessions_impression::numeric / NULLIF(cs.total_impressions, 0)::numeric) * 100, 1) as bounce_rate_impression,
    ROUND((bs.bounced_sessions_engaged::numeric / NULLIF(cs.engaged_15s_users, 0)::numeric) * 100, 1) as bounce_rate_engaged
FROM content_stats cs
LEFT JOIN bounce_stats bs ON cs.content_id = bs.content_id
ORDER BY cs.total_impressions DESC;
