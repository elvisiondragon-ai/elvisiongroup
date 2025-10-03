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
      'Fitri Handayani', 'Made Bangli', 'Putri Wahyudi', 'Tian Leeeee', 'Agustinus', 'Suyin Bekasi',
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
      'citradewi', 'bagusindra', 'citranirmala'
    ];

    const activities = [
      'Sedang Mendengarkan Verse 1 - The Space Hill',
      'Sedang Mendengarkan Verse 2 - Lucid Beach',
      'Sedang Mendengarkan Verse 3 - Syukur Meditation',
      'Sedang Mendengarkan Verse 4 - Prosperity Stream',
      'Sedang Mendengarkan Verse 5 - Vitality Vortex',
      'Sedang Mendengarkan Verse 8 - Love Magnet'
    ];

    const showRandomActivity = () => {
      // Keep 5-minute slot for user synchronization
      const jakartaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
      const currentSlot = Math.floor(jakartaTime.getTime() / (5 * 60 * 1000)); // 5-minute slots
      
      // Use seed to ensure all users see same name at same time
      const userIndex = currentSlot % userList.length;
      // Random verse selection from ALL verses
      const randomVerseIndex = Math.floor(Math.random() * activities.length);
      
      const randomUser = userList[userIndex];
      const randomActivity = activities[randomVerseIndex];
      const displayName = randomUser;
      
      // Extract verse title from activity
      const verseTitle = randomActivity.replace('Sedang Mendengarkan ', '');

      toast({
        title: `${displayName} Sedang Mendengarkan 🎧`,
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
          title: `${display_name} Sedang Mendengarkan 🎧`,
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