-- Update Hans Müller's message to mention English instead of German
UPDATE public.chat_messages 
SET message = 'Akhirnya! Sebuah aplikasi yang tidak merepotkan. Saya buka, dan semuanya sudah dalam bahasa Inggris'
WHERE user_name = 'Hans Müller';

-- Update Claire Dubois's message to ask about All father voice
UPDATE public.chat_messages 
SET message = 'Cara aplikasi ini menyambut saya dalam suara terasa begitu personal, siapakah itu All father yang dimaksud ?'
WHERE user_name = 'Claire Dubois';