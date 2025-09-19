import { useState, useEffect } from 'react';
import { Crown, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProUpgradeNotificationProps {
  onUpgradeClick: () => void;
}

export function ProUpgradeNotification({ onUpgradeClick }: ProUpgradeNotificationProps) {
  const { user, proStatus } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showAfterDelay, setShowAfterDelay] = useState(false);

  // Debug logging
  console.log('🔍 ProUpgradeNotification - user:', !!user, 'isPro:', proStatus?.isPro);

  // Set 30-second delay before showing notification for non-Pro users
  useEffect(() => {
    if (user && !proStatus?.isPro) {
      console.log('⏰ Starting 30-second delay for Pro notification');
      const timer = setTimeout(() => {
        console.log('✅ 30 seconds passed, showing Pro notification');
        setShowAfterDelay(true);
      }, 30 * 1000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [user, proStatus?.isPro]);

  // Hide notification if user is not logged in OR if user is already Pro OR if delay hasn't passed
  if (!user || proStatus?.isPro || !showAfterDelay) return null;

  // If completely hidden, don't render anything
  if (isHidden) return null;

  if (isMinimized) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm">
        <div className="flex items-center justify-center py-1 px-4">
          <button
            onClick={() => {
              console.log('🔼 ProUpgradeNotification - Expand clicked');
              setIsMinimized(false);
            }}
            className="flex items-center gap-1 text-white/90 hover:text-white active:text-white/70 transition-all duration-200 hover:scale-105 active:scale-95 transform"
          >
            <Crown className="w-3 h-3 animate-pulse" />
            <span className="text-xs font-medium">Pro</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-purple-600/95 to-pink-600/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-white/20 rounded-full p-1">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              Unlock Pro untuk Pengalaman Penuh
            </p>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span className="text-white/80 text-xs">Akses semua fitur premium</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🚀 ProUpgradeNotification - Upgrade button clicked!');
              console.log('🚀 Calling onUpgradeClick function...');
              onUpgradeClick();
            }}
            style={{
              cursor: 'pointer',
              zIndex: 50,
              pointerEvents: 'all'
            }}
            className="bg-white/20 hover:bg-white/30 active:bg-white/40 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 border border-white/20 shadow-lg hover:shadow-xl active:shadow-md transform"
          >
            Upgrade Pro
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('❌ ProUpgradeNotification - Hide clicked, will return in 10 seconds');
              setIsHidden(true);
              // Return after 10 seconds
              setTimeout(() => {
                console.log('🔄 ProUpgradeNotification - Returning after 10 seconds');
                setIsHidden(false);
                setIsMinimized(false);
              }, 10000);
            }}
            style={{
              cursor: 'pointer',
              zIndex: 50,
              pointerEvents: 'all'
            }}
            className="text-white/70 hover:text-white active:text-white/50 transition-all duration-200 p-2 hover:scale-110 active:scale-90 transform min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

        {/* Subtle animation effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      </div>
    </>
  );
}