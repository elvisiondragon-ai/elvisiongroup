-- Make chat messages publicly viewable by everyone
DROP POLICY IF EXISTS "Anyone can view chat messages" ON public.chat_messages;

CREATE POLICY "Anyone can view chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);

-- Insert the Indonesian community chat messages
INSERT INTO public.chat_messages (user_id, user_name, message, user_level, is_vip, created_at) VALUES
-- Generate a fake user ID for demo messages
('00000000-0000-0000-0000-000000000001', 'Budiyas32', 'asik banget apknya', 3, false, '2024-01-01 09:15:00+07'),
('00000000-0000-0000-0000-000000000002', 'dudungsubang', 'bener lebih mudah denger audionya ada historynya lagi', 2, false, '2024-01-01 09:16:00+07'),
('00000000-0000-0000-0000-000000000003', 'andiniwati', 'iya jadi betah diam di aplikasi', 2, false, '2024-01-01 09:16:00+07'),
('00000000-0000-0000-0000-000000000004', 'Jason', 'wah iya nih ada sistem game juga', 3, false, '2024-01-01 09:18:00+07'),
('00000000-0000-0000-0000-000000000005', 'Andin', 'bener mas anto, seru ngejar poinnya hehe', 9, false, '2024-01-01 09:18:00+07'),
('00000000-0000-0000-0000-000000000006', 'Master Yoga', 'Peringkatku naik terus nih, jadi semangat', 8, false, '2024-01-01 09:19:00+07'),
('00000000-0000-0000-0000-000000000007', 'SitiAisyah', 'fitur history itu yg paling ngebantu aku sih', 2, false, '2024-01-01 09:22:00+07'),
('00000000-0000-0000-0000-000000000008', 'EkoPrasetyo', 'setuju, ga perlu cari ulang audio yg kemarin didengerin', 2, false, '2024-01-01 09:22:00+07'),
('00000000-0000-0000-0000-000000000009', 'IwanSetiawan', 'Tampilannya juga bersih, ga ribet, enak diliat', 2, false, '2024-01-01 09:25:00+07'),
('00000000-0000-0000-0000-000000000010', 'DewiLestari90', 'baru download kemarin, langsung sukaa', 1, false, '2024-01-01 09:30:00+07'),
('00000000-0000-0000-0000-000000000011', 'Bambang_P', 'selamat datang mba dewi, dijamin nagih wkwk', 3, false, '2024-01-01 10:15:00+07'),
('00000000-0000-0000-0000-000000000012', 'PutriAyu', 'notifikasinya juga ga ganggu, pas banget timingnya', 2, false, '2024-01-01 10:17:00+07'),
('00000000-0000-0000-0000-000000000013', 'JokoWibowo88', 'Betul, ngingetin pas ada konten baru aja', 2, false, '2024-01-01 10:17:00+07'),
('00000000-0000-0000-0000-000000000014', 'HendraGunawan', 'eh ada yg udah dapet badge ''Master'' belum?', 4, true, '2024-01-01 10:20:00+07'),
('00000000-0000-0000-0000-000000000015', 'RatuAisyah', 'aku baru dapet yg ''Expert'', susah bgt yg master', 3, false, '2024-01-01 10:21:00+07'),
('00000000-0000-0000-0000-000000000016', 'SuryaAdi', 'Master harus selesain 100 audio tanpa skip kalo gasalah', 4, true, '2024-01-01 10:21:00+07'),
('00000000-0000-0000-0000-000000000017', 'HeruSantoso', 'wih mantap, kejar ah', 2, false, '2024-01-01 10:22:00+07'),
('00000000-0000-0000-0000-000000000018', 'LindaWati', 'Suka bgt sama playlistnya, bisa bikin sendiri', 3, false, '2024-01-01 11:40:00+07'),
('00000000-0000-0000-0000-000000000019', 'AhmadZaini', 'iyaa, aku kelompokin per topik jadi gampang belajarnya', 3, false, '2024-01-01 11:41:00+07'),
('00000000-0000-0000-0000-000000000020', 'CitraKirana', 'Adminnya juga responsif, kemarin aku lapor bug cepet ditanggepin', 3, false, '2024-01-01 11:45:00+07'),
('00000000-0000-0000-0000-000000000021', 'UjangTea', 'dua jempol buat developernya', 1, false, '2024-01-01 11:46:00+07'),
('00000000-0000-0000-0000-000000000022', 'MegaChan', 'Kualitas audionya jernih, pake headset makin mantap', 2, false, '2024-01-01 11:48:00+07'),
('00000000-0000-0000-0000-000000000023', 'FirmanHakim', 'bener, ga pecah suaranya', 1, false, '2024-01-01 11:48:00+07'),
('00000000-0000-0000-0000-000000000024', 'Sari_Love', 'aku malah suka dengerin sambil masak, jadi ga bosen', 2, false, '2024-01-01 11:50:00+07'),
('00000000-0000-0000-0000-000000000025', 'WawanKurniawan', 'ide bagus tuh mba sari, patut dicoba', 1, false, '2024-01-01 11:52:00+07'),
('00000000-0000-0000-0000-000000000026', 'DianPermata', 'Gamenya itu loh, simpel tapi bikin penasaran', 2, false, '2024-01-01 11:54:00+07'),
('00000000-0000-0000-0000-000000000027', 'FajarNugroho', 'bener, ga sadar udah main setengah jam sendiri', 2, false, '2024-01-01 11:55:00+07'),
('00000000-0000-0000-0000-000000000028', 'IndahPermatasari', 'Poinnya bisa dituker ga sih?', 1, false, '2024-01-01 11:58:00+07'),
('00000000-0000-0000-0000-000000000029', 'Admin_Renata', 'Belum bisa kak Indah, tapi ditunggu aja updatenya ya :)', 1, false, '2024-01-01 12:05:00+07'),
('00000000-0000-0000-0000-000000000030', 'AndiMalaka', 'wih adminnya muncul', 1, false, '2024-01-01 13:30:00+07'),
('00000000-0000-0000-0000-000000000031', 'BayuPradana', 'siap min, ditunggu fitur barunya', 2, false, '2024-01-01 13:31:00+07'),
('00000000-0000-0000-0000-000000000032', 'KartikaSari', 'Semoga ada fitur dark mode ya min kedepannya', 3, false, '2024-01-01 13:35:00+07'),
('00000000-0000-0000-0000-000000000033', 'Nurhayati85', 'setuju bgt, biar hemat batre juga', 2, false, '2024-01-01 13:36:00+07'),
('00000000-0000-0000-0000-000000000034', 'RudiHartono', 'Apk ini ringan banget, ga bikin hp lemot', 2, false, '2024-01-01 13:40:00+07'),
('00000000-0000-0000-0000-000000000035', 'TeguhPrasetyo', 'iya di hp kentangku juga lancar jaya', 2, false, '2024-01-01 13:40:00+07'),
('00000000-0000-0000-0000-000000000036', 'VinaPanduwinataKW', 'Gokil, ini aplikasi yg kucari selama ini', 2, false, '2024-01-01 15:02:00+07'),
('00000000-0000-0000-0000-000000000037', 'YusufMaulana', 'Rekomen ke temen2 kantor, pada suka semua', 3, false, '2024-01-01 15:05:00+07'),
('00000000-0000-0000-0000-000000000038', 'ZainalAbidin', 'Komunitasnya juga asik, jadi nambah temen', 2, false, '2024-01-01 15:08:00+07'),
('00000000-0000-0000-0000-000000000039', 'AsepSunandar', 'bener kang, pada ramah semua disini', 1, false, '2024-01-01 15:09:00+07'),
('00000000-0000-0000-0000-000000000040', 'BungaCitra', 'pokoknya aplot konten baru terus ya min, jangan kasih kendor', 3, false, '2024-01-01 15:12:00+07'),
('00000000-0000-0000-0000-000000000041', 'CandraWijaya', 'setiap hari pasti buka aplikasi ini, udah jadi kebiasaan', 4, true, '2024-01-01 15:20:00+07'),
('00000000-0000-0000-0000-000000000042', 'DoniSaputra', 'sama, pagi2 dengerin audio disini bikin semangat kerja', 4, true, '2024-01-01 15:21:00+07');