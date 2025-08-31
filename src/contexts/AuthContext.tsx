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
          await checkProStatus(session.user.id);
        } else {
          setProStatus(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkProStatus = async (userId: string) => {
    try {
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

      setProStatus(status);
      console.log('✅ AuthContext pro status:', status);
    } catch (error) {
      console.error('❌ AuthContext pro check failed:', error);
      setProStatus({
        isPro: false,
        subscriptionType: null,
        status: null,
        expiresAt: null,
        daysRemaining: null,
      });
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