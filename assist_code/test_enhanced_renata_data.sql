-- TEST DATA FOR ENHANCED RENATA ANALYSIS
-- This prepares sample data to test the complete spiritual trinity analysis

-- 1. Check current user data for testing
SELECT 'USER DATA FOR TESTING' as status,
       u.email,
       p.total_journal,
       p.total_elite_habit,
       p.total_verses,
       u.id as user_id
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE p.total_journal > 0 OR p.total_elite_habit > 0 OR p.total_verses > 0
ORDER BY (COALESCE(p.total_journal, 0) + COALESCE(p.total_elite_habit, 0) + COALESCE(p.total_verses, 0)) DESC
LIMIT 5;

-- 2. Sample reflections data structure
SELECT 'SAMPLE REFLECTIONS DATA' as status,
       r.id,
       r.user_id,
       r.question,
       r.reflection as content,
       r.created_at
FROM public.reflections r
ORDER BY r.created_at DESC
LIMIT 3;

-- 3. Sample elite habits data structure
SELECT 'SAMPLE ELITE HABITS DATA' as status,
       h.id,
       h.user_id,
       h.exercise_type,
       h.duration_minutes,
       h.date,
       h.created_at
FROM public.elite_habits h
ORDER BY h.created_at DESC
LIMIT 3;

-- 4. Create test JSON payload for RENATA API
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT;
    reflections_json JSONB;
    elite_habits_json JSONB;
    test_payload JSONB;
BEGIN
    -- Get a user with data
    SELECT u.id, u.email INTO test_user_id, test_email
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    WHERE p.total_journal > 0 AND p.total_elite_habit > 0
    ORDER BY (p.total_journal + p.total_elite_habit) DESC
    LIMIT 1;

    IF test_user_id IS NOT NULL THEN
        -- Build reflections array
        SELECT json_agg(
            json_build_object(
                'id', r.id,
                'content', r.reflection,
                'question', r.question,
                'created_at', r.created_at
            )
        ) INTO reflections_json
        FROM public.reflections r
        WHERE r.user_id = test_user_id
        ORDER BY r.created_at DESC
        LIMIT 10;

        -- Build elite habits array
        SELECT json_agg(
            json_build_object(
                'id', h.id,
                'exercise_type', h.exercise_type,
                'duration_minutes', h.duration_minutes,
                'date', h.date,
                'created_at', h.created_at
            )
        ) INTO elite_habits_json
        FROM public.elite_habits h
        WHERE h.user_id = test_user_id
        ORDER BY h.created_at DESC
        LIMIT 10;

        -- Build complete test payload
        SELECT json_build_object(
            'userId', test_user_id,
            'userName', test_email,
            'reflections', COALESCE(reflections_json, '[]'::json),
            'eliteHabits', COALESCE(elite_habits_json, '[]'::json),
            'totalJournal', (SELECT COUNT(*) FROM public.reflections WHERE user_id = test_user_id),
            'totalEliteHabits', (SELECT COUNT(*) FROM public.elite_habits WHERE user_id = test_user_id),
            'totalVerses', (SELECT total_verses FROM public.profiles WHERE user_id = test_user_id)
        ) INTO test_payload;

        RAISE NOTICE 'TEST PAYLOAD FOR ENHANCED RENATA:';
        RAISE NOTICE '%', test_payload::text;

    ELSE
        RAISE NOTICE 'No users with sufficient data found for testing';
    END IF;
END $$;

-- 5. Elite habits profile distribution analysis
SELECT 'ELITE HABITS PROFILE ANALYSIS' as status,
       exercise_type,
       COUNT(*) as frequency,
       AVG(duration_minutes) as avg_duration,
       CASE
           WHEN exercise_type IN ('Plank', 'Push-up') THEN 'Discipline-Focus'
           WHEN exercise_type IN ('Yoga') THEN 'Introspective-Calm'
           WHEN exercise_type IN ('Jalan santai', 'Jalan di alam bebas', 'Meditasi jalan') THEN 'Contemplative-Movement'
           WHEN exercise_type IN ('Renang') THEN 'Flow-Meditation'
           WHEN exercise_type IN ('Lari', 'Bersepeda') THEN 'Endurance-Mindfulness'
           WHEN exercise_type IN ('Senam pernapasan') THEN 'Breath-Awareness'
           ELSE 'General-Mindfulness'
       END as mindfulness_profile
FROM public.elite_habits
GROUP BY exercise_type
ORDER BY frequency DESC;

-- 6. Spiritual trinity readiness check
SELECT 'SPIRITUAL TRINITY READINESS' as status,
       u.email,
       CASE WHEN p.total_journal >= 3 THEN '✅' ELSE '❌' END as journals_ready,
       CASE WHEN p.total_elite_habit >= 2 THEN '✅' ELSE '❌' END as elite_habits_ready,
       CASE WHEN p.total_verses >= 2 THEN '✅' ELSE '❌' END as verses_ready,
       CASE
           WHEN p.total_journal >= 3 AND p.total_elite_habit >= 2 AND p.total_verses >= 2
           THEN '🔮 READY FOR ENHANCED RENATA'
           ELSE '⏳ Need more spiritual data'
       END as renata_status
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE p.total_journal > 0 OR p.total_elite_habit > 0 OR p.total_verses > 0
ORDER BY (p.total_journal + p.total_elite_habit + p.total_verses) DESC;