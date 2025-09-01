import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPro: boolean;
  proStatus: {
    isPro: boolean;
    subscriptionType: string | null;
    status: string | null;
    expiresAt: string | null;
    daysRemaining: number | null;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPro: false,
  proStatus: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [proStatus, setProStatus] = useState<any>(null);
  
  // OPTIMIZATION: Add caching to prevent excessive RPC calls
  const [proStatusCache, setProStatusCache] = useState<{data: any, timestamp: number} | null>(null);
  const [lastProCheck, setLastProCheck] = useState<number>(0);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkProStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes - this replaces multiple getUser() calls
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // OPTIMIZATION: Add rate limiting check before making RPC calls
          try {
            const rateLimitResponse = await fetch(
              'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/auth-rate-limit',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.access_token}`
                }
              }
            );
            
            if (rateLimitResponse.ok) {
              await checkProStatus(session.user.id, event === 'SIGNED_IN');
            } else {
              console.log('🚫 Rate limited - using cached status or default');
              if (proStatusCache) {
                setProStatus(proStatusCache.data);
              }
              setLoading(false);
            }
          } catch (rateLimitError) {
            console.warn('Rate limit check failed, proceeding with pro status check:', rateLimitError);
            await checkProStatus(session.user.id, event === 'SIGNED_IN');
          }
        } else {
          setProStatus(null);
          setLoading(false);
        }
      }
    );

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
        loading,
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