-- Manual Auto Deploy Trigger SQL
-- This will trigger the same auto deploy notification with clickable refresh button

-- 1. Create app_updates table if it doesn't exist
CREATE TABLE IF NOT EXISTS app_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    requires_refresh BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE app_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view app updates" ON app_updates FOR SELECT TO authenticated USING (true);

-- 2. Insert manual update trigger (THIS IS WHAT YOU RUN)
INSERT INTO app_updates (
    version, 
    title, 
    description, 
    requires_refresh
) VALUES (
    'v2025.09.05-manual-trigger',
    '🎨 Major UI/UX Update',
    'Tutorial Read Profil dengan desain Roman mewah, Profile icons HD+ 3D dengan efek glow, sistem caching video testimonial, Telegram Community button.',
    true
);

-- 3. How it works:
-- - App checks this table on load
-- - If requires_refresh = true and created_at > last_update_check
-- - App sets localStorage 'app-needs-update' = 'true'
-- - Auto deploy toast notification appears with clickable refresh button
-- - Same exact behavior as real auto deploy

-- TO TRIGGER: Just run the INSERT statement above
-- Users will see the auto deploy notification with refresh button