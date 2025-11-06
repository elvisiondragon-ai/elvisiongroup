// @ts-nocheck
import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { App } from '@capacitor/app';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { Send, Users, RefreshCw, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/contexts/AuthContext";
import { GoldReportList } from "./GoldReportList";

interface ChatMessageData {
  id: string;
  user_id: string;
  user_name: string;
  user_level: number;
  is_pro: boolean;
  is_admin?: boolean;
  message: string;
  created_at: string;
  streak_days?: number;
  subscription_type?: string | null;
  avatar_url?: string;
  is_gold_reported?: boolean;
}

interface ChatProps {
  onNavigate: (tab: string) => void;
}

// Memoized message list to prevent re-renders on every keystroke
const MessageList = memo(({ messages, userId, userIsAdmin, onDelete, onGoldReportToggle }: {
  messages: ChatMessageData[];
  userId: string | null;
  userIsAdmin: boolean;
  onDelete: (id: string) => void;
  onGoldReportToggle: (messageId: string, isGoldReported: boolean) => void;
}) => {
  return (
    <div className="divide-y divide-border">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          id={msg.id}
          user={{
            id: msg.user_id,
            name: msg.user_name,
            level: msg.user_level,
            isPro: msg.is_pro || false,
            isAdmin: msg.is_admin || false,
            streak_days: msg.streak_days || 0,
            subscriptionType: msg.subscription_type || undefined,
            avatar: msg.avatar_url || ""
          }}
          message={msg.message}
          timestamp={new Date(msg.created_at)}
          currentUserId={userId}
          currentUserIsAdmin={userIsAdmin}
          isGoldReported={msg.is_gold_reported}
          onDelete={onDelete}
          onGoldReportToggle={onGoldReportToggle}
        />
      ))}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export function Chat({ onNavigate }: ChatProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showGoldReportsOnly, setShowGoldReportsOnly] = useState(false);
  const [goldReportCount, setGoldReportCount] = useState(0);
  const [messageLimit, setMessageLimit] = useState(() => {
    const cached = localStorage.getItem('chat-message-limit');
    return cached ? parseInt(cached, 10) : 10;
  });

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // Android detection
  const isAndroid = /Android/i.test(navigator.userAgent);
  // Desktop detection
  const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  // PWA detection - check if app is installed to home screen
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;
  // Capacitor native app detection
  const isCapacitor = (window as any).Capacitor?.isNativePlatform();
  const { toast } = useToast();
  const { user, userId, userProfile, chatChannel, isPro, proStatus, messages, setMessages, addMessage, removeMessage, broadcastMessage, broadcastDelete } = useAuth();

  useEffect(() => {
    if (proStatus) {
      console.log('🔵 Subscribe From Chat tab - pro_status_changes channel');
      return () => {
        console.log('🟣 Unsubscribe From Chat tab - pro_status_changes channel');
      };
    }
  }, [proStatus]);

  // Save messageLimit to localStorage only when it's 10 (initial state)
  useEffect(() => {
    if (messageLimit === 10) {
      localStorage.setItem('chat-message-limit', messageLimit.toString());
    }
  }, [messageLimit]);

  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isDeleteActionRef = useRef<boolean>(false);

  // Independent pro badge cache for Chat.tsx optimistic UI
  const [chatProBadgeCache, setChatProBadgeCache] = useState(() => {
    const saved = localStorage.getItem('chat-pro-badge-cache');
    return saved ? JSON.parse(saved) : {
      is_pro: false,
      is_admin: false,
      subscription_type: null,
      streak_days: 0,
      user_name: '',
      user_level: 1,
      avatar_url: '',
      timestamp: 0
    };
  });

  // User badge cache for optimistic UI consistency (existing)
  const [userBadgeCache, setUserBadgeCache] = useState({
    is_pro: false,
    is_admin: false,
    subscription_type: null,
    streak_days: 0,
    user_name: '',
    user_level: 1,
    avatar_url: ''
  });

  if (!userId) return null;

  // Prevent body scroll on iOS, only allow chat messages to scroll
  useEffect(() => {
    if (isIOS) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      return () => {
        // Cleanup on unmount
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
  }, [isIOS]);

  // Scroll to bottom function for both platforms
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // For column-reverse, scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
  };

  // Auto-scroll to bottom when messages load or change (except delete)
  useEffect(() => {
    if (messages.length > 0) {
      // Skip auto-scroll if last action was delete
      if (isDeleteActionRef.current) {
        console.log('🚫 Skipping auto-scroll after delete');
        isDeleteActionRef.current = false; // Reset flag
        return;
      }
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);


  // Invalidate user cache when pro status changes
  const invalidateUserCache = (userId: string) => {
    localStorage.removeItem(`user-data-${userId}`);
    console.log(`🗑️ Invalidated cache for user: ${userId}`);
  };

  // Update independent chat pro badge cache with persistence
  useEffect(() => {
    if (user && userProfile) {
      const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
      const currentProStatus = isPro || proStatus?.isPro || false;
      
      // Check if pro status changed (for pro upgrade/downgrade detection)
      const proStatusChanged = chatProBadgeCache.timestamp > 0 && 
        chatProBadgeCache.is_pro !== currentProStatus;
      
      const cacheData = {
        is_pro: currentProStatus,
        is_admin: user.id === knownAdminId || userProfile?.is_admin || false,
        subscription_type: proStatus?.subscriptionType || null,
        streak_days: userProfile?.streak_days || 0,
        user_name: userProfile?.display_name || 'Anonymous',
        user_level: userProfile?.level || 1,
        avatar_url: userProfile?.avatar_url || '',
        timestamp: Date.now()
      };
      
      // Always update cache if pro status changed
      if (proStatusChanged) {
        console.log('🔄 Pro status changed, invalidating user cache:', {
          old: chatProBadgeCache.is_pro,
          new: currentProStatus
        });
        // Invalidate cache when pro status changes
        invalidateUserCache(user.id);
      }
      
      // Update both caches
      setChatProBadgeCache(cacheData);
      setUserBadgeCache(cacheData);
      
      // Persist chat-specific cache to localStorage
      localStorage.setItem('chat-pro-badge-cache', JSON.stringify(cacheData));
    }
  }, [user, userProfile, isPro, proStatus]);

  // Smart user data cache with TTL (24 hours)
  const USER_PROFILE_CACHE_VERSION = '20241109';
  const getUserDataFromCache = (userId: string) => {
    const cacheKey = `user-data-${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    try {
      const { data, timestamp, version } = JSON.parse(cached);
      const TTL = 6 * 60 * 60 * 1000; // 6 hours

      if (version !== USER_PROFILE_CACHE_VERSION) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      if (!timestamp || Date.now() - timestamp > TTL) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      localStorage.removeItem(cacheKey);
      return null;
    }
  };

  const cacheUserData = (userId: string, data: any) => {
    localStorage.setItem(`user-data-${userId}`, JSON.stringify({
      data,
      timestamp: Date.now(),
      version: USER_PROFILE_CACHE_VERSION
    }));
  };

  // Load messages from database with smart caching
  const loadMessages = useCallback(async (showRefreshState = false) => {
    if (showRefreshState) {
      setIsRefreshing(true);
    }
    
    try {
      // Get chat messages
      let query = supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', 'community')
        .order('created_at', { ascending: false });

      if (messageLimit > 0) {
        query = query.limit(messageLimit);
      }

      let { data: chatMessages, error } = await query;

      // Reverse to show oldest first
      if (chatMessages) {
        chatMessages = chatMessages.reverse();
      }

      // Get gold reports
      const { data: goldReports } = await supabase
        .from('gold_reports')
        .select('message_id');

      if (error || !chatMessages) {
        console.error('Error loading messages:', error);
        setIsLoading(false);
        return;
      }

      // Get unique user IDs from chat messages
      const userIds = [...new Set(chatMessages.map(msg => msg.user_id))];
      
      // Check cache for existing user data
      const cachedProfiles = new Map();
      const cachedSubscriptions = new Map();
      const uncachedUserIds = [];

      userIds.forEach(userId => {
        const cached = getUserDataFromCache(userId);
        if (cached) {
          cachedProfiles.set(userId, cached.profile);
          if (cached.subscription) {
            cachedSubscriptions.set(userId, cached.subscription);
          }
        } else {
          uncachedUserIds.push(userId);
        }
      });

      console.log(`💾 Cache hit: ${userIds.length - uncachedUserIds.length}/${userIds.length} users, fetching: ${uncachedUserIds.length}`);

      // Only fetch data for uncached users
      let userProfiles = [];
      let subscriptions = [];

      if (uncachedUserIds.length > 0) {
        // Fetch real profiles for uncached users only
        const { data: newUserProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, streak_days, level, is_admin, user_email, avatar_url')
          .in('user_id', uncachedUserIds);
          
        // Fetch Pro status for uncached users only using public RPC
        const { data: newSubscriptions } = await supabase
          .rpc('get_public_pro_status', { user_ids: uncachedUserIds });
        
        userProfiles = newUserProfiles || [];
        subscriptions = newSubscriptions || [];

        // Cache the new data
        userProfiles.forEach(profile => {
          const subscription = subscriptions.find(sub => sub.user_id === profile.user_id);
          cacheUserData(profile.user_id, {
            profile,
            subscription: subscription ? {
              is_pro: subscription.is_pro,
              subscription_type: subscription.subscription_type
            } : null
          });
          cachedProfiles.set(profile.user_id, profile);
          if (subscription?.is_pro) {
            cachedSubscriptions.set(profile.user_id, {
              is_pro: true,
              subscription_type: subscription.subscription_type
            });
          }
        });

        if (profilesError) {
          console.error('Error loading user profiles:', profilesError);
        }
      }

      // Create maps from combined cached + fresh data
      const profilesMap = cachedProfiles;
      const subscriptionMap = cachedSubscriptions;
        
      // Get admin users
      let adminUsers = new Set();
      const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
      adminUsers.add(knownAdminId);

      if (false) {
        console.error('Error loading messages:', error);
        // If no messages in database, use mock data as fallback
        const mockMessages: ChatMessageData[] = [
          { id: '1', user_id: '1', user_name: 'Budiyas32', user_level: 3, is_pro: true, message: 'asik banget apknya', created_at: new Date('2024-01-20T09:15:00').toISOString() },
          { id: '2', user_id: '2', user_name: 'dudungsubang', user_level: 2, is_pro: true, message: 'bener lebih mudah denger audionya ada historynya lagi', created_at: new Date('2024-01-20T09:16:00').toISOString() },
          { id: '3', user_id: '3', user_name: 'andiniwati', user_level: 2, is_pro: true, message: 'iya jadi betah diam di aplikasi', created_at: new Date('2024-01-20T09:16:30').toISOString() },
          { id: '4', user_id: '4', user_name: 'Jason', user_level: 3, is_pro: true, message: 'wah iya nih ada sistem game juga', created_at: new Date('2024-01-20T09:18:00').toISOString() },
          { id: '5', user_id: '5', user_name: 'Andin', user_level: 9, is_pro: true, message: 'bener mas anto, seru ngejar poinnya hehe', created_at: new Date('2024-01-20T09:18:30').toISOString() },
          { id: '6', user_id: '6', user_name: 'Master Yoga', user_level: 8, is_pro: true, message: 'Peringkatku naik terus nih, jadi semangat', created_at: new Date('2024-01-20T09:19:00').toISOString() },
          { id: '7', user_id: '7', user_name: 'SitiAisyah', user_level: 2, is_pro: true, message: 'fitur history itu yg paling ngebantu aku sih', created_at: new Date('2024-01-20T09:22:00').toISOString() },
          { id: '8', user_id: '8', user_name: 'EkoPrasetyo', user_level: 2, is_pro: true, message: 'setuju, ga perlu cari ulang audio yg kemarin didengerin', created_at: new Date('2024-01-20T09:22:30').toISOString() },
          { id: '9', user_id: '9', user_name: 'IwanSetiawan', user_level: 2, is_pro: true, message: 'Tampilannya juga bersih, ga ribet, enak diliat', created_at: new Date('2024-01-20T09:25:00').toISOString() },
          { id: '10', user_id: '10', user_name: 'DewiLestari90', user_level: 1, is_pro: true, message: 'baru download kemarin, langsung sukaa', created_at: new Date('2024-01-20T09:30:00').toISOString() },
          { id: '11', user_id: '11', user_name: 'Bambang_P', user_level: 3, is_pro: false, message: 'selamat datang mba dewi, dijamin nagih wkwk', created_at: new Date('2024-01-20T10:15:00').toISOString() },
          { id: '12', user_id: '12', user_name: 'PutriAyu', user_level: 2, is_pro: false, message: 'notifikasinya juga ga ganggu, pas banget timingnya', created_at: new Date('2024-01-20T10:17:00').toISOString() },
          { id: '13', user_id: '13', user_name: 'JokoWibowo88', user_level: 2, is_pro: false, message: 'Betul, ngingetin pas ada konten baru aja', created_at: new Date('2024-01-20T10:17:30').toISOString() },
          { id: '14', user_id: '14', user_name: 'HendraGunawan', user_level: 4, is_pro: true, message: 'eh ada yg udah dapet badge \'Master\' belum?', created_at: new Date('2024-01-20T10:20:00').toISOString() },
          { id: '15', user_id: '15', user_name: 'RatuAisyah', user_level: 3, is_pro: false, message: 'aku baru dapet yg \'Expert\', susah bgt yg master', created_at: new Date('2024-01-20T10:21:00').toISOString() },
          { id: '16', user_id: '16', user_name: 'SuryaAdi', user_level: 4, is_pro: true, message: 'Master harus selesain 100 audio tanpa skip kalo gasalah', created_at: new Date('2024-01-20T10:21:30').toISOString() },
          { id: '17', user_id: '17', user_name: 'HeruSantoso', user_level: 2, is_pro: false, message: 'wih mantap, kejar ah', created_at: new Date('2024-01-20T10:22:00').toISOString() },
          { id: '18', user_id: '18', user_name: 'LindaWati', user_level: 3, is_pro: false, message: 'Suka bgt sama playlistnya, bisa bikin sendiri', created_at: new Date('2024-01-20T11:40:00').toISOString() },
          { id: '19', user_id: '19', user_name: 'AhmadZaini', user_level: 3, is_pro: false, message: 'iyaa, aku kelompokin per topik jadi gampang belajarnya', created_at: new Date('2024-01-20T11:41:00').toISOString() },
          { id: '20', user_id: '20', user_name: 'CitraKirana', user_level: 3, is_pro: false, message: 'Adminnya juga responsif, kemarin aku lapor bug cepet ditanggepin', created_at: new Date('2024-01-20T11:45:00').toISOString() },
          { id: '21', user_id: '21', user_name: 'UjangTea', user_level: 1, is_pro: false, message: 'dua jempol buat developernya', created_at: new Date('2024-01-20T11:46:00').toISOString() },
          { id: '22', user_id: '22', user_name: 'MegaChan', user_level: 2, is_pro: false, message: 'Kualitas audionya jernih, pake headset makin mantap', created_at: new Date('2024-01-20T11:48:00').toISOString() },
          { id: '23', user_id: '23', user_name: 'FirmanHakim', user_level: 1, is_pro: false, message: 'bener, ga pecah suaranya', created_at: new Date('2024-01-20T11:48:30').toISOString() },
          { id: '24', user_id: '24', user_name: 'Sari_Love', user_level: 2, is_pro: false, message: 'aku malah suka dengerin sambil masak, jadi ga bosen', created_at: new Date('2024-01-20T11:50:00').toISOString() },
          { id: '25', user_id: '25', user_name: 'WawanKurniawan', user_level: 1, is_pro: false, message: 'ide bagus tuh mba sari, patut dicoba', created_at: new Date('2024-01-20T11:52:00').toISOString() },
          { id: '26', user_id: '26', user_name: 'DianPermata', user_level: 2, is_pro: false, message: 'Gamenya itu loh, simpel tapi bikin penasaran', created_at: new Date('2024-01-20T11:54:00').toISOString() },
          { id: '27', user_id: '27', user_name: 'FajarNugroho', user_level: 2, is_pro: false, message: 'bener, ga sadar udah main setengah jam sendiri', created_at: new Date('2024-01-20T11:55:00').toISOString() },
          { id: '28', user_id: '28', user_name: 'IndahPermatasari', user_level: 1, is_pro: false, message: 'Poinnya bisa dituker ga sih?', created_at: new Date('2024-01-20T11:58:00').toISOString() },
          { id: '30', user_id: '30', user_name: 'AndiMalaka', user_level: 1, is_pro: false, message: 'wih adminnya muncul', created_at: new Date('2024-01-20T13:30:00').toISOString() },
          { id: '31', user_id: '31', user_name: 'BayuPradana', user_level: 2, is_pro: false, message: 'siap min, ditunggu fitur barunya', created_at: new Date('2024-01-20T13:31:00').toISOString() },
          { id: '32', user_id: '32', user_name: 'KartikaSari', user_level: 3, is_pro: false, message: 'Semoga ada fitur dark mode ya min kedepannya', created_at: new Date('2024-01-20T13:35:00').toISOString() },
          { id: '33', user_id: '33', user_name: 'Nurhayati85', user_level: 2, is_pro: false, message: 'setuju bgt, biar hemat batre juga', created_at: new Date('2024-01-20T13:36:00').toISOString() },
          { id: '34', user_id: '34', user_name: 'RudiHartono', user_level: 2, is_pro: false, message: 'Apk ini ringan banget, ga bikin hp lemot', created_at: new Date('2024-01-20T13:40:00').toISOString() },
          { id: '35', user_id: '35', user_name: 'TeguhPrasetyo', user_level: 2, is_pro: false, message: 'iya di hp kentangku juga lancar jaya', created_at: new Date('2024-01-20T13:40:30').toISOString() },
          { id: '36', user_id: '36', user_name: 'VinaPanduwinataKW', user_level: 2, is_pro: false, message: 'Gokil, ini aplikasi yg kucari selama ini', created_at: new Date('2024-01-20T15:02:00').toISOString() },
          { id: '37', user_id: '37', user_name: 'YusufMaulana', user_level: 3, is_pro: false, message: 'Rekomen ke temen2 kantor, pada suka semua', created_at: new Date('2024-01-20T15:05:00').toISOString() },
          { id: '38', user_id: '38', user_name: 'ZainalAbidin', user_level: 2, is_pro: false, message: 'Komunitasnya juga asik, jadi nambah temen', created_at: new Date('2024-01-20T15:08:00').toISOString() },
          { id: '39', user_id: '39', user_name: 'AsepSunandar', user_level: 1, is_pro: false, message: 'bener kang, pada ramah semua disini', created_at: new Date('2024-01-20T15:09:00').toISOString() },
          { id: '40', user_id: '40', user_name: 'BungaCitra', user_level: 3, is_pro: false, message: 'pokoknya aplot konten baru terus ya min, jangan kasih kendor', created_at: new Date('2024-01-20T15:12:00').toISOString() },
          { id: '41', user_id: '41', user_name: 'CandraWijaya', user_level: 4, is_pro: true, message: 'setiap hari pasti buka aplikasi ini, udah jadi kebiasaan', created_at: new Date('2024-01-20T15:20:00').toISOString() },
          { id: '42', user_id: '42', user_name: 'DoniSaputra', user_level: 4, is_pro: true, message: 'sama, pagi2 dengerin audio disini bikin semangat kerja', created_at: new Date('2024-01-20T15:21:00').toISOString() },
          { id: '44', user_id: 'sam-165-user-id', user_name: 'Sam_165', user_level: 3, is_pro: false, message: 'Halo semua! Baru aja naik level 3 nih, seneng banget!', created_at: new Date('2024-01-20T15:30:00').toISOString() },
          { id: '45', user_id: 'test-seeker-30', user_name: 'TestSeeker', user_level: 2, is_pro: false, message: 'Testing Seeker 30 badge', created_at: new Date('2024-01-20T15:31:00').toISOString(), streak_days: 30 },
          { id: '46', user_id: 'test-lumina-60', user_name: 'TestLumina', user_level: 2, is_pro: false, message: 'Testing Lumina 60 badge', created_at: new Date('2024-01-20T15:32:00').toISOString(), streak_days: 60 },
          { id: '47', user_id: 'test-wanderer-90', user_name: 'TestWanderer', user_level: 2, is_pro: false, message: 'Testing Wanderer 90 badge', created_at: new Date('2024-01-20T15:33:00').toISOString(), streak_days: 90 }
        ];
        setMessages(mockMessages);
      } else {
        // Create a Set of gold reported message IDs
        const goldReportedIds = new Set(goldReports?.map(gr => gr.message_id) || []);

        // Process messages with real profile data
        const processedMessages = chatMessages?.map(msg => {
          const userProfile = profilesMap.get(msg.user_id);
          const realStreakDays = userProfile?.streak_days || 0;

          // For consistency, give minimum 7 days to users without profile data
          const displayStreakDays = userProfile ? realStreakDays : (realStreakDays === 0 ? 7 : realStreakDays);


          // Get subscription data from unified RPC
          const subscriptionData = subscriptionMap.get(msg.user_id);

          return {
            ...msg,
            is_admin: adminUsers.has(msg.user_id) || userProfile?.is_admin || false,
            // Use real streak_days or minimum for display
            streak_days: displayStreakDays,
            // Update other profile data if available
            user_level: userProfile?.level || msg.user_level || 1,
            is_pro: subscriptionData?.is_pro || false,
            subscription_type: subscriptionData?.subscription_type || null,
            user_name: userProfile?.display_name || msg.user_name,
            avatar_url: userProfile?.avatar_url,
            is_gold_reported: goldReportedIds.has(msg.id)
          };
        }) || [];

        // Update gold report count
        setGoldReportCount(goldReportedIds.size);

        setMessages(processedMessages);

        // Pre-cache gold reports for instant loading in GoldReportList.tsx
        const goldReportedMessagesForCache = processedMessages.filter(msg => goldReportedIds.has(msg.id));
        if (goldReportedMessagesForCache.length > 0) {
            try {
                const cacheData = {
                    version: 1,
                    timestamp: Date.now(),
                    data: goldReportedMessagesForCache
                };
                localStorage.setItem('gold-reports-cache', JSON.stringify(cacheData));
            } catch (e) {
                console.error('Failed to cache gold reports:', e);
            }
        }

      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      if (showRefreshState) {
        setIsRefreshing(false);
      }
      setIsLoading(false);
    }
  }, [toast, messageLimit]);

  // Load initial messages when channel is ready
  useEffect(() => {
    if (chatChannel) {
      console.log('🔵 Chat realtime status: SUBSCRIBED - Loading initial messages');

      // Wrap in try-catch to prevent black screen on errors
      try {
        loadMessages();
      } catch (error) {
        console.error('❌ Critical error loading messages:', error);
        console.log('🧹 Clearing cache and retrying...');
        localStorage.removeItem('chat-messages-cache');
        localStorage.removeItem('chat-message-limit');
        // Reload page to recover
        setTimeout(() => window.location.reload(), 1000);
      }

      // After 1 second, load 100 messages
      const timer = setTimeout(() => {
        if (messageLimit === 10) {
          console.log('⏰ 1 second passed - Loading 100 messages');
          setMessageLimit(100);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [chatChannel, loadMessages]);

  // PWA IDLE HANDLER - Listen for idle-wake events and reload messages
  useEffect(() => {
    const handlePWAIdleWake = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('📱 PWA IDLE WAKE: Received reload-messages event', customEvent.detail);

      // Reload messages silently when PWA comes back from idle
      loadMessages(false);

      // Also scroll to bottom to show latest messages
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    };

    window.addEventListener('pwa-reload-messages', handlePWAIdleWake);

    return () => {
      window.removeEventListener('pwa-reload-messages', handlePWAIdleWake);
    };
  }, [loadMessages]);

  // APK IDLE HANDLER - Listen for app resume events and reload messages
  useEffect(() => {
    if (isCapacitor) {
      const listener = App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          console.log('📱 APK RESUME: App became active, reloading messages');
          loadMessages(false);
          setTimeout(() => {
            scrollToBottom();
          }, 300);
        }
      });

      return () => {
        listener.remove();
      };
    }
  }, [isCapacitor, loadMessages]);

  // 10000ms timeout mechanism for chat loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Chat loading timeout triggered (10000ms), forcing refresh...');
        localStorage.setItem('refresh-redirect-to-chat', 'true');
        window.location.reload();
      }
    }, 10000);

    return () => clearTimeout(loadingTimeout);
  }, [isLoading]);

  useEffect(() => {
    // Network-first: Load fresh messages immediately on mount
    const loadFreshMessages = async () => {
      if (userId && messages.length === 0) {
        setIsLoading(true);
        try {
          await loadMessages();
        } catch (error) {
          console.error('Failed to load messages from network:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (messages.length > 0) {
        setIsLoading(false);
      }
    };
    loadFreshMessages();
  }, [loadMessages, messages.length, userId]);




  useEffect(() => {
    // Set up 60-minute polling interval
    const interval = setInterval(() => {
      loadMessages(true);
    }, 60 * 60 * 1000); // 60 minutes in milliseconds

    return () => clearInterval(interval);
  }, [loadMessages]);

  // Enhanced input validation function
  const validateMessage = (input: string): string | null => {
    const trimmed = input.trim();

    // Length validation
    if (trimmed.length === 0) return "Message cannot be empty";
    if (trimmed.length > 500) return "Message must be 500 characters or less";

    // Basic sanitization - remove potentially harmful characters
    const sanitized = trimmed
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers

    // Check for excessive repetition (spam detection)
    const repeated = /(.)\1{10,}/.test(sanitized);
    if (repeated) return "Message contains excessive repeated characters";

    return null;
  };

  const handleSendMessage = async () => {
    
    if (!userId) return;

    const validationError = validateMessage(message);
    if (validationError) {
      toast({
        title: "Invalid Message",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    // Check if user has valid display name
    if (!userProfile?.display_name || userProfile.display_name === 'Anonymous') {
      toast({
        title: "Lengkapi Profil untuk Chat",
        description: "Silakan pilih Edit Profil memastikan Nama anda untuk chat",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              localStorage.setItem('auto-edit-profile', 'true');
              onNavigate('profile');
            }}
          >
            Arahkan Ke Profil
          </Button>
        )
      });
      return;
    }

    // Get current user data from cache or fallback to profile
    const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
    const isAdmin = user.id === knownAdminId || userProfile?.is_admin || false;
    
    // Try to get fresh user data from cache first
    const cachedUserData = getUserDataFromCache(user.id);
    let userData = {
      is_pro: isPro || proStatus?.isPro || false,
      is_admin: isAdmin,
      subscription_type: proStatus?.subscriptionType || null,
      streak_days: userProfile?.streak_days || 0,
      user_name: userProfile?.display_name || 'Anonymous',
      user_level: userProfile?.level || 1,
      avatar_url: userProfile?.avatar_url || ''
    };

    // Use cached data if available and fresher
    if (cachedUserData) {
      userData = {
        is_pro: cachedUserData.subscription?.is_pro || userData.is_pro,
        is_admin: cachedUserData.profile?.is_admin || userData.is_admin,
        subscription_type: cachedUserData.subscription?.subscription_type || userData.subscription_type,
        streak_days: cachedUserData.profile?.streak_days || userData.streak_days,
        user_name: cachedUserData.profile?.display_name || userData.user_name,
        user_level: cachedUserData.profile?.level || userData.user_level,
        avatar_url: cachedUserData.profile?.avatar_url || userData.avatar_url
      };
    }

    // Update caches with latest data
    if (user && userProfile) {
      setChatProBadgeCache({ ...userData, timestamp: Date.now() });
      setUserBadgeCache(userData);
      localStorage.setItem('chat-pro-badge-cache', JSON.stringify({ ...userData, timestamp: Date.now() }));
    }

    // Add optimistic message immediately with best available data
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessageData = {
      id: tempId,
      user_id: user.id,
      user_name: userData.user_name,
      user_level: userData.user_level,
      is_pro: userData.is_pro,
      is_admin: userData.is_admin,
      message: message.trim(),
      created_at: new Date().toISOString(),
      streak_days: userData.streak_days,
      subscription_type: userData.subscription_type,
      avatar_url: userData.avatar_url
    };

    addMessage(optimisticMessage);
    setMessage(""); // Button becomes disabled immediately

    try {
      // Send to database without timeout
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          user_name: userProfile?.display_name || 'Anonymous',
          user_level: userProfile?.level || 1,
          message: message.trim(),
          channel_id: 'community'
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        // Remove optimistic message on error
        removeMessage(tempId);
        toast({
          title: "Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Message sent successfully');
        // Replace optimistic message with real one
        setMessages(current => {
          const messageExists = current.find(msg => msg.id === tempId);
          if (messageExists) {
            // Replace temp message with real database message
            return current.map(msg =>
              msg.id === tempId ? { ...optimisticMessage, id: data.id, created_at: data.created_at } : msg
            );
          } else {
            // If temp message was somehow removed, add the real message
            return [...current, { ...optimisticMessage, id: data.id, created_at: data.created_at }];
          }
        });

        // Broadcast new message to all users using AuthContext
        broadcastMessage({ ...optimisticMessage, id: data.id, created_at: data.created_at });

        toast({
          title: "Message Sent 🚀",
          description: "",
          variant: "default"
        });
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      
      // Check if it's likely an auth error (user/userProfile not loading properly)
      const isAuthError = !user || !userProfile || err.message?.includes('auth') || err.message?.includes('user');
      
      if (isAuthError) {
        console.log('🔄 Auth error detected, triggering auto-refresh to chat...');
        toast({
          title: "🔄 Auth Error - Auto Refreshing",
          description: "Refreshing to reload your session...",
          variant: "default"
        });
        
        // Set flag to return to chat after refresh
        localStorage.setItem('refresh-redirect-to-chat', 'true');
        
        // Small delay then refresh
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Regular error handling
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
    }
  };

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    // Set flag to prevent auto-scroll after delete
    isDeleteActionRef.current = true;

    removeMessage(messageId);

    if (messageId.startsWith('temp-')) {
      return;
    }

    if (!userId) return;

    try {
      const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
      const isAdmin = user?.id === knownAdminId || userProfile?.is_admin || false;

      let deleteQuery = supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (!isAdmin) {
        deleteQuery = deleteQuery.eq('user_id', userId);
      }

      const { error } = await deleteQuery;

      if (error) {
        const messageToRestore = messages.find(msg => msg.id === messageId);
        if (messageToRestore) {
          addMessage(messageToRestore);
        }
      } else {
        broadcastDelete(messageId);
      }
    } catch (err) {
      const messageToRestore = messages.find(msg => msg.id === messageId);
      if (messageToRestore) {
        addMessage(messageToRestore);
      }
    }
  }, [removeMessage, userId, messages, addMessage, broadcastDelete, user, userProfile]);

  const adjustUserExperience = useCallback(async (targetUserId: string, delta: number) => {
    if (!targetUserId || delta === 0) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('experience_points')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching profile for XP update:', error);
        return;
      }

      const currentXP = data.experience_points ?? 0;
      const updatedXP = Math.max(0, currentXP + delta);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ experience_points: updatedXP })
        .eq('user_id', targetUserId);

      if (updateError) {
        console.error('Error updating profile XP:', updateError);
      }
    } catch (xpError) {
      console.error('Unexpected error adjusting user XP:', xpError);
    }
  }, []);

  const handleGoldReportToggle = useCallback((messageId: string, isGoldReported: boolean) => {
    let affectedUserId: string | null = null;
    let affectedUserName: string | null = null;

    // Update the message in the list
    setMessages(current => current.map(msg => {
      if (msg.id === messageId) {
        affectedUserId = msg.user_id;
        affectedUserName = msg.user_name;
        return { ...msg, is_gold_reported: isGoldReported };
      }
      return msg;
    }));

    // Update count
    setGoldReportCount(current => isGoldReported ? current + 1 : current - 1);

    if (affectedUserId) {
      const xpDelta = isGoldReported ? 100 : -100;
      adjustUserExperience(affectedUserId, xpDelta);

      const isAdminUser = user?.id === '3da83afb-aa8c-4c55-b3b0-8aa64000205f' || !!userProfile?.is_admin;
      if (isAdminUser && affectedUserName) {
        setTimeout(() => {
          toast({
            title: isGoldReported
              ? `EXP +100 diberikan ke "${affectedUserName}"`
              : `EXP -100 dikurangi dari "${affectedUserName}"`,
            duration: 2500
          });
        }, 2000);
      }
    }
  }, [adjustUserExperience, toast, user?.id, userProfile?.is_admin]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Check if current user is admin
  const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
  const currentUserIsAdmin = user?.id === knownAdminId || userProfile?.is_admin || false;

  // Show Gold Report List if in that mode
  if (showGoldReportsOnly) {
    return (
      <GoldReportList
        onBack={() => setShowGoldReportsOnly(false)}
        currentUserIsAdmin={currentUserIsAdmin}
        userId={user?.id || null}
        onDelete={handleDeleteMessage}
        onGoldReportToggle={handleGoldReportToggle}
      />
    );
  }


  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Gold Report List Toggle Button - Visible to All Users */}
      <div
        className="fixed left-0 right-0 z-50 border-b border-border bg-black"
        style={{ top: 'env(safe-area-inset-top, 20px)' }}
      >
        <div className="px-4 py-3">
          <button
            onClick={() => setShowGoldReportsOnly(true)}
            className="w-full h-10 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-medium shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Rocket className="h-4 w-4" />
            Gold Report
          </button>
        </div>
      </div>

      {/* Messages */}
      {/* IOS HANDLER (VITAL) - Enables immediate touch scrolling without requiring click first */}
        <div
          ref={messagesContainerRef}
          className="overflow-y-auto"
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            WebkitOverflowScrolling: 'touch',
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 20px) + 64px)', // From top (with space for gold report button)
            bottom: isIOS ? (isPWA ? '240px' : '280px') : isDesktop ? '190px' : isAndroid ? (isCapacitor ? '200px' : (isPWA ? '200px' : '250px')) : '250px', // Above input bar
            left: '0',
            right: '0',
            paddingTop: ((isIOS || isAndroid) && isPWA) ? 'env(safe-area-inset-top)' : '0px',
            touchAction: isIOS ? 'pan-y' : 'auto',
            paddingBottom: '0px',
            overscrollBehavior: 'none',
            overscrollBehaviorY: 'none',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
          onTouchStart={(e) => {
            // iOS handler - only allow vertical scroll for chat messages
            if (isIOS) {
              e.stopPropagation();
            }
          }}
          onTouchMove={(e) => {
            // iOS handler - prevent horizontal scroll, only allow vertical
            if (isIOS) {
              const touch = e.touches[0];
              const deltaX = Math.abs(touch.clientX - (touch.target as any).startX || 0);
              const deltaY = Math.abs(touch.clientY - (touch.target as any).startY || 0);

              // If more horizontal movement than vertical, prevent scroll
              if (deltaX > deltaY) {
                e.preventDefault();
              }
            }
          }}
        >
        <MessageList
          messages={messageLimit < 999999 ? messages.slice(-messageLimit) : messages}
          userId={user?.id || null}
          userIsAdmin={currentUserIsAdmin}
          onDelete={handleDeleteMessage}
          onGoldReportToggle={handleGoldReportToggle}
        />
        {messageLimit < 999999 && (
          <div className="p-4 text-center">
            <span
              onClick={() => {
                setMessageLimit(999999);
              }}
              className="inline-block px-3 py-1.5 text-sm text-white font-medium bg-gray-800 hover:bg-gray-700 rounded-full cursor-pointer shadow-md transition-all duration-150"
            >
              Load more massage...
            </span>
          </div>
        )}
      </div>

      {/* Message Input - Optimized for mobile performance */}
      <div
        className="fixed bottom-20 left-0 right-0 bg-background border-t border-border z-50"
        style={{
          padding: '16px'
        }}
      >
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Bagikan energi positif Anda..."
            className="cyber-input text-lg h-24"
            maxLength={500}
          />
          <Button
            ref={sendButtonRef}
            onClick={() => {
              // Non-blocking call
              handleSendMessage();
            }}
            disabled={!message.trim()}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-4 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
