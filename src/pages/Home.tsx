import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/TierBadge";
import { XPRules } from "@/components/XPRules";
import { StreakIndicator } from "@/components/StreakIndicator";
import { CacheDebugPanel } from "@/components/CacheDebugPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useXPSystem } from "@/hooks/useXPSystem";
import { usePro } from "@/hooks/usePro";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAudioCache } from "@/hooks/useAudioCache";
import { cacheManager, CacheKeys } from "@/utils/cacheManager";
import { Play, Headphones, BookOpen, Zap, Target, Lock, Sparkles, Flame } from "lucide-react";
import heroImage from "@/assets/hero-meditation.jpg";

interface HomeProps {
  onNavigate: (tab: string) => void;
}

interface UserProfile {
  display_name: string | null;
  level: number;
  experience_points: number;
  streak_days: number;
  total_verses: number;
  total_journal: number;
}

export function Home({
  onNavigate
}: HomeProps) {
  const { t } = useTranslation();
  const { userProfile, user } = useUserProfile();
  const [onlineCount, setOnlineCount] = useState(825); // Base count of 825
  const { calculateXPProgress } = useXPSystem();
  const { proStatus } = usePro();
  const { preloadAudioFiles, getCacheStats } = useAudioCache();
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showCacheModal, setShowCacheModal] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [showCachePlayButton, setShowCachePlayButton] = useState(true);

  // Preload audio files for better performance
  useEffect(() => {
    const audioFiles = [
      'Verse1 - Calm Clarity.MP3',
      'Verse2 - Lucid Beach.MP3',
      'Verse 3 - Syukur.MP3',
      'Verse 4 - Prosperity Stream Vol. 1.MP3',
      'Verse4-English.MP3',
      'Verse5 - Virtality Vortex.MP3'
    ];
    
    // Preload audio files in background for offline access
    preloadAudioFiles(audioFiles);
  }, [preloadAudioFiles]);

  // Consolidated presence tracking - single channel for both listening and tracking
  useEffect(() => {
    if (!user) return;

    // Skip realtime in development environments that don't support WebSocket
    const isDevelopment = window.location.hostname.includes('sandbox') || window.location.hostname.includes('localhost');
    
    try {
      const channel = supabase.channel('online_users');
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState();
          const onlineUsers = Object.keys(presenceState).length;
          setOnlineCount(825 + onlineUsers); // Base 825 + actual online users
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('User joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('User left:', leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // Track current user's presence
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString()
            });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      // Fallback for environments without WebSocket support (like Lovable sandbox)
      console.log('WebSocket not available, using fallback online count');
      setOnlineCount(825); // Just use base count
    }
  }, [user]);


  const displayName = userProfile?.display_name || user?.email?.split('@')[0] || "User";

  // Calculate XP progress using the XP system
  const xpProgress = userProfile ? calculateXPProgress(userProfile.experience_points, userProfile.level) : {
    currentLevelXP: 0,
    xpForNextLevel: 100,
    progress: 0
  };

  const features = [{
    title: t('home.meditationSessions'),
    description: "Guided meditation sessions",
    icon: Play,
    color: "text-primary",
    key: "meditation-sessions",
    isLocked: true
  }, {
    title: t('Verse of eL Vision'),
    description: "Spiritual frequency healing",
    icon: Sparkles,
    color: "text-yellow-500",
    key: "audio-therapy"
  }, {
    title: t('home.spiritualJournal'),
    description: "Track your transformation journey",
    icon: BookOpen,
    color: "text-gold",
    key: "spiritual-journal"
  }, {
    title: "Community",
    description: "Join the soul tribe",
    icon: Zap,
    color: "text-neon-green",
    key: "chat"
  }, {
    title: "Ignis Quest",
    description: "Quest ini berisi langkah-langkah dan strategi untuk meraih harta, tahta, dan cinta, membawamu dari impian ke pencapaian nyata.",
    icon: Flame,
    color: "text-orange-500",
    key: "ignis-quest",
    isNew: true
  }];

  const tutorialFeature = {
    title: "Cara Menggunakan Aplikasi - FINAL TEST v6",
    description: "Tutorial lengkap cara menggunakan semua fitur aplikasi eL Vision Group",
    icon: Play,
    color: "text-blue-500",
    key: "tutorial"
  };

  return <div className="pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="h-64 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/bg-website.png)`
      }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <div className="relative h-full flex items-end p-6">
            <div className="flex items-center gap-4">
              <img src="/lovable-uploads/fbd7b86c-d8ea-447e-87ad-d67254074e61.png" alt="eL Vision Group Logo" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
                  Ecosystem
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    eL Vision Group
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  {t('Self-Transformation Through Spiritual Technology')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="p-6">
        <Card className="p-4 bg-gradient-secondary border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="mb-2">
                <TierBadge level={userProfile?.level || 1} isPro={proStatus.isPro} achievements={userProfile?.achievements || []} />
                <h3 className="font-semibold text-foreground mt-1">{displayName}</h3>
              </div>
              <StreakIndicator streakDays={userProfile?.streak_days || 0} size="sm" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-orbitron text-primary">
                {userProfile?.experience_points || 0} XP
              </div>
              <div className="text-xs text-muted-foreground">
                {xpProgress.xpForNextLevel - xpProgress.currentLevelXP} XP to next level
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {userProfile?.level || 1} Progress</span>
              <span>{Math.round(xpProgress.progress)}%</span>
            </div>
            <Progress value={xpProgress.progress} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 space-y-4">
        <h2 className="text-xl font-semibold font-orbitron">Explore</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
          const isLocked = feature.isLocked;
          const isIgnisQuest = feature.key === 'ignis-quest';
          const isIgnisLocked = isIgnisQuest && !proStatus.isPro;
          const actuallyLocked = isLocked || isIgnisLocked;
          return <Card key={index} className={`p-4 border-border transition-all duration-300 relative ${actuallyLocked ? 'bg-card/50 cursor-not-allowed' : 'bg-card hover:bg-card/80 hover:border-primary cursor-pointer'} ${feature.isNew ? 'relative' : ''} ${isIgnisQuest ? 'col-span-2' : ''}`} onClick={() => {
            if (actuallyLocked) {
              if (isIgnisLocked) {
                onNavigate("payment"); // Navigate to payment/upgrade page
                return;
              }
              return; // Do nothing if locked
            }
            console.log("Feature clicked:", feature.key);
            onNavigate(feature.key);
          }}>
                {feature.isNew}
                
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full relative ${
                    feature.key === 'audio-therapy' 
                      ? 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400 shadow-lg shadow-yellow-500/30' 
                    : feature.key === 'ignis-quest'
                      ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-lg shadow-orange-500/50'
                      : 'bg-muted'
                  } ${feature.color}`}>
                    <feature.icon className={`w-6 h-6 ${
                      feature.key === 'audio-therapy' ? 'text-white animate-pulse' 
                      : feature.key === 'ignis-quest' ? 'text-white animate-pulse'
                      : ''
                    }`} />
                    {isLocked && <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>}
                    {isIgnisLocked && <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-yellow-400" />
                      </div>}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                    {isLocked && <div className="text-xs font-medium text-muted-foreground mt-2">
                        Locked
                      </div>}
                  </div>
                </div>
              </Card>;
        })}
        </div>

        {/* Tutorial Button */}
        <Card 
          className="p-6 border-border transition-all duration-300 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/10 hover:to-pink-500/20 border-indigo-500/20 hover:border-indigo-400/40 cursor-pointer col-span-2 relative overflow-hidden group"
          onClick={() => setShowTutorialModal(true)}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
              <div className="relative p-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-110 transition-all duration-300">
                <tutorialFeature.icon className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-indigo-300 transition-colors duration-300">
                {tutorialFeature.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-indigo-200/80 transition-colors duration-300 leading-relaxed">
                {tutorialFeature.description}
              </p>
              
              {/* Call to action indicator */}
              <div className="flex items-center justify-center gap-2 mt-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <span className="text-xs font-medium text-indigo-300 uppercase tracking-wide">Tap to Watch</span>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
        </Card>

        {/* Cache Clearing Tutorial */}
        <Card 
          className="p-6 border-border transition-all duration-300 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10 hover:from-red-500/20 hover:via-orange-500/10 hover:to-yellow-500/20 border-red-500/20 hover:border-red-400/40 cursor-pointer col-span-2 relative overflow-hidden group"
          onClick={() => setShowCacheModal(true)}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-orange-600/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Icon container with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
              <div className="relative p-4 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 shadow-2xl shadow-red-500/30 group-hover:shadow-red-500/50 group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-red-300 transition-colors duration-300">
                Cara Bersihkan Error
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-red-200/80 transition-colors duration-300 leading-relaxed">
                Tutorial lengkap cara membersihkan cache dan error pada aplikasi eL Vision Group
              </p>
              
              {/* Call to action indicator */}
              <div className="flex items-center justify-center gap-2 mt-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                <span className="text-xs font-medium text-red-300 uppercase tracking-wide">Tap to Watch</span>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
        </Card>
        
        {/* XP Motivation & Weekly Challenge */}
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-primary/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-orbitron">
                ⚡ Dapatkan EXP Sebanyak Mungkin! ⚡
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Beraktivitas di Ecosystem eL Vision, Perbaiki Frekuensimu. 
                <br />
                <span className="text-primary font-medium">EXP mu disini akan menjadi alat ukur mempermudah keberhasilan dunia nyata mu</span>
              </p>
            </div>

            {/* Weekly Challenge */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-semibold text-orange-300">WEEKLY CHALLENGE</span>
                <Target className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm font-medium text-orange-200 mb-2">
                🔥 BONUS RAJIN AKTIF EXP MINGGUAN 🔥
              </p>
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                +50 EXP 🏆
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tetap aktif setiap hari untuk bonus mingguan!
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Community Preview */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-orbitron">Active Community</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("chat")} className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
        
        <Card className="p-4 bg-gradient-secondary border-border">
          <div className="text-center">
            
            <p className="text-sm text-muted-foreground mb-4">
              Members online now
            </p>
            <Button onClick={() => onNavigate("chat")} className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium">
              Join Chat
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Tutorial Video Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold font-orbitron">Cara Menggunakan Aplikasi</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowTutorialModal(false);
                  setShowPlayButton(true);
                }}
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="relative">
                <video 
                  className="w-full rounded-lg"
                  controls={!showPlayButton}
                  preload="metadata"
                  onPlay={() => setShowPlayButton(false)}
                  style={{ aspectRatio: '9/16', maxHeight: '70vh' }}
                >
                  <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/reactmove.mp4" type="video/mp4" />
                  Browser Anda tidak mendukung video HTML5.
                </video>
                
                {/* Overlay Play Button */}
                {showPlayButton && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={(e) => {
                      const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                      video.play();
                      setShowPlayButton(false);
                    }}
                  >
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 group-hover:bg-black/70 transition-all duration-300">
                      <Play className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cache Clearing Video Modal */}
      {showCacheModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold font-orbitron">Cara Bersihkan Error Cache</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowCacheModal(false);
                  setShowCachePlayButton(true);
                }}
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="relative">
                <video 
                  className="w-full rounded-lg"
                  controls={!showCachePlayButton}
                  preload="metadata"
                  onPlay={() => setShowCachePlayButton(false)}
                  style={{ aspectRatio: '9/16', maxHeight: '70vh' }}
                >
                  <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/caches.mp4" type="video/mp4" />
                  Browser Anda tidak mendukung video HTML5.
                </video>
                
                {/* Overlay Play Button */}
                {showCachePlayButton && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={(e) => {
                      const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                      video.play();
                      setShowCachePlayButton(false);
                    }}
                  >
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 group-hover:bg-black/70 transition-all duration-300">
                      <Play className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cache Debug Panel */}
      <CacheDebugPanel />
    </div>;
}
