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
      
      const { data, error } = await supabase.functions.invoke('vip-status-check');
      
      if (error) throw error;
      
      setProStatus({
        isPro: data.is_vip || false,
        subscriptionType: data.subscription_type,
        status: data.status,
        expiresAt: data.expires_at,
        daysRemaining: data.days_remaining,
        loading: false
      });
    } catch (error) {
      console.error('Pro status check failed:', error);
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
      const { data, error } = await supabase.functions.invoke('vip-trial-start');
      
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

      if (paymentMethod === 'BCA_MANUAL') {
        // Use Supabase function for Moota (BCA Manual)
        const { data, error } = await supabase.functions.invoke('moota-create-payment', {
          body: { subscriptionType, paymentMethod, userEmail, userName, phoneNumber, amount, currency }
        });
        
        if (error) throw error;
        return data;
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