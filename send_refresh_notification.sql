-- SQL script to send notification with refresh button (like auto deploy)
-- This notification will trigger the same refresh behavior as the auto deploy notification

-- Option 1: Send to ALL USERS (like auto deploy)
INSERT INTO notifications (user_id, title, message, type, created_at)
SELECT 
    user_id, 
    '🎨 NEW UPDATE AVAILABLE!', 
    'Aplikasi telah diperbarui dengan fitur baru dan perbaikan performa. Refresh untuk melihat perubahan terbaru.', 
    'info',
    NOW()
FROM profiles
WHERE user_id IS NOT NULL;

-- Option 2: Use broadcast_notifications (global announcement like auto deploy)
INSERT INTO broadcast_notifications (
    title, 
    message, 
    type, 
    priority, 
    expires_at, 
    created_at
) VALUES (
    '🎨 NEW UPDATE AVAILABLE!',
    'Aplikasi telah diperbarui dengan fitur Tutorial Read Profil baru, Profile icons HD+ 3D, dan sistem caching yang lebih baik. Refresh untuk melihat semua perubahan.',
    'info',
    'high',
    NOW() + INTERVAL '7 days', -- Expires in 7 days
    NOW()
);

-- Option 3: Trigger the SAME auto deploy refresh notification
-- This mimics the exact behavior of auto deploy by setting localStorage flag
-- You can run this to programmatically trigger the "app needs update" behavior

-- NOTE: Since we can't directly set localStorage from SQL, 
-- this would need to be done via a Supabase Edge Function or by 
-- having the app check a special database flag

-- Create a special deployment_status table for triggering refresh
CREATE TABLE IF NOT EXISTS deployment_status (
    id SERIAL PRIMARY KEY,
    deployment_version VARCHAR(50) NOT NULL,
    needs_refresh BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert new deployment to trigger refresh
INSERT INTO deployment_status (deployment_version, needs_refresh)
VALUES ('v2025.09.05-tutorial-profile-update', true);

-- The app can check this table and trigger the same refresh notification
-- when deployment_version changes or needs_refresh is true

-- RECOMMENDED: Use broadcast_notifications (Option 2)
-- It's the cleanest approach and matches your existing notification system