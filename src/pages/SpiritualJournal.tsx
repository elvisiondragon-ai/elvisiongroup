import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Save, Trash2, BookOpen, ChevronDown } from "lucide-react";
import { InvitePro } from "@/components/InvitePro";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAuth } from '@/contexts/AuthContext';

interface SpiritualJournalProps {
  onNavigate: (tab: string) => void;
}

interface Reflection {
  id: string;
  reflection: string;
  created_at: string;
}

export function SpiritualJournal({ onNavigate }: SpiritualJournalProps) {
  const [reflection, setReflection] = useState("");
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [isLoadingReflections, setIsLoadingReflections] = useState(true);
  const [totalReflections, setTotalReflections] = useState(0);
  const { toast } = useToast();
  const { awardXP } = useXPSystem();
  const { user, userProfile } = useUserProfile();
  const { userId } = useAuth();
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const currentQuestion = "Apa yang paling ingin kamu lepaskan hari ini, agar hatimu bisa ringan kembali?";





  // Load reflections when userId is available
  useEffect(() => {
    if (userId) {
      loadReflections(userId);
    } else {
      setIsLoadingReflections(false);
    }
  }, [userId]);

  // Remove auth listener - App.tsx handles this

  const loadReflections = async (userId: string) => {
    console.log('🔍 Loading reflections for user:', userId);
    setIsLoadingReflections(true);

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

    // Load total reflections from profile or use cached value
    if (userProfile?.total_journal !== undefined) {
      setTotalReflections(userProfile.total_journal);
    } else {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('total_journal')
        .eq('user_id', userId)
        .single();
        
      if (profileData) {
        setTotalReflections(profileData.total_journal || 0);
      }
    }
    
    setIsLoadingReflections(false);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveReflection = async () => {
    if (!reflection.trim()) {
      toast({
        title: "Error",
        description: "Silakan tulis renungan Anda terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "Silakan login terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    // Prevent rapid clicks
    if (isSaving) return;
    setIsSaving(true);

    console.log('💾 Attempting to save reflection for user:', userId);
    console.log('📝 Reflection content:', reflection.trim());

    const { data, error } = await supabase
      .from('reflections')
      .insert({
        user_id: userId,
        user_email: user?.email || '',
        reflection: reflection.trim()
      })
      .select(); // Return the inserted data to verify

    if (error) {
      console.error('❌ Error saving reflection:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan renungan: ${error.message}`,
        variant: "destructive"
      });
      setIsSaving(false);
    } else {
      console.log('%c✅ Reflection saved successfully:', 'color: green; font-weight: bold;', data);
      console.log('%c📝 Reflection query result - what was written:', 'color: green; font-weight: bold;', {
        user_id: userId,
        user_email: user?.email || '',
        reflection: reflection.trim(),
        saved_data: data
      });

      // Database triggers handle counter increment automatically - no manual update needed

      // Award XP AFTER counter increment (XP can be blocked by daily limit)
      awardXP('journal_completion', 1, 'Completed spiritual journal reflection');

      setReflection("");
      setIsSaving(false);
      
      // Update total display immediately
      setTotalReflections(prev => prev + 1);
      
      // Load reflections after UI update
      setTimeout(() => loadReflections(userId), 0);
    }
  };

  const handleProUpgradeClick = () => {
    setShowProUpgrade(true);
  };

  const handleDeleteReflection = async (reflectionId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('reflections')
        .delete()
        .eq('id', reflectionId)
        .eq('user_id', userId);

      if (error) {
        toast({
          title: "❌ Gagal menghapus",
          description: "Terjadi kesalahan saat menghapus renungan",
          variant: "destructive"
        });
        return;
      }

      // Database triggers handle counter decrement automatically - no manual update needed

      console.log('%c❌ Reflection deleted', 'color: red; font-weight: bold;', reflectionId);
      toast({
        title: "Reflection Deleted 🔥",
        variant: "default"
      });

      // Update total display immediately
      setTotalReflections(prev => Math.max(0, prev - 1));

      // Update local state instead of DB reload
      setReflections(prev => prev.filter(r => r.id !== reflectionId));
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

        {/* Tutorial Section - Accordion */}
        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 shadow-lg">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tutorial">
              <AccordionTrigger className="px-6 text-indigo-300 hover:text-indigo-200 hover:bg-indigo-800/20 rounded-lg transition-colors">
                <div className="text-left flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg animate-pulse">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      Mengapa Melepaskan Membuat Keinginan Terwujud?
                      <span className="text-yellow-400 text-2xl animate-bounce">👇</span>
                    </h3>
                    <p className="text-sm text-yellow-300 mt-1 font-medium">
                      💡 Click Untuk Paham - Sebelum memulai ⚡
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <div className="space-y-6 pt-2">
                  <div className="text-center">
                    <p className="text-indigo-200 text-sm leading-relaxed max-w-2xl mx-auto">
                      Keinginan yang kamu lepaskan, terwujud ke hidupmu.
                    </p>
                  </div>

                  {/* Real Life Examples */}
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="p-4 bg-indigo-800/30 rounded-lg border border-indigo-500/30">
                        <h5 className="font-medium text-indigo-300 mb-2 flex items-center gap-2">
                          🎯 Contoh 1: Melepaskan saat sudah hampir putus asa
                        </h5>
                        <div className="space-y-2 text-indigo-200 leading-relaxed" style={{fontSize: '16px'}}>
                          <p>Anda pasti pernah bahkan sering saat berusaha mendapatkan sesuatu atau seseorang. Berusaha mati matian namun terus seakan makin sulit dan semakin sulit.</p>
                          <p>Sampai pada titik anda merasa lelah dan tidak sepadan anda memutuskan melepaskan..</p>
                          <p className="font-semibold text-yellow-400">Alhasil, yang anda inginkan malah mendekati anda jadi mudah kan?</p>
                          <p className="font-semibold text-yellow-400">Itu memang hukum alam, you get what you let go. Kamu dapat yang kamu lepaskan</p>
                        </div>
                      </div>

                      <div className="p-4 bg-indigo-800/30 rounded-lg border border-indigo-500/30">
                        <h5 className="font-medium text-indigo-300 mb-2 flex items-center gap-2">
                          ⭐ Contoh 2: Seseorang yang ahli dan mudah
                        </h5>
                        <div className="space-y-2 text-indigo-200 leading-relaxed" style={{fontSize: '16px'}}>
                          <p>Anda pasti pernah melihat atau mungkin anda salah satunya. Saat orang tersebut menganggap sesuatu itu mudah dilakukan. Misalnya olahraga, atau mendapat pasangan, atau menyelesaikan pekerjaan..</p>
                          <p>Orang tersebut merasa itu hal yang mudah sehingga dibawa santai dan mudah dilepaskan. Bawaan nya happy melakukan hal yg terasa sulit bagi kebanyakan orang</p>
                          <p className="font-semibold text-yellow-400">Alhasil ? Hal tersebut jadi mudah untuk orang itu.</p>
                          <p className="font-semibold text-yellow-400">Itu bukan ketidak adilan. Memang begitu Hukum Alam nya</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Famous Examples */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-indigo-300 text-center">
                      Contoh Terkenal di Dunia:
                    </h4>
                    
                    <div className="grid gap-3">
                      <div className="p-3 bg-indigo-800/30 rounded-lg border border-indigo-500/30">
                        <h5 className="font-medium text-indigo-300 mb-2 flex items-center gap-2">
                          🏢 Steve Jobs & Apple (1997)
                        </h5>
                        <p className="text-indigo-200 leading-relaxed" style={{fontSize: '16px'}}>
                          Setelah dikeluarkan dari Apple, Jobs harus melepaskan ego dan dendam pribadi untuk kembali menyelamatkan perusahaan yang dia dirikan. Hasilnya? Apple menjadi perusahaan paling berharga di dunia.
                        </p>
                      </div>

                      <div className="p-3 bg-indigo-800/30 rounded-lg border border-indigo-500/30">
                        <h5 className="font-medium text-indigo-300 mb-2 flex items-center gap-2">
                          ✍️ Elizabeth Gilbert - Kreativitas
                        </h5>
                        <p className="text-indigo-200 leading-relaxed" style={{fontSize: '16px'}}>
                          "Untuk memaksimalkan peluang sukses, kita perlu mencintai proses penciptaan sepenuh hati, lalu melepaskannya tanpa attachment pada hasil."
                        </p>
                      </div>

                      <div className="p-3 bg-indigo-800/30 rounded-lg border border-indigo-500/30">
                        <h5 className="font-medium text-indigo-300 mb-2 flex items-center gap-2">
                          🎯 Paradox Kontrol dalam Bisnis
                        </h5>
                        <p className="text-indigo-200 leading-relaxed" style={{fontSize: '16px'}}>
                          Gary Cooper dalam "The Success Paradox": Seorang workaholic yang nyaris mati, kemudian sukses luar biasa setelah belajar "surrender" dan melepaskan kebutuhan mengontrol segalanya.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Quote Card */}
        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 shadow-md">
          <div className="text-center p-6">
            <p className="text-indigo-200 font-semibold leading-relaxed max-w-xl mx-auto" style={{fontSize: '16px'}}>
              "Riwayat Jurnal eL Vision Ini alat ukurmu setiap bulan, semakin dilepaskan keinginan semakin mudah terjadi"
            </p>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-1">
              {reflections.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Reflections
            </div>
          </div>
        </Card>

        {/* Daily Reflection Section */}
        <Card className="bg-gradient-to-br from-indigo-600/20 via-purple-500/15 to-pink-600/20 border-2 border-indigo-400/40 shadow-xl backdrop-blur-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mt-6 mx-6" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              Pertanyaan Hari Ini
            </h3>
            
            <div className="p-4 rounded-lg bg-indigo-800/50 border border-indigo-400/50 shadow-inner">
              <p className="text-indigo-100 leading-relaxed" style={{fontSize: '17px'}}>
                "{currentQuestion}"
              </p>
            </div>
            
            <div className="space-y-3">
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Tulis jawabanmu di sini..."
                className="min-h-32 bg-black/60 border-purple-300/50 focus:border-purple-300 text-white placeholder:text-purple-300/70 resize-none rounded-lg"
                style={{fontSize: '17px'}}
                rows={6}
              />
              
              <Button
                ref={saveButtonRef}
                onClick={() => {
                  if (!userId) {
                    toast({
                      title: "Please Log In",
                      description: "You need to log in to save reflections",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  handleSaveReflection();
                }}
                disabled={!reflection.trim() || isSaving}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all duration-150 hover:scale-105 active:scale-95 active:translate-y-0.5 disabled:scale-100 disabled:translate-y-0 disabled:opacity-50"
                style={{}}
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Renungan
              </Button>
            </div>
          </div>
        </Card>

        {/* Reflection History - Always Visible */}
        <Card className="bg-gradient-to-br from-slate-600/15 via-gray-500/10 to-zinc-600/15 border-2 border-slate-400/30 shadow-xl backdrop-blur-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200 mt-6 mx-6" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              Riwayat Renungan
            </h3>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {isLoadingReflections ? (
                <div className="p-6 text-center">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-300 text-sm">
                    Memuat riwayat renungan...
                  </p>
                </div>
              ) : reflections.length > 0 ? (
                reflections.map((refl) => (
                  <div key={refl.id} data-reflection-id={refl.id} className="relative p-4 rounded-lg bg-black/25 border border-slate-300/30 space-y-2 hover:bg-black/35 transition-colors">
                    {/* Delete Button */}
                    <Button
                      onClick={() => {
                        // Make reflection disappear with cool slide left animation
                        const reflectionElement = document.querySelector(`[data-reflection-id="${refl.id}"]`);
                        if (reflectionElement) {
                          reflectionElement.style.opacity = '0';
                          reflectionElement.style.transform = 'translateX(-100%)';
                          reflectionElement.style.transition = 'all 0.3s ease-out';
                          
                          // Remove from database after animation
                          setTimeout(() => {
                            handleDeleteReflection(refl.id);
                          }, 300);
                        } else {
                          // Fallback if element not found
                          handleDeleteReflection(refl.id);
                        }
                      }}
                      className="absolute top-2 right-2 w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                      size="sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>

                    <div className="text-sm text-purple-300 pr-8">
                      {new Date(refl.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="text-white leading-relaxed" style={{fontSize: '17px'}}>
                      {refl.reflection}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-slate-300 text-sm">
                    Belum ada renungan tersimpan. Mulai tulis renungan pertamamu!
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

      </div>

      {/* Done Button */}
      <div className="fixed bottom-8 left-8 right-8">
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
      <InvitePro
        isVisible={showProUpgrade}
        onClose={() => setShowProUpgrade(false)}
        onNavigateToPayment={() => {
          setShowProUpgrade(false);
          onNavigate("payment");
        }}
        reason="journal"
        userStats={{
          totalMeditations: reflections.length * 2,
          daysActive: reflections.length,
          currentStreak: Math.min(7, reflections.length)
        }}
      />

    </div>
  );
}
