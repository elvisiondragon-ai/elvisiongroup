import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioUpload } from "@/components/AudioUpload";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Lock, ArrowLeft, Music, Upload as UploadIcon, Star, Zap, Crown, Shield, Gem, Flame, Eye, Sparkles, Globe, Infinity } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useXPSystem } from "@/hooks/useXPSystem";
import { usePro } from "@/hooks/usePro";
import { useMeditative } from "@/contexts/MeditativeContext";
import { VerseAudioCard } from "@/components/VerseAudioCard";
import { MeditativeState } from "@/components/MeditativeState";
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
import verse11Artwork from "@/assets/verse-11-cosmic.jpg";
import verse12Artwork from "@/assets/verse-12-cosmic.jpg";
import verse13Artwork from "@/assets/verse-13-cosmic.jpg";
import verse14Artwork from "@/assets/verse-14-cosmic.jpg";
import verse15Artwork from "@/assets/verse-15-cosmic.jpg";

interface AudioTherapyProps {
  onNavigate: (tab: string) => void;
}

export function AudioTherapy({ onNavigate }: AudioTherapyProps) {
  const { t, i18n } = useTranslation();
  const [userLevel, setUserLevel] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningResolver, setWarningResolver] = useState<((value: boolean) => void) | null>(null);
  const [meditativeState, setMeditativeState] = useState<{verse: any, audio: HTMLAudioElement} | null>(null);
  const { awardXP } = useXPSystem();
  const { proStatus } = usePro();
  const { setMeditativeActive } = useMeditative();

  // Shared state to track which verse is currently playing (verses only)
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [currentVerseAudio, setCurrentVerseAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === "elvisiondragon@gmail.com");
      
      if (user) {
        await fetchUserProfile(user.id);
      }
      
      await fetchAudioTracks();
      setLoading(false);
    };
    
    initializeData();
  }, []);

  // Refetch audio tracks when language changes
  useEffect(() => {
    fetchAudioTracks();
  }, [i18n.language]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('level')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setUserLevel(data.level);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchAudioTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .eq('category', 'verse')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching audio tracks:', error);
        return;
      }

      setAudioTracks(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUploadComplete = () => {
    fetchAudioTracks(); // Refresh the tracks list
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

  // Handle meditative state activation
  const handleMeditativeState = (verse: any, audio: HTMLAudioElement) => {
    setMeditativeState({ verse, audio });
    setMeditativeActive(true);
  };

  // Handle meditative state exit
  const handleMeditativeExit = () => {
    if (meditativeState?.audio) {
      meditativeState.audio.pause();
    }
    setMeditativeState(null);
    setCurrentPlayingVerse(null);
    setCurrentVerseAudio(null);
    setMeditativeActive(false);
  };

  // Handle meditative state exit with reset
  const handleMeditativeResetExit = () => {
    if (meditativeState?.audio) {
      meditativeState.audio.pause();
    }
    // Reset EXP here if needed
    setMeditativeState(null);
    setCurrentPlayingVerse(null);
    setCurrentVerseAudio(null);
    setMeditativeActive(false);
  };

  const verses = [
    {
      id: 1,
      title: "Verse 1 - The Space Hill",
      subtitle: "Kedamaian Batin",
      unlocked: true, // Allow access to all verses - users will discover levels naturally
      requiredLevel: 2,
      artwork: verseArtwork,
      audioPath: 'Verse1 - The Space Hill.MP3',
      language: 'en'
    },
    {
      id: 2,
      title: "Verse 2 - Lucid Beach",
      subtitle: "Relaksasi seperti berada di pantai, membantu tidur nyenyak dan pikiran jernih",
      unlocked: proStatus.isPro, // Lock for non-pro users
      requiredLevel: 2,
      artwork: verse2Artwork,
      audioPath: 'Verse2 - Lucid Beach.MP3',
      language: 'id'
    },
    {
      id: 3,
      title: "Verse 3 - Syukur Meditation",
      subtitle: "Menumbuhkan rasa syukur pada titik saraf seluruh tubuh",
      unlocked: proStatus.isPro, // Lock for non-pro users
      requiredLevel: 3,
      artwork: verse3Artwork,
      audioPath: 'Verse 3 - Syukur.MP3',
      language: 'id'
    },
    {
      id: 4,
      title: "Verse 4 - Prosperity Stream",
      subtitle: "Frekuensi Kaya Raya",
      unlocked: true,
      requiredLevel: 1,
      artwork: verse4Artwork,
      audioPath: 'Verse 4 - Prosperity Stream Vol. 1.MP3',
      language: 'id'
    },
    {
      id: 41,
      title: "Verse 4 - Prosperity Stream (English)",
      subtitle: "Prosperity Stream",
      unlocked: true,
      requiredLevel: 1,
      artwork: verse4Artwork,
      audioPath: 'Verse4-English.MP3',
      language: 'en'
    },
    {
      id: 5,
      title: "Verse 5 - Vitality Vortex",
      subtitle: "Memperbaiki ulang finansial, fisik dan mental untuk hidup yang sehat",
      unlocked: proStatus.isPro, // Lock for non-pro users
      requiredLevel: 6,
      artwork: verse5Artwork,
      audioPath: 'Verse5 - Virtality Vortex.MP3',
      language: 'id'
    },
    {
      id: 6,
      title: "Verse 6 - Beautify",
      subtitle: "Memfokuskan Kecantikan fisik yang mempesona setiap orang",
      unlocked: false, // Lock for all users
      requiredLevel: 7,
      artwork: verse6Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 7,
      title: "Verse 7 - Confidence Core",
      subtitle: "Menumbuhkan keyakinan diri agar berani mengambil langkah penting",
      unlocked: false, // Lock for all users
      requiredLevel: 8,
      artwork: verse7Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 8,
      title: "Verse 8 - Love Magnet",
      subtitle: "Menarik cinta dan kasih sayang dari orang-orang di sekitar",
      unlocked: false, // Lock for all users
      requiredLevel: 9,
      artwork: verse8Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 9,
      title: "Verse 9 - Family Harmony",
      subtitle: "Menenangkan emosi dan memperkuat hubungan keluarga",
      unlocked: false, // Lock for all users
      requiredLevel: 10,
      artwork: verse9Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 10,
      title: "Verse 10 - Healing Heart",
      subtitle: "Menyembuhkan luka batin dan memulihkan kedamaian hati",
      unlocked: false, // Lock for all users
      requiredLevel: 1,
      artwork: verse10Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 11,
      title: "Verse 11 - Inner Light",
      subtitle: "Membangkitkan cahaya batin untuk pencerahan spiritual",
      unlocked: false, // Lock for all users
      requiredLevel: 1,
      artwork: verse11Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 12,
      title: "Verse 12 - Divine Harmony",
      subtitle: "Menyelaraskan jiwa dengan harmoni ilahi alam semesta",
      unlocked: false, // Lock for all users
      requiredLevel: 1,
      artwork: verse12Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 13,
      title: "Verse 13 - Radiant Peace",
      subtitle: "Memancarkan kedamaian yang bercahaya dari dalam hati",
      unlocked: false, // Lock for all users
      requiredLevel: 14,
      artwork: verse13Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 14,
      title: "Verse 14 - Celestial Calm",
      subtitle: "Mencapai ketenangan surgawi yang abadi",
      unlocked: false, // Lock for all users
      requiredLevel: 1,
      artwork: verse14Artwork,
      audioPath: null,
      language: 'id'
    },
    {
      id: 15,
      title: "Verse 15 - Enlightened Serenity",
      subtitle: "Ketenangan yang tercerahkan dalam kesadaran murni",
      unlocked: false, // Lock for all users
      requiredLevel: 1,
      artwork: verse15Artwork,
      audioPath: null,
      language: 'id'
    },
  ];

  // Show meditative state if active
  if (meditativeState) {
    return (
      <MeditativeState
        verse={meditativeState.verse}
        audio={meditativeState.audio}
        onExit={handleMeditativeExit}
        onResetExit={handleMeditativeResetExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
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
            <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
              {t('audioTherapy.title')}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
        <p className="text-muted-foreground text-center">
          {t('Dengarkan Pakai Headphone')}
        </p>
      </div>

      {/* Verses */}
      <div className="px-6 space-y-8">
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
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {verse.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      verse.language === 'en' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {verse.language === 'en' ? 'EN' : 'ID'}
                    </span>
                  </div>
                  {verse.subtitle && (
                    <p className="text-sm text-muted-foreground/80 font-medium">
                      {verse.subtitle}
                    </p>
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
                  />
                </div>

                    <div className="space-y-4">
                    <Button
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-10 py-3 rounded-full shadow-lg shadow-primary/40 transform hover:scale-105 transition-all duration-300 border border-white/20"
                      onClick={() => {
                        onNavigate('tutorial');
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        {t('audioTherapy.readTutorial')}
                      </span>
                    </Button>
                  </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Audio Tracks Section - Show only first 2 tracks */}
      {audioTracks.length > 0 && (
        <div className="px-6 space-y-4">
          <h2 className="text-xl font-semibold font-orbitron text-foreground">
            {t('audioTherapy.availableTracks')}
          </h2>
          {audioTracks.slice(0, 2).map((track) => (
            <AudioPlayer
              key={track.id}
              title={track.title}
              description={track.description}
              src={track.file_url}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}
