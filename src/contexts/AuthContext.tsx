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
  
  // IDLE USER HANDLER - Page visibility tracking
  const lastActiveTimeRef = useRef<number>(Date.now());
  const wasIdleRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const isIdleWakeReconnectRef = useRef<boolean>(false);
  
  // Chat messages state
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  
  // OPTIMIZATION: Add caching to prevent excessive RPC calls
  const [proStatusCache, setProStatusCache] = useState<{data: any, timestamp: number} | null>(null);
  const [lastProCheck, setLastProCheck] = useState<number>(0);

  // IDLE USER HANDLER - Detection function
  const isIdleState = () => {
    const now = Date.now();
    const timeSinceLastActive = now - lastActiveTimeRef.current;
    const isIdle = wasIdleRef.current || timeSinceLastActive > 600000; // 10 minutes (production)
    
    if (isIdle) {
      console.log('[RT] Idle state detected:', { 
        wasHidden: wasIdleRef.current, 
        minutesInactive: Math.floor(timeSinceLastActive / 60000) 
      });
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

  // IDLE USER HANDLER - Retry delay function
  const getRetryDelay = () => {
    const isIdle = isIdleState();
    
    if (isIdle) {
      console.log(`[RT] Using idle timeout: 8000ms`);
      return 8000; // 8 seconds for idle scenarios
    }
    
    console.log(`[RT] Using normal timeout: 500ms`);
    return 500; // 500ms for normal scenarios
  };

  // UNIFIED FLOW: Single function handles all channel management
  const rebuildChatChannel = async (session: Session | null, reason: string) => {
    const newToken = session?.access_token || null;
    
    // Only prevent rebuilds for duplicate auth state changes with same token
    if (reason === 'auth state change' && currentTokenRef.current === newToken && newToken !== null) {
      console.log('⏭️ Skipping channel rebuild - same token');
      return;
    }
    
    console.log(`🔧 Rebuilding chat channel - Reason: ${reason} | Token changed: ${currentTokenRef.current !== newToken}`);
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
      
      // 🩵 Serialize unsubscribe operation
      try {
        await channelToCleanup.unsubscribe();
        console.log('🔥 Chat realtime status: Unsubscribe completed successfully');
      } catch (e) {
        console.error('❄️ WebSocket unsubscribe failed:', e);
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
    const channel = supabase.channel('chat-community', {
      config: {
        broadcast: { self: true },
        presence: { key: 'chat' }
      }
    });
    
    // 7. Add event listeners for chat messages (with error handling)
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel_id=eq.community'
      },
      (payload) => {
        console.log('💖 Realtime message received:', payload.new);
        const newMessage = payload.new as ChatMessageData;
        if (newMessage.user_id !== session?.user?.id) {
          setMessages(current => {
            const exists = current.some(msg => msg.id === newMessage.id);
            if (exists) return current;
            return [...current, newMessage];
          });
        }
      }
    );
    
    // Add broadcast listeners for chat
    channel.on('broadcast', { event: 'message_added' }, (payload) => {
      const newMessage = payload.payload as ChatMessageData;
      if (newMessage.user_id !== session?.user?.id) {
        setMessages(current => {
          const exists = current.some(msg => msg.id === newMessage.id);
          if (exists) return current;
          return [...current, newMessage];
        });
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
        console.log(wasRetrying ? '🚀⚡️ WebSocket connection recovered successfully!' : '💥 Chat realtime status Connected');
        
        // Clear any pending retry timeouts and reset counter
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        retryCountRef.current = 0; // Reset on successful connection
        chatChannelRef.current = channel;
        setLoading(false);
      } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
        console.log('🩵 WebSocket Scheduling reconnect after timeout/close...');
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
        // WebSocket error silenced - normal reconnection behavior
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
      console.error('❌ AuthContext pro check failed:', error);
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