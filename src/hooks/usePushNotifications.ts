import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const usePushNotifications = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'prompt-with-rationale'>('prompt');
  
  // OPTIMIZATION: Use cached user from AuthContext instead of making auth calls
  const { user } = useAuth();

  const registerForNotifications = async () => {
    try {
      // Check if we're on a native platform
      if (!Capacitor.isNativePlatform()) {
        console.log('Push notifications only available on native platforms');
        return;
      }

      // Request permission
      const permission = await PushNotifications.requestPermissions();
      setPermissionStatus(permission.receive);

      if (permission.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();
        console.log('Registered for push notifications');
      } else {
        console.log('Push notification permission denied');
        toast.error('Izin notifikasi diperlukan untuk mendapatkan pemberitahuan chat');
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      toast.error('Gagal mendaftar notifikasi push');
    }
  };

  const saveDeviceToken = async (token: string) => {
    try {
      // OPTIMIZATION: Use cached user from AuthContext instead of auth.getUser() call
      if (!user) {
        console.log('No authenticated user found in context');
        return;
      }

      const platform = Capacitor.getPlatform();
      
      // Save the device token to the database
      const { error } = await supabase
        .from('device_tokens')
        .upsert({
          user_id: user.id,
          token,
          platform,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,token'
        });

      if (error) {
        console.error('Error saving device token:', error);
      } else {
        console.log('Device token saved successfully');
        setIsRegistered(true);

        // Also create notification settings if they don't exist
        await supabase
          .from('notification_settings')
          .upsert({
            user_id: user.id,
            chat_notifications_enabled: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
      }
    } catch (error) {
      console.error('Error in saveDeviceToken:', error);
    }
  };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Add listeners for push notification events
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token:', token.value);
      saveDeviceToken(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration:', error);
      toast.error('Gagal mendaftar untuk notifikasi push');
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
      
      // Show a toast for foreground notifications
      toast.info(notification.title || 'Pesan baru', {
        description: notification.body,
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed:', notification);
      
      // Handle notification tap - could navigate to chat screen
      const data = notification.notification.data;
      if (data?.type === 'chat_message') {
        // Navigate to chat (you might want to use a navigation context here)
        console.log('Should navigate to chat for message:', data.message_id);
      }
    });

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);

  return {
    isRegistered,
    permissionStatus,
    registerForNotifications
  };
};