-- All users broadcast notification with refresh instruction
INSERT INTO notifications (user_id, title, message, type)
SELECT user_id, '🎨 UPDATE TERSEDIA!', 'Fitur baru telah dirilis: Tutorial Read Profil dengan desain mewah, Profile icons HD+ 3D, dan sistem caching. Refresh browser atau clear cache untuk melihat perubahan terbaru.', 'info'
FROM profiles;