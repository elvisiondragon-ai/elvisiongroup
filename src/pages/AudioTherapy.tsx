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

interface AudioTherapyProps {
  onNavigate: (tab: string) => void;
}

export function AudioTherapy({ onNavigate }: AudioTherapyProps) {
  const { t, i18n } = useTranslation();
  const [userLevel] = useState(3); // Mock user level
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const { awardXP } = useXPSystem();

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === "elvisiondragon@gmail.com");
      await fetchAudioTracks();
      setLoading(false);
    };
    
    initializeData();
  }, []);

  // Refetch audio tracks when language changes
  useEffect(() => {
    fetchAudioTracks();
  }, [i18n.language]);

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

  const verses = [
    {
      id: 1,
      title: "Verse 1 - The Space Hill",
      subtitle: "Kedamaian Batin",
      unlocked: true,
      requiredLevel: 1,
      artwork: verseArtwork,
      audioUrl: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Verse1%20-%20The%20Space%20Hill%20-%20low%20env.MP3',
      language: 'en'
    },
    {
      id: 2,
      title: "Verse 2",
      subtitle: "Coming Soon",
      unlocked: false,
      requiredLevel: 5,
      artwork: verse2Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 3,
      title: "Verse 3 - Meditasi Syukur Powerful",
      subtitle: "Divine Connection",
      unlocked: userLevel >= 10,
      requiredLevel: 6,
      artwork: verse3Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 4,
      title: "Verse 4: Vitality Vortex",
      subtitle: "Mengisi ulang energi fisik dan mental untuk hari yang produktif",
      unlocked: false,
      requiredLevel: 6,
      artwork: verse4Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 5,
      title: "Verse 5: Momentum Matrix",
      subtitle: "Mengaktifkan semangat dan fokus untuk menyelesaikan tugas tanpa menunda",
      unlocked: false,
      requiredLevel: 7,
      artwork: verse5Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 6,
      title: "Verse 6: Confidence Core",
      subtitle: "Menumbuhkan keyakinan diri agar berani mengambil langkah penting",
      unlocked: false,
      requiredLevel: 8,
      artwork: verse6Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 7,
      title: "Verse 7: Love Magnet",
      subtitle: "Menarik cinta dan kasih sayang dari orang-orang di sekitar",
      unlocked: false,
      requiredLevel: 9,
      artwork: verse7Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 8,
      title: "Verse 8: Family Harmony",
      subtitle: "Menenangkan emosi dan memperkuat hubungan keluarga",
      unlocked: false,
      requiredLevel: 10,
      artwork: verse8Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 9,
      title: "Verse 9: Stress Release",
      subtitle: "Melepaskan ketegangan dan beban pikiran, membawa rasa lega",
      unlocked: false,
      requiredLevel: 11,
      artwork: verse9Artwork,
      audioUrl: null,
      language: 'id'
    },
    {
      id: 10,
      title: "Verse 10: Healing Heart",
      subtitle: "Menyembuhkan luka batin dan memulihkan kedamaian hati",
      unlocked: false,
      requiredLevel: 12,
      artwork: verse10Artwork,
      audioUrl: null,
      language: 'id'
    },
  ];

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
          {t('audioTherapy.subtitle')}
        </p>
      </div>

      {/* Verses */}
      <div className="px-6 space-y-8">
        {verses.map((verse) => {

          return (
            <Card
              key={verse.id}
              className={`relative overflow-hidden border-2 transition-all duration-500 transform hover:scale-[1.02] ${
                verse.unlocked
                  ? "bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/40 shadow-2xl shadow-primary/20"
                  : "bg-gradient-to-br from-muted/20 to-background border-border/40 opacity-70"
              }`}
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
                  {verse.unlocked && verse.artwork ? (
                    <div className="relative group cursor-pointer">
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-xl animate-pulse"></div>
                      
                      {/* Main artwork container */}
                      <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary/60 to-accent/60 shadow-2xl shadow-primary/40">
                        <img
                          src={verse.artwork}
                          alt={`${verse.title} cosmic artwork`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/20"></div>
                      </div>
                      
                      {/* Play Button Overlay */}
                      <div 
                        className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center transition-all duration-500 cursor-pointer"
                        onClick={() => {
                           // Always stop any currently playing audio first
                           if (currentAudio) {
                             currentAudio.pause();
                             currentAudio.currentTime = 0;
                             setCurrentAudio(null);
                             setPlayingVerseId(null);
                           }

                           if (playingVerseId === verse.id) {
                             // If this verse was playing, just stop it (already handled above)
                             return;
                           }

                           // Start new audio
                           if (verse.audioUrl) {
                             const audio = new Audio(verse.audioUrl);
                             
                             // Prevent download and right-click context menu
                             audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
                             audio.setAttribute('disablePictureInPicture', 'true');
                             audio.preload = 'metadata';
                             
                             // Add security attributes
                             audio.addEventListener('contextmenu', (e) => e.preventDefault());
                             
                             // Set playing state immediately
                             setCurrentAudio(audio);
                             setPlayingVerseId(verse.id);
                             
                             audio.play().catch(error => {
                               console.error('Error playing audio:', error);
                               // Reset state if play fails
                               setCurrentAudio(null);
                               setPlayingVerseId(null);
                             });
                             
                             // Handle audio end
                             audio.addEventListener('ended', () => {
                               setCurrentAudio(null);
                               setPlayingVerseId(null);
                               
                               // Award XP for completing audio
                               const verseTitle = verse.title;
                               awardXP('audio_completion', 10, `Completed ${verseTitle}`, {
                                 verseId: verse.id,
                                 verseTitle: verseTitle
                               });
                             });
                             
                             // Prevent seeking beyond current position when paused
                             audio.addEventListener('pause', () => {
                               const currentTime = audio.currentTime;
                               audio.addEventListener('seeked', () => {
                                 if (audio.paused && audio.currentTime > currentTime + 1) {
                                   audio.currentTime = currentTime;
                                 }
                               });
                             });
                           }
                         }}
                      >
                         <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                           {playingVerseId === verse.id ? (
                             // Pause icon (two rectangles)
                             <div className="flex gap-1 items-center justify-center">
                               <div className="w-1.5 h-5 bg-white rounded-sm"></div>
                               <div className="w-1.5 h-5 bg-white rounded-sm"></div>
                             </div>
                           ) : (
                             // Play icon (triangle) - incline pattern
                             <div className="relative flex items-center justify-center">
                               <div 
                                 className="w-0 h-0 ml-1"
                                 style={{
                                   borderLeft: '14px solid white',
                                   borderTop: '10px solid transparent',
                                   borderBottom: '10px solid transparent',
                                   filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                 }}
                               />
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                   ) : (
                    <div className="relative">
                      {/* Locked or No Audio Container */}
                      <div className={`w-36 h-36 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-500 ${
                        !verse.unlocked
                          ? verse.requiredLevel === 10
                            ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-400/40 shadow-lg shadow-purple-500/20"
                            : "bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-400/40 shadow-lg shadow-rose-500/20"
                          : "bg-gradient-to-br from-muted/20 to-background border-muted-foreground/40"
                      }`}>
                        <div className="text-center space-y-3">
                          {!verse.unlocked ? (
                            <>
                              {verse.requiredLevel === 10 ? (
                                <Zap className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
                              ) : (
                                <Crown className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
                              )}
                              <div className="relative">
                                <Lock className="w-6 h-6 text-muted-foreground mx-auto" />
                              </div>
                            </>
                          ) : (
                            <>
                              <Music className="w-12 h-12 text-muted-foreground mx-auto" />
                              <div className="text-xs text-muted-foreground font-medium">
                                Coming Soon
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {!verse.unlocked && (
                        <>
                          <div className={`text-xs font-bold mt-3 ${
                            verse.requiredLevel === 10 ? "text-purple-400" : "text-rose-400"
                          }`}>
                            {t('audioTherapy.locked')}
                          </div>
                          
                          {/* Animated glow ring */}
                          <div className={`absolute inset-0 rounded-full animate-pulse ${
                            verse.requiredLevel === 10
                              ? "bg-gradient-to-r from-purple-500/10 to-violet-500/10"
                              : "bg-gradient-to-r from-rose-500/10 to-pink-500/10"
                          } blur-xl`}></div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Status/Button */}
                {verse.unlocked ? (
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
                    <div className="text-xs text-primary/80 font-medium">✨ {t('audioTherapy.unlocked')} ✨</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Level requirement badge */}
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border shadow-lg ${
                      verse.requiredLevel === 5 
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/40 text-amber-300"
                        : verse.requiredLevel === 10
                        ? "bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-400/40 text-purple-300"
                        : verse.requiredLevel === 15
                        ? "bg-gradient-to-r from-rose-500/20 to-pink-500/20 border-rose-400/40 text-rose-300"
                        : verse.requiredLevel === 20
                        ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/40 text-emerald-300"
                        : verse.requiredLevel === 25
                        ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-400/40 text-cyan-300"
                        : verse.requiredLevel === 30
                        ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/40 text-yellow-300"
                        : verse.requiredLevel === 35
                        ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/40 text-red-300"
                        : verse.requiredLevel === 40
                        ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border-indigo-400/40 text-indigo-300"
                        : "bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-400/40 text-violet-300"
                    }`}>
                      {verse.requiredLevel === 5 ? (
                        <Star className="w-4 h-4" />
                      ) : verse.requiredLevel === 10 ? (
                        <Zap className="w-4 h-4" />
                      ) : verse.requiredLevel === 15 ? (
                        <Crown className="w-4 h-4" />
                      ) : verse.requiredLevel === 20 ? (
                        <Shield className="w-4 h-4" />
                      ) : verse.requiredLevel === 25 ? (
                        <Gem className="w-4 h-4" />
                      ) : verse.requiredLevel === 30 ? (
                        <Flame className="w-4 h-4" />
                      ) : verse.requiredLevel === 35 ? (
                        <Eye className="w-4 h-4" />
                      ) : verse.requiredLevel === 40 ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Infinity className="w-4 h-4" />
                      )}
                      <span className="font-semibold text-sm">
                        🔒 {t('audioTherapy.levelRequired', { level: verse.requiredLevel })}
                      </span>
                    </div>
                    
                    {/* Progress hint */}
                    <div className="text-xs text-muted-foreground/80 bg-muted/20 px-4 py-2 rounded-full">
                      {verse.requiredLevel === 5 
                        ? "⭐ Continue your journey to unlock"
                        : verse.requiredLevel === 10
                        ? "⚡ Advance further to access"
                        : verse.requiredLevel === 15
                        ? "👑 Master level required"
                        : verse.requiredLevel === 20
                        ? "🛡️ Guardian level needed"
                        : verse.requiredLevel === 25
                        ? "💎 Sage wisdom required"
                        : verse.requiredLevel === 30
                        ? "🔥 Flame keeper level"
                        : verse.requiredLevel === 35
                        ? "👁️ Seer vision required"
                        : verse.requiredLevel === 40
                        ? "✨ Cosmic master level"
                        : "♾️ Infinite wisdom required"
                      }
                    </div>
                  </div>
                )}
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
    </div>
  );
}
