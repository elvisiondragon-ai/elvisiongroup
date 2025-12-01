-- Create a function to simulate daily chat messages from 20 mock users.
CREATE OR REPLACE FUNCTION simulate_daily_mock_chats()
RETURNS void AS $$
DECLARE
    v_email TEXT;
    v_message TEXT;
    v_created_at TIMESTAMPTZ;
    messages TEXT[] := ARRAY[
        'Selamaat malam teman teman',
        'Pagi semua, semangat ya hari ini!',
        'Ada yang punya rekomendasi film seru?',
        'Lagi dengerin lagu apa nih?',
        'Kerjaan numpuk banget, butuh liburan.',
        'Selamat siang, jangan lupa makan ya.',
        'Hujan di tempatku, di sana gimana?',
        'Akhir pekan mau kemana nih?',
        'Baru selesai meeting, akhirnya bisa istirahat.',
        'Ada berita menarik apa hari ini?'
    ];
BEGIN
    -- Loop from 1 to 20 for mock1@yahoo.com to mock20@yahoo.com
    FOR i IN 1..20 LOOP
        v_email := 'mock' || i || '@yahoo.com';

        -- Select a random message from the array
        v_message := messages[1 + floor(random() * array_length(messages, 1))];

        -- Generate a random timestamp within the last 24 hours
        v_created_at := now() - (random() * interval '24 hours');

        -- Insert the chat message for the mock user
        INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, channel_id, is_pro, subscription_type, streak_days, avatar_url)
        SELECT
            au.id,
            p.display_name,
            p.level,
            v_message,
            v_created_at,
            'community',
            COALESCE(ps.pro_badge, false),
            ps.subscription_type,
            p.streak_days,
            p.avatar_url
        FROM auth.users au
        JOIN public.profiles p ON au.id = p.user_id
        LEFT JOIN public.pro_subscriptions ps ON au.id = ps.user_id AND ps.status = 'active' AND ps.subscription_end_date > now()
        WHERE au.email = v_email;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Example of how to run the function manually:
-- SELECT simulate_daily_mock_chats();
