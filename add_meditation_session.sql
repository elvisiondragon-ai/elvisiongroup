-- Insert meditation session into audio_tracks table
INSERT INTO audio_tracks (
    title,
    description,
    file_url,
    category,
    is_public,
    created_at,
    updated_at
) VALUES (
    'Monday Live Session 736',
    'Join our weekly guided meditation session with thousands of practitioners worldwide. Experience collective healing energy and spiritual alignment through the power of group consciousness.',
    'live01.MP3',
    'meditation_session',
    true,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;