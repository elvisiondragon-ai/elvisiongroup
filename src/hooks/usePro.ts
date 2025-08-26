
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProStatus {
  isPro: boolean;
  subscriptionType: string | null;
  status: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  verseAccess: boolean;
  proBadge: boolean;
  loading: boolean;
}

export function usePro() {
  const [proStatus, setProStatus] = useState<ProStatus>({
    isPro: false,
    subscriptionType: null,
    status: null,
    expiresAt: null,
    daysRemaining: null,
    verseAccess: false,
    proBadge: false,
    loading: true
  });

  // Cache for 5 minutes to reduce API calls
  const CACHE_DURATION = 5 * 60 * 1000;
  const CACHE_KEY = 'unified_pro_status_cache';

  const setNotPro = () => {
    setProStatus({
      isPro: false,
      subscriptionType: null,
      status: null,
      expiresAt: null,
      daysRemaining: null,
      verseAccess: false,
      proBadge: false,
      loading: false,
    });
  };

  const checkProStatus = async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setProStatus({ ...cachedData, loading: false });
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNotPro();
        return;
      }

      // Use unified pro status function - single source of truth
      const { data, error } = await supabase.rpc('check_unified_pro_status', {
        p_user_id: user.id
      });

      if (!error && data && data.length > 0) {
        const statusData = data[0];
        const proStatusData = {
          isPro: statusData.is_pro,
          subscriptionType: statusData.subscription_type,
          status: statusData.status,
          expiresAt: statusData.expires_at,
          daysRemaining: statusData.days_remaining,
          verseAccess: statusData.verse_access,
          proBadge: statusData.pro_badge,
        };
        
        setProStatus({ ...proStatusData, loading: false });
        
        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: proStatusData,
          timestamp: Date.now()
        }));
      } else {
        setNotPro();
        // Cache the "not pro" result as well
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: {
            isPro: false,
            subscriptionType: null,
            status: null,
            expiresAt: null,
            daysRemaining: null,
            verseAccess: false,
            proBadge: false,
          },
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Error checking unified pro status:', error);
      setNotPro();
    }
  };

  const startTrial = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('pro-trial-start');
      
      if (error) throw error;
      
      if (data.success) {
        // Clear cache and refresh status
        localStorage.removeItem(CACHE_KEY);
        await checkProStatus();
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Failed to start trial');
      }
    } catch (error) {
      console.error('Trial start failed:', error);
      throw error;
    }
  };

  const createPayment = async (
    subscriptionType: string, 
    paymentMethod: string, 
    userEmail: string, 
    userName: string, 
    phoneNumber: string,
    amount: number,
    currency: string = 'IDR'
  ) => {
    try {
      // Get current user for authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use Supabase function for Tripay
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: { 
          subscriptionType, 
          paymentMethod, 
          userEmail, 
          userName, 
          phoneNumber,
          amount,
          currency
        }
      });
      
      if (error) throw error;
      
      // Open checkout URL if available
      if (data?.success && data?.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
      }
      
      return data;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkProStatus();
  }, []);

  return {
    proStatus,
    startTrial,
    createPayment,
    refreshStatus: checkProStatus
  };
}
