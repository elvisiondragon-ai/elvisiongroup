"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioUpload } from "@/components/AudioUpload";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Lock, ArrowLeft, Music, Upload as UploadIcon, Star, Zap, Crown, Shield, Gem, Flame, Eye, Sparkles, Globe, Infinity, Users, TrendingUp, Headphones, FileText, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useXPSystem } from "@/hooks/useXPSystem";
import { usePro } from "@/hooks/usePro";
import { useMeditative } from "@/contexts/MeditativeContext";
import { VerseAudioCard } from "@/components/VerseAudioCard";
import { useProtectedAudio } from "@/contexts/AudioContext"; // //Nevertouch Audio-cache
import { TutorialButton } from "@/components/TutorialButton";
// Removed slow UserProfileContext - now using fast auth
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import verseArtwork from "@/assets/verse-1-cosmic.jpg";
import verse2Artwork from "@/assets/verse-2-cosmic.jpg";
import verse3Artwork from "@/assets/verse-3-cosmic.jpg";
import verse4Artwork from "@/assets/verse-4-gold-coins.jpg";
import verse5Artwork from "@/assets/verse-5-cosmic.jpg";
import verse6Artwork from "@/assets/verse-6-cosmic.jpg";
import verse7Artwork from "@/assets/verse-7-cosmic.jpg";
import verse8Artwork from "@/assets/verse-8-cosmic.jpg";
import verse9Artwork from "@/assets/verse-9-cosmic.jpg";
import verse10Artwork from "@/assets/verse-10-cosmic.jpg";
import shortVerse1Artwork from "@/assets/shortverse1.png";

interface AudioTherapyProps {
  onNavigate: (tab: string) => void;
}

