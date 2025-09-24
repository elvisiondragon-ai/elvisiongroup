-- Check ALL level thresholds 1-10 in database function
-- Test with comprehensive XP values to see every level boundary

-- Test database function with ALL possible level thresholds
SELECT 
    test_name,
    xp_value,
    public.calculate_level_from_xp(xp_value) as database_level,
    expected_level,
    CASE 
        WHEN public.calculate_level_from_xp(xp_value) = expected_level THEN '✅ MATCH'
        ELSE '❌ MISMATCH'
    END as status
FROM (
    VALUES 
        -- Level 1 tests
        ('Level 1 - Start', 0, 1),
        ('Level 1 - Middle', 50, 1),
        ('Level 1 - Max', 149, 1),
        
        -- Level 2 tests  
        ('Level 2 - Start', 150, 2),
        ('Level 2 - Middle', 300, 2),
        ('Level 2 - Max', 499, 2),
        
        -- Level 3 tests
        ('Level 3 - Start', 500, 3),
        ('Level 3 - Middle', 800, 3),
        ('Level 3 - Max', 1199, 3),
        
        -- Level 4 tests
        ('Level 4 - Start', 1200, 4),
        ('Level 4 - Middle', 1800, 4),
        ('Level 4 - Max', 2499, 4),
        
        -- Level 5 tests
        ('Level 5 - Start', 2500, 5),
        ('Level 5 - Middle', 3500, 5),
        ('Level 5 - Max', 4499, 5),
        
        -- Level 6 tests
        ('Level 6 - Start', 4500, 6),
        ('Level 6 - Middle', 5500, 6),
        ('Level 6 - Max', 6999, 6),
        
        -- Level 7 tests
        ('Level 7 - Start', 7000, 7),
        ('Level 7 - Middle', 8000, 7),
        ('Level 7 - Max', 8999, 7),
        
        -- Level 8 tests
        ('Level 8 - Start', 9000, 8),
        ('Level 8 - Middle', 10500, 8),
        ('Level 8 - Max', 11999, 8),
        
        -- Level 9 tests
        ('Level 9 - Start', 12000, 9),
        ('Level 9 - Middle', 13500, 9),
        ('Level 9 - Max', 14999, 9),
        
        -- Level 10 tests
        ('Level 10 - Start', 15000, 10),
        ('Level 10 - High', 20000, 10),
        ('Level 10 - Max', 50000, 10)
        
) AS test_data(test_name, xp_value, expected_level)
ORDER BY xp_value;

-- Show the actual database function code
SELECT 
    'CURRENT DATABASE FUNCTION' as info,
    pg_get_functiondef(p.oid) as function_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'calculate_level_from_xp';

-- Summary: Show what XP is needed for each level in database
SELECT 
    level,
    'Level ' || level as level_name,
    CASE level
        WHEN 1 THEN '0 XP'
        WHEN 2 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (0),(50),(100),(150),(200)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 2
        )
        WHEN 3 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (150),(200),(300),(500),(600)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 3
        )
        WHEN 4 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (500),(800),(1000),(1200),(1500)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 4
        )
        WHEN 5 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (1200),(1500),(2000),(2500),(3000)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 5
        )
        WHEN 6 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (2500),(3000),(4000),(4500),(5000)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 6
        )
        WHEN 7 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (4500),(5000),(6000),(7000),(7500)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 7
        )
        WHEN 8 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (7000),(7500),(8000),(9000),(9500)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 8
        )
        WHEN 9 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (9000),(10000),(11000),(12000),(12500)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 9
        )
        WHEN 10 THEN (
            SELECT MIN(xp_value)::text || ' XP' 
            FROM (VALUES (12000),(13000),(14000),(15000),(16000)) v(xp_value)
            WHERE public.calculate_level_from_xp(xp_value) = 10
        )
    END as required_xp
FROM generate_series(1, 10) level;