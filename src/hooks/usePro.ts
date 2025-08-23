import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProStatus {
  isPro: boolean;
  subscriptionType: string | null;
  status: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  loading: boolean;
}

export function usePro() {
  const [proStatus, setProStatus] = useState<ProStatus>({
    isPro: false,
    subscriptionType: null,
    status: null,
    expiresAt: null,
    daysRemaining: null,
    loading: true
  });

  const checkProStatus = async () => {
    try {
      setProStatus(prev => ({ ...prev, loading: true }));
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProStatus({
          isPro: false,
          subscriptionType: null,
          status: null,
          expiresAt: null,
          daysRemaining: null,
          loading: false
        });
        return;
      }

      // First check profile achievements (fallback method)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('achievements')
        .eq('user_id', user.id)
        .single();

      if (profileData?.achievements?.includes('pro')) {
        setProStatus({
          isPro: true,
          subscriptionType: 'achievement',
          status: 'active',
          expiresAt: null,
          daysRemaining: null,
          loading: false
        });
        return;
      }

      // Try the RPC function as backup
      try {
        const { data, error } = await supabase.rpc('check_pro_status', { p_user_id: user.id });
        
        if (!error && data && data.length > 0) {
          const statusData = data[0];
          setProStatus({
            isPro: statusData.is_pro || false,
            subscriptionType: statusData.subscription_type,
            status: statusData.status,
            expiresAt: statusData.expires_at,
            daysRemaining: statusData.days_remaining,
            loading: false
          });
          return;
        }
      } catch (rpcError) {
        console.log('RPC function failed, using achievements fallback');
      }

      // Default to not pro
      setProStatus({
        isPro: false,
        subscriptionType: null,
        status: null,
        expiresAt: null,
        daysRemaining: null,
        loading: false
      });
    } catch (error) {
      console.error('Error in checkProStatus:', error);
      setProStatus({
        isPro: false,
        subscriptionType: null,
        status: null,
        expiresAt: null,
        daysRemaining: null,
        loading: false
      });
    }
  };

  const startTrial = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('pro-trial-start');
      
      if (error) throw error;
      
      if (data.success) {
        await checkProStatus(); // Refresh status
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


      } else {
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
      }
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