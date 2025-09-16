import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, BarChart3, BookOpen, Trash2 } from "lucide-react";
import { JournalAnalytics } from "@/components/JournalAnalytics";
import { ProUpgradeModal } from "@/components/ProUpgradeModal";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useXPSystem } from '@/hooks/useXPSystem';

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
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [activeTab, setActiveTab] = useState("journal");
  const { toast } = useToast();
  const { awardXP } = useXPSystem();

  const currentQuestion = "Apa yang paling ingin kamu lepaskan hari ini, agar hatimu bisa ringan kembali?";





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
    console.log('🔍 Loading reflections for user:', userId);

    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('📊 Reflections query result:', { data, error });

    if (error) {
      console.error('❌ Error loading reflections:', error);
    } else {
      console.log('✅ Successfully loaded reflections:', data?.length || 0, 'entries');
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

    console.log('💾 Attempting to save reflection for user:', currentUser.id);
    console.log('📝 Reflection content:', reflection.trim());

    const { data, error } = await supabase
      .from('reflections')
      .insert({
        user_id: currentUser.id,
        user_email: currentUser.email,
        question: currentQuestion,
        reflection: reflection.trim(),
        content: reflection.trim() // Populate both fields for RENATA compatibility
      })
      .select(); // Return the inserted data to verify

    if (error) {
      console.error('❌ Error saving reflection:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan renungan: ${error.message}`,
        variant: "destructive"
      });
    } else {
      console.log('✅ Reflection saved successfully:', data);

      // Award XP for completing spiritual journal reflection (this will show XP notification)
      awardXP('journal_completion', 1, 'Completed spiritual journal reflection');

      toast({
        title: "✅ Tersimpan",
        description: "Renungan berhasil disimpan ke database",
        variant: "default"
      });

      setReflection("");
      loadReflections(currentUser.id);
    }
  };

  const handleProUpgradeClick = () => {
    setShowProUpgrade(true);
  };

  const navigateToPayment = () => {
    setShowProUpgrade(false);
    onNavigate("payment");
  };

  const handleDeleteReflection = async (reflectionId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('reflections')
        .delete()
        .eq('id', reflectionId)
        .eq('user_id', currentUser.id);

      if (error) {
        toast({
          title: "❌ Gagal menghapus",
          description: "Terjadi kesalahan saat menghapus renungan",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "✅ Berhasil dihapus",
        description: "Renungan berhasil dihapus",
        variant: "default"
      });

      // Reload reflections
      loadReflections(currentUser.id);
    } catch (error) {
      console.error("Error deleting reflection:", error);
      toast({
        title: "❌ Gagal menghapus",
        description: "Terjadi kesalahan sistem",
        variant: "destructive"
      });
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
        {/* Tabs for Journal and Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Jurnal
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-6 mt-6">

        {/* Tutorial Section */}
        <Card className="p-8 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 border-2 border-amber-400/30 shadow-2xl">
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-amber-300 tracking-wider" style={{
              fontFamily: 'serif',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '0.1em'
            }}>
              Tutorial
            </h3>
            <div className="space-y-4">
              <p className="text-foreground font-serif text-lg leading-relaxed tracking-wide" style={{
                fontFamily: 'Times New Roman, serif',
                fontWeight: '500',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em'
              }}>
                Keinginan yang kamu lepaskan, terwujud ke hidupmu..<br/>
                Emosi negatif yang kamu lepaskan, akan Menjadi Energi Ignis Memory mu..
              </p>
              <p className="text-amber-200 text-xl font-serif font-bold leading-relaxed tracking-wide px-4" style={{
                fontFamily: 'Times New Roman, serif',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                letterSpacing: '0.05em',
                fontSize: '1.25rem'
              }}>
                "Riwayat Jurnal eL Vision Ini alat ukurmu setiap bulan, semakin dilepaskan keinginan semakin mudah terjadi"
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
                className="w-full bg-gradient-accent hover:opacity-90 text-background font-medium glow-accent transition-all duration-150 hover:scale-105 active:scale-95 active:translate-y-0.5 disabled:scale-100 disabled:translate-y-0"
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
                  <div key={refl.id} className="relative p-4 rounded-lg bg-card/30 border border-border space-y-2">
                    {/* Delete Button */}
                    <Button
                      onClick={() => handleDeleteReflection(refl.id)}
                      className="absolute top-2 right-2 w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                      size="sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>

                    <div className="text-sm text-muted-foreground pr-8">
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

          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <JournalAnalytics onUpgradeClick={handleProUpgradeClick} />
          </TabsContent>
        </Tabs>
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

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isVisible={showProUpgrade}
        onClose={() => setShowProUpgrade(false)}
        onNavigateToPayment={navigateToPayment}
        reason="analytics"
        userStats={{
          totalMeditations: reflections.length * 2, // Estimate based on journal entries
          daysActive: reflections.length,
          currentStreak: Math.min(7, reflections.length)
        }}
      />

    </div>
  );
}
