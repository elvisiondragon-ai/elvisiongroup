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
    
    // Show toast notification immediately
    toast({
      title: notification.title,
      description: notification.message,
      variant: getToastVariant(notification.type),
      duration: notification.type === 'error' ? 8000 : 5000,
    });
  }, [toast]);

  useEffect(() => {
    if (!user) return;

    console.log('🔔 Setting up real-time notifications for user:', user.id);

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        handleNotification
      )
      .subscribe((status) => {
        console.log('🔔 Real-time subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔔 Cleaning up real-time notifications subscription');
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