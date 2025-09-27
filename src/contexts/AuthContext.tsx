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

  const updateAuthState = (session: Session | null) => {
    setUser(session?.user ?? null);
    setUserId(session?.user?.id ?? null);
    
    supabase.realtime.setAuth(session?.access_token ?? '');
    
    if (chatChannelRef.current) {
      supabase.removeChannel(chatChannelRef.current);
      chatChannelRef.current = null;
    }
    
    if (session?.user) {
      const channel = supabase.channel('chat-community', {
        config: {
          broadcast: { self: true },
          presence: { key: 'chat' }
        }
      });
      
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
      
      channel.subscribe((status) => {
        console.log('🔴 Chat realtime status:', status);
        setChannelStatus(status);
        
        if (status === 'SUBSCRIBED' && retryTimeoutRef.current) {
          console.log('🚀 Connected, clearing retry timeout');
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        
        if ((status === 'TIMED_OUT' || status === 'CLOSED') && 
            !retryTimeoutRef.current && 
            status !== 'CHANNEL_ERROR') {
          console.log('⚠️ Scheduling reconnect...');
          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null;
            if (session?.user) {
              const ch = chatChannelRef.current;
              const connecting = ch && ['subscribing', 'joining'].includes(ch.status);
              const open = ch && ch.status === 'open';
              if (open || connecting) return;
              console.log('🚀 Attempting reconnect...');
              // Rejoin existing channels
              const channels = (supabase as any).getChannels?.() ?? [];
              channels.forEach((ch: any) => {
                try { ch.rejoin?.(); } catch {}
              });
              
              // Ensure socket is connected
              // @ts-ignore: sdk version check
              supabase.realtime.connect?.();
            }
          }, 3000);
        }
      });
      
      chatChannelRef.current = channel;
      setChatChannel(channel);
      
      checkProStatus(session.user.id);
    } else {
      setChatChannel(null);
      setLoading(false);
    }
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