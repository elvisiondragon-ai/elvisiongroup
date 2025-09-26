import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Minus, Check, Activity, ChevronLeft, ChevronRight, Calendar, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface EliteHabitEntry {
  id?: string;
  user_id?: string;
  user_email?: string;
  exercise_type: string;
  duration_minutes: number;
  date: string;
  notes?: string;
  created_at?: string;
}

const EXERCISE_OPTIONS = [
  'Plank',
  'Lari',
  'Renang',
  'Jalan santai',
  'Jalan di alam',
  'Push-up',
  'Yoga',
  'Meditasi jalan',
  'Bersepeda',
  'Senam'
];

export function EliteHabit() {
  const { awardXP } = useXPSystem();
  const { toast } = useToast();
  const { user, userProfile, handleAuthError, handleButtonTimeout } = useUserProfile();
  const [selectedExercise, setSelectedExercise] = useState('');
  const [duration, setDuration] = useState(5);
  const [notes, setNotes] = useState('');
  const [todayEntries, setTodayEntries] = useState<EliteHabitEntry[]>([]);
  const [totalEliteHabits, setTotalEliteHabits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allEntries, setAllEntries] = useState<EliteHabitEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showReports, setShowReports] = useState(true);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const today = new Date().toDateString();

  // Load habit data when user is available
  useEffect(() => {
    const loadInitialData = async () => {
      const currentUser = await supabase.auth.getUser();
      if (currentUser.data.user) {
        loadHabitData();
      }
    };
    loadInitialData();
  }, []);

  const loadHabitData = async () => {
    const currentUser = await supabase.auth.getUser();
    if (!currentUser.data.user) return;

    try {
      // Load today's entries
      const { data: todayData } = await supabase
        .from('elite_habits')
        .select('*')
        .eq('user_id', currentUser.data.user.id)
        .gte('created_at', new Date(today).toISOString())
        .lt('created_at', new Date(new Date(today).getTime() + 24*60*60*1000).toISOString());

      if (todayData) {
        setTodayEntries(todayData);
      }

      // Load all entries for reports (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: allData } = await supabase
        .from('elite_habits')
        .select('*')
        .eq('user_id', currentUser.data.user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (allData) {
        setAllEntries(allData);
      }

      // Use cached total from userProfile context or fetch if not available
      if (userProfile?.total_elite_habit !== undefined) {
        setTotalEliteHabits(userProfile.total_elite_habit);
      } else {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('total_elite_habit')
          .eq('user_id', currentUser.data.user.id)
          .single();
          
        if (profileData) {
          setTotalEliteHabits(profileData.total_elite_habit || 0);
        }
      }
    } catch (error) {
      console.error('Error loading habit data:', error);
    }
  };

  const adjustDuration = (increment: number) => {
    setDuration(prev => Math.max(5, prev + increment));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // No pagination - show all entries with scrollable container

  const submitHabit = async (buttonElement?: HTMLElement) => {
    if (!selectedExercise || !notes.trim()) return;

    // Ensure user is available
    const currentUser = await supabase.auth.getUser();
    if (!currentUser.data.user) {
      handleAuthError(buttonElement);
      return;
    }

    setLoading(true);
    try {
      // Insert habit entry
      const { error: insertError } = await supabase
        .from('elite_habits')
        .insert({
          user_id: user.id,
          user_email: user.email || 'anonymous',
          exercise_type: selectedExercise,
          duration_minutes: duration,
          date: today,
          notes: notes.trim()
        });

      if (insertError) throw insertError;

      // Update total_elite_habit counter FIRST - get fresh count from DB to prevent mismatch
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_elite_habit')
        .eq('user_id', currentUser.data.user.id)
        .maybeSingle();

      const currentCount = currentProfile?.total_elite_habit || 0;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          total_elite_habit: currentCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.data.user.id);

      if (profileError) {
        console.error('Error updating profile total_elite_habit:', profileError);
      }

      // Award XP AFTER counter increment (XP can be blocked by daily limit)
      awardXP('elite_habit_completion', 10, 'Completed elite habit exercise');

      // Reset form
      setSelectedExercise('');
      setDuration(5);
      setNotes('');

      // Reload data
      loadHabitData();

      // Auto-show reports after submitting
      setShowReports(true);

    } catch (error) {
      console.error('Elite habit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('elite_habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', currentUser.data.user.id);

      if (error) {
        toast({
          title: "❌ Gagal menghapus",
          description: "Terjadi kesalahan saat menghapus elite habit",
          variant: "destructive"
        });
        return;
      }

      // Update total_elite_habit counter (decrement) - get fresh count from DB
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_elite_habit')
        .eq('user_id', currentUser.data.user.id)
        .maybeSingle();

      const currentCount = currentProfile?.total_elite_habit || 0;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          total_elite_habit: Math.max(0, currentCount - 1),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.data.user.id);

      if (profileError) {
        console.error('Error updating profile total_elite_habit:', profileError);
      }

      toast({
        title: "Elite Habit Deleted 🔥",
        variant: "default"
      });

      // Reload data
      loadHabitData();
    } catch (error) {
      console.error("Error deleting elite habit:", error);
      toast({
        title: "❌ Gagal menghapus", 
        description: "Terjadi kesalahan sistem",
        variant: "destructive"
      });
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <CardTitle className="text-xl text-emerald-100">
              Elite Habit
            </CardTitle>
          </div>
          <CardDescription className="text-emerald-300 text-sm leading-relaxed">
            Kegiatan yang memudahkan konsentrasi dan ketenangan. Bersifat olahraga yang terkonsentrasi dengan mindfulness - menikmati setiap tahapan dan memindahkan konsentrasi ke hal menenangkan.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tutorial Section - Accordion */}
      <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 shadow-lg">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tutorial">
            <AccordionTrigger className="px-6 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-800/20 rounded-lg transition-colors">
              <div className="text-left flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg animate-pulse">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Mengapa Elite Habit Berbeda dari Olahraga Biasa?
                    <span className="text-emerald-400 text-2xl animate-bounce">👇</span>
                  </h3>
                  <p className="text-sm text-teal-300 mt-1 font-medium">
                    💡 Click Untuk Paham - Fokus Natural Training ⚡
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="space-y-6 pt-2">
                <div className="text-center">
                  <p className="text-emerald-200 text-sm leading-relaxed max-w-2xl mx-auto">
                    Elite Habit adalah latihan fokus alami dengan tekanan ringan untuk kehidupan nyata.
                  </p>
                </div>

                {/* Core Difference */}
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 bg-emerald-800/30 rounded-lg border border-emerald-500/30">
                      <h5 className="font-medium text-emerald-300 mb-2 flex items-center gap-2">
                        🎯 Olahraga Biasa vs Elite Habit
                      </h5>
                      <div className="space-y-3 text-emerald-200 leading-relaxed" style={{fontSize: '16px'}}>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-3 bg-red-900/20 rounded border-l-4 border-red-500">
                            <h6 className="font-semibold text-red-300 mb-1">🏃 Olahraga Biasa:</h6>
                            <p>Fokus pada hasil: kalori terbakar, otot terbentuk, target tercapai</p>
                          </div>
                          <div className="p-3 bg-emerald-900/20 rounded border-l-4 border-emerald-500">
                            <h6 className="font-semibold text-emerald-300 mb-1">⭐ Elite Habit:</h6>
                            <p>Fokus pada proses: menikmati setiap tahapan, mindfulness, ketenangan</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-800/30 rounded-lg border border-emerald-500/30">
                      <h5 className="font-medium text-emerald-300 mb-2 flex items-center gap-2">
                        🧘 Contoh Elite Habit dalam Praktek
                      </h5>
                      <div className="space-y-3 text-emerald-200 leading-relaxed" style={{fontSize: '16px'}}>
                        <div className="space-y-3">
                          <div className="p-3 bg-emerald-700/20 rounded">
                            <h6 className="font-semibold text-teal-300">💪 Gym / Push-up:</h6>
                            <p>Nikmati napas saat angkat beban, rasakan grip tangan, fokus pada ritme pernapasan</p>
                          </div>
                          <div className="p-3 bg-emerald-700/20 rounded">
                            <h6 className="font-semibold text-teal-300">🚶 Jalan Santai:</h6>
                            <p>Rasakan kaki menyentuh tanah, dengarkan suara burung, nikmati daun-daun di taman</p>
                          </div>
                          <div className="p-3 bg-emerald-700/20 rounded">
                            <h6 className="font-semibold text-teal-300">🏊 Renang:</h6>
                            <p>Fokus pada gerakan air, suara gelembung, ritme napas yang teratur</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Goal */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-emerald-300 text-center">
                    🎯 Tujuan Elite Habit:
                  </h4>
                  
                  <div className="grid gap-3">
                    <div className="p-4 bg-gradient-to-r from-emerald-800/30 to-teal-800/30 rounded-lg border border-emerald-500/30">
                      <h5 className="font-medium text-emerald-300 mb-2 flex items-center gap-2">
                        🏋️ Melatih Fokus dengan Tekanan Ringan
                      </h5>
                      <p className="text-emerald-200 leading-relaxed" style={{fontSize: '16px'}}>
                        Seperti warm-up sebelum tantangan besar. Elite Habit melatih kemampuan memindahkan fokus ke hal menenangkan 
                        saat tubuh dalam "tekanan ringan" (olahraga).
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-teal-800/30 to-emerald-800/30 rounded-lg border border-teal-500/30">
                      <h5 className="font-medium text-teal-300 mb-2 flex items-center gap-2">
                        🎯 Aplikasi di Kehidupan Nyata
                      </h5>
                      <p className="text-teal-200 leading-relaxed" style={{fontSize: '16px'}}>
                        Saat menghadapi tekanan hidup (deadline, konflik, stress), Anda terlatih untuk memindahkan fokus 
                        ke hal menenangkan daripada mengikuti pola pikir kacau.
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-700/30 to-green-700/30 rounded-lg border border-green-500/30">
                      <h5 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                        💎 Hasil Akhir: Disiplin Mental
                      </h5>
                      <p className="text-green-200 leading-relaxed font-medium" style={{fontSize: '16px'}}>
                        Anda menjadi terlatih untuk tetap tenang dan fokus pada solusi, bukan terjebak dalam kekacauan pikiran 
                        saat menghadapi tantangan hidup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Stats */}
      <Card className="p-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {totalEliteHabits}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Elite Habits
          </div>
        </div>
      </Card>

      {/* Today's entries removed - all entries now show in main report below */}
      {false && todayEntries.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-emerald-400">Hari Ini:</h3>
          <div className="space-y-2">
            {todayEntries.map((entry, index) => (
              <div key={index} className="relative p-3 bg-emerald-900/20 rounded-lg space-y-2">
                {/* Delete Button */}
                <Button
                  onClick={() => handleDeleteHabit(entry.id!)}
                  className="absolute top-2 right-2 w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                  size="sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>

                <div className="flex items-center justify-between pr-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">{entry.exercise_type}</span>
                  </div>
                  <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                    {entry.duration_minutes} menit
                  </Badge>
                </div>
                {entry.notes && (
                  <div className="text-xs text-emerald-300 bg-emerald-800/20 p-2 rounded border-l-2 border-emerald-500">
                    <strong>Catatan:</strong> {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add New Habit */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-emerald-400">
          Tambah Elite Habit Hari Ini
        </h3>

        {/* Exercise Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Pilih Olahraga:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EXERCISE_OPTIONS.map((exercise) => (
              <Button
                key={exercise}
                variant={selectedExercise === exercise ? "default" : "outline"}
                className={`text-left justify-start ${
                  selectedExercise === exercise
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'border-emerald-500/30 hover:border-emerald-500'
                }`}
                onClick={() => setSelectedExercise(exercise)}
              >
                {exercise}
              </Button>
            ))}
          </div>
        </div>

        {/* Duration Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Durasi (menit):
          </label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustDuration(-5)}
              className="border-emerald-500/30 hover:border-emerald-500"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {duration}
              </div>
              <div className="text-xs text-muted-foreground">
                menit
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustDuration(5)}
              className="border-emerald-500/30 hover:border-emerald-500"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notes Field - Required */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Catatan (wajib): <span className="text-red-400">*</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bagaimana perasaan Anda setelah aktivitas ini? Efek pada peredaran darah, konsentrasi, dan ketenangan..."
            className={`w-full p-3 rounded-lg bg-background border text-sm resize-none ${
              notes.trim() === '' 
                ? 'border-red-500/50 focus:border-red-500' 
                : 'border-emerald-500/30 focus:border-emerald-500'
            }`}
            rows={3}
            required
          />
          <p className="text-xs text-emerald-300/80 mt-1">
            <span className="text-red-400">*Wajib diisi:</span> Catat bagaimana aktivitas ini mempengaruhi peredaran darah dan kemudahan bermeditasi Anda
          </p>
        </div>

        {/* Submit Button */}
        <Button
          ref={submitButtonRef}
          onClick={async () => {
            // Simple getSession check
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              toast({
                title: "Please Log In",
                description: "You need to log in to save elite habits",
                variant: "destructive"
              });
              return;
            }
            
            console.log('BUTTON CLICKED!');
            handleButtonTimeout(
              () => submitHabit(submitButtonRef.current || undefined),
              submitButtonRef.current || undefined
            );
          }}
          disabled={!selectedExercise || !notes.trim() || loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600"
          size="lg"
        >
          {loading ? (
            <>Menyimpan...</>
          ) : !selectedExercise ? (
            <>Pilih olahraga terlebih dahulu</>
          ) : !notes.trim() ? (
            <>Tulis catatan wajib terlebih dahulu</>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Catat Elite Habit
            </>
          )}
        </Button>

        {/* Reports always visible - no toggle needed */}
      </Card>

      {/* Reports Section - Always Visible */}
      {(
        <Card className="p-6 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-emerald-400">
              Laporan Elite Habit (30 Hari Terakhir)
            </h3>
            <Badge variant="secondary" className="ml-2">
              {allEntries.length}
            </Badge>
          </div>

          {allEntries.length === 0 ? (
            <div className="text-center py-8 text-emerald-300">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada laporan Elite Habit</p>
              <p className="text-sm text-muted-foreground">
                Mulai catat aktivitas mindful Anda hari ini
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {allEntries.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="relative p-4 bg-emerald-800/20 rounded-lg border border-emerald-500/20 space-y-2"
                >
                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDeleteHabit(entry.id!)}
                    className="absolute top-2 right-2 w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
                    size="sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>

                  <div className="flex items-center justify-between pr-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-medium text-emerald-100">
                          {entry.exercise_type}
                        </div>
                        <div className="text-xs text-emerald-300">
                          {formatDate(entry.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                        {entry.duration_minutes} min
                      </Badge>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="text-xs text-emerald-300 bg-emerald-700/20 p-2 rounded border-l-2 border-emerald-500">
                      <strong>Catatan:</strong> {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {allEntries.length > 0 && (
            <div className="mt-4 p-3 bg-emerald-800/10 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-300">Total minggu ini:</span>
                <span className="text-emerald-400 font-medium">
                  {allEntries.filter(entry => {
                    const entryDate = new Date(entry.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return entryDate >= weekAgo;
                  }).length} aktivitas
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-emerald-300">Total durasi minggu ini:</span>
                <span className="text-emerald-400 font-medium">
                  {allEntries
                    .filter(entry => {
                      const entryDate = new Date(entry.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return entryDate >= weekAgo;
                    })
                    .reduce((total, entry) => total + entry.duration_minutes, 0)} menit
                </span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Info */}
      <Card className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
        <div className="text-sm text-blue-300 leading-relaxed">
          <strong>💡 Tips Elite Habit:</strong> Fokus pada mindfulness selama olahraga.
          Nikmati setiap gerakan, rasakan napas, dan pindahkan konsentrasi dari masalah harian
          ke sensasi tubuh yang menenangkan. Data ini akan membantu RENATA memberikan
          rekomendasi yang lebih akurat berdasarkan keseimbangan spiritual dan fisik Anda.
        </div>
      </Card>
    </div>
  );
}