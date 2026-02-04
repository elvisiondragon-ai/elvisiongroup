-- COMPLETE SETUP & MIGRATION FOR USER_WEBINAR
-- This script handles:
-- 1. Renaming 'usa_webinar' to 'user_webinar' if it exists.
-- 2. Creating 'user_webinar' if it doesn't exist.
-- 3. Adding the 'origin' and 'status' columns.
-- 4. Setting up auto-status triggers and functions.
-- 5. Configuring RLS policies.
-- 6. Cleaning up old 'usa_webinar' artifacts.

BEGIN;

-- 1. MIGRATION: Rename old table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usa_webinar') THEN
        ALTER TABLE public.usa_webinar RENAME TO user_webinar;
    END IF;
END $$;

-- 2. CREATE: Ensure table exists (if migration didn't happen)
CREATE TABLE IF NOT EXISTS public.user_webinar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT,
    phone_number TEXT,
    order_id TEXT UNIQUE,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SCHEMA UPDATES: Add necessary columns if missing
ALTER TABLE public.user_webinar ADD COLUMN IF NOT EXISTS origin TEXT;
ALTER TABLE public.user_webinar ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

-- 4. FUNCTIONS: Status Synchronization Logic
CREATE OR REPLACE FUNCTION public.sync_user_webinar_status()
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

-- 5. TRIGGERS: Auto-update status
DROP TRIGGER IF EXISTS tr_sync_user_webinar_status ON public.user_webinar;
-- Also drop old trigger name if it exists on the new table
DROP TRIGGER IF EXISTS tr_sync_usa_webinar_status ON public.user_webinar;

CREATE TRIGGER tr_sync_user_webinar_status
BEFORE INSERT OR UPDATE ON public.user_webinar
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_webinar_status();

-- 6. INDEXES: Performance
CREATE INDEX IF NOT EXISTS idx_user_webinar_email ON public.user_webinar(email);
-- Rename old index if it exists
ALTER INDEX IF EXISTS idx_usa_webinar_email RENAME TO idx_user_webinar_email;

-- 7. SECURITY: RLS Policies
ALTER TABLE public.user_webinar ENABLE ROW LEVEL SECURITY;

-- Drop old policies to ensure clean slate
DROP POLICY IF EXISTS "Allow service role full access" ON public.user_webinar;
DROP POLICY IF EXISTS "Allow public read access" ON public.user_webinar;

-- Recreate Policies
CREATE POLICY "Allow service role full access" ON public.user_webinar
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access" ON public.user_webinar
    FOR SELECT TO anon, authenticated USING (true);

-- 8. CLEANUP: Remove old artifacts
DROP VIEW IF EXISTS public.usa_webinar_status;
DROP FUNCTION IF EXISTS public.sync_usa_webinar_status();

-- 9. DATA REPAIR: Ensure status is correct for existing rows
UPDATE public.user_webinar SET status = 'Active';

-- 10. BACKFILL ORIGIN: Populate origin based on product name in global_product
UPDATE public.user_webinar uw
SET origin = CASE 
    WHEN gp.product_name ILIKE '%usa_webinar%' THEN 'USA'
    ELSE 'Indonesia'
END
FROM public.global_product gp
WHERE uw.order_id = gp.tripay_reference
AND uw.origin IS NULL;

-- 11. METADATA
COMMENT ON TABLE public.user_webinar IS 'Table for all webinar participants (USA and Indonesia)';
COMMENT ON COLUMN public.user_webinar.origin IS 'Indicates the source product: USA or Indonesia';

COMMIT;
