-- Add tracking field to existing notifications table to replace localStorage
-- This ensures notifications show only once per user, even after cache/cookie clear

-- Add a new column to track if user has been shown general notifications (like broadcast_checked)
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS notification_type VARCHAR(100);

-- Add index for performance on the new column
CREATE INDEX IF NOT EXISTS idx_notifications_type 
ON notifications(user_id, notification_type) 
WHERE notification_type IS NOT NULL;

-- Add helper function to check if user has seen notification type
CREATE OR REPLACE FUNCTION check_user_notification_shown(
    p_user_id UUID,
    p_notification_type VARCHAR(100)
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM notifications 
        WHERE user_id = p_user_id 
        AND notification_type = p_notification_type
        AND read = true
    );
END;
$$;

-- Add function to mark notification type as shown for user
CREATE OR REPLACE FUNCTION mark_notification_type_shown(
    p_user_id UUID,
    p_notification_type VARCHAR(100)
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO notifications (
        user_id, 
        title, 
        message, 
        notification_type,
        read,
        created_at
    )
    VALUES (
        p_user_id, 
        'System Tracking', 
        'Internal tracking record for ' || p_notification_type, 
        p_notification_type,
        true,
        NOW()
    )
    ON CONFLICT DO NOTHING;
END;
$$;