// Meditation Counter Component
function MeditationCounter() {
  const [currentlyMeditating, setCurrentlyMeditating] = useState(() => {
    // Start from base 3472 with small daily variation
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const seed = (dayOfYear * 137) % 200;
    return 3472 + seed; // 3472-3672 base range
  });

  useEffect(() => {
    // Simulate realistic daily meditation patterns
    const interval = setInterval(() => {
      setCurrentlyMeditating(prev => {
        const hour = new Date().getHours();
        let targetRange;

        // Peak meditation times - night is most active
        if (hour >= 19 && hour <= 23) targetRange = [4000, 5600]; // Night peak (7PM-11PM)
        else if (hour >= 6 && hour <= 9) targetRange = [3200, 4200]; // Morning meditation
        else if (hour >= 0 && hour <= 5) targetRange = [2800, 3800]; // Late night/early morning
        else targetRange = [2500, 3500]; // Daytime

        const target = targetRange[0] + Math.random() * (targetRange[1] - targetRange[0]);
        const drift = prev < target ? 1 : -1; // Gentle drift toward target
        const change = Math.floor(Math.random() * 30) - 12 + drift; // -11 to +18 range
        return Math.max(2500, Math.min(5600, prev + change));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return <span>{currentlyMeditating.toLocaleString()}</span>;
}

export function AudioTherapy({ onNavigate }: AudioTherapyProps) {
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningResolver, setWarningResolver] = useState<((value: boolean) => void) | null>(null);
  const [showSacredNotification, setShowSacredNotification] = useState(false);
  const [currentVerseName, setCurrentVerseName] = useState<string>("");
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string>("unlock");
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { awardXP } = useXPSystem();
  const { proStatus } = usePro();
  const { setMeditativeActive } = useMeditative();
  const { userId, user, userProfile, refreshUserProfile } = useAuth();
  const [verse4Used, setVerse4Used] = useState(0);
  const [showVerse4Limit, setShowVerse4Limit] = useState(false);

  const daysActive = user?.created_at ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Tab-level pro status logging - ONLY ON MOUNT
  useEffect(() => {
    console.log('🔵 Subscribe From AudioTherapy tab - pro_status_changes channel');
    return () => {
      console.log('🟣 Unsubscribe From AudioTherapy tab - pro_status_changes channel');
    };
  }, []); // 🛡️ FIX: Empty deps = run once on mount/unmount only

  // Use global audio state from AudioContext to persist across tab changes
  const { currentPlayingVerse, currentVerseAudio, setCurrentPlayingVerse, setCurrentVerseAudio } = useProtectedAudio();

  // Separate function to fetch just verse4_used
  const fetchVerse4Count = async (userId: string) => {
    try {
      console.log('🎵 Fetching ONLY verse4_used for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('verse4_used')
        .eq('user_id', userId)
        .single();
      
      console.log('🎵 Verse4 ONLY response:', { data, error });
      
      if (!error && data) {
        const count = (data as any).verse4_used || 0;
        console.log('🎵 Setting verse4Used to:', count);
        setVerse4Used(count);
        return count;
      }
      return 0;
    } catch (error) {
      console.error('❌ Error fetching verse4_used:', error);
      return 0;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      if (userId) {
        console.log('%c🌹 Entering AudioTherapy page:', 'color: green; font-weight: bold;', {
          user_id: userId,
          email: user?.email || 'loading...'
        });
        setIsAdmin(userId === "3da83afb-aa8c-4c55-b3b0-8aa64000205f");
      }
      setLoading(false);
    };
    initializeData();
  }, [userId, user?.email]);

  // Refetch profile when pro status changes to ensure data is fresh
  useEffect(() => {
    if (userId && !loading && proStatus) {
      console.log('🔄 Pro status changed, refreshing profile');
      refreshUserProfile();
    }
  }, [proStatus.isPro]); // Only track isPro, not userId or loading



  const handleUploadComplete = () => {
    setShowUpload(false);
  };

  // Warning dialog handler
  const handleWarning = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setWarningResolver(() => resolve);
      setShowWarningDialog(true);
    });
  };

  const handleWarningResponse = (shouldContinue: boolean) => {
    if (warningResolver) {
      warningResolver(shouldContinue);
      setWarningResolver(null);
    }
    setShowWarningDialog(false);
  };

  const handleProUpgrade = (reason: string) => {
    setUpgradeReason(reason);
    setShowProUpgrade(true);
  };

  const navigateToPayment = () => {
    setShowProUpgrade(false);
    onNavigate("payment");
  };

  const handleVerse4Usage = async () => {
    if (proStatus.isPro) return true; // Pro users have unlimited access

    try {
      if (!userId || !userProfile) return false;

      const currentUsage = (userProfile as any).verse4_used || 0;
      if (currentUsage >= 3) {
        setShowVerse4Limit(true);
        return false;
      }

      const newCount = currentUsage + 1;

      const { error } = await supabase
        .from('profiles')
        .update({ verse4_used: newCount } as any)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error updating verse4_used:', error);
        return false;
      }

      // Manually trigger profile refresh to get the new count
      await refreshUserProfile();
      
      if (newCount >= 3) {
        setTimeout(() => {
          setShowVerse4Limit(true);
        }, 2000);
      }
      
      return true;
    } catch (error) {
      console.error('💥 Error handling verse 4 usage:', error);
      return false;
    }
  };


  const verses = [
    {
      id: 1,
      title: "Verse 1 - The Space Hill",
      subtitle: "Kedamaian Batin",
      unlocked: true, // Free access
      requiredLevel: 2,
      artwork: verseArtwork.src,
      audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse1%20-%20The%20Space%20Hill.MP3',
      language: 'en',
      isFree: true
    },
    {
      id: 2,
      title: "Verse 2 - Lucid Beach",
      subtitle: "Relaksasi seperti berada di pantai, membantu tidur nyenyak dan pikiran jernih",
      unlocked: true, // Free access
      requiredLevel: 1,
      artwork: verse2Artwork.src,
      audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse2%20-%20Lucid%20Beach.MP3',
      language: 'id',
      isFree: true
    },
    {
      id: 3,
      title: "Verse 3 - Syukur Meditation",
      subtitle: "Menumbuhkan rasa syukur pada titik saraf seluruh tubuh",
      unlocked: proStatus.isPro, // Pro only
      requiredLevel: 3,
      artwork: verse3Artwork.src,
      audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse%203%20-%20Syukur.MP3',
      language: 'id',
      isFree: false,
      proOnly: true
    },
    {
      id: 4,
      title: "Verse 4 - Prosperity Stream",
      subtitle: "Frekuensi afirmasi menarik kekayaan dengan rasa yang dimiliki orang orang sukses",
      unlocked: proStatus.isPro, // Pro only
      requiredLevel: 5,
      artwork: verse4Artwork.src,
      audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse%204%20-%20Prosperity%20Stream%20Vol.%201.MP3',
      language: 'id',
      isFree: false,
      proOnly: true
    },
    {
      id: 5,
      title: "Verse 5 - Vitality Vortex",
      subtitle: "Memperbaiki ulang finansial, fisik dan mental untuk hidup yang sehat",
      unlocked: proStatus.isPro, // Pro only
      requiredLevel: 6,
      artwork: verse5Artwork.src,
      audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse5%20-%20Virtality%20Vortex.MP3',
      language: 'id',
      isFree: false,
      proOnly: true
    },
    {
      id: 6,
      title: "Verse 6 - Beautify",
      subtitle: "Memfokuskan Kecantikan fisik yang mempesona setiap orang",
      unlocked: false, // Lock for all users
      requiredLevel: 7,
      artwork: verse6Artwork.src,
      audioPath: null,
      language: 'id'
    },
    {
      id: 7,
      title: "Verse 7 - Confidence Core",
      subtitle: "Menumbuhkan keyakinan diri agar berani mengambil langkah penting",
      unlocked: false, // Lock for all users
      requiredLevel: 8,
      artwork: verse7Artwork.src,
      audioPath: null,
      language: 'id'
    },
    {
      id: 8,
      title: "Verse 8 - Love Magnet",
      subtitle: "Menarik cinta dan kasih sayang dari orang-orang di sekitar",
      unlocked: proStatus.isPro && (userProfile?.level || 1) >= 1,
      requiredLevel: 9,
      artwork: verse8Artwork.src,
      audioPath: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse%208%20-%20Love%20Magnet.MP3",
      language: 'id'
    },
    {
      id: 9,
      title: "Verse 9 - Family Harmony",
      subtitle: "Menenangkan emosi dan memperkuat hubungan keluarga",
      unlocked: false, // Lock for all users
      requiredLevel: 10,
      artwork: verse9Artwork.src,
      audioPath: null,
      language: 'id'
    },
    {
      id: 10,
      title: "Verse 10 - Healing Heart",
      subtitle: "Menyembuhkan luka batin dan memulihkan kedamaian hati",
      unlocked: false, // Lock for all users
      requiredLevel: 1,
      artwork: verse10Artwork.src,
      audioPath: null,
      language: 'id'
    },
  ];


  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("home")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              Verses of eL Vision
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
        <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-pulse">
              <Headphones className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-400 animate-pulse">
                Wajib Pakai Headphone Untuk hasil maximal
              </p>
              <p className="text-sm text-yellow-300/80 mt-1">
                Gunakan headphone berkualitas untuk pengalaman terbaik
              </p>
            </div>
          </div>
        </div>
        
        {/* Single Tutorial Button for All Songs */}
        <div className="flex justify-center mt-6">
          <Button
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary/40 transform hover:scale-105 transition-all duration-300 border border-white/20"
            onClick={() => setShowTutorialModal(true)}
          >
            <span className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Tutorial
            </span>
          </Button>
        </div>
      </div>

      {/* Live Meditation Counter */}
      <div className="px-6 mb-6">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-full px-4 py-2 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">
              <MeditationCounter /> Anggota Sedang Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Personalized Stats for Conversion */}
      {!proStatus.isPro && userProfile && (
        <div className="px-6 mb-6">
          <Card className="p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-indigo-300">Progress Anda</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-indigo-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{userProfile.total_verses || 0}</div>
                  <div className="text-xs text-indigo-300">Meditasi</div>
                </div>
                <div className="text-center p-3 bg-indigo-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{daysActive}</div>
                  <div className="text-xs text-indigo-300">Hari Aktif</div>
                </div>
                <div className="text-center p-3 bg-indigo-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{userProfile.streak_days || 0}</div>
                  <div className="text-xs text-indigo-300">Streak</div>
                </div>
              </div>

              <p className="text-indigo-200 text-sm">
                <strong>Anggota Pro rata-rata:</strong> 45x lebih banyak insight & kemajuan spiritual!
              </p>

              <Button
                onClick={() => handleProUpgrade("stats")}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Lihat Apa yang Anggota Pro Dapatkan
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Short Verses - Reflection */}
      <div className="px-6 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold font-exo bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Short Verses - Reflection
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
        </div>

        <Card className="relative overflow-hidden border transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-orange-500/5 via-background to-yellow-500/5 border-orange-400/30 shadow-lg shadow-orange-400/10">
          {/* Minimal Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500 via-transparent to-yellow-500"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border border-orange-400/20 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border border-yellow-400/20 rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center space-y-4 p-4">
            {/* Compact Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-lg font-semibold font-exo bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Guided to Inner Silence
                </h3>
                <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  SHORT
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80 font-medium">
                Refleksi mendalam menuju ketenangan batin
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
            </div>

            {/* Smaller Audio Player */}
            <div className="flex justify-center">
              <div className="transform scale-75">
                <VerseAudioCard
                  verse={{
                    id: 11,
                    title: "Guided to Inner Silence",
                    subtitle: "Refleksi mendalam menuju ketenangan batin",
                    unlocked: true,
                    requiredLevel: 1,
                    artwork: shortVerse1Artwork.src, // Using dedicated short verse artwork
                    audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Jurnalsyukur1.MP3',
                    language: 'id'
                  }}
                  onWarning={handleWarning}
                  currentPlayingVerse={currentPlayingVerse}
                  setCurrentPlayingVerse={setCurrentPlayingVerse}
                  currentVerseAudio={currentVerseAudio}
                  setCurrentVerseAudio={setCurrentVerseAudio}
                  onShowSacredNotification={(verseName) => {
                    setCurrentVerseName(verseName);
                    setShowSacredNotification(true);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-orange-500/5 via-background to-yellow-500/5 border-orange-400/30 shadow-lg shadow-orange-400/10">
          {/* Minimal Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500 via-transparent to-yellow-500"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border border-orange-400/20 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border border-yellow-400/20 rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center space-y-4 p-4">
            {/* Compact Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-base font-semibold font-exo bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  eL Vision Delta Breathing
                </h3>
                <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  SHORT
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80 font-medium">
                Tehnik Pernafasan Delta untuk Mengantuk cepat
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
            </div>

            {/* Smaller Audio Player */}
            <div className="flex justify-center">
              <div className="transform scale-75">
                <VerseAudioCard
                  verse={{
                    id: 12,
                    title: "eL Vision Delta Breathing",
                    subtitle: "Tehnik Pernafasan Delta untuk Mengantuk cepat",
                    unlocked: proStatus.isPro || (userProfile?.level || 1) >= 4,
                    requiredLevel: 4,
                    artwork: verse7Artwork.src,
                    audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Short%20Verse%20-%20eL%20Vision%20Delta%20Breathing.MP3',
                    language: 'id',
                    isFree: false,
                    proOnly: true
                  }}
                  onWarning={handleWarning}
                  currentPlayingVerse={currentPlayingVerse}
                  setCurrentPlayingVerse={setCurrentPlayingVerse}
                  currentVerseAudio={currentVerseAudio}
                  setCurrentVerseAudio={setCurrentVerseAudio}
                  onShowSacredNotification={(verseName) => {
                    setCurrentVerseName(verseName);
                    setShowSacredNotification(true);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
        <Card className="relative overflow-hidden border transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-teal-500/5 via-background to-cyan-500/5 border-teal-400/30 shadow-lg shadow-teal-400/10">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500 via-transparent to-cyan-500"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border border-teal-400/20 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border border-cyan-400/20 rounded-full"></div>
            </div>
            <div className="relative z-10 text-center space-y-4 p-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                        <h3 className="text-base font-semibold font-exo bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Audio Khusus Therapy Tumor Pak Arif
                        </h3>
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            PRIVATE
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 font-medium">
                        Terapi khusus untuk penyembuhan tumor.
                    </p>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent mx-auto"></div>
                </div>
                <div className="flex justify-center">
                    <div className="transform scale-75">
                        <VerseAudioCard
                            verse={{
                                id: 13,
                                title: "Audio Khusus Therapy Tumor Pak Arif",
                                subtitle: "Terapi khusus untuk penyembuhan tumor.",
                                unlocked: userId === "4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e" || userId === "3da83afb-aa8c-4c55-b3b0-8aa64000205f",
                                requiredLevel: 1,
                                artwork: verse10Artwork.src,
                                audioPath: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/arifelvision.MP3',
                                language: 'id',
                                isFree: false,
                                proOnly: false,
                                isPrivate: true,
                            }}
                            onWarning={handleWarning}
                            currentPlayingVerse={currentPlayingVerse}
                            setCurrentPlayingVerse={setCurrentPlayingVerse}
                            currentVerseAudio={currentVerseAudio}
                            setCurrentVerseAudio={setCurrentVerseAudio}
                            onShowSacredNotification={(verseName) => {
                                setCurrentVerseName(verseName);
                                setShowSacredNotification(true);
                            }}
                        />
                    </div>
                </div>
            </div>
        </Card>
      </div>

      {/* Main Verses */}
      <div className="px-6 space-y-8">
        <div className="text-center space-y-2 pt-8">
          <h2 className="text-xl font-bold font-exo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Main Verses
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>
        
        {verses.map((verse) => {

          return (
            <Card
              key={verse.id}
                  className={`relative overflow-hidden border-2 transition-all duration-500 transform hover:scale-[1.02] bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/40 shadow-2xl shadow-primary/20`}
                >
              {/* Cosmic Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-accent"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border border-primary/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border border-accent/20 rounded-full"></div>
              </div>
              
              <div className="relative z-10 text-center space-y-6 p-8">
                {/* Title */}
                <div className="space-y-2">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold font-exo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {verse.title.includes(' - ') ? (
                        <>
                          {verse.title.split(' - ')[0]}
                          <br />
                          {verse.title.split(' - ')[1]}
                        </>
                      ) : verse.title}
                    </h3>
                  </div>
                  {verse.subtitle && (
                    <p className="text-sm text-muted-foreground/80 font-medium">
                      {verse.subtitle}
                    </p>
                  )}
                  {verse.id === 8 && (
                    <div className="mt-3">
                      <Button
                        onClick={() => setShowTermsModal(true)}
                        size="sm"
                        className="text-xs bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-medium px-3 py-1"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Terms - Wajib Baca
                      </Button>
                    </div>
                  )}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                </div>

                {/* Artwork or Lock */}
                <div className="flex justify-center">
                  <VerseAudioCard
                    verse={verse}
                    onWarning={handleWarning}
                    currentPlayingVerse={currentPlayingVerse}
                    setCurrentPlayingVerse={setCurrentPlayingVerse}
                    currentVerseAudio={currentVerseAudio}
                    setCurrentVerseAudio={setCurrentVerseAudio}
                    onShowSacredNotification={(verseName) => {
                      setCurrentVerseName(verseName);
                      setShowSacredNotification(true);
                    }}
                    onNavigate={onNavigate}
                  />
                </div>

              </div>
            </Card>
          );
        })}
      </div>


      {/* Loading State */}
      {loading && (
        <div className="px-6">
          <Card className="p-6 bg-gradient-secondary border-border">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground">{t('audioTherapy.loading')}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
      </div>

      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent className="bg-background border border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Peringatan</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Anda akan mengulang exp dari awal jika menghentikan audio ini, lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => handleWarningResponse(false)}
              className="border-muted-foreground/20"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleWarningResponse(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tutorial Modal */}
      <TutorialButton 
        isOpen={showTutorialModal} 
        onClose={() => setShowTutorialModal(false)} 
      />

      {/* Terms Modal for Verse 8 */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden border border-pink-500/30">
            <div className="flex items-center justify-between p-4 border-b border-pink-500/30">
              <h2 className="text-lg font-semibold text-pink-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Terms - Wajib Baca
              </h2>
              <Button 
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95"
                size="sm"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4 text-base leading-relaxed">
                <div className="bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-pink-300 mb-2 text-center">💕 Verse 8 - Love Magnet 💕</h3>
                  <p className="text-pink-200 text-center">
                    Ilmu yang sangat powerful untuk menarik cinta dan kasih sayang
                  </p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-foreground">
                    <strong className="text-yellow-400">Rate Keberhasilan:</strong> 95% dari 100 orang merasakan efek cepat, 
                    sedangkan 5% memakan waktu bertahun-tahun.
                  </p>
                  
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-orange-200 text-base">
                      ⚠️ <strong>Penting:</strong> Berdasarkan faktual di lapangan, ini adalah ilmu yang sangat powerful.
                    </p>
                  </div>
                  
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-200 text-base">
                      <strong>Pernyataan Tanggung Jawab:</strong>
                    </p>
                    <ul className="text-red-200 text-sm mt-2 space-y-1 pl-4">
                      <li>• Anda menyatakan tidak akan menyalahgunakan ilmu ini untuk merusak hubungan orang lain</li>
                      <li>• Anda menyatakan tidak akan memainkan perasaan orang lain</li>
                      <li>• eL Vision Group tidak bertanggung jawab atas perbuatan yang kami tidak setujui</li>
                      <li>• Gunakan dengan bijak dan penuh kasih sayang</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-200 text-base text-center">
                      ✨ Gunakan Love Magnet untuk menciptakan hubungan yang harmonis dan penuh cinta ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-pink-500/30">
              <Button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-medium"
                size="lg"
              >
                Setuju
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
