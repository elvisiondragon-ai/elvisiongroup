import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, X, Star, Zap, Users, TrendingUp, Gift } from 'lucide-react';
import { usePro } from '@/hooks/usePro';

interface ProUpgradeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateToPayment: () => void;
  reason?: string;
  userStats?: {
    totalMeditations: number;
    daysActive: number;
    currentStreak: number;
  };
}

export function ProUpgradeModal({
  isVisible,
  onClose,
  onNavigateToPayment,
  reason = "unlock",
  userStats
}: ProUpgradeModalProps) {
  const { proStatus } = usePro();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
    }
  }, [isVisible]);

  if (!isVisible || proStatus.isPro) return null;

  const getReasonContent = () => {
    switch (reason) {
      case 'audio_preview':
        return {
          title: '🎵 Ingin Mendengar Selengkapnya?',
          description: 'Dapatkan akses penuh ke semua audio Premium tanpa batas',
          highlight: 'Preview audio berakhir - Upgrade untuk melanjutkan'
        };
      case 'analytics':
        return {
          title: '📊 Analytics Powerful Menunggu!',
          description: 'Buka insight mendalam tentang perkembangan spiritualmu',
          highlight: 'Laporan AI personal dari RENATA'
        };
      case 'live_session':
        return {
          title: '🔴 Live Session Eksklusif Pro',
          description: 'Bergabung dengan anggota Pro lainnya dalam sesi khusus',
          highlight: 'Session dimulai dalam 15 menit'
        };
      default:
        return {
          title: '✨ Waktunya Upgrade ke Pro!',
          description: 'Buka semua fitur premium dan konten eksklusif',
          highlight: 'Bergabung dengan 10,927+ anggota Pro'
        };
    }
  };

  const content = getReasonContent();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-sm max-h-[75vh] overflow-y-auto mx-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/25 ${showAnimation ? 'animate-in zoom-in-95 duration-300' : ''}`}>
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 text-purple-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
            {content.title}
          </CardTitle>

          <CardDescription className="text-purple-200 text-lg mt-2">
            {content.description}
          </CardDescription>

          <div className="mt-4 p-3 bg-purple-800/50 rounded-lg border border-purple-500/30">
            <p className="text-yellow-300 font-semibold text-sm">
              {content.highlight}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Stats Display */}
          {userStats && (
            <div className="space-y-3">
              <h4 className="text-purple-200 font-semibold text-center">Progress Kamu Saat Ini:</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-purple-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.totalMeditations}</div>
                  <div className="text-xs text-purple-300">Meditasi</div>
                </div>
                <div className="text-center p-3 bg-purple-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.daysActive}</div>
                  <div className="text-xs text-purple-300">Hari Aktif</div>
                </div>
                <div className="text-center p-3 bg-purple-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.currentStreak}</div>
                  <div className="text-xs text-purple-300">Streak</div>
                </div>
              </div>
              <p className="text-center text-purple-200 text-sm">
                <strong>Anggota Pro rata-rata:</strong> 45x lebih banyak insight & kemajuan!
              </p>
            </div>
          )}

          {/* Pro Benefits */}
          <div className="space-y-3">
            <h4 className="text-purple-200 font-semibold">Yang Kamu Dapatkan:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-purple-100">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Akses ke Verse Pro dan powerful</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">AI Analytics dari RENATA</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <Users className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Live Sessions eksklusif</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Laporan kemajuan spiritual</span>
              </div>
            </div>
          </div>

          {/* Limited Time Offer */}
          <div className="p-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-orange-300 mb-2">
              <Gift className="w-4 h-4" />
              <span className="font-semibold text-sm">Penawaran Terbatas!</span>
            </div>
            <p className="text-orange-200 text-sm">
              Dapatkan <strong>30% diskon</strong> untuk berlangganan Tahunan
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onNavigateToPayment}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 text-lg shadow-lg shadow-orange-500/25"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade ke Pro Sekarang
            </Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}