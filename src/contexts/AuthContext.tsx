import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  loading: true,
  chatChannel: null,
  isPro: false,
  proStatus: null,
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
  
  // OPTIMIZATION: Add caching to prevent excessive RPC calls
  const [proStatusCache, setProStatusCache] = useState<{data: any, timestamp: number} | null>(null);
  const [lastProCheck, setLastProCheck] = useState<number>(0);

  // UNIFIED FLOW: Single function handles all channel management
  const rebuildChatChannel = async (session: Session | null, reason: string) => {
    console.log(`🔧 Rebuilding chat channel - Reason: ${reason}`);
    
    // 1. Clear existing timers
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // 2. Teardown old channel
    if (chatChannelRef.current) {
      console.log('☠️ Chat realtime status Unsubscribe');
      try {
        await chatChannelRef.current.unsubscribe();
      } catch (e) {
        console.log('⚠️ Unsubscribe failed, continuing...');
      }
      supabase.removeChannel(chatChannelRef.current);
      chatChannelRef.current = null;
      setChatChannel(null);
    }
    
    if (!session?.user) {
      setLoading(false);
      return;
    }
    
    // 3. Set auth FIRST
    console.log('🔑 WebSocket Auth token updated');
    supabase.realtime.setAuth(session.access_token);
    
    // 4. Wait for auth propagation
    console.log('⏳ WebSocket Auth propagation...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 5. Ensure WebSocket connected
    console.log('⚡️ WebSocket Sukses konek');
    supabase.realtime.connect();
    
    // 6. Create new channel
    console.log('🔧 Channel recreated with new auth');
    const channel = supabase.channel('chat-community', {
      config: {
        broadcast: { self: true },
        presence: { key: 'chat' }
      }
    });
    
    // 7. Add event listeners
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel_id=eq.community'
      },
      (payload) => console.log('💖 Realtime message received:', payload.new)
    );
    
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
        console.log('⚠️ WebSocket Scheduling reconnect...');
        // Retry with backoff
        if (!retryTimeoutRef.current) {
          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null;
            console.log('🚀 WebSocket Attempting reconnect...');
            rebuildChatChannel(session, 'retry after timeout').catch(() => {});
          }, 3000);
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
    
    // Use unified flow for all channel management
    rebuildChatChannel(session, 'auth state change').catch(() => {});
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session);
    });

    // Auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      updateAuthState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        loading,
        chatChannel,
        isPro: proStatus?.isPro || false,
        proStatus,
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