import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff } from 'lucide-react';

interface NotificationSettingsData {
  chat_notifications_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsData>({
    chat_notifications_enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { isRegistered, permissionStatus, registerForNotifications } = usePushNotifications();

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification settings:', error);
        return;
      }

      if (data) {
        setSettings({
          chat_notifications_enabled: data.chat_notifications_enabled,
          quiet_hours_start: data.quiet_hours_start,
          quiet_hours_end: data.quiet_hours_end
        });
      }
    } catch (error) {
      console.error('Error in fetchNotificationSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettingsData) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving notification settings:', error);
        toast.error('Gagal menyimpan pengaturan notifikasi');
      } else {
        setSettings(newSettings);
        toast.success('Pengaturan notifikasi berhasil disimpan');
      }
    } catch (error) {
      console.error('Error in saveSettings:', error);
      toast.error('Terjadi kesalahan saat menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleChatNotificationToggle = async (enabled: boolean) => {
    await saveSettings({
      ...settings,
      chat_notifications_enabled: enabled
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pengaturan Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            Memuat pengaturan...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Pengaturan Notifikasi
        </CardTitle>
        <CardDescription>
          Kelola preferensi notifikasi Anda untuk tetap terhubung dengan komunitas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notification Registration */}
        {!isRegistered && permissionStatus !== 'denied' && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <BellOff className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Notifikasi Push Belum Aktif</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Aktifkan notifikasi push untuk mendapatkan pemberitahuan pesan baru di komunitas
            </p>
            <Button 
              onClick={registerForNotifications}
              size="sm"
              className="w-full"
            >
              Aktifkan Notifikasi Push
            </Button>
          </div>
        )}

        {permissionStatus === 'denied' && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <BellOff className="w-5 h-5" />
              <span className="font-medium">Notifikasi Diblokir</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">
              Notifikasi telah diblokir. Silakan aktifkan di pengaturan perangkat Anda.
            </p>
          </div>
        )}

        {isRegistered && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <Bell className="w-5 h-5" />
              <span className="font-medium">Notifikasi Push Aktif</span>
            </div>
            <p className="text-sm text-primary/80 mt-1">
              Anda akan menerima notifikasi untuk pesan baru di komunitas
            </p>
          </div>
        )}

        {/* Chat Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="chat-notifications" className="text-base font-medium">
              Notifikasi Chat Komunitas
            </Label>
            <p className="text-sm text-muted-foreground">
              Terima notifikasi saat ada pesan baru di komunitas
            </p>
          </div>
          <Switch
            id="chat-notifications"
            checked={settings.chat_notifications_enabled}
            onCheckedChange={handleChatNotificationToggle}
            disabled={saving}
          />
        </div>

        {saving && (
          <div className="text-center py-2">
            <span className="text-sm text-muted-foreground">Menyimpan...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}