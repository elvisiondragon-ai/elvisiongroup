import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VIPStatus {
  isVip: boolean;
  subscriptionType: string | null;
  status: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  loading: boolean;
}

export function useVIP() {
  const [vipStatus, setVipStatus] = useState<VIPStatus>({
    isVip: false,
    subscriptionType: null,
    status: null,
    expiresAt: null,
    daysRemaining: null,
    loading: true
  });

  const checkVIPStatus = async () => {
    try {
      setVipStatus(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.functions.invoke('vip-status-check');
      
      if (error) throw error;
      
      setVipStatus({
        isVip: data.is_vip || false,
        subscriptionType: data.subscription_type,
        status: data.status,
        expiresAt: data.expires_at,
        daysRemaining: data.days_remaining,
        loading: false
      });
    } catch (error) {
      console.error('VIP status check failed:', error);
      setVipStatus({
        isVip: false,
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
        await checkVIPStatus(); // Refresh status
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Failed to start trial');
      }
    } catch (error) {
      console.error('Trial start failed:', error);
      throw error;
    }
  };

  const createPayment = async (subscriptionType: 'monthly' | 'yearly', paymentMethod: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: { subscriptionType, paymentMethod }
      });
      
      if (error) throw error;
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkVIPStatus();
  }, []);

  return {
    vipStatus,
    startTrial,
    createPayment,
    refreshStatus: checkVIPStatus
  };
}