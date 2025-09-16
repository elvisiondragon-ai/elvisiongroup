import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Check, Activity, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface EliteHabitEntry {
  id?: string;
  user_id?: string;
  user_email?: string;
  exercise_type: string;
  duration_minutes: number;
  date: string;
  created_at?: string;
}

const EXERCISE_OPTIONS = [
  'Plank',
  'Lari',
  'Renang',
  'Jalan santai',
  'Jalan di alam bebas',
  'Push-up',
  'Yoga',
  'Meditasi jalan',
  'Bersepeda',
  'Senam pernapasan'
];

export function EliteHabit() {
  const { userProfile, user, refreshProfile } = useUserProfile();
  const [selectedExercise, setSelectedExercise] = useState('');
  const [duration, setDuration] = useState(5);
  const [todayEntries, setTodayEntries] = useState<EliteHabitEntry[]>([]);
  const [totalEliteHabits, setTotalEliteHabits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allEntries, setAllEntries] = useState<EliteHabitEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showReports, setShowReports] = useState(false);

  const today = new Date().toDateString();

  // Load today's entries and total count
  useEffect(() => {
    if (!user) return;
    loadHabitData();
  }, [user]);

  const loadHabitData = async () => {
    if (!user) return;

    try {
      // Load today's entries
      const { data: todayData } = await supabase
        .from('elite_habits')
        .select('*')
        .eq('user_id', user.id)
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
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (allData) {
        setAllEntries(allData);
      }

      // Load total count from profile
      if (userProfile?.total_elite_habit) {
        setTotalEliteHabits(userProfile.total_elite_habit);
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

  // Pagination for reports
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(allEntries.length / ITEMS_PER_PAGE);
  const currentEntries = allEntries.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const submitHabit = async () => {
    if (!selectedExercise || !user) return;

    setLoading(true);
    try {
      // Insert habit entry
      const { error: insertError } = await supabase
        .from('elite_habits')
        .insert({
          user_id: user.id,
          exercise_type: selectedExercise,
          duration_minutes: duration,
          date: today
        });

      if (insertError) throw insertError;

      // Reset form (total_elite_habit will be updated automatically by database trigger)
      setSelectedExercise('');
      setDuration(5);

      // Reload data and refresh profile context
      loadHabitData();
      refreshProfile();

      // Auto-show reports after submitting
      setShowReports(true);

    } catch (error) {
      console.error('Error submitting habit:', error);
    } finally {
      setLoading(false);
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

      {/* Today's Entries */}
      {todayEntries.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-emerald-400">Hari Ini:</h3>
          <div className="space-y-2">
            {todayEntries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">{entry.exercise_type}</span>
                </div>
                <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                  {entry.duration_minutes} menit
                </Badge>
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

        {/* Submit Button */}
        <Button
          onClick={submitHabit}
          disabled={!selectedExercise || loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          size="lg"
        >
          {loading ? (
            <>Menyimpan...</>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Catat Elite Habit
            </>
          )}
        </Button>

        {/* Toggle Reports Button */}
        <Button
          variant="outline"
          onClick={() => setShowReports(!showReports)}
          className="w-full mt-4 border-emerald-500/30 hover:border-emerald-500"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {showReports ? 'Sembunyikan' : 'Lihat'} Laporan Elite Habit
          {allEntries.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {allEntries.length}
            </Badge>
          )}
        </Button>
      </Card>

      {/* Sliding Reports Section */}
      {showReports && (
        <Card className="p-6 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-emerald-400">
              Laporan Elite Habit (30 Hari Terakhir)
            </h3>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="border-emerald-500/30 hover:border-emerald-500"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-emerald-300">
                  {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="border-emerald-500/30 hover:border-emerald-500"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
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
            <div className="space-y-3">
              {currentEntries.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="flex items-center justify-between p-4 bg-emerald-800/20 rounded-lg border border-emerald-500/20"
                >
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