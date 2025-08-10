-- Add 5 community comments about the language switching feature
INSERT INTO public.chat_messages (user_id, user_name, message, user_level, is_vip, created_at) VALUES
(
  gen_random_uuid(),
  'Hans Müller',
  'Luar biasa! Akhirnya ada aplikasi yang otomatis mengerti saya tanpa perlu ganti bahasa manual.',
  2,
  false,
  now() - interval '5 minutes'
),
(
  gen_random_uuid(),
  'Claire Dubois',
  'Ini keren sekali! Rasanya seperti aplikasi ini bicara langsung dengan saya dalam bahasa ibu.',
  2,
  false,
  now() - interval '4 minutes'
),
(
  gen_random_uuid(),
  'John Smith',
  'Hebat banget! Seperti aplikasi ini dibuat khusus untuk saya, di mana pun saya berada.',
  2,
  false,
  now() - interval '3 minutes'
),
(
  gen_random_uuid(),
  'Khalid Al-Farouq',
  'Benar-benar memukau! Aplikasi ini paham bahasa saya dan membuat pengalaman terasa alami.',
  2,
  false,
  now() - interval '2 minutes'
),
(
  gen_random_uuid(),
  'Haruki Tanaka',
  'Ini luar biasa! Rasanya seperti aplikasi ini diciptakan khusus untuk saya.',
  2,
  false,
  now() - interval '1 minute'
);