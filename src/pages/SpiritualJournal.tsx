import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, ArrowLeft, Save, Heart, Wind, DollarSign, Sparkles, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useXPSystem } from "@/hooks/useXPSystem";

interface SpiritualJournalProps {
  onNavigate: (tab: string) => void;
}

interface Reflection {
  id: string;
  question: string;
  reflection: string;
  created_at: string;
}

export function SpiritualJournal({ onNavigate }: SpiritualJournalProps) {
  const [reflection, setReflection] = useState("");
  const [playingJournal, setPlayingJournal] = useState<number | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { awardXP } = useXPSystem();

  const currentQuestion = "Apa yang paling ingin kamu lepaskan hari ini, agar hatimu bisa ringan kembali?";

  // Check if user has access to a journal
  const hasAccess = (journal: any) => {
    if (!userProfile) return false;
    const userLevel = userProfile.level || 1;
    const isPro = userProfile.is_vip || false;
    
    // Always allow access to level 1 journals
    if (journal.levelRequired <= 1) return true;
    
      // Check Pro requirement
      if (journal.isProRequired && !isPro) return false;
    
    // Check level requirement
    return userLevel >= journal.levelRequired;
  };

  const handlePlay = (journalId: number) => {
    // Check if journal is locked
    const journal = journals.find(j => j.id === journalId);
    if (!journal || !userProfile) return;
    
    const isLocked = !hasAccess(journal);
    
    if (isLocked) {
      const proMessage = journal.isProRequired ? " atau beli Pro" : "";
      toast({
        title: "Akses Terbatas",
        description: `Level mu belum cukup (butuh level ${journal.levelRequired})${proMessage}`,
        variant: "destructive"
      });
      return;
    }

    const audioUrl = "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Jurnalsyukur1.MP3";
    
    // If currently playing this journal, stop it completely and reset
    if (playingJournal === journalId && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      // Clean up all event listeners properly
      currentAudio.oncanplay = null;
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.onloadstart = null;
      currentAudio.onloadeddata = null;
      setCurrentAudio(null);
      setPlayingJournal(null);
      return;
    }

    // Stop and cleanup any existing audio completely
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.oncanplay = null;
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.onloadstart = null;
      currentAudio.onloadeddata = null;
      setCurrentAudio(null);
      setPlayingJournal(null);
    }

    // Create and configure new audio with security features
    const audio = new Audio(audioUrl);
    audio.preload = 'metadata';
    
    // Prevent download and right-click context menu
    audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
    audio.setAttribute('disablePictureInPicture', 'true');
    audio.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Set playing state and current audio reference first
    setPlayingJournal(journalId);
    setCurrentAudio(audio);
    
    // Setup event handlers using direct property assignment (easier cleanup)
    audio.oncanplay = () => {
      // Double check this is still the current audio to prevent race conditions
      if (audio === currentAudio) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Error",
            description: "Gagal memutar audio",
            variant: "destructive"
          });
          if (audio === currentAudio) {
            setPlayingJournal(null);
            setCurrentAudio(null);
          }
        });
      }
    };
    
    audio.onended = () => {
      if (audio === currentAudio) {
        setPlayingJournal(null);
        setCurrentAudio(null);
      }
    };
    
    audio.onerror = () => {
      if (audio === currentAudio) {
        toast({
          title: "Error",
          description: "Gagal memuat audio",
          variant: "destructive"
        });
        setPlayingJournal(null);
        setCurrentAudio(null);
      }
    };
  };

  const journals = [
    {
      id: 1,
      title: "Guide to Inner Silence",
      subtitle: "Audio Pembuka Renungan",
      duration: "2 menit",
      icon: Sparkles,
      gradient: "bg-gradient-primary",
      borderColor: "border-primary/30",
      glowClass: "glow-primary",
      levelRequired: 1,
      isProRequired: false
    },
    {
      id: 2,
      title: "Nafasmu lebih berharga dari masalahmu",
      subtitle: "Audio Pembuka Renungan",
      duration: "5 menit",
      icon: Wind,
      gradient: "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20",
      borderColor: "border-cyan-400/30",
      glowClass: "glow-accent",
      levelRequired: 5,
      isProRequired: true
    },
    {
      id: 3,
      title: "Cinta Pasanganmu adalah Cerminan Frekuensi mu",
      subtitle: "Audio Pembuka Renungan",
      duration: "8 menit",
      icon: Heart,
      gradient: "bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-red-500/20",
      borderColor: "border-pink-400/30",
      glowClass: "hover:shadow-pink-500/20",
      levelRequired: 7,
      isProRequired: true
    },
    {
      id: 4,
      title: "Cinta Adalah Kesehatan",
      subtitle: "Audio Pembuka Renungan",
      duration: "10 menit",
      icon: Heart,
      gradient: "bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-red-500/20",
      borderColor: "border-pink-400/30",
      glowClass: "hover:shadow-pink-500/20",
      levelRequired: 8,
      isProRequired: true
    },
    {
      id: 5,
      title: "Uang adalah Frekuensi Energi",
      subtitle: "Audio Pembuka Renungan",
      duration: "7 menit",
      icon: DollarSign,
      gradient: "bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-500/20",
      borderColor: "border-amber-400/30",
      glowClass: "hover:shadow-amber-500/20",
      levelRequired: 9,
      isProRequired: true
    }
  ];

  useEffect(() => {
    // Get current user and load reflections
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        loadReflections(session.user.id);
        loadUserProfile(session.user.id);
      }
    };

    getCurrentUser();

    // Cleanup audio on unmount
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Default profile if not found
        setUserProfile({ level: 1, is_vip: false });
      }
    } catch (error) {
      console.error('Error:', error);
      setUserProfile({ level: 1, is_vip: false });
    }
  };

  const loadReflections = async (userId: string) => {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reflections:', error);
    } else {
      setReflections(data || []);
    }
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim() || !currentUser) {
      toast({
        title: "Error",
        description: "Silakan tulis renungan Anda terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('reflections')
      .insert({
        user_id: currentUser.id,
        question: currentQuestion,
        reflection: reflection.trim()
      });

    if (error) {
      console.error('Error saving reflection:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan renungan",
        variant: "destructive"
      });
    } else {
      // Award XP for completing spiritual journal reflection
      awardXP('journal_completion', 5, 'Completed spiritual journal reflection');
      
      toast({
        title: "Tersimpan",
        description: "Renungan Anda telah disimpan",
      });
      setReflection("");
      loadReflections(currentUser.id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
            Jurnal Spiritual
          </h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Journal Audio Sections */}
        {journals.map((journal) => {
          const Icon = journal.icon;
          const isCurrentlyPlaying = playingJournal === journal.id;
          const isLocked = !hasAccess(journal);
          
          return (
            <Card key={journal.id} className={`relative p-6 ${journal.gradient} border-2 ${journal.borderColor} ${journal.glowClass} overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-75' : ''}`}>
              {/* Animated background ripple */}
              <div className="absolute inset-0 opacity-20">
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/20 ${isCurrentlyPlaying ? 'animate-ping' : ''}`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 ${isCurrentlyPlaying ? 'animate-pulse' : ''}`}></div>
              </div>
              
              <div className="relative z-10 text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Icon className="w-6 h-6 text-foreground" />
                  <h2 className="text-xl font-semibold font-orbitron text-foreground">
                    {journal.title}
                  </h2>
                  {isLocked && (
                    <Lock className="w-5 h-5 text-muted-foreground ml-2" />
                  )}
                </div>
                <p className="text-muted-foreground">
                  {journal.subtitle}
                </p>
                
                 <div className="flex justify-center py-4">
                   <Button
                     onClick={() => {
                       if (playingJournal === journal.id && currentAudio) {
                         // Stop current audio if this journal is playing
                         currentAudio.pause();
                         currentAudio.currentTime = 0;
                         setCurrentAudio(null);
                         setPlayingJournal(null);
                       } else {
                         // Stop any currently playing audio first
                         if (currentAudio) {
                           currentAudio.pause();
                           currentAudio.currentTime = 0;
                         }
                         
                         // Play audio for Journal Spiritual 1
                         const audioUrl = journal.id === 1 
                           ? 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio-files/Jurnalsyukur1.MP3'
                           : null;
                         
                         if (audioUrl) {
                           const audio = new Audio(audioUrl);
                           
                           // Prevent download and right-click context menu
                           audio.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen');
                           audio.setAttribute('disablePictureInPicture', 'true');
                           audio.preload = 'metadata';
                           
                           // Add security attributes
                           audio.addEventListener('contextmenu', (e) => e.preventDefault());
                           
                           audio.play().then(() => {
                             setCurrentAudio(audio);
                             setPlayingJournal(journal.id);
                           }).catch(error => {
                             console.error('Error playing audio:', error);
                           });
                           
                            // Handle audio end
                            audio.addEventListener('ended', () => {
                              setCurrentAudio(null);
                              setPlayingJournal(null);
                              
                              // Award XP for completing spiritual journal audio
                              awardXP('audio_completion', 10, `Completed ${journal.title}`, {
                                journalId: journal.id,
                                journalTitle: journal.title
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
                       }
                     }}
                     disabled={isLocked}
                     className={`w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 ${isCurrentlyPlaying ? 'scale-110 shadow-lg' : ''} ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                   >
                    {isLocked ? (
                      <Lock className="w-6 h-6 text-foreground" />
                    ) : isCurrentlyPlaying ? (
                      <Pause className="w-6 h-6 text-foreground animate-pulse" />
                    ) : (
                      <Play className="w-6 h-6 text-foreground" />
                    )}
                  </Button>
                </div>
                
                 <p className="text-sm text-muted-foreground">
                   {isLocked 
                     ? `Level ${journal.levelRequired} required${journal.isProRequired ? ' • Pro' : ''}`
                     : `Dengarkan dan renungkan selama ${journal.duration}`
                   }
                 </p>
              </div>
            </Card>
          );
        })}

        {/* Tutorial Section */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold font-orbitron text-foreground">
              Tutorial
            </h3>
            <div className="space-y-3">
            <p className="text-foreground font-medium leading-relaxed">
              Keinginan yang kamu lepaskan, terwujud ke hidupmu..<br></br> Emosi negatif yang kamu lepaskan, akan Menjadi Energi Ignis Memory mu..
            </p>
              <p className="text-muted-foreground text-sm">
                Riwayat Jurnal eL Vision Ini alat ukurmu setiap bulan
              </p>
            </div>
          </div>
        </Card>

        {/* Daily Reflection Section */}
        <Card className="p-6 bg-gradient-secondary border-2 border-accent/30 glow-accent">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-orbitron text-foreground">
              Pertanyaan Hari Ini
            </h3>
            
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <p className="text-foreground leading-relaxed">
                "{currentQuestion}"
              </p>
            </div>
            
            <div className="space-y-3">
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Tulis jawabanmu di sini..."
                className="min-h-32 cyber-input bg-card/30 border-border focus:border-primary resize-none"
                rows={6}
              />
              
              <Button
                onClick={handleSaveReflection}
                disabled={!reflection.trim()}
                className="w-full bg-gradient-accent hover:opacity-90 text-background font-medium glow-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Renungan
              </Button>
            </div>
          </div>
        </Card>

        {/* Reflection History */}
        {reflections.length > 0 && (
          <Card className="p-6 bg-gradient-subtle border-2 border-muted/30">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-orbitron text-foreground">
                Riwayat Renungan
              </h3>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {reflections.map((refl) => (
                  <div key={refl.id} className="p-4 rounded-lg bg-card/30 border border-border space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {new Date(refl.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground italic mb-2">
                      "{refl.question}"
                    </div>
                    <div className="text-foreground leading-relaxed">
                      {refl.reflection}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Done Button */}
      <div className="fixed bottom-6 left-6 right-6">
        <Button
          onClick={() => onNavigate("home")}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3 rounded-full glow-primary"
        >
          Done
        </Button>
      </div>

      {/* Enhanced Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-transparent animate-pulse"></div>
        
        {/* Floating cosmic particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-accent rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-primary rounded-full opacity-50 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-accent rounded-full opacity-30 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '5s'}}></div>
        <div className="absolute top-1/6 right-1/3 w-2 h-2 bg-primary rounded-full opacity-70 animate-pulse" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-accent rounded-full opacity-50 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}></div>
        <div className="absolute top-2/3 right-1/6 w-2 h-2 bg-primary rounded-full opacity-40 animate-pulse" style={{animationDelay: '1.2s'}}></div>
        
        {/* Glowing ambient areas with enhanced effects */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-primary/4 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-l from-accent/4 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-radial from-primary/6 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s', animationDuration: '7s'}}></div>
        <div className="absolute top-1/6 right-1/5 w-40 h-40 bg-gradient-to-br from-accent/3 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s', animationDuration: '5s'}}></div>
        
        {/* Moving energy streams */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-accent/15 to-transparent animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        </div>
      </div>
    </div>
  );
}
