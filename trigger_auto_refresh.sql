-- Advanced SQL to trigger auto-refresh notification (like auto deploy)
-- This creates a notification that will show the SAME refresh button as auto deploy

-- 1. Send broadcast notification with refresh action
INSERT INTO broadcast_notifications (
    title, 
    message, 
    type, 
    priority,
    action_type,
    action_label,
    expires_at, 
    created_at
) VALUES (
    '🎨 UPDATE TERSEDIA!',
    'Fitur baru telah dirilis: Tutorial Read Profil dengan desain mewah, Profile icons HD+ 3D, sistem caching video, dan perbaikan performa lainnya.',
    'update', -- Special type that triggers refresh behavior
    'high',
    'refresh', -- This tells the app to show refresh button
    '🔄 Refresh Sekarang',
    NOW() + INTERVAL '7 days',
    NOW()
);

-- 2. Alternative: Individual notifications with refresh action
INSERT INTO notifications (user_id, title, message, type, action_type, action_label, created_at)
SELECT 
    user_id, 
    '🎨 UPDATE TERSEDIA!', 
    'Tutorial Read Profil baru dengan desain mewah, Profile icons HD+ 3D, dan sistem caching telah dirilis. Refresh untuk melihat perubahan.',
    'update', -- Special type that triggers refresh behavior  
    'refresh', -- This tells the app to show refresh button
    '🔄 Refresh & Update',
    NOW()
FROM profiles 
WHERE user_id IS NOT NULL;

-- 3. Create app_updates table for version control
CREATE TABLE IF NOT EXISTS app_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    requires_refresh BOOLEAN DEFAULT true,
    released_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE app_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view app updates" ON app_updates FOR SELECT TO authenticated USING (true);

-- Insert the current update
INSERT INTO app_updates (
    version, 
    title, 
    description, 
    requires_refresh
) VALUES (
    'v2025.09.05',
    '🎨 Major UI/UX Update',
    'Tutorial Read Profil dengan desain Roman mewah, Profile icons HD+ 3D dengan efek glow, sistem caching video testimonial, Telegram Community button, dan database notification tracking.',
    true
);

-- 4. Function to check for app updates
CREATE OR REPLACE FUNCTION check_app_updates()
RETURNS TABLE (
    version TEXT,
    title TEXT,
    description TEXT,
    requires_refresh BOOLEAN
)
LANGUAGE SQL
AS $$
    SELECT 
        version::TEXT,
        title::TEXT, 
        description::TEXT,
        requires_refresh
    FROM app_updates 
    WHERE expires_at > NOW()
    ORDER BY released_at DESC 
    LIMIT 1;
$$;

-- Usage Instructions:
-- 1. Run the broadcast_notifications INSERT to send update notification to all users
-- 2. The app will detect type='update' and action_type='refresh' 
-- 3. It will show the same refresh button as auto deploy
-- 4. When users click the button, it clears cache and refreshes the app

-- To test: Run the first INSERT statement and check the app for the notification