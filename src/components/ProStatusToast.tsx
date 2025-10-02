import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Component that handles pro status notifications independently  
export const ProStatusNotifications = () => {
  const { toast } = useToast();

  // Pro status change notification (persistent like deploy notification)
  useEffect(() => {
    const proStatusChange = localStorage.getItem('pro-status-change');
    if (proStatusChange) {
      const { type } = JSON.parse(proStatusChange);
      
      const showProNotification = () => {
        if (type === 'cancelled') {
          toast({
            title: "⚠️ Status Pro Berakhir!",
            description: "Status Pro anda Telah habis, Klik disini untuk Refresh",
            action: (
              <button 
                onClick={() => {
                  localStorage.removeItem('pro-status-change');
                  localStorage.removeItem('unified_pro_status_cache');
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Refresh Sekarang
              </button>
            ),
            duration: 0, // Never disappear
          });
        } else if (type === 'granted') {
          toast({
            title: "🎉 Status Pro Aktif!",
            description: "Status Pro anda telah aktif, Klik disini untuk Refresh dan Akses Pro",
            action: (
              <button 
                onClick={() => {
                  localStorage.removeItem('pro-status-change');
                  localStorage.removeItem('unified_pro_status_cache');
                  window.location.reload();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                🔄 Refresh dan Akses Pro!
              </button>
            ),
            duration: 0, // Never disappear
          });
        }
      };
      
      showProNotification();
    }
  }, [toast]);

  return null; // This component only handles notifications, no UI
};