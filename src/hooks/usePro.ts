
// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProStatus {
  isPro: boolean;
  subscriptionType: string | null;
  status: string | null;
  expiresAt: string | null;
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

  // TRIAL REMOVED FOR SECURITY - NO FREE PRO ACCESS
  const startTrial = async () => {
    throw new Error('Trial functionality has been disabled for security. Please purchase a subscription.');
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
      
      // FIXED: Clear cache and refresh status after payment creation
      localStorage.removeItem(CACHE_KEY);
      await checkProStatus();
      
      return data;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkProStatus();
  }, []);

  // REAL-TIME LISTENER: Listen for payment success AND admin changes
  useEffect(() => {
    let subscription: any = null;
    
    const setupRealtimeListener = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Listen for ALL pro_subscriptions changes (payment success + admin grants/cancels)
      subscription = supabase
        .channel('pro_status_changes')
        .on('postgres_changes', {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'pro_subscriptions',
          filter: `user_id=eq.${user.id}`
        }, async (payload) => {
          console.log('🔄 Pro status change detected:', payload);
          
          // Clear cache and refresh pro status
          localStorage.removeItem(CACHE_KEY);
          await checkProStatus();
          
          if (payload.eventType === 'DELETE' || payload.new?.status === 'expired') {
            // Pro CANCELLED - Set persistent notification
            localStorage.setItem('pro-status-change', JSON.stringify({
              type: 'cancelled',
              timestamp: Date.now()
            }));
          } else if (payload.eventType === 'INSERT' && payload.new?.status === 'active') {
            // Set persistent notification for Pro granted
            localStorage.setItem('pro-status-change', JSON.stringify({
              type: 'granted', 
              timestamp: Date.now()
            }));
            console.log('🎉 Payment success detected:', payload);
            
            // Show success notification with email check message
            const subscriptionData = payload.new;
            const subscriptionType = subscriptionData.subscription_type;
            const duration = subscriptionType === '1_year' ? '1 Tahun' : 
                            subscriptionType === '1_month' ? '1 Bulan' : 
                            subscriptionType === '1_week' ? '1 Minggu' : 
                            subscriptionType === '1_day' ? '1 Hari' : 'PRO';
            
            // You can use your toast system here
            if (window.showToast) {
              window.showToast({
                title: "🎉 Pembayaran Berhasil!",
                description: `Status PRO ${duration} Anda telah aktif. Silahkan cek email Anda untuk konfirmasi.`,
                type: "success",
                duration: 7000,
                className: "text-xl p-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 border-purple-500/30 shadow-2xl shadow-purple-500/25 ring-2 ring-purple-400/20"
              });
            } else {
              // Enhanced fallback notification with purple styling
              const modal = document.createElement('div');
              modal.innerHTML = `
                <div style="position: fixed: top: 20px; right: 20px; z-index: 10000; max-width: 400px;">
                  <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%); padding: 25px; border-radius: 15px; box-shadow: 0 20px 60px rgba(139, 92, 246, 0.4); border: 2px solid rgba(139, 92, 246, 0.3); animation: slideInRight 0.5s ease-out;">
                    <div style="color: #8b5cf6; font-size: 1.5rem; font-weight: bold; margin-bottom: 8px;">🎉 Pembayaran Berhasil!</div>
                    <div style="color: #c4b5fd; font-size: 1rem; line-height: 1.5;">Status PRO ${duration} Anda telah aktif. Silahkan cek email Anda untuk konfirmasi.</div>
                  </div>
                </div>
                <style>
                  @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                  }
                </style>
              `;
              document.body.appendChild(modal);
              setTimeout(() => document.body.removeChild(modal), 7000);
            }
          }
        })
        .subscribe();
    };

    setupRealtimeListener();

    // Cleanup listener on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return {
    proStatus,
    startTrial,
    createPayment,
    refreshStatus: checkProStatus
  };
}
