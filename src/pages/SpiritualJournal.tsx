import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, ArrowLeft, Save, Heart, Wind, DollarSign, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const currentQuestion = "Apa yang paling ingin kamu lepaskan hari ini, agar hatimu bisa ringan kembali?";

  const handlePlay = (journalId: number) => {
    setPlayingJournal(playingJournal === journalId ? null : journalId);
    // Here you would integrate audio playback
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
      glowClass: "glow-primary"
    },
    {
      id: 2,
      title: "Nafasmu lebih berharga dari kesulitanmu",
      subtitle: "Audio Pembuka Renungan",
      duration: "5 menit",
      icon: Wind,
      gradient: "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20",
      borderColor: "border-cyan-400/30",
      glowClass: "glow-accent"
    },
    {
      id: 3,
      title: "Cinta Adalah Kesehatan",
      subtitle: "Audio Pembuka Renungan",
      duration: "10 menit",
      icon: Heart,
      gradient: "bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-red-500/20",
      borderColor: "border-pink-400/30",
      glowClass: "hover:shadow-pink-500/20"
    },
    {
      id: 4,
      title: "Uang adalah Frekuensi Energi",
      subtitle: "Audio Pembuka Renungan",
      duration: "7 menit",
      icon: DollarSign,
      gradient: "bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-500/20",
      borderColor: "border-amber-400/30",
      glowClass: "hover:shadow-amber-500/20"
    }
  ];

  useEffect(() => {
    // Get current user and load reflections
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        loadReflections(session.user.id);
      }
    };

    getCurrentUser();
  }, []);

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
          
          return (
            <Card key={journal.id} className={`relative p-6 ${journal.gradient} border-2 ${journal.borderColor} ${journal.glowClass} overflow-hidden transition-all duration-300`}>
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
                </div>
                <p className="text-muted-foreground">
                  {journal.subtitle}
                </p>
                
                <div className="flex justify-center py-4">
                  <Button
                    onClick={() => handlePlay(journal.id)}
                    className={`w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 ${isCurrentlyPlaying ? 'scale-110 shadow-lg' : ''}`}
                  >
                    <Play className={`w-6 h-6 text-foreground ${isCurrentlyPlaying ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Dengarkan dan renungkan selama {journal.duration}
                </p>
              </div>
            </Card>
          );
        })}

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

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Cosmic particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-primary rounded-full opacity-50 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-accent rounded-full opacity-30 animate-pulse delay-1500"></div>
        <div className="absolute top-1/6 right-1/3 w-1 h-1 bg-primary rounded-full opacity-70 animate-pulse delay-700"></div>
        
        {/* Glowing ambient areas */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
