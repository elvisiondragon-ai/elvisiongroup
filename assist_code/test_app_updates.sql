-- Test SQL for app_updates notification system

-- 1. Insert test notification
INSERT INTO app_updates (version, title, description) 
VALUES (
    'v2025.09.04.test', 
    '🧪 Test Update Notification', 
    'This is a test notification to verify the app updates system is working correctly. Click to refresh!'
);

-- 2. View current notifications
SELECT * FROM app_updates ORDER BY released_at DESC;

-- 3. Delete all notifications (clear table)
DELETE FROM app_updates;

-- 4. Alternative: Delete specific notification by version
-- DELETE FROM app_updates WHERE version = 'v2025.09.04.test';