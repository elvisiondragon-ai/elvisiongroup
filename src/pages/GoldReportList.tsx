// @ts-nocheck
import { useEffect, useRef, memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

interface GoldReportListProps {
  onBack: () => void;
  currentUserIsAdmin: boolean;
  userId: string | null;
  onDelete: (messageId: string) => void;
  onGoldReportToggle: (messageId: string, isGoldReported: boolean) => void;
}

// Memoized message list
const MessageList = memo(({ messages, userId, userIsAdmin, onDelete, onGoldReportToggle }: {
  messages: ChatMessageData[];
  userId: string | null;
  userIsAdmin: boolean;
  onDelete: (id: string) => void;
  onGoldReportToggle: (messageId: string, isGoldReported: boolean) => void;
}) => {
  return (
    <div className="space-y-3 p-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="relative rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
          <ChatMessage
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
        </div>
      ))}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export function GoldReportList({ onBack, currentUserIsAdmin, userId, onDelete, onGoldReportToggle }: GoldReportListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { chatChannel } = useAuth();

  // Cache version and TTL
  const CACHE_VERSION = 1;
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  // State for gold reported messages with cache (identical to chat.tsx)
  const [goldReportedMessages, setGoldReportedMessages] = useState<ChatMessageData[]>(() => {
    const cached = localStorage.getItem('gold-reports-cache');
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);

        // Validate cache structure
        if (!parsedCache || typeof parsedCache !== 'object') {
          console.warn('⚠️ Invalid gold reports cache structure, clearing...');
          localStorage.removeItem('gold-reports-cache');
          return [];
        }

        const { version, timestamp, data } = parsedCache;

        // If old format (no version), migrate to new format
        if (!version && Array.isArray(parsedCache)) {
          console.log('📦 Migrating old gold reports cache format...');
          return parsedCache;
        }

        // Check cache version
        if (version !== CACHE_VERSION) {
          console.warn('⚠️ Gold reports cache version mismatch, clearing...');
          localStorage.removeItem('gold-reports-cache');
          return [];
        }

        // Check cache age (TTL)
        if (timestamp && Date.now() - timestamp > CACHE_TTL) {
          console.warn('⚠️ Gold reports cache expired (>24h), clearing...');
          localStorage.removeItem('gold-reports-cache');
          return [];
        }

        // Validate data is array
        if (!Array.isArray(data)) {
          console.warn('⚠️ Invalid gold reports cache data format, clearing...');
          localStorage.removeItem('gold-reports-cache');
          return [];
        }

        console.log('✅ Loaded valid gold reports cache:', data.length, 'messages');
        return data;
      } catch (e) {
        console.error('❌ Failed to parse cached gold reports:', e);
        console.log('🧹 Clearing corrupted gold reports cache...');
        localStorage.removeItem('gold-reports-cache');
        return [];
      }
    }
    return [];
  });

  // Message limit pattern: start at 10, expand to 100 after 1 second
  const [messageLimit, setMessageLimit] = useState(() => {
    const cached = localStorage.getItem('gold-report-limit');
    return cached ? parseInt(cached, 10) : 10;
  });

  // Save messageLimit to localStorage only when it's 10 (initial state)
  useEffect(() => {
    if (messageLimit === 10) {
      localStorage.setItem('gold-report-limit', messageLimit.toString());
    }
  }, [messageLimit]);

  // Save gold reported messages to localStorage whenever they change (identical to chat.tsx)
  useEffect(() => {
    if (goldReportedMessages.length > 0) {
      try {
        const cacheData = {
          version: CACHE_VERSION,
          timestamp: Date.now(),
          data: goldReportedMessages
        };
        localStorage.setItem('gold-reports-cache', JSON.stringify(cacheData));
      } catch (e) {
        console.error('❌ Failed to save gold reports cache:', e);
        // If localStorage is full, clear old cache
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          console.warn('💾 localStorage quota exceeded, clearing gold reports cache...');
          localStorage.removeItem('gold-reports-cache');
        }
      }
    }
  }, [goldReportedMessages]);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // Android detection
  const isAndroid = /Android/i.test(navigator.userAgent);
  // Desktop detection
  const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  // PWA detection
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;

  // Smart user data cache (same as chat.tsx)
  const getUserDataFromCache = (userId: string) => {
    const cached = localStorage.getItem(`user-data-${userId}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const TTL = 24 * 60 * 60 * 1000; // 24 hours

    if (Date.now() - timestamp > TTL) {
      localStorage.removeItem(`user-data-${userId}`);
      return null;
    }

    return data;
  };

  const cacheUserData = (userId: string, data: any) => {
    localStorage.setItem(`user-data-${userId}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  // Fetch gold reports directly from database
  const loadGoldReports = useCallback(async () => {
    try {
      // Get gold reports
      const { data: goldReports, error } = await supabase
        .from('gold_reports')
        .select('message_id');

      if (error || !goldReports) {
        console.error('Error loading gold reports:', error);
        return;
      }

      const messageIds = goldReports.map(gr => gr.message_id);

      if (messageIds.length === 0) {
        setGoldReportedMessages([]);
        return;
      }

      // Fetch messages for these IDs
      let { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .in('id', messageIds)
        .order('created_at', { ascending: false });

      // Reverse to show oldest first (identical to chat.tsx)
      if (chatMessages) {
        chatMessages = chatMessages.reverse();
      }

      if (messagesError || !chatMessages) {
        console.error('Error loading messages:', messagesError);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(chatMessages.map(msg => msg.user_id))];

      // Check cache for existing user data
      const cachedProfiles = new Map();
      const uncachedUserIds = [];

      userIds.forEach(userId => {
        const cached = getUserDataFromCache(userId);
        if (cached && cached.profile) { // Check for profile existence
          cachedProfiles.set(userId, cached.profile);
        } else {
          uncachedUserIds.push(userId);
        }
      });

      console.log(`💾 Gold Report Cache hit: ${userIds.length - uncachedUserIds.length}/${userIds.length} users`);

      // Only fetch data for uncached users
      if (uncachedUserIds.length > 0) {
        const { data: userProfiles } = await supabase
          .from('profiles')
          .select('user_id, display_name, streak_days, level, is_admin, avatar_url')
          .in('user_id', uncachedUserIds);

        if (userProfiles) {
          userProfiles.forEach(profile => {
            // Cache profile data without subscription info
            cacheUserData(profile.user_id, { profile });
            cachedProfiles.set(profile.user_id, profile);
          });
        }
      }

      // Process messages with cached + fresh data
      const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
      const processedMessages = chatMessages.map(msg => {
        const userProfile = cachedProfiles.get(msg.user_id);

        return {
          ...msg,
          user_name: userProfile?.display_name || msg.user_name,
          user_level: userProfile?.level || msg.user_level || 1,
          is_pro: false, // Pro status not needed for gold reports
          is_admin: msg.user_id === knownAdminId || userProfile?.is_admin || false,
          streak_days: userProfile?.streak_days || 0,
          subscription_type: null,
          avatar_url: userProfile?.avatar_url || undefined,
          is_gold_reported: true
        };
      });

      setGoldReportedMessages(processedMessages);
    } catch (error) {
      console.error('Error loading gold reports:', error);
    }
  }, []);

  // Load initial gold reports when chatChannel is ready (identical to chat.tsx pattern)
  useEffect(() => {
    if (chatChannel) {
      console.log('🔵 Gold Report realtime status: SUBSCRIBED - Loading gold reports');

      try {
        loadGoldReports();
      } catch (error) {
        console.error('❌ Critical error loading gold reports:', error);
        console.log('🧹 Clearing cache and retrying...');
        localStorage.removeItem('gold-reports-cache');
        localStorage.removeItem('gold-report-limit');
      }
    }
  }, [chatChannel, loadGoldReports]);

  // Listen to broadcast events from AuthContext for instant updates
  useEffect(() => {
    if (!chatChannel) return;

    // Use isMounted flag to prevent updates after unmount
    let isMounted = true;

    const handleGoldReportAdded = (event: any) => {
      if (!isMounted) return;
      console.log('📢⭐ GoldReportList received: gold_report_added', event.payload.message_id);
      loadGoldReports(); // Reload to show new gold report
    };

    const handleGoldReportRemoved = (event: any) => {
      if (!isMounted) return;
      console.log('📢⭐ GoldReportList received: gold_report_removed', event.payload.message_id);
      // Remove from local state instantly
      setGoldReportedMessages(current =>
        current.filter(msg => msg.id !== event.payload.message_id)
      );
    };

    // Listen to broadcast events (channel already subscribed by AuthContext)
    chatChannel.on('broadcast', { event: 'gold_report_added' }, handleGoldReportAdded);
    chatChannel.on('broadcast', { event: 'gold_report_removed' }, handleGoldReportRemoved);

    return () => {
      // Set flag to prevent updates after unmount (channel managed by AuthContext)
      isMounted = false;
    };
  }, [chatChannel, loadGoldReports]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Auto-scroll when gold reported messages change
  useEffect(() => {
    if (goldReportedMessages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [goldReportedMessages.length]);

  // After 1 second, expand to 100 messages (identical to chat.tsx pattern)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messageLimit === 10) {
        console.log('⏰ 1 second passed - Expanding gold report limit to 100');
        setMessageLimit(100);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [messageLimit]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Header with Back Button */}
      <div
        className="fixed left-0 right-0 bg-background border-b border-border z-50"
        style={{ top: 'env(safe-area-inset-top, 20px)' }}
      >
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="w-full h-10 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-medium shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="overflow-y-auto"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          WebkitOverflowScrolling: 'touch',
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 20px) + 64px)',
          bottom: isIOS ? (isPWA ? '110px' : '150px') : isDesktop ? '60px' : (isAndroid && isPWA) ? '75px' : '120px', // Fullscreen - device-specific spacing
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
          if (isIOS) {
            e.stopPropagation();
          }
        }}
        onTouchMove={(e) => {
          if (isIOS) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - (touch.target as any).startX || 0);
            const deltaY = Math.abs(touch.clientY - (touch.target as any).startY || 0);

            if (deltaX > deltaY) {
              e.preventDefault();
            }
          }
        }}
      >
        {goldReportedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No gold reports yet
          </div>
        ) : (
          <>
            <MessageList
              messages={messageLimit < 999999 ? goldReportedMessages.slice(-messageLimit) : goldReportedMessages}
              userId={userId}
              userIsAdmin={currentUserIsAdmin}
              onDelete={onDelete}
              onGoldReportToggle={onGoldReportToggle}
            />
            {messageLimit < goldReportedMessages.length && (
              <div className="p-4 text-center">
                <span
                  onClick={() => {
                    setMessageLimit(999999);
                  }}
                  className="inline-block px-3 py-1.5 text-sm text-white font-medium bg-gray-800 hover:bg-gray-700 rounded-full cursor-pointer shadow-md transition-all duration-150"
                >
                  Load more gold reports...
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
