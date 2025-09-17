import { useEffect, useState } from 'react';
import { usePro } from '@/hooks/usePro';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationTracker {
  lastShownDate: string | null;
  notificationIndex: number;
}

const PENGALAMAN_VIDEOS = [
  'OM-MANI-PADME-HUM',
  'RUQYAH-MANDARIN',
  'THETA-HEALING-SABAH-GOOD-MORNING-SABAH',
  'SILENT-MIND-MEDITATION',
  'CLEARING-SPACE-HEALING'
];

// Notification configuration - 6 notifications, 10 minutes apart
const NOTIFICATIONS = [
  {
    id: 1,
    title: "🎵 Testimonials Menunggu rasakan sendiri",
    description: "Dengarkan testimoni spiritual dari member lainnya",
    buttonText: "Dengar Sekarang",
    buttonClass: "bg-purple-600 hover:bg-purple-700",
    action: 'vio-testimonial'
  },
  {
    id: 2,
    title: "🎯 Tujuan Kami",
    description: "Pelajari visi dan misi spiritual eL Vision",
    buttonText: "Lihat Tujuan",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
    action: 'tujuan-kami'
  },
  {
    id: 3,
    title: "🧠 Personal Analytics Tersedia!",
    description: "Dapatkan insight mendalam perjalanan spiritual Anda",
    buttonText: "Analisis Sekarang",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700",
    action: 'personal-analytics'
  },
  {
    id: 4,
    title: "📖 Cara Menggunakan Aplikasi",
    description: "Panduan lengkap untuk memaksimalkan pengalaman spiritual",
    buttonText: "Pelajari Sekarang",
    buttonClass: "bg-green-600 hover:bg-green-700",
    action: 'tutorial'
  },
  {
    id: 5,
    title: "⚡ Hall of Energy",
    description: "Jelajahi pusat energi spiritual dan transformasi diri",
    buttonText: "Masuki Hall",
    buttonClass: "bg-yellow-600 hover:bg-yellow-700",
    action: 'hall-of-energy'
  },
  {
    id: 6,
    title: "🌟 Upgrade ke Pro",
    description: "Buka semua fitur premium untuk perjalanan spiritual lebih dalam",
    buttonText: "Upgrade Sekarang",
    buttonClass: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    action: 'upgrade-pro'
  }
];

// Using custom event system for navigation
const triggerNavigation = (action: string) => {
  const event = new CustomEvent('changeActiveTab', { detail: action });
  window.dispatchEvent(event);
};

export const useFreeUserNotifications = () => {
  const { proStatus } = usePro();
  const { user } = useAuth();
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentReason, setCurrentReason] = useState('');

  const getStoredTracker = (): NotificationTracker => {
    const stored = localStorage.getItem('freeUserNotificationTracker');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { lastShownDate: null, notificationIndex: 0 };
      }
    }
    return { lastShownDate: null, notificationIndex: 0 };
  };

  const updateTracker = (notificationIndex: number) => {
    const tracker: NotificationTracker = {
      lastShownDate: new Date().toDateString(),
      notificationIndex
    };
    localStorage.setItem('freeUserNotificationTracker', JSON.stringify(tracker));
  };

  const shouldStartNotifications = (): boolean => {
    if (!user) return false; // No notifications for unauthenticated users
    if (proStatus.isPro) return false; // No notifications for Pro users

    const tracker = getStoredTracker();
    const today = new Date().toDateString();

    // If never shown before, or if it's a new day, start notifications
    return !tracker.lastShownDate || tracker.lastShownDate !== today;
  };

  const getRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * PENGALAMAN_VIDEOS.length);
    return PENGALAMAN_VIDEOS[randomIndex];
  };

  const handleNotificationAction = (action: string) => {
    switch (action) {
      case 'vio-testimonial':
        // Open Vio's video modal directly - for authenticated users only
        triggerNavigation('home');
        const event = new CustomEvent('openVioVideo');
        window.dispatchEvent(event);
        break;
      case 'pengalaman-anggota':
        // Navigate to home and scroll to testimonials section
        triggerNavigation('home');
        localStorage.setItem('scrollToTestimonials', 'true');
        break;
      case 'tujuan-kami':
        // Navigate to external ecosystem website
        window.open('https://ecosystem.elvisiongroup.com', '_blank');
        break;
      case 'personal-analytics':
        triggerNavigation('personal-analytics');
        break;
      case 'tutorial':
        triggerNavigation('tutorial');
        break;
      case 'hall-of-energy':
        triggerNavigation('hall-of-energy');
        break;
      case 'upgrade-pro':
        triggerNavigation('payment');
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  };

  const showNotification = (notificationConfig: typeof NOTIFICATIONS[0], index: number) => {
    console.log(`🎯 Showing modal for: ${notificationConfig.action}`);
    setCurrentReason(notificationConfig.action);
    setShowModal(true);
    updateTracker(index + 1); // Update to next notification index
  };

  const handleModalNavigate = (action: string) => {
    console.log(`🚀 Navigating to: ${action}`);
    handleNotificationAction(action);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentReason('');
  };

  // Main notification scheduler
  useEffect(() => {
    if (!user) return; // No notifications for unauthenticated users
    if (proStatus.isPro) return;

    if (shouldStartNotifications()) {
      console.log('🔔 Starting daily notification sequence for authenticated free user');

      // Start notification sequence 5 seconds after app loads
      const initialDelay = setTimeout(() => {
        // Show all 6 notifications with 10-minute intervals
        NOTIFICATIONS.forEach((notification, index) => {
          const delay = index * 10 * 60 * 1000; // 10 minutes in milliseconds

          setTimeout(() => {
            console.log(`🔔 Showing notification ${index + 1}/6:`, notification.title);
            showNotification(notification, index);
          }, delay);
        });

        // Mark notifications as started for today
        updateTracker(0);
      }, 5000);

      return () => clearTimeout(initialDelay);
    } else {
      console.log('🚫 Daily notifications already shown today, user is Pro, or user is not authenticated');
    }
  }, [user, proStatus.isPro]);

  // Manual trigger functions for testing/debugging
  const triggerSpecificNotification = (index: number) => {
    if (index >= 0 && index < NOTIFICATIONS.length) {
      showNotification(NOTIFICATIONS[index], index);
    }
  };

  const resetNotificationTracker = () => {
    localStorage.removeItem('freeUserNotificationTracker');
    console.log('🔄 Notification tracker reset');
  };

  return {
    triggerSpecificNotification,
    resetNotificationTracker,
    currentNotificationIndex,
    totalNotifications: NOTIFICATIONS.length,
    showModal,
    currentReason,
    handleModalNavigate,
    handleModalClose
  };
};