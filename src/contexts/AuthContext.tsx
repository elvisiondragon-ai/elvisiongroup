import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ChatMessageData {
  id: string;
  user_id: string;
  user_name: string;
  user_level: number;
  is_pro: boolean;
  is_admin?: boolean;
  message: string;
  created_at: string;
  translatedMessage?: string;
  streak_days?: number;
  subscription_type?: string | null;
}

interface AuthContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  chatChannel: RealtimeChannel | null;
  isPro: boolean;
  proStatus: {
    isPro: boolean;
    subscriptionType: string | null;
    status: string | null;
    expiresAt: string | null;
  } | null;
  // Chat message state and actions
  messages: ChatMessageData[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>;
  addMessage: (message: ChatMessageData) => void;
  removeMessage: (messageId: string) => void;
  broadcastMessage: (message: ChatMessageData) => void;
  broadcastDelete: (messageId: string) => void;
  broadcastGoldReportAdded: (messageId: string) => void;
  broadcastGoldReportRemoved: (messageId: string) => void;
  cleanupSupabase: () => Promise<void>;
  refreshSession: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  loading: true,
  chatChannel: null,
  isPro: false,
  proStatus: null,
  messages: [],
  setMessages: () => {},
  addMessage: () => {},
  removeMessage: () => {},
  broadcastMessage: () => {},
  broadcastDelete: () => {},
  broadcastGoldReportAdded: () => {},
  broadcastGoldReportRemoved: () => {},
  cleanupSupabase: async () => {},
  refreshSession: async () => ({ success: false, error: 'Context not initialized' }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatChannel, setChatChannel] = useState<RealtimeChannel | null>(null);
  const [proStatus, setProStatus] = useState<any>(null);
  const chatChannelRef = useRef<RealtimeChannel | null>(null);
  const [channelStatus, setChannelStatus] = useState<string>('CLOSED');
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTokenRef = useRef<string | null>(null);
  const isConnectingRef = useRef<boolean>(false);
  const isRebuildingRef = useRef<boolean>(false);

  // IDLE USER HANDLER - Page visibility tracking
  const lastActiveTimeRef = useRef<number>(Date.now());
  const wasIdleRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const isIdleWakeReconnectRef = useRef<boolean>(false);
  const isIdleWakeRecoveryRef = useRef<boolean>(false);
  
  // Cache version - increment when data structure changes
  const CACHE_VERSION = 1;
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  // Chat messages state with localStorage cache and validation
  const [messages, setMessages] = useState<ChatMessageData[]>(() => {
    const cached = localStorage.getItem('chat-messages-cache');
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);

        // Validate cache structure
        if (!parsedCache || typeof parsedCache !== 'object') {
          console.warn('⚠️ Invalid cache structure, clearing...');
          localStorage.removeItem('chat-messages-cache');
          return [];
        }

        // Check if cache has version and timestamp
        const { version, timestamp, data } = parsedCache;

        // If old format (no version), migrate to new format
        if (!version && Array.isArray(parsedCache)) {
          console.log('📦 Migrating old cache format...');
          return parsedCache; // Use old data but will be saved in new format
        }

        // Check cache version
        if (version !== CACHE_VERSION) {
          console.warn('⚠️ Cache version mismatch, clearing old cache...');
          localStorage.removeItem('chat-messages-cache');
          return [];
        }

        // Check cache age (TTL)
        if (timestamp && Date.now() - timestamp > CACHE_TTL) {
          console.warn('⚠️ Cache expired (>24h), clearing stale cache...');
          localStorage.removeItem('chat-messages-cache');
          return [];
        }

        // Validate data is array
        if (!Array.isArray(data)) {
          console.warn('⚠️ Invalid cache data format, clearing...');
          localStorage.removeItem('chat-messages-cache');
          return [];
        }

        console.log('✅ Loaded valid cache:', data.length, 'messages');
        return data;
      } catch (e) {
        console.error('❌ Failed to parse cached messages:', e);
        console.log('🧹 Clearing corrupted cache...');
        localStorage.removeItem('chat-messages-cache');
        return [];
      }
    }
    return [];
  });

  // OPTIMIZATION: Add caching to prevent excessive RPC calls
  const [proStatusCache, setProStatusCache] = useState<{data: any, timestamp: number} | null>(null);
  const [lastProCheck, setLastProCheck] = useState<number>(0);

  // Save messages to localStorage whenever they change (with version and timestamp)
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const cacheData = {
          version: CACHE_VERSION,
          timestamp: Date.now(),
          data: messages
        };
        localStorage.setItem('chat-messages-cache', JSON.stringify(cacheData));
      } catch (e) {
        console.error('❌ Failed to save cache:', e);
        // If localStorage is full, clear old cache
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          console.warn('💾 localStorage quota exceeded, clearing cache...');
          localStorage.removeItem('chat-messages-cache');
        }
      }
    }
  }, [messages]);

  // IDLE USER HANDLER - Detection function
  const isIdleState = () => {
    const isIdle = wasIdleRef.current;

    if (isIdle) {
      console.log('[RT] Idle state detected: page was hidden');
    }

    return isIdle;
  };


  // UPDATE CHECKER - Function to check for PWA updates
  const checkForPWAUpdates = () => {
    console.log('🔍 AuthContext: Checking for PWA updates');
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
  };

  // IDLE USER HANDLER - Max retry limit before refresh
  const MAX_RETRIES = 10; // After 10 retries, refresh instead of continuing

  // IDLE USER HANDLER - Retry delay function with exponential backoff + jitter
  const getRetryDelay = () => {
    const retryCount = retryCountRef.current;

    // TRUE EXPONENTIAL BACKOFF: 100ms base, doubles each retry
    // Pattern: 100 -> 500 -> 1000 -> 2000 -> 4000 -> 8000 -> 16000
    const delays = [100, 500, 1000, 2000, 4000, 8000, 16000];

    const baseDelay = delays[Math.min(retryCount, delays.length - 1)];

    // Full jitter: randomize between 0 and baseDelay to spread retries
    const delay = Math.floor(baseDelay * Math.random());

    console.log(`[RT] Retry attempt #${retryCount + 1}. Jittered backoff: ${delay}ms (max: ${baseDelay}ms)`);
    return delay;
  };

  // UNIFIED FLOW: Single function handles all channel management
  const rebuildChatChannel = async (session: Session | null, reason: string) => {
    const newToken = session?.access_token || null;

    // Only prevent rebuilds for duplicate auth state changes with same token
    if (reason === 'auth state change' && currentTokenRef.current === newToken && newToken !== null) {
      console.log('❌⚠️ Skipping channel rebuild - same token');
      return;
    }

    // 🛡️ GUARD: Prevent duplicate concurrent rebuilds
    if (isRebuildingRef.current) {
      console.log('⏭️ Skipping channel rebuild - already rebuilding');
      return;
    }

    console.log(`🔧 Rebuilding chat channel - Reason: ${reason} | Token changed: ${currentTokenRef.current !== newToken}`);
    isRebuildingRef.current = true;
    currentTokenRef.current = newToken;
    
    // 1. Clear existing timers
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // 2. Synchronized channel teardown with stale ref guard
    if (chatChannelRef.current) {
      console.log('💝 Chat realtime status: Starting synchronized unsubscribe');

      // 💙 Capture channel reference before nullifying to prevent stale refs
      const channelToCleanup = chatChannelRef.current;
      chatChannelRef.current = null;
      setChatChannel(null);

      // 🛡️ GUARD: Check channel state before operations
      const channelState = (channelToCleanup as any).state;
      console.log(`🔍 Channel state before cleanup: ${channelState}`);

      // 🩵 Serialize unsubscribe operation only if channel is active
      if (channelState === 'joined' || channelState === 'joining') {
        try {
          await channelToCleanup.unsubscribe();
          console.log('🔥 Chat realtime status: Unsubscribe completed successfully');
        } catch (e) {
          console.error('❄️ WebSocket unsubscribe failed:', e);
        }
      } else {
        console.log(`⭐️⭐️ Skipping unsubscribe - channel state: ${channelState}`);
      }

      // ☀️ Always remove channel regardless of unsubscribe result
      try {
        supabase.removeChannel(channelToCleanup);
        console.log('💚 Chat realtime status: Channel removed successfully');
      } catch (e) {
        console.error('♥️ WebSocket removeChannel failed:', e);
      }
    }
    
    if (!session?.user) {
      setLoading(false);
      isRebuildingRef.current = false; // Reset flag
      return;
    }
    
    // 3. Set auth FIRST
    console.log('🔑 WebSocket Auth token updated');
    supabase.realtime.setAuth(session.access_token);
    
    // 4. Wait for auth propagation (increased to 500ms)
    console.log('💔 WebSocket Auth propagation: Waiting 500ms...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 5. Ensure WebSocket connected with connection guard
    if (!isConnectingRef.current) {
      console.log('🩸 WebSocket: Initiating guarded connection');
      isConnectingRef.current = true;
      supabase.realtime.connect();
      
      // Reset connecting flag after a delay
      setTimeout(() => {
        isConnectingRef.current = false;
        console.log('🧲 WebSocket: Connection guard reset');
      }, 2000);
    } else {
      console.log('🔥 WebSocket: Skipping connection - already connecting');
    }
    
    // 6. Create new channel with full realtime capabilities  
    console.log('🔧 Channel recreated with new auth');
    const channel = supabase.channel('chat-community');
    
    // 7. Add event listeners for chat messages (with error handling)
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel_id=eq.community'
      },
      async (payload) => {
        console.log('💖 Realtime message received:', payload.new);
        const newMessage = payload.new as ChatMessageData;
        if (newMessage.user_id !== session?.user?.id) {
          // Fetch fresh badge data for the message sender
          try {
            const { data: userProfiles } = await supabase
              .from('profiles')
              .select('user_id, display_name, streak_days, level, is_admin, avatar_url')
              .eq('user_id', newMessage.user_id)
              .single();

            const { data: subscriptions } = await supabase
              .rpc('get_public_pro_status', { user_ids: [newMessage.user_id] });

            const subscriptionData = subscriptions?.[0];
            const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
            
            // Enrich message with fresh badge data
            const enrichedMessage: ChatMessageData = {
              ...newMessage,
              user_name: userProfiles?.display_name || newMessage.user_name,
              user_level: userProfiles?.level || newMessage.user_level || 1,
              is_pro: subscriptionData?.is_pro || false,
              is_admin: newMessage.user_id === knownAdminId || userProfiles?.is_admin || false,
              streak_days: userProfiles?.streak_days || 0,
              subscription_type: subscriptionData?.subscription_type || null,
              avatar_url: userProfiles?.avatar_url || undefined
            };

            console.log('🎯 Real-time message enriched with fresh badge data:', enrichedMessage);

            setMessages(current => {
              const exists = current.some(msg => msg.id === enrichedMessage.id);
              if (exists) return current;
              return [...current, enrichedMessage];
            });
          } catch (error) {
            console.error('❌ Failed to fetch badge data for real-time message:', error);
            // Fallback: add message without enriched data
            setMessages(current => {
              const exists = current.some(msg => msg.id === newMessage.id);
              if (exists) return current;
              return [...current, newMessage];
            });
          }
        }
      }
    );

    // Add DELETE listener for real-time deletion
    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel_id=eq.community'
      },
      (payload) => {
        console.log('🗑️ Realtime delete received:', payload.old);
        const deletedMessage = payload.old as { id: string };
        setMessages(current => current.filter(msg => msg.id !== deletedMessage.id));
      }
    );

    // Add INSERT listener for gold_reports
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'gold_reports'
      },
      (payload) => {
        console.log('⭐ Gold report added:', payload.new);
        const goldReport = payload.new as { message_id: string };
        setMessages(current => current.map(msg =>
          msg.id === goldReport.message_id ? { ...msg, is_gold_reported: true } : msg
        ));
      }
    );

    // Add DELETE listener for gold_reports
    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'gold_reports'
      },
      (payload) => {
        console.log('⭐ Gold report removed:', payload.old);
        const goldReport = payload.old as { message_id: string };
        setMessages(current => current.map(msg =>
          msg.id === goldReport.message_id ? { ...msg, is_gold_reported: false } : msg
        ));
      }
    );

    // Add broadcast listeners for gold report toggles (instant sync)
    channel.on('broadcast', { event: 'gold_report_added' }, (payload) => {
      console.log('📢⭐ Broadcast: Gold report added', payload.payload.message_id);
      const { message_id } = payload.payload;
      setMessages(current => current.map(msg =>
        msg.id === message_id ? { ...msg, is_gold_reported: true } : msg
      ));
    });

    channel.on('broadcast', { event: 'gold_report_removed' }, (payload) => {
      console.log('📢⭐ Broadcast: Gold report removed', payload.payload.message_id);
      const { message_id } = payload.payload;
      setMessages(current => current.map(msg =>
        msg.id === message_id ? { ...msg, is_gold_reported: false } : msg
      ));
    });
    
    // Add broadcast listeners for chat
    channel.on('broadcast', { event: 'message_added' }, async (payload) => {
      const newMessage = payload.payload as ChatMessageData;
      if (newMessage.user_id !== session?.user?.id) {
        // Check if message already has enriched data (from optimistic UI)
        if (newMessage.is_pro !== undefined && newMessage.subscription_type !== undefined) {
          // Message already enriched, use as-is
          console.log('📢 Broadcast message already enriched:', newMessage);
          setMessages(current => {
            const exists = current.some(msg => msg.id === newMessage.id);
            if (exists) return current;
            return [...current, newMessage];
          });
        } else {
          // Fetch fresh badge data for the message sender
          try {
            const { data: userProfiles } = await supabase
              .from('profiles')
              .select('user_id, display_name, streak_days, level, is_admin, avatar_url')
              .eq('user_id', newMessage.user_id)
              .single();

            const { data: subscriptions } = await supabase
              .rpc('get_public_pro_status', { user_ids: [newMessage.user_id] });

            const subscriptionData = subscriptions?.[0];
            const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
            
            // Enrich message with fresh badge data
            const enrichedMessage: ChatMessageData = {
              ...newMessage,
              user_name: userProfiles?.display_name || newMessage.user_name,
              user_level: userProfiles?.level || newMessage.user_level || 1,
              is_pro: subscriptionData?.is_pro || false,
              is_admin: newMessage.user_id === knownAdminId || userProfiles?.is_admin || false,
              streak_days: userProfiles?.streak_days || 0,
              subscription_type: subscriptionData?.subscription_type || null,
              avatar_url: userProfiles?.avatar_url || undefined
            };

            console.log('📢🎯 Broadcast message enriched with fresh badge data:', enrichedMessage);

            setMessages(current => {
              const exists = current.some(msg => msg.id === enrichedMessage.id);
              if (exists) return current;
              return [...current, enrichedMessage];
            });
          } catch (error) {
            console.error('❌ Failed to fetch badge data for broadcast message:', error);
            // Fallback: add message without enriched data
            setMessages(current => {
              const exists = current.some(msg => msg.id === newMessage.id);
              if (exists) return current;
              return [...current, newMessage];
            });
          }
        }
      }
    });
    
    channel.on('broadcast', { event: 'message_deleted' }, (payload) => {
      console.log('❌ Chat deleted:', payload.payload.message_id);
      setMessages(current => current.filter(msg => msg.id !== payload.payload.message_id));
    });

    // Add verse notification listener to unified channel
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'verse_notif'
      },
      (payload) => {
        const { display_name, verse_title } = payload.new;
        console.log(`🔔 ${display_name} - ${verse_title}`);
        console.log('🐢🐢 1 sec delay before notif');
        // 1 second delay: ensures listener is ready + nice UX timing
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('verse_notification', {
            detail: payload.new
          }));
        }, 1000);
      }
    );

    // 8. Subscribe with unified error handling
    channel.subscribe((status) => {
      setChannelStatus(status);

      if (status === 'SUBSCRIBED') {
        // Check if this was a recovery from failure
        const wasRetrying = retryTimeoutRef.current !== null;
        console.log(wasRetrying ? '🚀⚡️ WebSocket connection recovered successfully!' : '✈️✈️ CHAT RT SUKSES Connected');
        console.log(`✅ Channel rebuild completed successfully - Reason: ${reason}`);

        // Clear any pending retry timeouts and reset counter
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        retryCountRef.current = 0; // Reset on successful connection
        chatChannelRef.current = channel;
        setChatChannel(channel); // Ensure state is updated
        setLoading(false);
        isRebuildingRef.current = false; // ✅ Reset rebuilding flag on success
      } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
        console.log('🩵 WebSocket Scheduling reconnect after timeout/close...');
        isRebuildingRef.current = false; // ⚠️ Reset flag to allow retry

        // Check if max retries exceeded - refresh instead of logout
        if (retryCountRef.current >= MAX_RETRIES) {
          console.log('🔄 Max retries exceeded, refreshing page to recover connection...');
          localStorage.setItem('connection-recovery-refresh', 'true');
          window.location.reload();
          return;
        }

        // Retry with idle-aware backoff
        if (!retryTimeoutRef.current) {
          const delay = getRetryDelay();
          console.log(`🩵 WebSocket retry in ${delay}ms after timeout/close`);
          retryCountRef.current++;

          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null;
            console.log('❄️ WebSocket Attempting reconnect after timeout...');
            rebuildChatChannel(session, 'retry after timeout').catch((error) => {
              console.error('💝 WebSocket retry rebuild failed:', error);
            });
          }, delay);
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'CONNECTION_ERROR' || status === 'FAILED') {
        console.log('🔥🐢☀️ WebSocket Transition:', status);
        isRebuildingRef.current = false; // ⚠️ Reset flag to allow retry

        // Check if max retries exceeded - refresh instead of logout
        if (retryCountRef.current >= MAX_RETRIES) {
          console.log('🔄 Max retries exceeded, refreshing page to recover connection...');
          localStorage.setItem('connection-recovery-refresh', 'true');
          window.location.reload();
          return;
        }

        // Retry failed connections with idle detection
        if (!retryTimeoutRef.current) {
          const delay = getRetryDelay();
          console.log(`🔥 WebSocket retry in ${delay}ms after CHANNEL_ERROR`);
          retryCountRef.current++;

          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null;
            console.log('☀️ WebSocket Attempting reconnect after failure...');
            rebuildChatChannel(session, 'retry after failure').catch((error) => {
              console.error('💚 WebSocket failure rebuild failed:', error);
            });
          }, delay);
        }
      }
    });
    
    if (session.user) {
      // Force refresh Pro status for new login (clear cache first)
      localStorage.removeItem('unified_pro_status_cache');
      setProStatusCache(null);
      checkProStatus(session.user.id, true);
    }
  };

  const updateAuthState = (session: Session | null) => {
    setUser(session?.user ?? null);
    setUserId(session?.user?.id ?? null);
    
    // Check token expiry and log warning
    if (session?.expires_at) {
      const expiryTime = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiry = expiryTime.getTime() - now.getTime();
      const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
      const minutesUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));
      
      if (timeUntilExpiry > 0) {
        console.log(`🆘🚀 Token habis dalam ${hoursUntilExpiry} jam ${minutesUntilExpiry} menit | Token Expiry in ${hoursUntilExpiry}h ${minutesUntilExpiry}m`);
      } else {
        console.log('🆘🚀 Token sudah expired! | Token already expired!');
      }
    }
    
    // Use unified flow for all channel management
    rebuildChatChannel(session, 'auth state change').catch((error) => {
      console.error('💙 WebSocket auth state rebuild failed:', error);
    });
  };

  useEffect(() => {
    // Display last logout reason if available
    const lastLogoutReason = localStorage.getItem('last-logout-reason');
    if (lastLogoutReason) {
      console.log(`📋 Previous logout: ${lastLogoutReason}`);
    }

    // Display connection recovery refresh if available
    const connectionRecovery = localStorage.getItem('connection-recovery-refresh');
    if (connectionRecovery) {
      console.log('🔄 Page refreshed due to max retries - attempting fresh connection...');
      localStorage.removeItem('connection-recovery-refresh');
    }

    // IDLE USER HANDLER - Page visibility tracking
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;

      if (isVisible) {
        console.log('[RT] Page became visible - checking for idle-wake reconnection');
        lastActiveTimeRef.current = Date.now();

        // Check for PWA updates when page becomes visible
        checkForPWAUpdates();

        // Mark for genuine idle-wake reconnection if page was hidden
        if (wasIdleRef.current) {
          console.log('❇️❇️ USER BACK FROM IDLE');
          console.log('[RT] Genuine idle-wake scenario detected - flagging for long delay');
          isIdleWakeReconnectRef.current = true;
          isIdleWakeRecoveryRef.current = true; // 🛡️ RACE CONDITION FIX: Prevent duplicate rebuilds

          // PWA & BROWSER FIX: Dispatch custom event to reload messages for all platforms
          const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

          // OPTIMIZATION: Add a 1-second delay to allow network to stabilize after wake
          console.log('[RT] Delaying recovery for 1s to allow network to stabilize.');
          setTimeout(() => {
            // OPTIMIZATION: Check channel state first before expensive refresh
            console.log(`🔍 Current channel status: ${channelStatus}`);

            if (channelStatus === 'SUBSCRIBED') {
              // FAST PATH: Channel still connected, just sync existing token
              console.log('✅ Channel still SUBSCRIBED, using existing token (no API call)');

              supabase.auth.getSession().then(async ({ data: { session } }) => {
                if (session) {
                  // Check token expiry (5 min buffer)
                  const tokenExpiresAt = session.expires_at || 0;
                  const timeUntilExpiry = (tokenExpiresAt * 1000) - Date.now();
                  const hasValidToken = timeUntilExpiry > 300000; // 5 minutes buffer

                  if (hasValidToken) {
                    console.log(`✅ Token valid for ${Math.floor(timeUntilExpiry / 60000)} more minutes, syncing with realtime`);

                    // Just sync existing token - NO API CALL!
                    supabase.realtime.setAuth(session.access_token);

                    // Dispatch reload event for messages
                    console.log(`📱 ${isPWA ? 'PWA' : 'BROWSER'} IDLE HANDLER: Dispatching reload-messages event (fast path)`);
                    window.dispatchEvent(new CustomEvent('pwa-reload-messages', {
                      detail: { reason: 'idle-wake', timestamp: Date.now(), isPWA }
                    }));

                    // 🛡️ RACE CONDITION FIX: Reset flag for fast path too
                    isIdleWakeRecoveryRef.current = false;
                    console.log('✅ Idle-wake recovery flag reset (fast path)');

                    return; // Done! No rebuild needed
                  } else {
                    console.log('⚠️ Token expiring soon, will refresh');
                    // Token expiring, fall through to SLOW PATH by triggering rebuild
                    // This will be handled by the else block below
                  }
                }
              });
            } else {
              // SLOW PATH: Channel not subscribed or token expiry suspected
              console.log('‼️⛔️⛔️ Channel not SUBSCRIBED or token needs refresh, rebuilding...');
            supabase.auth.getSession().then(async ({ data: { session } }) => {
              if (session) {
                // Check if token is already expired before attempting refresh
                const tokenExpiresAt = session.expires_at || 0;
                const isExpired = (tokenExpiresAt * 1000) < Date.now();

                if (isExpired) {
                  console.log('⚠️ Token already expired, must refresh');
                }

                // Refresh session to get new token
                try {
                  const { data: refreshedSession } = await supabase.auth.refreshSession();
                  const sessionToUse = refreshedSession?.session || session;

                  console.log('🔐 Auth refreshed before idle-wake channel rebuild');
                  await rebuildChatChannel(sessionToUse, 'idle-wake').catch((error) => {
                    console.error('🚨 Idle wake channel rebuild failed:', error);
                    // Force refresh to recover
                    localStorage.setItem('refresh-redirect-to-chat', 'true');
                    window.location.reload();
                  }).finally(() => {
                    // 🛡️ RACE CONDITION FIX: Reset flag after idle-wake rebuild completes
                    isIdleWakeRecoveryRef.current = false;
                    console.log('✅ Idle-wake recovery flag reset');
                  });

                  // ✅ Dispatch AFTER rebuild initiated
                  console.log(`📱 ${isPWA ? 'PWA' : 'BROWSER'} IDLE HANDLER: Dispatching reload-messages event (slow path)`);
                  window.dispatchEvent(new CustomEvent('pwa-reload-messages', {
                    detail: { reason: 'idle-wake', timestamp: Date.now(), isPWA }
                  }));
                } catch (error) {
                  console.error('❌ Auth refresh failed:', error);

                  // 🛡️ FALLBACK: Try getSession before giving up
                  const { data: { session: fallbackSession }, error: sessionError } = await supabase.auth.getSession();

                  if (fallbackSession && !sessionError) {
                    console.log('✅ Session recovered via getSession fallback');
                    await rebuildChatChannel(fallbackSession, 'idle-wake-fallback').catch((error) => {
                      console.error('🚨 Fallback session rebuild failed:', error);
                      localStorage.setItem('refresh-redirect-to-chat', 'true');
                      window.location.reload();
                    }).finally(() => {
                      isIdleWakeRecoveryRef.current = false;
                      console.log('✅ Idle-wake recovery flag reset (fallback)');
                    });

                    // Dispatch reload event
                    console.log(`📱 ${isPWA ? 'PWA' : 'BROWSER'} IDLE HANDLER: Dispatching reload-messages event (fallback path)`);
                    window.dispatchEvent(new CustomEvent('pwa-reload-messages', {
                      detail: { reason: 'idle-wake', timestamp: Date.now(), isPWA }
                    }));
                  } else {
                    // Both refresh and getSession failed - redirect to login
                    console.error('❌ All session recovery attempts failed, redirecting to login.');
                    localStorage.setItem('session-expired', 'true');
                    window.location.href = '/';
                  }
                }
              } else {
                console.log('[RT] No session found on idle wake, attempting recovery...');
                // Try to refresh session first
                const { data: refreshData } = await supabase.auth.refreshSession();
                if (refreshData?.session) {
                  console.log('✅ Session recovered on idle wake');
                  await rebuildChatChannel(refreshData.session, 'idle-wake-recovered').catch((error) => {
                    console.error('🚨 Recovered session rebuild failed:', error);
                    localStorage.setItem('refresh-redirect-to-chat', 'true');
                    window.location.reload();
                  }).finally(() => {
                    // 🛡️ RACE CONDITION FIX: Reset flag after recovery rebuild completes
                    isIdleWakeRecoveryRef.current = false;
                    console.log('✅ Idle-wake recovery flag reset');
                  });

                  // ✅ Dispatch AFTER rebuild initiated
                  console.log(`📱 ${isPWA ? 'PWA' : 'BROWSER'} IDLE HANDLER: Dispatching reload-messages event (recovery path)`);
                  window.dispatchEvent(new CustomEvent('pwa-reload-messages', {
                    detail: { reason: 'idle-wake', timestamp: Date.now(), isPWA }
                  }));
                } else {
                  // No session available - redirect to login
                  console.log('❌ No session available, setting expired flag');
                  localStorage.setItem('session-expired', 'true');
                  window.location.href = '/';
                }
              }
            });
            }
          }, 1000); // 1-second delay
        }

        wasIdleRef.current = false;
      } else {
        console.log('☠️☠️ USER IDLE');
        console.log('[RT] Page hidden - marking as potentially idle');
        wasIdleRef.current = true;
      }
    };

    // Track user activity to detect idle periods
    const updateActiveTime = () => {
      const now = Date.now();
      const timeSinceLastActive = now - lastActiveTimeRef.current;

      // Check if user was idle and is now active
      if (timeSinceLastActive > 600000) { // 600000 = 10 minutes (production)
        console.log('⚠️⚠️ IDLE USER BACK updateActiveTime');
        console.log('[RT] User active after 10+ minute idle');

        // Check for PWA updates when user returns from long idle
        checkForPWAUpdates();

        // PWA & BROWSER FIX: Dispatch custom event to reload messages for all platforms
        const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true;

        console.log(`⭕️⭕️ ${isPWA ? 'PWA' : 'BROWSER'} IDLE HANDLER: Dispatching reload-messages event (activity-based)`);
        window.dispatchEvent(new CustomEvent('pwa-reload-messages', {
          detail: { reason: 'activity-wake', timestamp: now, isPWA }
        }));
      }

      lastActiveTimeRef.current = now;
      wasIdleRef.current = false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', updateActiveTime);
    document.addEventListener('keydown', updateActiveTime);
    document.addEventListener('scroll', updateActiveTime);
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // If no session, try to recover from deployment backup
      if (!session) {
        // Try manual update backup first
        const deploymentRecover = sessionStorage.getItem('auth-backup');
        if (deploymentRecover) {
          try {
            const authData = JSON.parse(deploymentRecover);
            if (authData._session_backup) {
              const backupSession = JSON.parse(authData._session_backup);
              await supabase.auth.setSession(backupSession);
              console.log('🚀 Recovered from deployment logout');
              sessionStorage.removeItem('auth-backup');
              return; // Don't call updateAuthState yet, let onAuthStateChange handle it
            }
          } catch (e) {
            console.warn('Failed to recover session:', e);
          }
        }

        // iOS: Try automatic deployment backup with audio cache
        const iosNeedsRecovery = localStorage.getItem('ios-needs-recovery');
        if (iosNeedsRecovery === 'true') {
          const iosBackup = sessionStorage.getItem('ios-deploy-backup');
          if (iosBackup) {
            try {
              const fullData = JSON.parse(iosBackup);
              
              // Restore ALL data (auth + audio cache)
              Object.keys(fullData).forEach(key => {
                if (key !== '_session_backup' && fullData[key]) {
                  localStorage.setItem(key, fullData[key]);
                }
              });
              
              // Restore session if available
              if (fullData._session_backup) {
                const backupSession = JSON.parse(fullData._session_backup);
                await supabase.auth.setSession(backupSession);
                console.log('📱 iOS recovered from auto-deployment (auth + audio cache secured)');
                sessionStorage.removeItem('ios-deploy-backup');
                localStorage.removeItem('ios-needs-recovery');
                return;
              }
            } catch (e) {
              console.warn('iOS recovery failed:', e);
              localStorage.removeItem('ios-needs-recovery');
            }
          }
        }

        // Non-iOS: Try deployment backup with audio cache  
        const needsRecovery = localStorage.getItem('needs-recovery');
        if (needsRecovery === 'true') {
          const deployBackup = sessionStorage.getItem('deploy-backup');
          if (deployBackup) {
            try {
              const fullData = JSON.parse(deployBackup);
              
              // Restore ALL data (auth + audio cache)
              Object.keys(fullData).forEach(key => {
                if (key !== '_session_backup' && fullData[key]) {
                  localStorage.setItem(key, fullData[key]);
                }
              });
              
              // Restore session if available
              if (fullData._session_backup) {
                const backupSession = JSON.parse(fullData._session_backup);
                await supabase.auth.setSession(backupSession);
                console.log('🔒 Deployment recovery completed (auth + audio cache secured)');
                sessionStorage.removeItem('deploy-backup');
                localStorage.removeItem('needs-recovery');
                return;
              }
            } catch (e) {
              console.warn('Deployment recovery failed:', e);
              localStorage.removeItem('needs-recovery');
            }
          }
        }
      }
      
      updateAuthState(session);
    });

    // Auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔵🔵🔵 Auth State Change: ${event}`, { userId: session?.user?.id, hasSession: !!session });

      // 🛡️ RACE CONDITION FIX: Skip TOKEN_REFRESHED during idle-wake recovery
      if (event === 'TOKEN_REFRESHED' && isIdleWakeRecoveryRef.current) {
        console.log('⏭️ Skipping rebuild - TOKEN_REFRESHED during idle-wake recovery');
        return;
      }

      // IDLE USER HANDLER - Prevent unwanted signouts
      if (event === 'SIGNED_OUT') {
        const now = new Date().toISOString();
        const logoutReason = session ? '🔑 User manually clicked sign out' : '☠️ Token expired/disconnected';
        
        // Check if this is an unwanted idle signout
        if (!session && !localStorage.getItem('manual-logout-flag')) {
          console.log('🩵🩵🩵 IDLE USER HANDLER - Attempting token refresh before signout');
          
          try {
            // Try to refresh the session
            const { data: refreshedSession, error } = await supabase.auth.refreshSession();
            
            if (refreshedSession?.session && !error) {
              console.log('🩵🩵🩵 IDLE USER HANDLER - Token refreshed successfully');
              // CHANNEL FIX: Don't call updateAuthState, just update state directly to avoid channel rebuild
              setUser(refreshedSession.session.user);
              setUserId(refreshedSession.session.user.id);
              currentTokenRef.current = refreshedSession.session.access_token;
              // Just update auth token without rebuilding channels
              supabase.realtime.setAuth(refreshedSession.session.access_token);
              return;
            } else {
              console.log('🩵🩵🩵 IDLE USER HANDLER - Refresh failed, trying getSession fallback');
              
              // Fallback: Try getSession to recover
              const { data: { session: fallbackSession }, error: sessionError } = await supabase.auth.getSession();
              
              if (fallbackSession && !sessionError) {
                console.log('🩵🩵🩵 IDLE USER HANDLER - Session recovered via getSession');
                // CHANNEL FIX: Don't call updateAuthState, just update state directly
                setUser(fallbackSession.user);
                setUserId(fallbackSession.user.id);
                currentTokenRef.current = fallbackSession.access_token;
                supabase.realtime.setAuth(fallbackSession.access_token);
                return;
              }
            }
          } catch (e) {
            console.warn('🩵🩵🩵 IDLE USER HANDLER - All recovery attempts failed:', e);
          }
        }
        
        const logEntry = `${now} - 🟡🟡🟡 Reason Signed out: ${logoutReason}`;
        
        // Store in localStorage to survive refresh
        localStorage.setItem('last-logout-reason', logEntry);
        console.log(logEntry);
        
        // Clear manual logout flag after processing
        localStorage.removeItem('manual-logout-flag');
        
        // Clear token reference on logout to prevent confusion
        currentTokenRef.current = null;
      }
      
      // Backup session on every auth change for deployment recovery
      if (session && event !== 'SIGNED_OUT') {
        sessionStorage.setItem('last-valid-session', JSON.stringify({
          session,
          timestamp: Date.now()
        }));
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('last-valid-session');
      }
      
      updateAuthState(session);
    });

    // IDLE USER HANDLER - Cleanup event listeners
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', updateActiveTime);
      document.removeEventListener('keydown', updateActiveTime);
      document.removeEventListener('scroll', updateActiveTime);
    };
  }, []);

  // Cleanup function for proper logout
  const cleanupSupabase = async () => {
    console.log('🧹 Cleaning up Supabase connections');
    
    // Set manual logout flag to prevent IDLE USER HANDLER interference
    localStorage.setItem('manual-logout-flag', 'true');
    
    // Clear token reference
    currentTokenRef.current = null;
    
    // Clear timers
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Unsubscribe and remove chat channel
    if (chatChannelRef.current) {
      try {
        await chatChannelRef.current.unsubscribe();
      } catch (e) {
        console.log('⚠️ Channel unsubscribe failed during cleanup');
      }
      supabase.removeChannel(chatChannelRef.current);
      chatChannelRef.current = null;
      setChatChannel(null);
    }
    
    // Clear state and Pro cache
    setMessages([]);
    setProStatus(null);
    setProStatusCache(null);
    setChannelStatus('CLOSED');
    
    // Clear Pro status cache from localStorage
    localStorage.removeItem('unified_pro_status_cache');
  };

  const checkProStatus = async (userId: string, force: boolean = false) => {
    const now = Date.now();
    const cacheAge = proStatusCache ? now - proStatusCache.timestamp : Infinity;
    const timeSinceLastCheck = now - lastProCheck;
    
    // OPTIMIZATION: Use cache if less than 5 minutes old and not forced, and minimum 30 seconds between checks
    if (!force && cacheAge < 300000 && timeSinceLastCheck < 30000 && proStatusCache) {
      console.log('✅ AuthContext using cached pro status (age: ' + Math.floor(cacheAge/1000) + 's)');
      setProStatus(proStatusCache.data);
      setLoading(false);
      return;
    }
    
    // Prevent rapid successive calls
    if (timeSinceLastCheck < 30000 && !force) {
      console.log('⏱️ AuthContext pro check throttled (last check: ' + Math.floor(timeSinceLastCheck/1000) + 's ago)');
      setLoading(false);
      return;
    }
    
    setLastProCheck(now);
    
    try {
      console.log('🔄 AuthContext making RPC call for pro status...');
      const { data, error } = await supabase.rpc('check_unified_pro_status', {
        p_user_id: userId
      });

      if (error) throw error;

      const status = {
        isPro: data?.[0]?.is_pro || false,
        subscriptionType: data?.[0]?.subscription_type,
        status: data?.[0]?.status,
        expiresAt: data?.[0]?.expires_at,
        daysRemaining: data?.[0]?.days_remaining,
      };

      // Cache the result
      setProStatusCache({ data: status, timestamp: now });
      setProStatus(status);
      console.log('✅ AuthContext pro status updated and cached:', status);
    } catch (error) {
      if (!navigator.onLine) {
        console.log('IDLEUSER_PROFAIL: Pro status check skipped, user is offline.');
      } else {
        console.error('❌ AuthContext pro check failed:', error);
      }
      const fallbackStatus = {
        isPro: false,
        subscriptionType: null,
        status: null,
        expiresAt: null,
        daysRemaining: null,
      };
      setProStatus(fallbackStatus);
      // Don't cache errors, but still update timestamp to prevent spam
    } finally {
      setLoading(false);
    }
  };

  // Chat message actions
  const addMessage = (message: ChatMessageData) => {
    setMessages(current => {
      const exists = current.some(msg => msg.id === message.id);
      if (exists) return current;
      return [...current, message];
    });
  };

  const removeMessage = (messageId: string) => {
    setMessages(current => current.filter(msg => msg.id !== messageId));
  };

  const broadcastMessage = (message: ChatMessageData) => {
    if (chatChannel) {
      chatChannel.send({
        type: 'broadcast',
        event: 'message_added',
        payload: message
      });
      console.log('🧊 Message broadcasted:', message.id);
    }
  };

  const broadcastDelete = (messageId: string) => {
    if (chatChannel) {
      chatChannel.send({
        type: 'broadcast',
        event: 'message_deleted',
        payload: { message_id: messageId }
      });
      console.log('🗑️ Delete broadcasted:', messageId);
    }
  };

  const broadcastGoldReportAdded = (messageId: string) => {
    if (chatChannel) {
      chatChannel.send({
        type: 'broadcast',
        event: 'gold_report_added',
        payload: { message_id: messageId }
      });
      console.log('⭐ Gold report added broadcasted:', messageId);
    }
  };

  const broadcastGoldReportRemoved = (messageId: string) => {
    if (chatChannel) {
      chatChannel.send({
        type: 'broadcast',
        event: 'gold_report_removed',
        payload: { message_id: messageId }
      });
      console.log('⭐ Gold report removed broadcasted:', messageId);
    }
  };

  // Dedicated refresh session method for update scenarios
  const refreshSession = async (): Promise<{ success: boolean; error?: string }> => {
    console.log('🔄 AuthContext refreshSession called for update workflow');
    
    try {
      // First try to refresh the current session
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshedSession?.session && !refreshError) {
        console.log('✅ AuthContext session refresh successful');
        
        // Update state directly without triggering channel rebuild
        setUser(refreshedSession.session.user);
        setUserId(refreshedSession.session.user.id);
        currentTokenRef.current = refreshedSession.session.access_token;
        
        // Update realtime auth token
        supabase.realtime.setAuth(refreshedSession.session.access_token);
        
        return { success: true };
      } else {
        console.log('⚠️ AuthContext refresh failed, trying getSession fallback');
        
        // Fallback: Try getSession to recover existing session
        const { data: { session: fallbackSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (fallbackSession && !sessionError) {
          console.log('✅ AuthContext session recovered via getSession');
          
          // Update state directly
          setUser(fallbackSession.user);
          setUserId(fallbackSession.user.id);
          currentTokenRef.current = fallbackSession.access_token;
          supabase.realtime.setAuth(fallbackSession.access_token);
          
          return { success: true };
        } else {
          const errorMsg = refreshError?.message || sessionError?.message || 'Session refresh failed';
          console.error('❌ AuthContext all refresh attempts failed:', errorMsg);
          return { success: false, error: errorMsg };
        }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown refresh error';
      console.error('❌ AuthContext refresh exception:', errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        loading,
        chatChannel,
        isPro: proStatus?.isPro || false,
        proStatus,
        messages,
        setMessages,
        addMessage,
        removeMessage,
        broadcastMessage,
        broadcastDelete,
        broadcastGoldReportAdded,
        broadcastGoldReportRemoved,
        cleanupSupabase,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};