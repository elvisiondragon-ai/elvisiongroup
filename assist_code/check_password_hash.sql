-- Check if password hash is working correctly
SELECT 
    email,
    encrypted_password,
    length(encrypted_password) as hash_length,
    -- Test if password "password123" matches the hash
    encrypted_password = crypt('password123', encrypted_password) as password_matches
FROM auth.users 
WHERE email = 'mock6@yahoo.com';

-- Check if the hash format looks correct (bcrypt should start with $2a$ or $2b$)
SELECT 
    email,
    substring(encrypted_password, 1, 4) as hash_prefix,
    length(encrypted_password) as hash_length
FROM auth.users 
WHERE email LIKE 'mock%@yahoo.com'
LIMIT 5;