INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, channel_id, is_pro, subscription_type, streak_days, avatar_url)
SELECT au.id, p.display_name, p.level,
'Amiin dan terima kasih.',
now() - interval '9 minutes',
'community', COALESCE(ps.pro_badge, false), ps.subscription_type, p.streak_days, p.avatar_url
FROM auth.users au JOIN public.profiles p ON au.id = p.user_id LEFT JOIN public.pro_subscriptions ps ON au.id = ps.user_id AND ps.status = 'active' AND ps.subscription_end_date > now()
WHERE au.email = 'mock14@yahoo.com';