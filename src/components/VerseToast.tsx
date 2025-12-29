import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const VerseToast = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Cleanup ref for notification timeout
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Random User Activity Notification System
  useEffect(() => {
    if (!user) return;

    const userList = [
      'Gustian', 'Dr. Hendro Wijaya', 'Mega Sari', 'Dani Pratama', 'Lina Maharani', 'Budi Hartono',
      'Fitri Handayani', 'Made Bangli', 'Putri Wahyudi', 'Tian Lee', 'Agustinus', 'Suyin Bekasi',
      'Sari Kusuma', 'Ahmad Santoso', 'Dewi Anggraini, A.Md.Keb', 'Rina Puspita', 'Dr. Maya Sari',
      'S.Kom Andi Nugroho', 'Prof. Joko', 'drg. Susi Ramdani', 'dr. hendri', 'Bambang Sutomo',
      'S.E. Sinta Dewi', 'Prof. Wahyu', 'M.T. ratnapermata', 'prof. bayu', 'Retno Wulandari',
      'Dr. Endah Lestari', 'S.T. budiartanto', 'Ir. Teguh', 'A.Md.Keb sintalesmana', 'ir. imam',
      'Nita Anggraeni', 'M.M. Bayu Pradana', 'Prof. Dr. Citra', 'drg. budiciamissol', 'dr. maya',
      'Yudi Hermawan', 'S.H. Silvia Maharani', 'Prof. aisyah', 'M.E. andihartawan', 'ir. rina',
      'Irfan Maulana', 'Dr. Rika Permata', 'S.Psi. sintalaksana', 'Prof. Bima', 'drg. mayasusanti',
      'dr. yudi', 'Dimas Pratama', 'S.Farm. Sari Handayani', 'Prof. rizkianugerah', 'M.Kom dewiratna',
      'ir. andi', 'Joni Setiawan', 'Dr. Wulan Sari', 'Sinta Dewi', 'rudihartono', 'mayasusanti',
      'rudiciputra', 'bayu', 'Agus Wibowo', 'rinaanggraeni', 'rizkianugerah', 'rinadarmawan',
      'rina', 'Lina Rahayu', 'bayuwibowo', 'dewiratna', 'bayutegarino', 'andi', 'Doni Setiawan',
      'citradewi', 'bagusindra', 'citranirmala',
      'arianaputra', 'deviputri', 'farhanperkasa', 'gitalestari', 'haryosaputra', 'irfansyah',
      'jajangpermana', 'kinasari', 'lukmanadi', 'miftahulhaq', 'nabilahakim', 'opanpermata',
      'putriwidya', 'qoriimani', 'rizkyaditama', 'salsabilla', 'tariqzaman', 'umarmukti',
      'vinaardianti', 'wildansyah', 'bima aditya', 'cinta rahayu', 'dafa setiawan', 'elang pratama',
      'fira handayani', 'gama wijaya', 'hana permata', 'indra kusuma', 'junaedi saputra', 'kania lestari',
      'lutfi anggara', 'maya dini', 'nanda putri', 'ozi ramadhan', 'pasha nugroho', 'qila salsabila',
      'rama darmawan', 'sakti budiman', 'tio mahendra', 'umi kalsum', 'Arya Wijaya', 'Bella Permata',
      'Cakra Santoso', 'Dinda Maharani', 'Evan Perkasa', 'Fani Rahmawati', 'Gibran Maulana',
      'Hilda Kurnia', 'Iqbal Firdaus', 'Jelita Sari', 'kiki pancoran', 'lala cengkareng', 'miko tollroad',
      'nisa warungkopi', 'ojan bajuri', 'pipit transjakarta', 'qiqi kampungmelayu', 'rere senopati',
      'sasa manggarmas', 'tata ciledug', 'uut pondoklabu', 'vina karetan', 'wawan gerbangtol',
      'xena monas', 'yaya cibinong', 'zizi depokbaru', 'adit jembatanmerah', 'beta stasiunbogor',
      'coki cawangtimur', 'dodi simpanglima', 'Dr. Fira Adhani', 'Prof. Arka Wijayanto', 'drg. Vania Kirana',
      'S.Kom. Gibran Fauzan', 'M.T. Talitha Prameswari', 'S.E. Daffa Lesmana', 'Ir. Elvira Damayanti',
      'A.Md.Keb. Shabira Larasati', 'S.Psi. Rayhan Firdaus', 'M.Kom. Keisha Putriana', 'S.ST. Alvaro Sentosa',
      'Dr. Zavier Budiyanto', 'Prof. Callista Wening', 'drg. Raisa Sulistyo', 'S.H. Fadilah Winata',
      'M.M. Kenzie Ardhana', 'Ir. Bianca Laraswati', 'S.Farm. Nadhira Fajrin', 'Dr. Rafi Gunarsa',
      'Prof. Anya Praditha', 'S.IP. Dzaki Fauzi', 'M.Pd. Laras Sekar', 'A.Md.T. Fathan Adriansyah',
      'S.Sos. Amira Kinasih', 'Dr. Ezra Wicaksono', 'Prof. Salma Dewanti', 'drg. Nasya Pratista',
      'S.Kom. Arsenio Kusnadi', 'M.T. Clarissa Hartadi', 'S.E. Valen Suryadi',
      'Budi Santoso', 'Dewi Lestari', 'Joko Susilo', 'Siti Aminah', 'Ahmad Yani', 'Ratna Sari',
      'I Gede Wirawan', 'Tigor Siregar', 'Siti Nurhaliza', 'Amir Hamzah', 'Chandra Kirana',
      'Eka Kurniawan', 'Fitriani Hasanah', 'Guntur Perkasa', 'Harun Al Rasyid', 'Indah Permatasari',
      'Kartika Chandra', 'Lestari Indah', 'Muhammad Taufik', 'Nina Agustina', 'Omar Syarif',
      'Putri Ayu', 'Qoriatul Hasanah', 'Rizky Ananda', 'Surya Pratama', 'Taufik Hidayat',
      'Umar Bakri', 'Vera Susanti', 'Wati Ningsih', 'Yanto Basna', 'Asep', 'Ujang',
      'Bambang', 'Endang', 'Iwan', 'Wati', 'Agus', 'Yanti', 'Tono', 'Wawan', 'Yuni',
      'Zulkifli', 'Aishah', 'Butet', 'Poltak', 'Wayan', 'Made', 'Nyoman', 'Ketut',
      'Sutrisno', 'Sumarni', 'Hartono', 'Widodo', 'Lestari', 'Gunawan', 'Purnomo',
      'Handoko', 'Maimunah', 'Jamilah', 'Surya', 'anwarfuadi', 'bintangsamudra',
      'cahyapurnama', 'dianpermata', 'ekaprasetya', 'fajarhidayat', 'gitaselvia',
      'hasanuddin', 'indahcahyani', 'jayatrisna', 'kurniawati', 'lintangbaskoro',
      'mayasari', 'nabilahputri', 'okypratama', 'panduwijaya', 'qorirahman',
      'restuibu', 'saskiakirana', 'tiaraputri', 'utamiputri', 'vionaananda',
      'wulandariayu', 'xavierbatubara', 'yessicaputri', 'zainalabidin', 'adityanugraha',
      'bayuanggara', 'citralestari', 'donihartono', 'abdisiregar', 'bataranatar',
      'cintyadewi', 'darmayantisimbolon', 'endangsusilowati', 'fatimahazzahra',
      'galihprakoso', 'haryonosaputra', 'intanpermatasari', 'johanliebert',
      'kadekmahardika', 'luhputuayu', 'marulitua', 'nengahsutrisna', 'parulian',
      'qomariyah', 'rahmadewisinta', 'situmorang', 'togarhasibuan', 'ulidamanik',
      'vanyasaragih', 'wajdysumbayak', 'yantisimatupang', 'zulfahmisinaga',
      'anissaharahap', 'bonarnapitupulu', 'carolinepanjaitan', 'davidlumbantobing',
      'erikasianturi', 'firmanpanggabean'
    ];

    const activities = [
      'Listening to Verse 1 - The Space Hill',
      'Listening to Verse 2 - Lucid Beach',
      'Listening to Verse 3 - Gratitude Meditation',
      'Listening to Verse 4 - Prosperity Stream',
      'Listening to Verse 5 - Vitality Vortex',
      'Listening to Verse 8 - Love Magnet',
      'Listening to Guided to Inner Silence',
      'Listening to eL Vision Delta Breathing'
    ];

    // Seeded random number generator for deterministic shuffling
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Fisher-Yates shuffle with seed for deterministic random order
    const shuffleArray = (array: string[], seed: number) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const showRandomActivity = () => {
      // Keep 5-minute slot for user synchronization
      const jakartaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
      const currentSlot = Math.floor(jakartaTime.getTime() / (5 * 60 * 1000)); // 5-minute slots

      // Calculate epoch (each epoch = one complete cycle through all names)
      const epoch = Math.floor(currentSlot / userList.length);
      const positionInEpoch = currentSlot % userList.length;

      // Shuffle userList based on epoch (reshuffles each cycle)
      const shuffledUsers = shuffleArray(userList, epoch);

      // Pick name at current position in shuffled list
      const randomUser = shuffledUsers[positionInEpoch];

      // Random verse selection from ALL verses
      const randomVerseIndex = Math.floor(Math.random() * activities.length);
      const randomActivity = activities[randomVerseIndex];
      const displayName = randomUser;
      
      // Extract verse title from activity
      const verseTitle = randomActivity.replace('Listening to ', '');

      toast({
        title: `${displayName} is Listening 🎧`,
        description: `${verseTitle} 🔥`,
        duration: 6000, // Show for 6 seconds
        className: "p-3 pr-4 space-x-3 [&>div>*:first-child]:text-sm [&>div>*:last-child]:text-sm",
      });
    };

    // GLOBAL notification every 5 minutes - UTC+7 JAKARTA TIME
    const scheduleGlobalNotification = () => {
      const now = new Date();
      // Convert to Jakarta time (UTC+7)
      const jakartaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
      const nextMinute = new Date(jakartaTime);
      
      // Calculate next 5-minute mark based on Jakarta time
      const currentMinutes = jakartaTime.getMinutes();
      const currentSeconds = jakartaTime.getSeconds();
      const nextFiveMinuteMark = Math.ceil((currentMinutes + 1) / 5) * 5;
      
      nextMinute.setMinutes(nextFiveMinuteMark, 0, 0); // Set to next 5-minute mark
      
      // If we're already at the next 5-minute mark, go to the one after
      if (nextMinute <= jakartaTime) {
        nextMinute.setMinutes(nextFiveMinuteMark + 5, 0, 0);
      }
      
      // Calculate time difference back to local time for setTimeout
      const timeUntilNext = nextMinute - jakartaTime;
      
      notificationTimeoutRef.current = setTimeout(() => {
        showRandomActivity();
        scheduleGlobalNotification(); // Schedule next one
      }, timeUntilNext);
    };

    scheduleGlobalNotification();

    return () => {
      // Cleanup notification timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
        notificationTimeoutRef.current = null;
      }
    };
  }, [user, toast]);

  // Real User Verse Notification System
  // CRITICAL: Event listener needs User as trigger - cannot randomly listen
  // useEffect must depend on [user] to re-run when authentication completes
  useEffect(() => {
    if (!user) return;

    const showVerseNotification = (payload) => {
      console.log('🔥 Real-time verse notification received:', payload);
      
      if (payload.eventType === 'INSERT') {
        const { user_id: activityUserId, display_name, verse_title } = payload.new;
        
        // THIS BUG IS CRUCIAL WITHOUT THIS NO TOAST 🤯
        // WTF: This variable MUST be referenced or toast won't work
        void activityUserId; // Keep variable "alive" without console.log
        
        toast({
          title: `${display_name} is Listening 🎧`,
          description: `${verse_title} 🔥`,
          duration: 6000, // Show for 6 seconds
          className: "p-3 pr-4 space-x-3 [&>div>*:first-child]:text-sm [&>div>*:last-child]:text-sm",
        });
      }
    };

    const handleVerseNotification = (event: CustomEvent) => {
      showVerseNotification({ eventType: 'INSERT', new: event.detail });
    };

    window.addEventListener('verse_notification', handleVerseNotification as EventListener);

    return () => {
      console.log('🔌 Removing verse notification event listener');
      window.removeEventListener('verse_notification', handleVerseNotification as EventListener);
    };
  }, [user, toast]); // Event listener needs User as trigger - runs when user becomes available

  return null; // This component only handles notifications, no UI
};