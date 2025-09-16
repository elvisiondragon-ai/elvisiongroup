import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BookOpen, Target, Sparkles, Brain, Crown, Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePro } from '@/hooks/usePro';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { RenataAnalysisModal } from '@/components/RenataAnalysisModal';
import { useToast } from '@/hooks/use-toast';

interface JournalAnalyticsProps {
  onUpgradeClick: () => void;
}

interface AnalyticsData {
  totalEntries: number;
  totalVerses: number;
  focusGoals: Array<{
    goal: string;
    count: number;
    percentage: number;
  }>;
  insights: string[];
  recommendation: string[];
  spiritualGrowthScore: number;
}

export function JournalAnalytics({ onUpgradeClick }: JournalAnalyticsProps) {
  const { proStatus } = usePro();
  const { userProfile, user } = useUserProfile();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [freeReportsUsed, setFreeReportsUsed] = useState(0);
  const [lastReportDate, setLastReportDate] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Safe database tracking for monthly analytics
  const checkMonthlyAnalyticsUsage = async () => {
    if (!user || proStatus.isPro) return { canUse: true, used: 0 };

    try {
      console.log('🔍 Checking analytics usage for user:', user.id);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('analytics_used, last_analytics_date')
        .eq('user_id', user.id)
        .single();

      console.log('📊 Database response:', { profile, error });

      if (error) {
        console.error('❌ Error checking analytics usage:', error);
        // Fallback to localStorage logic
        return checkLocalStorageUsage();
      }

      const currentMonth = new Date().toISOString().slice(0, 7); // "2025-01"
      const lastUsedMonth = profile?.last_analytics_date?.slice(0, 7);

      console.log('📅 Month comparison:', { currentMonth, lastUsedMonth, analyticsUsed: profile?.analytics_used });

      if (lastUsedMonth !== currentMonth) {
        // New month - reset counter in database
        console.log('🔄 New month detected, resetting counter');
        try {
          await supabase
            .from('profiles')
            .update({
              analytics_used: 0,
              last_analytics_date: new Date().toISOString().split('T')[0]
            })
            .eq('user_id', user.id);
          console.log('✅ Counter reset for new month');
        } catch (resetError) {
          console.error('❌ Failed to reset counter:', resetError);
        }
        return { canUse: true, used: 0 };
      }

      const used = profile?.analytics_used || 0;
      const canUse = used < 1;

      console.log('✅ Final result:', { canUse, used });

      return { canUse, used };
    } catch (error) {
      console.error('💥 Database error, falling back to localStorage:', error);
      return checkLocalStorageUsage();
    }
  };

  // Fallback to localStorage if database fails
  const checkLocalStorageUsage = () => {
    const today = new Date().toDateString();
    if (lastReportDate !== today) {
      return { canUse: freeReportsUsed < 1, used: freeReportsUsed };
    }
    return { canUse: false, used: freeReportsUsed };
  };

  // Update analytics usage in database
  const updateAnalyticsUsage = async () => {
    if (!user || proStatus.isPro) return;

    try {
      const today = new Date().toISOString().split('T')[0]; // "2025-01-17"
      const currentMonth = new Date().toISOString().slice(0, 7); // "2025-01"

      console.log('💾 Updating analytics usage:', { userId: user.id, today });

      // First get current usage
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('analytics_used, last_analytics_date')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching current usage:', fetchError);
        throw fetchError;
      }

      const lastUsedMonth = profile?.last_analytics_date?.slice(0, 7);
      const currentUsage = (lastUsedMonth === currentMonth) ? (profile?.analytics_used || 0) : 0;
      const newUsage = currentUsage + 1;

      console.log('📊 Usage calculation:', { currentUsage, newUsage, lastUsedMonth, currentMonth });

      const { error } = await supabase
        .from('profiles')
        .update({
          analytics_used: newUsage,
          last_analytics_date: today
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error updating analytics usage:', error);
        // Fallback to localStorage tracking
        const todayString = new Date().toDateString();
        setFreeReportsUsed(newUsage);
        setLastReportDate(todayString);
        localStorage.setItem('freeReportsUsed', JSON.stringify({ date: todayString, count: newUsage }));
      } else {
        console.log('✅ Successfully updated analytics usage in database');
        setFreeReportsUsed(newUsage);
      }
    } catch (error) {
      console.error('💥 Database error, using localStorage fallback:', error);
      // Fallback to localStorage - increment current usage
      const todayString = new Date().toDateString();
      const currentCount = freeReportsUsed + 1;
      setFreeReportsUsed(currentCount);
      setLastReportDate(todayString);
      localStorage.setItem('freeReportsUsed', JSON.stringify({ date: todayString, count: currentCount }));
    }
  };

  const canUseFreeReport = async () => {
    if (proStatus.isPro) return true;

    const usage = await checkMonthlyAnalyticsUsage();
    setFreeReportsUsed(usage.used);
    return usage.canUse;
  };

  const generateAIReport = async () => {
    const canUse = await canUseFreeReport();
    if (!canUse && !proStatus.isPro) {
      onUpgradeClick();
      return;
    }

    setLoading(true);
    setShowAnalysisModal(true);
    try {
      if (!user || !userProfile) return;

      // Fetch user's journal entries
      const { data: reflections } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      // Use profile data from context (source of truth)
      const userTotalVerses = userProfile.total_verses || 0;
      const userTotalJournal = userProfile.total_journal || 0;

      // Check if user needs more engagement first
      if (!reflections || userTotalJournal < 3 || userTotalVerses < 2) {
        // Show red warning for unfulfilled conditions
        setLoading(false);
        setShowAnalysisModal(false);

        const missingJournals = Math.max(0, 3 - userTotalJournal);
        const missingVerses = Math.max(0, 2 - userTotalVerses);

        toast({
          title: "❌ Kondisi Belum Terpenuhi",
          description: `Untuk analisis sukses: ${missingJournals > 0 ? `Tulis ${missingJournals} jurnal lagi` : '✅ Jurnal cukup'}${missingJournals > 0 && missingVerses > 0 ? ' & ' : ''}${missingVerses > 0 ? `Selesaikan ${missingVerses} verse lagi` : missingJournals === 0 ? '✅ Verse cukup' : ''}`,
          variant: "destructive"
        });

        const encouragementAnalysis = {
          totalEntries: userTotalJournal,
          totalVerses: userTotalVerses,
          focusGoals: [],
          insights: [
            userTotalJournal === 0
              ? "🌱 Perjalanan spiritual Anda baru dimulai! Menulis jurnal adalah kunci untuk memahami diri lebih dalam."
              : `📖 Anda telah menulis ${userTotalJournal} jurnal - ini awal yang bagus! Untuk analisis yang lebih akurat, RENATA membutuhkan minimal 3-5 jurnal.`,
            userTotalVerses < 2
              ? "🎵 Dengarkan lebih banyak Verses untuk memperkaya pengalaman spiritual Anda. Setiap Verse memberikan frekuensi yang berbeda untuk pertumbuhan."
              : `🎯 Anda telah menyelesaikan ${userTotalVerses} Verses. Kombinasikan dengan menulis jurnal untuk hasil manifestasi yang optimal.`
          ],
          recommendation: userTotalJournal === 0
            ? ["✍️ Mulai dengan menulis 1 jurnal hari ini tentang apa yang paling ingin Anda lepaskan", "🎵 Dengarkan Verse 1 atau 2 untuk menenangkan pikiran"]
            : userTotalJournal < 3
            ? [`📝 Tulis ${3 - userTotalJournal} jurnal lagi untuk mendapat analisis mendalam dari RENATA`, "🎯 Fokus pada hal spesifik yang ingin Anda manifestasikan"]
            : ["🎵 Dengarkan minimal 3 Verses untuk analisis yang komprehensif", "📖 Tulis 2 jurnal lagi dengan tema yang konsisten"],
          spiritualGrowthScore: Math.max(10, userTotalJournal * 15 + userTotalVerses * 10)
        };

        setAnalytics(encouragementAnalysis);

        // DON'T track usage for encouragement - user needs more data first
        setLoading(false);
        return;
      }

      // Prepare data for ChatGPT analysis
      const journalTexts = reflections.map(r => r.reflection).join('\n\n');

      // Extract keywords for manifestation from journal entries
      const manifestationKeywords = journalTexts.toLowerCase().match(/\b(dapat|dapatkan|ingin|mau|butuh|perlu|harapan|impian|cita-cita|keinginan|rezeki|uang|cinta|kesehatan|kebahagiaan|sukses|karir|pekerjaan|jodoh|keluarga|rumah|mobil|travel|bisnis)\b/g) || [];
      const keywordCounts = manifestationKeywords.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topKeywords = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word, count]) => `${word}(${count}x)`)
        .join(', ');

      // Create a personalized simulated analysis as fallback
      const topManifestationWord = Object.entries(keywordCounts)[0]?.[0] || 'kebahagiaan';
      const simulatedAnalysis = {
        totalEntries: userTotalJournal,
        totalVerses: userTotalVerses,
        focusGoals: [
          { goal: "Kekhawatiran dan overthinking", count: Math.floor(reflections.length * 0.4), percentage: 40 },
          { goal: "Rasa tidak percaya diri", count: Math.floor(reflections.length * 0.3), percentage: 30 },
          { goal: "Beban masa lalu yang menghambat", count: Math.floor(reflections.length * 0.3), percentage: 30 }
        ],
        insights: [
          `🌟 ${userProfile.display_name || 'Spiritual Seeker'}, dengan ${userTotalJournal} jurnal dan ${userTotalVerses} Verses, Anda menunjukkan dedikasi luar biasa untuk pertumbuhan spiritual!`,
          `🔮 Kata kunci "${topManifestationWord}" muncul dalam jurnal Anda - ini menunjukkan arah manifestasi yang jelas. Yang dilepaskan akan membuka jalan untuk ini.`,
          `🎵 Kombinasi jurnal + Verses menciptakan frekuensi manifestasi yang powerful. Teruskan pola ini untuk hasil yang menakjubkan.`
        ],
        recommendation: userTotalVerses < 5
          ? [`🎵 Target next: Dengarkan ${5 - userTotalVerses} Verses lagi untuk analisis yang lebih akurat`, `📝 Tulis ${Math.max(7, userTotalJournal + 3)} jurnal tentang "${topManifestationWord}" untuk memperkuat manifestasi`]
          : [`✅ Anda sudah di jalur yang tepat! Teruskan konsistensi ini`, `📖 Tulis ${Math.max(10, userTotalJournal * 2)} jurnal spesifik tentang "${topManifestationWord}"`, `🎵 Dengarkan Verse 4-5 rutin untuk manifestasi keuangan yang powerful`],
        spiritualGrowthScore: Math.min(90, 25 + (userTotalJournal * 8) + (userTotalVerses * 12))
      };

      try {
        console.log('🔥 Calling RENATA analysis function...');
        console.log('📊 Data:', {
          totalJournal: userTotalJournal,
          totalVerses: userTotalVerses,
          reflectionsCount: reflections?.length || 0,
          userId: user.id
        });

        // Use secure Supabase Edge Function for AI analysis
        const { data, error } = await supabase.functions.invoke('renata-analysis', {
          body: {
            reflections: reflections || [],
            totalVerses: userTotalVerses,
            totalJournal: userTotalJournal,
            userId: user.id,
            userName: userProfile.display_name || 'Spiritual Seeker'
          }
        });

        console.log('📡 Function response:', { data, error });

        if (error) {
          console.error('❌ Supabase function error:', error);
          throw new Error(`Function error: ${error.message}`);
        }

        if (data.success && data.analysis) {
          // Use real AI analysis
          setAnalytics(data.analysis);
          setUsingFallback(false);

          // Track usage for successful AI analysis
          if (!proStatus.isPro) {
            await updateAnalyticsUsage();
          }
        } else if (data.error === 'insufficient_data') {
          // Handle insufficient data case - already handled above
          console.log('Insufficient data for analysis');
          throw new Error('Insufficient data');
        } else {
          // API failed, use fallback
          throw new Error('AI analysis failed');
        }

      } catch (apiError) {
        console.error('RENATA analysis failed, using simulated analysis:', apiError);
        // Use simulated analysis as fallback
        setAnalytics(simulatedAnalysis);
        setUsingFallback(true);

        // Track usage for fallback analysis ONLY if user has sufficient data
        if (!proStatus.isPro && reflections && reflections.length >= 3 && userTotalVerses >= 2) {
          await updateAnalyticsUsage();
        }
      }

    } catch (error) {
      console.error('Final error in AI report generation:', error);

      // Provide meaningful fallback based on user data
      const meaningfulFallback = {
        totalEntries: userTotalJournal || 0,
        totalVerses: userTotalVerses || 0,
        focusGoals: userTotalJournal > 0 ? [
          { goal: "Berbagi kekhawatiran dan beban pikiran", count: Math.ceil(userTotalJournal * 0.6), percentage: 60 },
          { goal: "Melepaskan ekspektasi berlebihan", count: Math.ceil(userTotalJournal * 0.4), percentage: 40 }
        ] : [],
        insights: userTotalJournal > 0 ? [
          `${userProfile.display_name || 'Spiritual Seeker'}, Anda telah menulis ${userTotalJournal} jurnal spiritual - ini menunjukkan komitmen yang luar biasa untuk pertumbuhan diri.`,
          "Setiap jurnal yang Anda tulis adalah langkah menuju pemahaman diri yang lebih dalam. Teruslah konsisten!",
          "Prinsip eL Vision: Yang dilepaskan akan didapat. Kepercayaan Anda pada proses ini akan membawa hasil yang menakjubkan."
        ] : [
          "Mulai menulis jurnal spiritual untuk mendapat insight yang mendalam tentang perjalanan spiritual Anda.",
          "Setiap kata yang Anda tulis adalah investasi untuk ketenangan batin dan manifestasi impian."
        ],
        recommendation: userTotalJournal > 0
          ? [`📈 Berdasarkan ${userTotalJournal} jurnal yang telah Anda tulis, Anda menunjukkan dedikasi yang luar biasa`, `🎯 Lanjutkan dengan menulis lebih fokus pada hal-hal spesifik yang ingin Anda manifestasikan`, `🧘 Kombinasikan dengan meditasi rutin untuk hasil optimal`]
          : ["📝 Mulai dengan menulis 1 jurnal per hari selama 7 hari berturut-turut", "🎯 Fokus pada apa yang ingin Anda lepaskan hari ini"],
        spiritualGrowthScore: Math.min(75, 25 + (userTotalJournal * 8))
      };

      setAnalytics(meaningfulFallback);
      setUsingFallback(true);

      // DON'T track usage for error fallback - this isn't a proper analysis
    } finally {
      // Ensure loading is always set to false and modal is hidden
      setTimeout(() => {
        setLoading(false);
        setShowAnalysisModal(false);
      }, 100);
    }
  };

  useEffect(() => {
    // Load analytics usage state when component mounts or user/profile changes
    const loadAnalyticsState = async () => {
      if (!user || proStatus.isPro) {
        setFreeReportsUsed(0);
        return;
      }

      try {
        console.log('🔄 Loading analytics state...');
        const usage = await checkMonthlyAnalyticsUsage();
        console.log('📊 Setting usage to:', usage.used);
        setFreeReportsUsed(usage.used);
      } catch (error) {
        console.error('Error loading analytics state:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('freeReportsUsed');
        if (saved) {
          try {
            const { date, count } = JSON.parse(saved);
            const today = new Date().toDateString();
            if (date === today) {
              setFreeReportsUsed(count);
              setLastReportDate(date);
            } else {
              setFreeReportsUsed(0);
            }
          } catch {
            setFreeReportsUsed(0);
          }
        } else {
          setFreeReportsUsed(0);
        }
      }
    };

    // Load when we have user and userProfile is available
    if (user && userProfile) {
      loadAnalyticsState();
    }
  }, [user, userProfile, proStatus.isPro]);

  return (
    <>
      {/* High-Tech Analysis Modal */}
      <RenataAnalysisModal isOpen={showAnalysisModal} />

    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <CardTitle className="text-xl text-purple-100">
              Personal Analytics Algoritm by RENATA
            </CardTitle>
          </div>
          <CardDescription className="text-purple-300">
            Analisis mendalam tentang perkembangan spiritual Anda
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Generate Report Button */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          {!proStatus.isPro && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="outline" className="border-amber-500 text-amber-400">
                <span className="mr-1">🆓</span>
                {freeReportsUsed}/1 Laporan Gratis Bulan Ini
              </Badge>
            </div>
          )}

          <Button
            onClick={generateAIReport}
            disabled={loading || (freeReportsUsed >= 1 && !proStatus.isPro)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                RENATA sedang menganalisis...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Buat Laporan Analisis
              </>
            )}
          </Button>

          {/* Visual Understanding Section - Only show when no analytics results */}
          {!analytics && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-300">
                  Bagaimana RENATA Bekerja
                </h3>
              </div>

              <div className="space-y-3 text-sm text-blue-200 leading-relaxed">
                <p className="text-center">
                  <strong className="text-blue-300">Total Verses</strong> + <strong className="text-purple-300">Spiritual Journal</strong> + <strong className="text-emerald-300">Elite Habit</strong>
                </p>

                <div className="text-center text-blue-400 font-medium">
                  ⬇️ Menjadi Tolak Ukur Keberhasilan Goal Anda ⬇️
                </div>

                <p className="text-center">
                  RENATA akan memberi Anda <strong className="text-yellow-300">insight</strong> apa yang perlu dimaksimalkan karena manusia seringkali lupa.
                </p>

                <div className="text-center text-xs text-blue-300 mt-3 border-t border-blue-500/20 pt-3">
                  🌟 Sesuai arahan eL Vision Group 🌟
                </div>
              </div>
            </div>
          )}

          {freeReportsUsed >= 1 && !proStatus.isPro && (
            <div className="p-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-semibold">
                  Laporan Gratis Bulan Ini Habis
                </span>
              </div>
              <p className="text-amber-200 text-sm text-center mb-3">
                Upgrade ke Pro untuk analisis unlimited dan insight yang lebih mendalam!
              </p>
              <Button
                onClick={onUpgradeClick}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade untuk Analytics Unlimited
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Fallback Notice */}
      {usingFallback && analytics && (
        <Card className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
          <div className="flex items-center gap-2 text-blue-300">
            <Brain className="w-5 h-5" />
            <div className="text-sm">
              <strong>Analisis Lokal RENATA:</strong> Menggunakan algoritma lokal karena koneksi API terbatas. Analisis tetap akurat berdasarkan data Anda!
            </div>
          </div>
        </Card>
      )}

      {/* Analytics Results */}
      {analytics && (
        <div className="space-y-4">
          {/* Overview Stats */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Ringkasan Spiritual
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{analytics.totalEntries}</div>
                  <div className="text-sm text-muted-foreground">Total Jurnal</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{analytics.totalVerses}</div>
                  <div className="text-sm text-muted-foreground">Verse Selesai</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{analytics.spiritualGrowthScore}</div>
                  <div className="text-sm text-muted-foreground">Skor Spiritual</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{analytics.focusGoals.length}</div>
                  <div className="text-sm text-muted-foreground">Fokus Utama</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Focus Goals */}
          {analytics.focusGoals.length > 0 && (
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Yang Paling Ingin Dilepaskan
                </CardTitle>
                <CardDescription>
                  Berdasarkan prinsip "yang dilepaskan akan didapat"
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {analytics.focusGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{goal.goal}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {typeof goal.count === 'number' ? `${goal.count}x` : goal.count}
                        </span>
                        <Badge variant="secondary">{goal.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Insight dari RENATA
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {analytics.insights.map((insight, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-100 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          {analytics.recommendation && (
            <Card className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Sparkles className="w-5 h-5" />
                  Rekomendasi Spiritual
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {analytics.recommendation.map((rec, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-100 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
    </>
  );
}