-- Check which tables have user_id columns
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
    'audio_tracks', 'elite_habits', 'reflections', 'user_activities', 
    'xp_transactions', 'notification_settings', 'device_tokens', 
    'notifications', 'admin_roles', 'data_classification', 'days_remaining'
)
AND column_name LIKE '%user%'
ORDER BY table_name, column_name;