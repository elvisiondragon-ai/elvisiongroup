SELECT
    p.user_id,
    p.total_verses AS current_total_verses_in_profile,
    (SELECT COUNT(*) FROM public.xp_transactions WHERE user_id = p.user_id AND transaction_type = 'audio_completion') AS total_audio_completions_logged,
    (SELECT COUNT(*) FROM public.user_activities WHERE user_id = p.user_id AND activity_type = 'verse_incremented') AS total_verse_increment_events
FROM
    public.profiles p
WHERE
    p.user_id = 'YOUR_USER_ID'; -- REPLACE WITH THE ACTUAL USER_ID