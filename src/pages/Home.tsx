import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/TierBadge";
import { XPRules } from "@/components/XPRules";
import { StreakIndicator } from "@/components/StreakIndicator";
import { CacheDebugPanel } from "@/components/CacheDebugPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Testimonials } from "@/components/testimonials";
import { supabase } from "@/integrations/supabase/client";
import { useXPSystem } from "@/hooks/useXPSystem";
import { usePro } from "@/hooks/usePro";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAudioCache } from "@/hooks/useAudioCache";
import { useToast } from "@/hooks/use-toast";
import { cacheManager, CacheKeys } from "@/utils/cacheManager";
import { getCachedMediaUrl, preloadAndCacheMedia } from "@/utils/mediaCache";
import { Play, Headphones, BookOpen, Zap, Target, Lock, Sparkles, Flame, Video, Image as ImageIcon, X, ChevronLeft, ChevronRight, Radio, Scroll, Users, BarChart3, Activity, Heart, Smile, Apple, Gem, HelpCircle, Crown, CircleUser, Sun } from "lucide-react";
import { AdminBadge } from "@/components/AdminBadge";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-meditation.jpg";
import faviconImage from "@/assets/favicon.png";

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
  const { toast } = useToast();
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: 'video' | 'image', title: string} | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showIndividualVideoModal, setShowIndividualVideoModal] = useState(false);
  const [individualVideo, setIndividualVideo] = useState<{url: string, title: string} | null>(null);
  const [showImageGalleryModal, setShowImageGalleryModal] = useState(false);
  const [cachedMediaUrls, setCachedMediaUrls] = useState<Map<string, string>>(new Map());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const testimonialsRef = useRef<HTMLDivElement>(null);

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

  // Video control system - only one video can play at a time
  useEffect(() => {
    const handleVideoPlay = (playingIndex: number) => {
      // Pause all other videos when one starts playing
      videoRefs.current.forEach((video, index) => {
        if (video && index !== playingIndex && !video.paused) {
          video.pause();
        }
      });
    };

    // Add play event listeners to all video elements
    videoRefs.current.forEach((video, index) => {
      if (video) {
        const playHandler = () => handleVideoPlay(index);
        video.addEventListener('play', playHandler);
        
        // Store the handler for cleanup
        (video as any)._playHandler = playHandler;
      }
    });

    // Cleanup function
    return () => {
      videoRefs.current.forEach((video) => {
        if (video && (video as any)._playHandler) {
          video.removeEventListener('play', (video as any)._playHandler);
          delete (video as any)._playHandler;
        }
      });
    };
  }, [selectedMedia]); // Re-run when media modal opens/closes

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

  // Check for scroll to testimonials flag from notification
  useEffect(() => {
    const shouldScrollToTestimonials = localStorage.getItem('scrollToTestimonials');
    if (shouldScrollToTestimonials === 'true' && testimonialsRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        testimonialsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        localStorage.removeItem('scrollToTestimonials'); // Clear the flag
      }, 500);
    }
  }, []);

  // Listen for Vio video open event from notification
  useEffect(() => {
    const handleOpenVioVideo = () => {
      setIndividualVideo({
        url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4",
        title: "Pengalaman Vio"
      });
      setShowIndividualVideoModal(true);
    };

    window.addEventListener('openVioVideo', handleOpenVioVideo);

    return () => {
      window.removeEventListener('openVioVideo', handleOpenVioVideo);
    };
  }, []);

  const displayName = userProfile?.display_name || user?.email?.split('@')[0] || "User";
  const isAdmin = user?.id === '3da83afb-aa8c-4c55-b3b0-8aa64000205f';

  // Calculate XP progress using the XP system
  const xpProgress = userProfile ? calculateXPProgress(userProfile.experience_points, userProfile.level) : {
    currentLevelXP: 0,
    xpForNextLevel: 100,
    progress: 0
  };

  const features = [{
    title: "Sesi Meditasi",
    description: "Weekly live meditation sessions",
    icon: Radio,
    color: "text-red-500",
    key: "meditation-sessions",
    isLocked: !proStatus.isPro,
    isLive: true
  }, {
    title: t('Verse of eL Vision'),
    description: "Verses Audio Frequency",
    icon: Sparkles,
    color: "text-yellow-500",
    key: "audio-therapy"
  }, {
    title: "Jurnal Spiritual",
    description: "Sacred transformation chronicles",
    icon: Scroll,
    color: "text-amber-400",
    key: "spiritual-journal",
    isMystical: true
  }, {
    title: "Elite Habit",
    description: "Olahraga terkonsentrasi dengan mindfulness untuk ketenangan",
    icon: Activity,
    color: "text-emerald-500",
    key: "elite-habit",
    isNew: true
  }, {
    title: "Personal Analytics",
    description: "AI-powered spiritual journey insights from RENATA",
    icon: BarChart3,
    color: "text-purple-500",
    key: "personal-analytics",
    isAnalytics: true
  }, {
    title: "Ignis Quest",
    description: "Quest ini berisi langkah-langkah dan strategi untuk meraih harta, tahta, dan cinta, membawamu dari impian ke pencapaian nyata.",
    icon: Flame,
    color: "text-orange-500",
    key: "ignis-quest",
    isNew: true
  }];

  const educationFeatures = [{
    title: "Blood",
    description: "Optimasi aliran darah untuk mencapai keadaan meditatif yang ideal melalui yoga, olahraga, puasa, dan gaya hidup sehat",
    icon: Activity,
    color: "text-red-400",
    key: "blood-circulation",
    isBloodFlow: true
  }, {
    title: "Beauty",
    description: "Rahasia kecantikan sejati dari dalam - bagaimana kesehatan mental dan spiritual mempengaruhi penampilan fisik",
    icon: Heart,
    color: "text-rose-400",
    key: "physical-beauty",
    isBeauty: true
  }, {
    title: "True Diet",
    description: "Diet sejati bukan obat melainkan cara pandang kita terhadap makanan - revolusi mindset untuk kesehatan optimal",
    icon: Apple,
    color: "text-green-400",
    key: "true-diet",
    isTrueDiet: true
  }, {
    title: "Lifestyle",
    description: "Harmoni sempurna antara inner calm, jewelry, dan fragrance untuk meningkatkan karisma dan daya tarik alami",
    icon: Gem,
    color: "text-purple-400",
    key: "lifestyle",
    isLifestyle: true
  }];

  const tutorialFeature = {
    title: "Cara Menggunakan Ecosystem",
    description: "",
    icon: Play,
    color: "text-blue-500",
    key: "tutorial"
  };


  const mediaFiles = [
    // All Videos First
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/kikireact.mp4",
      type: "video" as const,
      title: "Pengalaman Kiki"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/senoreact.mp4",
      type: "video" as const,
      title: "Pengalaman Seno"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4",
      type: "video" as const,
      title: "Pengalaman Dr"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4",
      type: "video" as const,
      title: "Pengalaman Fel"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4",
      type: "video" as const,
      title: "Pengalaman Habib"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/INTELVIDEO_WA.mp4",
      type: "video" as const,
      title: "Pengalaman Intel"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4",
      type: "video" as const,
      title: "Pengalaman Lena"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4",
      type: "video" as const,
      title: "Pengalaman Vio"
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4",
      type: "video" as const,
      title: "Pengalaman Umi"
    },
    // All Images After Videos
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testI_jahitan.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi01.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi03.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi05.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi09.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_15taun.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_17juli.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_28juli.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_2jt.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_3minggu.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_JOE.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_agustinus.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_audio1.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_audio2.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_damai.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_depres.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_eldi3.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_jahit.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_jauh.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_karimah.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_kelas1.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_marah.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_muklas.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_pelakor.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_pesantren.png",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_pesantreren01.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_proyek.jpg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_santet.jpeg",
      type: "image" as const
    },
    {
      url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_santri.jpeg",
      type: "image" as const
    }
  ];

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
              <img src={faviconImage} alt="eL Vision Group Logo" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
                  Ecosystem
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    eL Vision Group
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Ecosystem eL Vision Group - Secret of Effortless Wealthy Life
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
                {!isAdmin && <TierBadge level={userProfile?.level || 1} isPro={proStatus.isPro} achievements={userProfile?.achievements || []} />}
                <div className="flex items-center gap-2 mt-1">
                  <h3 className={cn(
                    "font-semibold transition-all duration-300",
                    isAdmin 
                      ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-3 py-1.5 rounded-lg shadow-2xl shadow-red-500/25"
                      : "text-foreground"
                  )}>
                    {displayName}
                  </h3>
                  {isAdmin && <AdminBadge size="sm" />}
                </div>
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
        <h2 className="text-xl font-semibold font-orbitron">FITUR</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
          const isLocked = feature.isLocked;
          const isMeditationSession = feature.key === 'meditation-sessions';
          const isMeditationLocked = isMeditationSession && !proStatus.isPro;
          const isIgnisQuest = feature.key === 'ignis-quest';
          const isIgnisLocked = isIgnisQuest && (userProfile?.level || 1) < 8;
          const actuallyLocked = isLocked || isIgnisLocked || isMeditationLocked;
          return <Card key={index} className={`${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'p-2 rounded-full aspect-square max-w-24 max-h-24 mx-auto' : 'p-4'} border-border transition-all duration-300 relative ${
            feature.key === 'personal-analytics'
              ? actuallyLocked
                ? 'bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-violet-500/20 cursor-pointer opacity-90'
                : 'bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-fuchsia-500/15 hover:from-violet-500/25 hover:via-purple-500/15 hover:to-fuchsia-500/25 border-violet-500/30 hover:border-violet-400/50 cursor-pointer'
              : feature.key === 'ignis-quest'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10 border-orange-500/20 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-red-500/15 via-orange-500/10 to-yellow-500/15 hover:from-red-500/25 hover:via-orange-500/15 hover:to-yellow-500/25 border-orange-500/30 hover:border-red-400/50 cursor-pointer'
              : feature.key === 'audio-therapy'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-yellow-300/15 via-amber-400/12 to-orange-500/15 border-yellow-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-yellow-300/30 via-amber-400/25 to-orange-500/30 hover:from-yellow-300/45 hover:via-amber-400/40 hover:to-orange-500/45 border-yellow-500/60 hover:border-amber-400/90 cursor-pointer ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-500/25'
              : feature.key === 'spiritual-journal'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-amber-300/15 via-yellow-500/12 to-orange-400/15 border-amber-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-amber-300/20 via-yellow-500/18 to-orange-400/20 hover:from-amber-300/35 hover:via-yellow-500/30 hover:to-orange-400/35 border-amber-500/40 hover:border-yellow-400/70 cursor-pointer'
              : feature.key === 'meditation-sessions'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-orange-400/15 via-red-500/12 to-pink-600/15 border-orange-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-orange-400/20 via-red-500/18 to-pink-600/20 hover:from-orange-400/35 hover:via-red-500/30 hover:to-pink-600/35 border-orange-500/40 hover:border-red-500/70 cursor-pointer'
              : feature.key === 'chat'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-blue-400/15 via-cyan-500/12 to-indigo-600/15 border-blue-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-blue-400/20 via-cyan-500/18 to-indigo-600/20 hover:from-blue-400/35 hover:via-cyan-500/30 hover:to-indigo-600/35 border-blue-500/40 hover:border-cyan-500/70 cursor-pointer'
              : feature.key === 'elite-habit'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-emerald-400/15 via-green-500/12 to-teal-600/15 border-emerald-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-emerald-400/20 via-green-500/18 to-teal-600/20 hover:from-emerald-400/35 hover:via-green-500/30 hover:to-teal-600/35 border-emerald-500/40 hover:border-green-500/70 cursor-pointer'
              : feature.key === 'blood-circulation'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-red-600/80 via-pink-500/80 to-rose-500/80 border-red-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-red-600 via-pink-500 to-rose-500 hover:from-red-700 hover:via-pink-600 hover:to-rose-600 border-red-500/40 hover:border-pink-500/70 cursor-pointer'
              : feature.key === 'physical-beauty'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-rose-600/80 via-amber-500/80 to-yellow-500/80 border-rose-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-rose-600 via-amber-500 to-yellow-500 hover:from-rose-700 hover:via-amber-600 hover:to-yellow-600 border-rose-500/40 hover:border-amber-500/70 cursor-pointer'
              : feature.key === 'true-diet'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-green-600/80 via-lime-500/80 to-emerald-500/80 border-green-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-green-600 via-lime-500 to-emerald-500 hover:from-green-700 hover:via-lime-600 hover:to-emerald-600 border-green-500/40 hover:border-lime-500/70 cursor-pointer'
              : feature.key === 'lifestyle'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-purple-600/80 via-violet-500/80 to-indigo-500/80 border-purple-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-500 hover:from-purple-700 hover:via-violet-600 hover:to-indigo-600 border-purple-500/40 hover:border-violet-500/70 cursor-pointer'
                : actuallyLocked
                  ? 'bg-card/50 cursor-pointer'
                  : 'bg-card hover:bg-card/80 hover:border-primary cursor-pointer'
          } ${feature.isNew ? 'relative' : ''}`} onClick={() => {
            if (actuallyLocked) {
              if (isMeditationLocked) {
                onNavigate("payment"); // Navigate to payment/upgrade page for Pro features
                return;
              }
              if (isIgnisLocked) {
                // Show fire notification for Ignis Quest level requirement
                toast({
                  title: "🔥 Ignis Quest",
                  description: "🔥 Ignis For lv 8 User ++, Jalani Proses anda terlebih dahulu",
                  duration: 4000
                });
                return;
              }
              return; // Do nothing if locked
            }
            console.log("Feature clicked:", feature.key);
            onNavigate(feature.key);
          }}>
                {feature.isNew}
                
                <div className={`flex flex-col items-center text-center ${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'space-y-1 justify-center h-full' : 'space-y-3'}`}>
                  <div className={`${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'w-20 h-20 flex items-center justify-center' : 'p-3'} rounded-full relative ${
                    feature.key === 'meditation-sessions'
                      ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-lg shadow-red-500/40 animate-pulse'
                    : feature.key === 'audio-therapy'
                      ? 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400 shadow-lg shadow-yellow-500/30'
                    : feature.key === 'spiritual-journal'
                      ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 shadow-xl shadow-amber-500/50 border-2 border-amber-300/30'
                    : feature.key === 'chat'
                      ? 'bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 shadow-xl shadow-cyan-500/50 border-2 border-cyan-300/30'
                    : feature.key === 'personal-analytics'
                      ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-2xl shadow-violet-500/60 border-2 border-violet-400/40 animate-pulse'
                    : feature.key === 'elite-habit'
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-xl shadow-emerald-500/50 border-2 border-emerald-300/30'
                    : feature.key === 'ignis-quest'
                      ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-lg shadow-orange-500/50'
                    : feature.key === 'blood-circulation'
                      ? 'bg-transparent'
                    : feature.key === 'physical-beauty'
                      ? 'bg-transparent'
                    : feature.key === 'true-diet'
                      ? 'bg-gradient-to-r from-green-600 via-lime-500 to-emerald-500'
                    : feature.key === 'lifestyle'
                      ? 'bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500'
                      : 'bg-muted'
                  } ${feature.color}`}>
                    <feature.icon className={`${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'w-8 h-8' : 'w-6 h-6'} ${
                      feature.key === 'meditation-sessions' ? 'text-white animate-pulse'
                      : feature.key === 'audio-therapy' ? 'text-white animate-pulse'
                      : feature.key === 'spiritual-journal' ? 'text-white drop-shadow-lg'
                      : feature.key === 'chat' ? 'text-white drop-shadow-lg'
                      : feature.key === 'personal-analytics' ? 'text-white drop-shadow-2xl animate-pulse'
                      : feature.key === 'elite-habit' ? 'text-white drop-shadow-lg animate-pulse'
                      : feature.key === 'ignis-quest' ? 'text-white animate-pulse'
                      : feature.key === 'blood-circulation' ? 'text-white drop-shadow-2xl'
                      : feature.key === 'physical-beauty' ? 'text-white drop-shadow-2xl'
                      : feature.key === 'true-diet' ? 'text-white drop-shadow-2xl'
                      : feature.key === 'lifestyle' ? 'text-white drop-shadow-2xl'
                      : ''
                    }`} />
                    {/* Live indicator for meditation sessions */}
                    {feature.key === 'meditation-sessions' && (
                      <div className="absolute -top-1 -right-1 flex items-center">
                        <div className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
                          LIVE
                        </div>
                      </div>
                    )}
                    {/* Main feature indicator for Verse of eL Vision */}
                    {feature.key === 'audio-therapy' && (
                      <div className="absolute -top-1 left-6 flex items-center">
                        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
                          AUDIO
                        </div>
                      </div>
                    )}
                    {isMeditationLocked && <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-red-400" />
                      </div>}
                    {isLocked && !isMeditationLocked && <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>}
                    {isIgnisLocked && <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center opacity-80">
                        <Flame className="w-6 h-6 text-white animate-pulse" />
                      </div>}
                  </div>
                  <div>
                    <h3 className={`font-medium text-foreground mb-1 ${
                      feature.key === 'blood-circulation' 
                        ? 'text-base font-bold text-center px-2 py-1 bg-gradient-to-r from-red-600 via-pink-500 to-rose-500 text-white rounded-md max-w-20 mx-auto'
                      : feature.key === 'physical-beauty'
                        ? 'text-sm font-bold text-center px-2 py-1 bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-500 text-white rounded-md max-w-20 mx-auto'
                      : feature.key === 'true-diet'
                        ? 'text-sm font-bold text-center px-2 py-1 bg-gradient-to-r from-green-600 via-lime-500 to-emerald-500 text-white rounded-md max-w-20 mx-auto'
                      : feature.key === 'lifestyle'
                        ? 'text-sm font-bold text-center px-2 py-1 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 text-white rounded-md max-w-20 mx-auto'
                        : ''
                    }`}>
                      {feature.title}
                    </h3>
                    {!(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') && (
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    )}
                    {isMeditationLocked && <div className="text-xs font-medium text-red-400 mt-2">
                        Upgrade to Pro
                      </div>}
                    {isIgnisLocked && <div className="text-xs font-medium text-orange-400 mt-2">
                        Requires Level 8
                      </div>}
                    {isLocked && !isMeditationLocked && !isIgnisLocked && <div className="text-xs font-medium text-muted-foreground mt-2">
                        Locked
                      </div>}
                  </div>
                </div>
              </Card>;
        })}

          {/* Tutorial Button */}
          <Card
            className="p-4 border-border transition-all duration-300 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/10 hover:to-pink-500/20 border-indigo-500/20 hover:border-indigo-400/40 cursor-pointer relative overflow-hidden group"
            onClick={(e) => {
              e.preventDefault();
              if (!showTutorialModal) setShowTutorialModal(true);
            }}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative p-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-110 transition-all duration-300">
                <tutorialFeature.icon className="w-6 h-6 text-white animate-pulse" />
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-1">
                  {tutorialFeature.title}
                </h3>
                {tutorialFeature.description && (
                  <p className="text-xs text-muted-foreground">
                    {tutorialFeature.description}
                  </p>
                )}
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
          </Card>
        </div>

        {/* Education Blog Section */}
        <h2 className="text-xl font-semibold font-orbitron">EDUCATION BLOG</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {educationFeatures.map((feature, index) => {
          const isLocked = feature.isLocked;
          const isMeditationSession = feature.key === 'meditation-sessions';
          const isMeditationLocked = isMeditationSession && !proStatus.isPro;
          const isIgnisQuest = feature.key === 'ignis-quest';
          const isIgnisLocked = isIgnisQuest && (userProfile?.level || 1) < 8;
          const actuallyLocked = isLocked || isIgnisLocked || isMeditationLocked;
          return <Card key={index} className={`${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'p-2 rounded-full aspect-square max-w-24 max-h-24 mx-auto' : 'p-4'} border-border transition-all duration-300 relative ${
            feature.key === 'personal-analytics'
              ? actuallyLocked
                ? 'bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border-violet-500/20 cursor-pointer opacity-90'
                : 'bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-fuchsia-500/15 hover:from-violet-500/25 hover:via-purple-500/15 hover:to-fuchsia-500/25 border-violet-500/30 hover:border-violet-400/50 cursor-pointer'
              : feature.key === 'ignis-quest'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10 border-orange-500/20 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-red-500/15 via-orange-500/10 to-yellow-500/15 hover:from-red-500/25 hover:via-orange-500/15 hover:to-yellow-500/25 border-orange-500/30 hover:border-red-400/50 cursor-pointer'
              : feature.key === 'audio-therapy'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-yellow-300/15 via-amber-400/12 to-orange-500/15 border-yellow-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-yellow-300/30 via-amber-400/25 to-orange-500/30 hover:from-yellow-300/45 hover:via-amber-400/40 hover:to-orange-500/45 border-yellow-500/60 hover:border-amber-400/90 cursor-pointer ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-500/25'
              : feature.key === 'spiritual-journal'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-amber-300/15 via-yellow-500/12 to-orange-400/15 border-amber-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-amber-300/20 via-yellow-500/18 to-orange-400/20 hover:from-amber-300/35 hover:via-yellow-500/30 hover:to-orange-400/35 border-amber-500/40 hover:border-yellow-400/70 cursor-pointer'
              : feature.key === 'meditation-sessions'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-orange-400/15 via-red-500/12 to-pink-600/15 border-orange-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-orange-400/20 via-red-500/18 to-pink-600/20 hover:from-orange-400/35 hover:via-red-500/30 hover:to-pink-600/35 border-orange-500/40 hover:border-red-500/70 cursor-pointer'
              : feature.key === 'chat'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-blue-400/15 via-cyan-500/12 to-indigo-600/15 border-blue-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-blue-400/20 via-cyan-500/18 to-indigo-600/20 hover:from-blue-400/35 hover:via-cyan-500/30 hover:to-indigo-600/35 border-blue-500/40 hover:border-cyan-500/70 cursor-pointer'
              : feature.key === 'elite-habit'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-emerald-400/15 via-green-500/12 to-teal-600/15 border-emerald-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-emerald-400/20 via-green-500/18 to-teal-600/20 hover:from-emerald-400/35 hover:via-green-500/30 hover:to-teal-600/35 border-emerald-500/40 hover:border-green-500/70 cursor-pointer'
              : feature.key === 'blood-circulation'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-red-600/80 via-pink-500/80 to-rose-500/80 border-red-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-red-600 via-pink-500 to-rose-500 hover:from-red-700 hover:via-pink-600 hover:to-rose-600 border-red-500/40 hover:border-pink-500/70 cursor-pointer'
              : feature.key === 'physical-beauty'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-rose-600/80 via-amber-500/80 to-yellow-500/80 border-rose-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-rose-600 via-amber-500 to-yellow-500 hover:from-rose-700 hover:via-amber-600 hover:to-yellow-600 border-rose-500/40 hover:border-amber-500/70 cursor-pointer'
              : feature.key === 'true-diet'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-green-600/80 via-lime-500/80 to-emerald-500/80 border-green-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-green-600 via-lime-500 to-emerald-500 hover:from-green-700 hover:via-lime-600 hover:to-emerald-600 border-green-500/40 hover:border-lime-500/70 cursor-pointer'
              : feature.key === 'lifestyle'
                ? actuallyLocked
                  ? 'bg-gradient-to-br from-purple-600/80 via-violet-500/80 to-indigo-500/80 border-purple-500/30 cursor-pointer opacity-90'
                  : 'bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-500 hover:from-purple-700 hover:via-violet-600 hover:to-indigo-600 border-purple-500/40 hover:border-violet-500/70 cursor-pointer'
                : actuallyLocked
                  ? 'bg-card/50 cursor-pointer'
                  : 'bg-card hover:bg-card/80 hover:border-primary cursor-pointer'
          } ${feature.isNew ? 'relative' : ''}`} onClick={() => {
            if (actuallyLocked) {
              if (isMeditationLocked) {
                onNavigate("payment"); // Navigate to payment/upgrade page for Pro features
                return;
              }
              if (isIgnisLocked) {
                // Show fire notification for Ignis Quest level requirement
                toast({
                  title: "🔥 Ignis Quest",
                  description: "🔥 Ignis For lv 8 User ++, Jalani Proses anda terlebih dahulu",
                  duration: 4000
                });
                return;
              }
              return; // Do nothing if locked
            }
            console.log("Feature clicked:", feature.key);
            onNavigate(feature.key);
          }}>
                {feature.isNew}
                
                <div className={`flex flex-col items-center text-center ${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'space-y-1 justify-center h-full' : 'space-y-3'}`}>
                  <div className={`${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'w-20 h-20 flex items-center justify-center' : 'p-3'} rounded-full relative ${
                    feature.key === 'meditation-sessions'
                      ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-lg shadow-red-500/40 animate-pulse'
                    : feature.key === 'audio-therapy'
                      ? 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400 shadow-lg shadow-yellow-500/30'
                    : feature.key === 'spiritual-journal'
                      ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 shadow-xl shadow-amber-500/50 border-2 border-amber-300/30'
                    : feature.key === 'chat'
                      ? 'bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 shadow-xl shadow-cyan-500/50 border-2 border-cyan-300/30'
                    : feature.key === 'personal-analytics'
                      ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-2xl shadow-violet-500/60 border-2 border-violet-400/40 animate-pulse'
                    : feature.key === 'elite-habit'
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-xl shadow-emerald-500/50 border-2 border-emerald-300/30'
                    : feature.key === 'ignis-quest'
                      ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-lg shadow-orange-500/50'
                    : feature.key === 'blood-circulation'
                      ? 'bg-transparent'
                    : feature.key === 'physical-beauty'
                      ? 'bg-transparent'
                    : feature.key === 'true-diet'
                      ? 'bg-gradient-to-r from-green-600 via-lime-500 to-emerald-500'
                    : feature.key === 'lifestyle'
                      ? 'bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500'
                      : 'bg-muted'
                  } ${feature.color}`}>
                    <feature.icon className={`${(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') ? 'w-8 h-8' : 'w-6 h-6'} ${
                      feature.key === 'meditation-sessions' ? 'text-white animate-pulse'
                      : feature.key === 'audio-therapy' ? 'text-white animate-pulse'
                      : feature.key === 'spiritual-journal' ? 'text-white drop-shadow-lg'
                      : feature.key === 'chat' ? 'text-white drop-shadow-lg'
                      : feature.key === 'personal-analytics' ? 'text-white drop-shadow-2xl animate-pulse'
                      : feature.key === 'elite-habit' ? 'text-white drop-shadow-lg animate-pulse'
                      : feature.key === 'ignis-quest' ? 'text-white animate-pulse'
                      : feature.key === 'blood-circulation' ? 'text-white drop-shadow-2xl'
                      : feature.key === 'physical-beauty' ? 'text-white drop-shadow-2xl'
                      : feature.key === 'true-diet' ? 'text-white drop-shadow-2xl'
                      : feature.key === 'lifestyle' ? 'text-white drop-shadow-2xl'
                      : ''
                    }`} />
                    {/* Live indicator for meditation sessions */}
                    {feature.key === 'meditation-sessions' && (
                      <div className="absolute -top-1 -right-1 flex items-center">
                        <div className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
                          LIVE
                        </div>
                      </div>
                    )}
                    {isMeditationLocked && <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-red-400" />
                      </div>}
                    {isLocked && !isMeditationLocked && <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>}
                    {isIgnisLocked && <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center opacity-80">
                        <Flame className="w-6 h-6 text-white animate-pulse" />
                      </div>}
                  </div>
                  <div>
                    <h3 className={`font-medium text-foreground mb-1 ${
                      feature.key === 'blood-circulation' 
                        ? 'text-base font-bold text-center px-2 py-1 bg-gradient-to-r from-red-600 via-pink-500 to-rose-500 text-white rounded-md max-w-20 mx-auto'
                      : feature.key === 'physical-beauty'
                        ? 'text-sm font-bold text-center px-2 py-1 bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-500 text-white rounded-md max-w-20 mx-auto'
                      : feature.key === 'true-diet'
                        ? 'text-sm font-bold text-center px-2 py-1 bg-gradient-to-r from-green-600 via-lime-500 to-emerald-500 text-white rounded-md max-w-20 mx-auto'
                      : feature.key === 'lifestyle'
                        ? 'text-sm font-bold text-center px-2 py-1 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 text-white rounded-md max-w-20 mx-auto'
                        : ''
                    }`}>
                      {feature.title}
                    </h3>
                    {!(feature.key === 'physical-beauty' || feature.key === 'true-diet' || feature.key === 'blood-circulation' || feature.key === 'lifestyle') && (
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    )}
                    {isMeditationLocked && <div className="text-xs font-medium text-red-400 mt-2">
                        Upgrade to Pro
                      </div>}
                    {isIgnisLocked && <div className="text-xs font-medium text-orange-400 mt-2">
                        Requires Level 8
                      </div>}
                    {isLocked && !isMeditationLocked && !isIgnisLocked && <div className="text-xs font-medium text-muted-foreground mt-2">
                        Locked
                      </div>}
                  </div>
                </div>
              </Card>;
        })}
        </div>

        {/* User Testimonials Section Card */}
        <Card
          className="p-6 border-border transition-all duration-300 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 hover:from-emerald-500/20 hover:via-teal-500/10 hover:to-cyan-500/20 border-emerald-500/20 hover:border-emerald-400/40 cursor-pointer col-span-2 relative overflow-hidden group"
          onClick={() => {
            setShowImageGalleryModal(true);
          }}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-teal-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
              <div className="relative p-4 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
                <ImageIcon className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-300 transition-colors duration-300">
                User Testimonials
              </h3>
              <p className="text-sm text-muted-foreground">
                Testimoni tertulis dari ribuan anggota eL Vision Group
              </p>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
        </Card>

        {/* Testimonials Section */}
        <div ref={testimonialsRef}>
          <Testimonials
            onVideoClick={(videoIndex, videoUrl, videoTitle) => {
              setIndividualVideo({ url: videoUrl, title: videoTitle });
              setShowIndividualVideoModal(true);
            }}
          />
        </div>

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
                onClick={() => {
                  setShowTutorialModal(false);
                  setShowPlayButton(true);
                }}
                className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                size="sm"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="relative">
                <video 
                  className="w-full rounded-lg"
                  controls={!showPlayButton}
                  preload="none"
                  crossOrigin="anonymous"
                  onPlay={() => setShowPlayButton(false)}
                  onError={(e) => {
                    console.error('Video error:', e);
                    setShowPlayButton(true);
                  }}
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

      {/* Pengalaman Anggota Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold font-orbitron">Pengalaman Anggota</h2>
              <Button 
                onClick={() => setShowMediaModal(false)}
                className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                size="sm"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Description */}
              <div className="mb-6">
                <Card className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                  <p className="text-sm text-muted-foreground text-center">
                    Lihat pengalaman dan testimoni dari anggota eL Vision Group
                  </p>
                </Card>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaFiles.map((media, index) => (
                  <Card
                    key={index}
                    className="relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => {
                      setCurrentMediaIndex(index);
                      setSelectedMedia(media);
                      setShowMediaModal(false);
                    }}
                  >
                    <div className="relative aspect-video bg-muted">
                      {media.type === 'video' ? (
                        <>
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                              <Play className="w-8 h-8 text-white" fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                            <Video className="w-4 h-4 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={media.url}
                            alt={media.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                            <ImageIcon className="w-4 h-4 text-white" />
                          </div>
                        </>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-medium">
                          {media.title}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Scrollable Media Player Modal */}
      {selectedMedia && !showMediaModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/80 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Pengalaman Anggota</h2>
              <Button 
                onClick={() => setSelectedMedia(null)}
                className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                size="sm"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            
            {/* Scrollable Media Content */}
            <div className="overflow-y-auto max-h-[80vh] p-4 space-y-6">
              {mediaFiles.map((media, index) => (
                <div key={index} className="space-y-2">
                  {/* Media Title */}
                  <h3 className="text-white font-medium text-lg text-center">
                    {media.title}
                  </h3>
                  
                  {/* Media Content */}
                  <div className="flex justify-center">
                    {media.type === 'video' ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={cachedMediaUrls.get(media.url) || media.url}
                        controls
                        className="max-w-full rounded-lg"
                        style={{ maxHeight: '60vh' }}
                        preload="metadata"
                        crossOrigin="anonymous"
                        onLoadStart={async () => {
                          // Preload and cache video for future views
                          if (!cachedMediaUrls.has(media.url)) {
                            try {
                              const cachedUrl = await preloadAndCacheMedia(media.url);
                              setCachedMediaUrls(prev => new Map(prev).set(media.url, cachedUrl));
                            } catch (error) {
                              console.warn('Failed to cache video:', error);
                            }
                          }
                        }}
                      >
                        Browser Anda tidak mendukung video HTML5.
                      </video>
                    ) : (
                      <img
                        src={cachedMediaUrls.get(media.url) || media.url}
                        alt={media.title}
                        className="max-w-full max-h-[60vh] object-contain rounded-lg"
                        onLoad={async () => {
                          // Preload and cache image for future views
                          if (!cachedMediaUrls.has(media.url)) {
                            try {
                              const cachedUrl = await preloadAndCacheMedia(media.url);
                              setCachedMediaUrls(prev => new Map(prev).set(media.url, cachedUrl));
                            } catch (error) {
                              console.warn('Failed to cache image:', error);
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Separator */}
                  {index < mediaFiles.length - 1 && (
                    <div className="border-t border-white/10 pt-6 mt-6" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-center text-white/80 text-sm">
              <p>Pengalaman dari Anggota eL Vision Group</p>
              <p className="text-white/60 text-xs mt-1">
                Scroll ke bawah untuk melihat semua media
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Individual Video Testimonial Modal */}
      {showIndividualVideoModal && individualVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold font-orbitron">{individualVideo.title}</h2>
              <Button
                onClick={() => {
                  setShowIndividualVideoModal(false);
                  setIndividualVideo(null);
                }}
                className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                size="sm"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="relative flex justify-center">
                <video
                  src={individualVideo.url}
                  controls
                  autoPlay
                  className="max-w-full rounded-lg"
                  style={{ maxHeight: '70vh' }}
                  preload="metadata"
                  crossOrigin="anonymous"
                >
                  Browser Anda tidak mendukung video HTML5.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal - Only Images */}
      {showImageGalleryModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/80 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">User Testimonials</h2>
              <Button
                onClick={() => setShowImageGalleryModal(false)}
                className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                size="sm"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Scrollable Image Content Only */}
            <div className="overflow-y-auto max-h-[80vh] p-4 pb-8 space-y-6">
              {mediaFiles
                .filter(media => media.type === 'image')
                .map((media, index) => (
                  <div key={index} className="space-y-2">
                    {/* Image Content */}
                    <div className="flex justify-center">
                      <img
                        src={cachedMediaUrls.get(media.url) || media.url}
                        alt={media.title}
                        className="max-w-full max-h-[60vh] object-contain rounded-lg"
                        onLoad={async () => {
                          // Preload and cache image for future views
                          if (!cachedMediaUrls.has(media.url)) {
                            try {
                              const cachedUrl = await preloadAndCacheMedia(media.url);
                              setCachedMediaUrls(prev => new Map(prev).set(media.url, cachedUrl));
                            } catch (error) {
                              console.warn('Failed to cache image:', error);
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Separator */}
                    {index < mediaFiles.filter(m => m.type === 'image').length - 1 && (
                      <div className="border-t border-white/10 pt-6 mt-6" />
                    )}
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-center text-white/80 text-sm">
              <p>Testimoni Tertulis dari Anggota eL Vision Group</p>
              <p className="text-white/60 text-xs mt-1">
                Scroll ke bawah untuk melihat semua testimoni
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Cache Debug Panel */}
      <CacheDebugPanel />
    </div>;
}
