import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface RealtimeNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export const useRealTimeNotifications = (user: User | null) => {
  const { toast } = useToast();

  const handleNotification = useCallback((payload: any) => {
    console.log('🔔 New real-time notification received:', payload);
    
    const notification = payload.new as RealtimeNotification;
    
    // OPTIMIZATION: Client-side filtering - only show notifications for current user
    if (!user || notification.user_id !== user.id) {
      console.log('🔔 Notification filtered out - not for current user');
      return;
    }
    
    // Show toast notification immediately
    toast({
      title: notification.title,
      description: notification.message,
      variant: getToastVariant(notification.type),
      duration: 15000,
    });
  }, [toast, user?.id]);

  useEffect(() => {
    if (!user) return;

    console.log('🔔 Setting up GLOBAL real-time notifications channel');

    // OPTIMIZATION: Use single global channel instead of per-user channels
    // This reduces from 128 individual channels to 1 shared channel
    // @ts-ignore - Lovable deployment compatibility
    const channel = supabase
      .channel('global-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
          // REMOVED: filter: `user_id=eq.${user.id}` - now handled client-side
        },
        handleNotification
      )
      .subscribe((status) => {
        console.log('🔔 Global real-time subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔔 Cleaning up global real-time notifications subscription');
      // @ts-ignore - Lovable deployment compatibility
      supabase.removeChannel(channel);
    };
  }, [user?.id, handleNotification]);
};

// Helper function to map notification type to toast variant
const getToastVariant = (type?: string): "default" | "destructive" => {
  switch (type) {
    case 'error':
      return 'destructive';
    case 'success':
    case 'info':
    case 'warning':
    default:
      return 'default';
  }
};