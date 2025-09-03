-- Add expires_at column to existing notifications table for time-based notifications
ALTER TABLE public.notifications 
ADD COLUMN expires_at timestamptz DEFAULT (now() + interval '24 hours');

-- Create index for performance when filtering expired notifications
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at 
ON public.notifications(expires_at);

-- Update RLS policy to only show non-expired notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id AND (expires_at IS NULL OR expires_at > now()));