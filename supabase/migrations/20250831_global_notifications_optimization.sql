-- SUPABASE API OPTIMIZATION: Global Notifications System
-- This migration adds support for broadcast notifications while keeping existing system intact
-- Your current mass notification SQL will continue to work exactly the same!

-- Create broadcast notifications table for global announcements (optional enhancement)
CREATE TABLE IF NOT EXISTS public.broadcast_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Enable RLS for broadcast notifications
ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can read broadcast notifications
CREATE POLICY "Authenticated users can read broadcast notifications" 
ON public.broadcast_notifications FOR SELECT 
TO authenticated 
USING (expires_at > now());

-- Policy: Only admins can insert broadcast notifications  
CREATE POLICY "Admins can create broadcast notifications"
ON public.broadcast_notifications FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND 'admin' = ANY(achievements)
    )
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_broadcast_notifications_created_at ON public.broadcast_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_broadcast_notifications_expires_at ON public.broadcast_notifications(expires_at);

-- Function to clean up expired broadcast notifications (optional)
CREATE OR REPLACE FUNCTION public.cleanup_expired_broadcasts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.broadcast_notifications 
    WHERE expires_at < now();
END;
$$;

-- Optional: Create a scheduled job to clean expired broadcasts
-- This can be set up in Supabase dashboard under Database > Extensions > pg_cron
-- SELECT cron.schedule('cleanup-expired-broadcasts', '0 2 * * *', 'SELECT public.cleanup_expired_broadcasts();');

COMMENT ON TABLE public.broadcast_notifications IS 'Global broadcast notifications visible to all users - used for system announcements';
COMMENT ON FUNCTION public.cleanup_expired_broadcasts IS 'Cleans up expired broadcast notifications - can be scheduled to run daily';