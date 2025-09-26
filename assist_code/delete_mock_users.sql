-- Delete mock users from mock6 to mock15
DELETE FROM auth.users 
WHERE email IN (
    'mock6@yahoo.com',
    'mock7@yahoo.com', 
    'mock8@yahoo.com',
    'mock9@yahoo.com',
    'mock10@yahoo.com',
    'mock11@yahoo.com',
    'mock12@yahoo.com',
    'mock13@yahoo.com',
    'mock14@yahoo.com',
    'mock15@yahoo.com'
);

-- Verify deletion
SELECT email FROM auth.users WHERE email LIKE 'mock%@yahoo.com';