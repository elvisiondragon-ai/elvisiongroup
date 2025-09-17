import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Music, Target, Brain, BookOpen, Zap, Crown, Sparkles, Users, TrendingUp } from 'lucide-react';

interface FreeUserNotificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (action: string) => void;
  reason: string;
  notificationData?: {
    title: string;
    description: string;
    buttonText: string;
    action: string;
  };
}

export function FreeUserNotificationModal({
  isVisible,
  onClose,
  onNavigate,
  reason,
  notificationData
}: FreeUserNotificationModalProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getReasonContent = () => {
    switch (reason) {
      case 'pengalaman-anggota':
        return {
          title: '🎵 Pengalaman Anggota',
          description: 'Dengarkan testimoni spiritual dari member',
          highlight: 'Audio testimoni gratis',
          icon: Music,
          iconColor: 'text-purple-400',
          gradientFrom: 'from-purple-500/20',
          gradientTo: 'to-indigo-500/20',
          borderColor: 'border-purple-500/50',
          buttonText: 'Dengar Sekarang',
          buttonGradient: 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
        };
      case 'tujuan-kami':
        return {
          title: '🎯 Tujuan Kami',
          description: 'Visi dan misi spiritual eL Vision Group',
          highlight: 'Rahasia transformasi spiritual',
          icon: Target,
          iconColor: 'text-blue-400',
          gradientFrom: 'from-blue-500/20',
          gradientTo: 'to-cyan-500/20',
          borderColor: 'border-blue-500/50',
          buttonText: 'Lihat Tujuan',
          buttonGradient: 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        };
      case 'personal-analytics':
        return {
          title: '🚀 Analytics Powerful Menunggu',
          description: 'Buka insight mendalam tentang perkembangan spiritualmu',
          highlight: 'Laporan AI personal dari RENATA',
          icon: Brain,
          iconColor: 'text-emerald-400',
          gradientFrom: 'from-emerald-500/20',
          gradientTo: 'to-green-500/20',
          borderColor: 'border-emerald-500/50',
          buttonText: 'Analisis Sekarang',
          buttonGradient: 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
        };
      case 'tutorial':
        return {
          title: '📖 Tutorial Aplikasi',
          description: 'Panduan memaksimalkan potensi spiritual',
          highlight: 'Tips manifestasi powerful',
          icon: BookOpen,
          iconColor: 'text-amber-400',
          gradientFrom: 'from-amber-500/20',
          gradientTo: 'to-yellow-500/20',
          borderColor: 'border-amber-500/50',
          buttonText: 'Pelajari Sekarang',
          buttonGradient: 'from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700'
        };
      case 'hall-of-energy':
        return {
          title: '⚡ Hall of Energy',
          description: 'Masuki pusat energi spiritual dan rasakan transformasi yang luar biasa',
          highlight: 'Energi Ignis Memory menunggu Anda',
          icon: Zap,
          iconColor: 'text-yellow-400',
          gradientFrom: 'from-yellow-500/20',
          gradientTo: 'to-orange-500/20',
          borderColor: 'border-yellow-500/50',
          buttonText: 'Masuki Hall',
          buttonGradient: 'from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
        };
      case 'upgrade-pro':
        return {
          title: '🌟 Upgrade ke Pro',
          description: 'Fitur premium untuk spiritual lebih dalam',
          highlight: 'Diskon 30% OFF hari ini',
          icon: Crown,
          iconColor: 'text-pink-400',
          gradientFrom: 'from-pink-500/20',
          gradientTo: 'to-rose-500/20',
          borderColor: 'border-pink-500/50',
          buttonText: 'Upgrade Sekarang',
          buttonGradient: 'from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
        };
      default:
        return {
          title: '✨ Jelajahi eL Vision',
          description: 'Temukan fitur spiritual yang akan mengubah hidup Anda',
          highlight: 'Gratis untuk semua anggota',
          icon: Sparkles,
          iconColor: 'text-purple-400',
          gradientFrom: 'from-purple-500/20',
          gradientTo: 'to-indigo-500/20',
          borderColor: 'border-purple-500/50',
          buttonText: 'Jelajahi',
          buttonGradient: 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
        };
    }
  };

  const content = getReasonContent();
  const IconComponent = content.icon;

  const handleActionClick = () => {
    onClose();
    onNavigate(reason);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center pt-[5vh] pb-0 px-4">
      <Card className={`
        w-full max-w-sm max-h-[95vh] overflow-y-auto mx-auto bg-gradient-to-br ${content.gradientFrom} via-slate-900 ${content.gradientTo}
        border-2 ${content.borderColor} shadow-2xl shadow-purple-500/25
        ${showAnimation ? 'animate-in zoom-in-95 duration-500' : ''}
      `}>
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${content.buttonGradient} flex items-center justify-center shadow-lg`}>
            <IconComponent className={`w-10 h-10 text-white`} />
          </div>

          <CardTitle className={`text-2xl font-bold text-transparent bg-gradient-to-r ${content.buttonGradient} bg-clip-text`}>
            {content.title}
          </CardTitle>

          <CardDescription className="text-gray-300 text-lg mt-3 leading-relaxed">
            {content.description}
          </CardDescription>

          <div className={`mt-4 p-4 bg-gradient-to-r ${content.gradientFrom} ${content.gradientTo} rounded-lg border ${content.borderColor}`}>
            <p className={`${content.iconColor} font-semibold text-sm flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4" />
              {content.highlight}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Benefits for this feature */}
          <div className="space-y-3">
            <h4 className="text-gray-200 font-semibold">Yang Anda Dapatkan:</h4>
            <div className="space-y-2">
              {reason === 'pengalaman-anggota' && (
                <>
                  <div className="flex items-center gap-3 text-gray-100">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Testimoni autentik dari 1,200+ member</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-100">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Inspirasi perubahan hidup nyata</span>
                  </div>
                </>
              )}
              {reason === 'personal-analytics' && (
                <>
                  <div className="flex items-center gap-3 text-gray-100">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">Analisis AI personal dari RENATA</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-100">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">Insight mendalam progress spiritual</span>
                  </div>
                </>
              )}
              {reason === 'upgrade-pro' && (
                <>
                  <div className="flex items-center gap-3 text-gray-100">
                    <Crown className="w-4 h-4 text-pink-400" />
                    <span className="text-sm">Akses semua 10 Verses Premium</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-100">
                    <Zap className="w-4 h-4 text-pink-400" />
                    <span className="text-sm">Live Sessions eksklusif Pro</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-100">
                    <TrendingUp className="w-4 h-4 text-pink-400" />
                    <span className="text-sm">Analytics unlimited + AI insights</span>
                  </div>
                </>
              )}
              {(reason === 'tujuan-kami' || reason === 'tutorial' || reason === 'hall-of-energy') && (
                <>
                  <div className="flex items-center gap-3 text-gray-100">
                    <Sparkles className={`w-4 h-4 ${content.iconColor}`} />
                    <span className="text-sm">Konten eksklusif dan gratis</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-100">
                    <TrendingUp className={`w-4 h-4 ${content.iconColor}`} />
                    <span className="text-sm">Panduan spiritual teruji</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Free User Encouragement */}
          <div className="p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-sm">Member Gratis Istimewa!</span>
            </div>
            <p className="text-cyan-200 text-sm">
              Anda mendapat akses <strong>gratis</strong> ke fitur ini sebagai apresiasi kami untuk member setia
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleActionClick}
              className={`w-full bg-gradient-to-r ${content.buttonGradient} text-white font-bold py-3 text-lg shadow-lg hover:scale-105 transition-transform duration-200`}
            >
              <IconComponent className="w-5 h-5 mr-2" />
              {content.buttonText}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/30 hover:text-white"
            >
              Nanti Saja
            </Button>
          </div>
        </CardContent>

        {/* Floating Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-400/20 rounded-full animate-ping" />
        <div className="absolute -top-6 -right-6 w-6 h-6 bg-cyan-400/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-4 -left-6 w-4 h-4 bg-emerald-400/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-6 -right-4 w-10 h-10 bg-pink-400/20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
      </Card>
    </div>
  );
}