-- Remove expires_at column from notifications table
ALTER TABLE public.notifications 
DROP COLUMN IF EXISTS expires_at;

-- Drop the index for expires_at if it exists
DROP INDEX IF EXISTS idx_notifications_expires_at;

-- Update RLS policy to remove expires_at check
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);