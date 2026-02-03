-- REPAIR SCRIPT FOR USA_WEBINAR TABLE
-- Run this in Supabase SQL Editor to add the 'status' column and auto-sync trigger

-- 1. Add the physical column if it doesn't exist
ALTER TABLE public.usa_webinar ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

-- 2. Create/Update the Function for auto-calculating status
CREATE OR REPLACE FUNCTION public.sync_usa_webinar_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If current time is past ends_at, set to Expired, else Active
    IF NOW() >= NEW.ends_at THEN
        NEW.status := 'Expired';
    ELSE
        NEW.status := 'Active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the Trigger to run automatically before every insert or update
DROP TRIGGER IF EXISTS tr_sync_usa_webinar_status ON public.usa_webinar;
CREATE TRIGGER tr_sync_usa_webinar_status
BEFORE INSERT OR UPDATE ON public.usa_webinar
FOR EACH ROW
EXECUTE FUNCTION public.sync_usa_webinar_status();

-- 4. Force update existing data to trigger the calculation immediately
-- This will fix any NULL or incorrect status values based on the ends_at date
UPDATE public.usa_webinar SET status = 'Active';

-- 5. Confirmation
COMMENT ON COLUMN public.usa_webinar.status IS 'Automatically managed by tr_sync_usa_webinar_status trigger';
