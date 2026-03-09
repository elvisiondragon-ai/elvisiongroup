-- Update the community comments with new text
UPDATE public.chat_messages 
SET message = 'Akhirnya! Sebuah aplikasi yang tidak merepotkan. Saya buka, dan semuanya sudah dalam bahasa Jerman'
WHERE user_name = 'Hans Müller';

UPDATE public.chat_messages 
SET message = 'Cara aplikasi ini menyambut saya dalam bahasa Prancis terasa begitu personal'
WHERE user_name = 'Claire Dubois';

UPDATE public.chat_messages 
SET message = 'Keren'
WHERE user_name = 'John Smith';

UPDATE public.chat_messages 
SET message = 'Semoga lancar'
WHERE user_name = 'Khalid Al-Farouq';

UPDATE public.chat_messages 
SET message = 'Saya suka desainnya'
WHERE user_name = 'Haruki Tanaka';