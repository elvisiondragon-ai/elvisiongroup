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
  
  // Chat messages state
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  
  // OPTIMIZATION: Add caching to prevent excessive RPC calls
  const [proStatusCache, setProStatusCache] = useState<{data: any, timestamp: number} | null>(null);
  const [lastProCheck, setLastProCheck] = useState<number>(0);

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
    
    // 6. Create new channel
    console.log('🔧 Channel recreated with new auth');
    const channel = supabase.channel('chat-community', {
      config: {
        broadcast: { self: true },
        presence: { key: 'chat' }
      }
    });
    
    // 7. Add event listeners for chat messages
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
    
    // Add broadcast listeners
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
    
    // 8. Subscribe with unified error handling
    channel.subscribe((status) => {
      setChannelStatus(status);
      
      if (status === 'SUBSCRIBED') {
        console.log('💥 Chat realtime status Reconnect');
        // Clear any pending retry timeouts
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        chatChannelRef.current = channel;
        setChatChannel(channel);
        setLoading(false);
      } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
        console.log('🩵 WebSocket Scheduling reconnect after timeout/close...');
        // Retry with backoff
        if (!retryTimeoutRef.current) {
          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null;
            console.log('❄️ WebSocket Attempting reconnect after timeout...');
            rebuildChatChannel(session, 'retry after timeout').catch((error) => {
              console.error('💝 WebSocket retry rebuild failed:', error);
            });
          }, 3000);
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'CONNECTION_ERROR' || status === 'FAILED') {
        console.error('🔥 WebSocket connection failed with status:', status);
        // Retry failed connections with longer delay
        if (!retryTimeoutRef.current) {
          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null;
            console.log('☀️ WebSocket Attempting reconnect after failure...');
            rebuildChatChannel(session, 'retry after failure').catch((error) => {
              console.error('💚 WebSocket failure rebuild failed:', error);
            });
          }, 5000);
        }
      }
    });
    
    if (session.user) {
      checkProStatus(session.user.id);
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

        // iOS: Try automatic deployment backup
        const iosNeedsRecovery = localStorage.getItem('ios-needs-recovery');
        if (iosNeedsRecovery === 'true') {
          const iosBackup = sessionStorage.getItem('ios-deploy-backup');
          if (iosBackup) {
            try {
              const authData = JSON.parse(iosBackup);
              if (authData._session_backup) {
                const backupSession = JSON.parse(authData._session_backup);
                await supabase.auth.setSession(backupSession);
                console.log('📱 iOS recovered from auto-deployment logout');
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
              // Don't process signout, let the TOKEN_REFRESHED event handle it
              return;
            } else {
              console.log('🩵🩵🩵 IDLE USER HANDLER - Refresh failed, trying getSession fallback');
              
              // Fallback: Try getSession to recover
              const { data: { session: fallbackSession }, error: sessionError } = await supabase.auth.getSession();
              
              if (fallbackSession && !sessionError) {
                console.log('🩵🩵🩵 IDLE USER HANDLER - Session recovered via getSession');
                updateAuthState(fallbackSession);
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

    return () => subscription.unsubscribe();
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
    
    // Clear state
    setMessages([]);
    setProStatus(null);
    setProStatusCache(null);
    setChannelStatus('CLOSED');
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