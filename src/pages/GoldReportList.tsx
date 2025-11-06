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
  const CACHE_VERSION = 2;
  const CACHE_TTL = 365 * 24 * 60 * 60 * 1000; // 365 days
  const PROFILE_CACHE_TTL = CACHE_TTL;
  const FULL_CACHE_KEY = 'gold-reports-cache';
  const PREVIEW_CACHE_KEY = 'gold-reports-cache-preview';
  const LIMIT_CACHE_KEY = 'gold-report-limit';
  const PROFILE_CACHE_PREFIX = 'gold-user-data-';

  // State for gold reported messages with cache (identical to chat.tsx)
  const [goldReportedMessages, setGoldReportedMessages] = useState<ChatMessageData[]>(() => {
    const parseCache = (raw: string | null, { keyName }: { keyName: string }) => {
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
          console.warn(`⚠️ Invalid gold reports cache structure in ${keyName}, clearing...`);
          localStorage.removeItem(keyName);
          return null;
        }

        const { version, timestamp, data } = parsed;

        if (version !== CACHE_VERSION) {
          console.warn(`⚠️ Gold reports cache version mismatch for ${keyName}, clearing...`);
          localStorage.removeItem(keyName);
          return null;
        }

        if (!timestamp || Date.now() - timestamp > CACHE_TTL) {
          console.warn(`⚠️ Gold reports cache expired for ${keyName}, clearing...`);
          localStorage.removeItem(keyName);
          return null;
        }

        if (!Array.isArray(data)) {
          console.warn(`⚠️ Invalid gold reports cache data format in ${keyName}, clearing...`);
          localStorage.removeItem(keyName);
          return null;
        }

        return data as ChatMessageData[];
      } catch (error) {
        console.error(`❌ Failed to parse cached gold reports from ${keyName}:`, error);
        localStorage.removeItem(keyName);
        return null;
      }
    };

    const preview = parseCache(localStorage.getItem(PREVIEW_CACHE_KEY), { keyName: PREVIEW_CACHE_KEY });
    if (preview && preview.length > 0) {
      console.log('✅ Loaded gold report preview cache:', preview.length, 'messages');
      return preview;
    }

    const fullCache = parseCache(localStorage.getItem(FULL_CACHE_KEY), { keyName: FULL_CACHE_KEY });
    if (fullCache) {
      console.log('✅ Loaded gold reports cache:', fullCache.length, 'messages');
      return fullCache;
    }

    return [];
  });

  // Message limit pattern: start at 10, expand to 100 after 1 second
  const [messageLimit, setMessageLimit] = useState(() => {
    const cached = localStorage.getItem(LIMIT_CACHE_KEY);
    return cached ? parseInt(cached, 10) : 10;
  });

  // Save messageLimit to localStorage only when it's 10 (initial state)
  useEffect(() => {
    if (messageLimit === 10) {
      localStorage.setItem(LIMIT_CACHE_KEY, messageLimit.toString());
    }
  }, [messageLimit]);

  // Save gold reported messages to localStorage whenever they change (identical to chat.tsx)
  useEffect(() => {
    const hasMessages = goldReportedMessages.length > 0;

    if (!hasMessages) {
      localStorage.removeItem(FULL_CACHE_KEY);
      localStorage.removeItem(PREVIEW_CACHE_KEY);
      return;
    }

    try {
      const timestamp = Date.now();
      const cacheData = {
        version: CACHE_VERSION,
        timestamp,
        data: goldReportedMessages
      };

      localStorage.setItem(FULL_CACHE_KEY, JSON.stringify(cacheData));

      const previewData = {
        version: CACHE_VERSION,
        timestamp,
        data: goldReportedMessages.slice(-10)
      };

      localStorage.setItem(PREVIEW_CACHE_KEY, JSON.stringify(previewData));
    } catch (e) {
      console.error('❌ Failed to save gold reports cache:', e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('💾 localStorage quota exceeded, clearing gold reports cache...');
        localStorage.removeItem(FULL_CACHE_KEY);
        localStorage.removeItem(PREVIEW_CACHE_KEY);
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
  // Capacitor native app detection
  const isCapacitor = (window as any).Capacitor?.isNativePlatform();

  // Smart user data cache (same as chat.tsx)
  const getUserDataFromCache = (userId: string) => {
    const cacheKey = `${PROFILE_CACHE_PREFIX}${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    try {
      const { data, timestamp, version } = JSON.parse(cached);

      if (version !== CACHE_VERSION) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      if (!timestamp || Date.now() - timestamp > PROFILE_CACHE_TTL) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to parse user cache:', error);
      localStorage.removeItem(cacheKey);
      return null;
    }
  };

  const cacheUserData = (userId: string, data: any) => {
    localStorage.setItem(`${PROFILE_CACHE_PREFIX}${userId}`, JSON.stringify({
      version: CACHE_VERSION,
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
        .select('id, message_id, reported_by, created_at, message_content')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading gold reports:', error);
        return;
      }

      if (!goldReports || goldReports.length === 0) {
        setGoldReportedMessages([]);
        return;
      }

      const messageIds = goldReports
        .map(gr => gr.message_id)
        .filter((id: string | null) => Boolean(id)) as string[];

      if (messageIds.length === 0) {
        setGoldReportedMessages([]);
        return;
      }

      // Fetch messages for these IDs
      const { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('id, user_id, user_name, user_level, message, created_at')
        .in('id', messageIds);

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        return;
      }

      const chatMessageMap = new Map<string, any>();
      (chatMessages || []).forEach((msg) => {
        if (msg?.id) {
          chatMessageMap.set(msg.id, msg);
        }
      });

      // Get unique user IDs
      const userIds = [
        ...new Set(
          (chatMessages || [])
            .map(msg => msg?.user_id)
            .filter(Boolean)
        )
      ] as string[];

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
      let missingMessages = 0;
      const processedMessages = goldReports
        .map(report => {
          const chatMessage = chatMessageMap.get(report.message_id);
          if (!chatMessage) {
            missingMessages += 1;
            return null;
          }

          const userProfile = cachedProfiles.get(chatMessage.user_id);
          const resolvedMessage = chatMessage.message || report.message_content || '';
          const resolvedCreatedAt = chatMessage.created_at || report.created_at;

          return {
            ...chatMessage,
            message: resolvedMessage,
            created_at: resolvedCreatedAt,
            user_name: userProfile?.display_name || chatMessage.user_name,
            user_level: userProfile?.level || chatMessage.user_level || 1,
            is_pro: false, // Pro status not needed for gold reports
            is_admin: chatMessage.user_id === knownAdminId || userProfile?.is_admin || false,
            streak_days: userProfile?.streak_days || 0,
            subscription_type: null,
            avatar_url: userProfile?.avatar_url || undefined,
            is_gold_reported: true
          } as ChatMessageData;
        })
        .filter(Boolean) as ChatMessageData[];

      if (missingMessages > 0) {
        console.warn(`⚠️ ${missingMessages} gold report entries reference missing chat messages`);
      }

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
        localStorage.removeItem(FULL_CACHE_KEY);
        localStorage.removeItem(PREVIEW_CACHE_KEY);
        localStorage.removeItem(LIMIT_CACHE_KEY);
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
          bottom: isIOS ? (isPWA ? '110px' : '150px') : isDesktop ? '60px' : isAndroid ? (isCapacitor ? '65px' : (isPWA ? '75px' : '120px')) : '120px', // Fullscreen - device-specific spacing
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
