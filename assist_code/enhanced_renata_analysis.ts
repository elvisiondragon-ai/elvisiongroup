// ENHANCED RENATA ANALYSIS WITH ELITE HABITS MINDFULNESS INTEGRATION
// This replaces the current renata-analysis function with complete spiritual profile analysis

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`🔮 RENATA Enhanced: ${req.method} request to ${req.url}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Handle GET requests (status)
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        message: 'ENHANCED RENATA Analysis API - Now with Elite Habits Mindfulness! 🧘‍♀️',
        version: '3.0.0 - Elite Habits Integrated',
        capabilities: [
          'Reflections analysis (spiritual challenges)',
          'Elite Habits mindfulness training assessment',
          'Verses knowledge foundation',
          'Complete spiritual profile analysis',
          'Mindfulness under pressure evaluation'
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const requestBody = await req.json();
    const {
      reflections,
      eliteHabits,
      totalVerses,
      totalJournal,
      totalEliteHabits,
      userId,
      userName
    } = requestBody;

    console.log('📊 Received data:', {
      reflections: reflections?.length || 0,
      eliteHabits: eliteHabits?.length || 0,
      totalVerses: totalVerses || 0,
      totalJournal: totalJournal || 0,
      totalEliteHabits: totalEliteHabits || 0
    });

    // Enhanced validation - need all three pillars
    const userTotalJournal = totalJournal || reflections?.length || 0;
    const userTotalEliteHabits = totalEliteHabits || eliteHabits?.length || 0;
    const userTotalVerses = totalVerses || 0;

    if (userTotalJournal < 3 || userTotalVerses < 2 || userTotalEliteHabits < 2) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'insufficient_spiritual_data',
          message: 'RENATA membutuhkan spiritual trinity: minimal 3 jurnal + 2 verses + 2 elite habits untuk analisis lengkap',
          current: {
            journals: userTotalJournal,
            verses: userTotalVerses,
            eliteHabits: userTotalEliteHabits
          },
          requirement: {
            journals: 3,
            verses: 2,
            eliteHabits: 2
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ENHANCED ANALYSIS - SPIRITUAL TRINITY
    console.log('🧘‍♀️ Performing enhanced spiritual trinity analysis...');

    // 1. REFLECTION ANALYSIS (Spiritual Challenges)
    const reflectionTexts = (reflections || []).map(r => {
      return r.content || r.reflection || r.answer || r.text || JSON.stringify(r);
    }).join('\n---\n');

    // 2. ELITE HABITS ANALYSIS (Mindfulness Training Assessment)
    const eliteHabitsAnalysis = analyzeEliteHabitsMindfulness(eliteHabits || []);

    // 3. PATTERN ANALYSIS WITH ELITE HABITS INTEGRATION
    const spiritualProfile = analyzeCompleteSpirituralProfile(
      reflectionTexts,
      eliteHabitsAnalysis,
      userTotalVerses,
      userTotalJournal,
      userTotalEliteHabits
    );

    // 4. CALCULATE ENHANCED SPIRITUAL SCORE
    const spiritualGrowthScore = calculateEnhancedSpirituralScore(
      userTotalJournal,
      userTotalEliteHabits,
      userTotalVerses,
      eliteHabitsAnalysis.mindfulnessLevel
    );

    // 5. GENERATE RENATA INSIGHTS
    const renataInsights = generateRenataInsights(spiritualProfile, eliteHabitsAnalysis);

    const analysis = {
      // Core metrics
      totalEntries: userTotalJournal,
      totalVerses: userTotalVerses,
      totalEliteHabits: userTotalEliteHabits,

      // Spiritual profile
      spiritualGrowthScore,
      mindfulnessLevel: eliteHabitsAnalysis.mindfulnessLevel,
      stressTopeacePower: eliteHabitsAnalysis.stressTopeacePower,

      // Analysis results
      focusGoals: [{
        goal: spiritualProfile.primaryChallenge,
        count: spiritualProfile.challengeFrequency,
        percentage: 100
      }],

      insights: renataInsights.insights,
      recommendation: renataInsights.recommendation,

      // Elite habits specific
      eliteHabitsProfile: eliteHabitsAnalysis.profile,
      mindfulnessTrainingLevel: eliteHabitsAnalysis.trainingLevel,

      // Enhanced fields
      yangPalingInginDilepaskan: spiritualProfile.primaryChallenge,
      spiritualTrinity: {
        reflections: userTotalJournal,
        eliteHabits: userTotalEliteHabits,
        verses: userTotalVerses
      },

      // Meta
      analysisMethod: 'Enhanced RENATA v3.0 - Elite Habits Integrated',
      processedAt: new Date().toISOString()
    };

    console.log('✅ Enhanced spiritual analysis completed');

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        message: 'RENATA Enhanced Analysis - Spiritual Trinity Complete! 🔮🧘‍♀️⚡'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Enhanced RENATA Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'enhanced_processing_error',
        message: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ELITE HABITS MINDFULNESS ANALYSIS
function analyzeEliteHabitsMindfulness(eliteHabits) {
  console.log('🧘‍♀️ Analyzing elite habits mindfulness training...');

  const habitTypes = {};
  let totalDuration = 0;
  let totalSessions = eliteHabits.length;

  // Categorize habits by mindfulness training type
  eliteHabits.forEach(habit => {
    const exerciseType = habit.exercise_type || habit.exerciseType || 'Unknown';
    const duration = habit.duration_minutes || habit.durationMinutes || 0;

    habitTypes[exerciseType] = (habitTypes[exerciseType] || 0) + 1;
    totalDuration += duration;
  });

  // Analyze mindfulness profile based on habit types
  const profile = determineEliteHabitsProfile(habitTypes);
  const mindfulnessLevel = calculateMindfulnessLevel(totalSessions, totalDuration);
  const stressTopeacePower = calculateStressTopeacePower(habitTypes, totalDuration);
  const trainingLevel = determineTrainingLevel(totalSessions, mindfulnessLevel);

  return {
    habitTypes,
    totalSessions,
    totalDuration,
    averageDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
    profile,
    mindfulnessLevel,
    stressTopeacePower,
    trainingLevel
  };
}

function determineEliteHabitsProfile(habitTypes) {
  const typeMap = {
    'Plank': 'discipline-focus',
    'Push-up': 'discipline-focus',
    'Yoga': 'introspective-calm',
    'Meditasi jalan': 'contemplative-movement',
    'Jalan santai': 'contemplative-movement',
    'Jalan di alam bebas': 'contemplative-movement',
    'Renang': 'flow-meditation',
    'Lari': 'endurance-mindfulness',
    'Bersepeda': 'endurance-mindfulness',
    'Senam pernapasan': 'breath-awareness'
  };

  const profileCounts = {};
  Object.entries(habitTypes).forEach(([habit, count]) => {
    const profile = typeMap[habit] || 'general-mindfulness';
    profileCounts[profile] = (profileCounts[profile] || 0) + count;
  });

  // Get dominant profile
  const dominantProfile = Object.entries(profileCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general-mindfulness';

  return {
    dominant: dominantProfile,
    distribution: profileCounts,
    interpretation: getProfileInterpretation(dominantProfile)
  };
}

function getProfileInterpretation(profile) {
  const interpretations = {
    'discipline-focus': 'Tipe disiplin-fokus: Melatih konsentrasi melalui tekanan fisik, baik untuk mengubah stress menjadi ketahanan mental',
    'introspective-calm': 'Tipe introspektif-tenang: Menggabungkan gerakan dengan kesadaran dalam, natural untuk spiritual deepening',
    'contemplative-movement': 'Tipe kontemplasi-gerakan: Melatih mindfulness melalui gerakan lembut, ideal untuk clarity dan inner peace',
    'flow-meditation': 'Tipe flow-meditation: Menggunakan ritme gerakan untuk masuk ke state meditatif, powerful untuk mental reset',
    'endurance-mindfulness': 'Tipe ketahanan-mindfulness: Melatih mental strength melalui tantangan fisik berkelanjutan',
    'breath-awareness': 'Tipe kesadaran napas: Master of mindfulness fundamentals, strong foundation for all spiritual practice',
    'general-mindfulness': 'Tipe general-mindfulness: Exploring berbagai cara mindful training, good for finding personal method'
  };

  return interpretations[profile] || interpretations['general-mindfulness'];
}

function calculateMindfulnessLevel(sessions, duration) {
  const sessionScore = Math.min(sessions * 10, 50); // Max 50 from sessions
  const durationScore = Math.min(duration, 50); // Max 50 from duration
  return Math.min(sessionScore + durationScore, 100);
}

function calculateStressTopeacePower(habitTypes, totalDuration) {
  // Different habits have different stress-to-peace conversion power
  const powerMap = {
    'Plank': 0.8, // High pressure training
    'Push-up': 0.7,
    'Lari': 0.6,
    'Renang': 0.9, // Flow state
    'Yoga': 0.9, // Direct mindfulness
    'Meditasi jalan': 1.0, // Pure mindfulness
    'Senam pernapasan': 1.0, // Pure breath awareness
    'Jalan santai': 0.7,
    'Jalan di alam bebas': 0.8,
    'Bersepeda': 0.6
  };

  let totalPower = 0;
  let totalCount = 0;

  Object.entries(habitTypes).forEach(([habit, count]) => {
    const power = powerMap[habit] || 0.5;
    totalPower += power * count;
    totalCount += count;
  });

  const averagePower = totalCount > 0 ? totalPower / totalCount : 0;
  const durationBonus = Math.min(totalDuration / 100, 0.3); // Up to 30% bonus

  return Math.min((averagePower + durationBonus) * 100, 100);
}

function determineTrainingLevel(sessions, mindfulnessLevel) {
  if (sessions >= 20 && mindfulnessLevel >= 80) return 'Master Mindfulness Warrior';
  if (sessions >= 15 && mindfulnessLevel >= 60) return 'Advanced Mindful Athlete';
  if (sessions >= 10 && mindfulnessLevel >= 40) return 'Developing Mindful Practitioner';
  if (sessions >= 5 && mindfulnessLevel >= 20) return 'Beginning Mindfulness Student';
  return 'Mindfulness Newcomer';
}

// COMPLETE SPIRITUAL PROFILE ANALYSIS
function analyzeCompleteSpirituralProfile(reflections, eliteHabitsAnalysis, verses, journals, eliteHabitsCount) {
  console.log('🔮 Analyzing complete spiritual profile with elite habits integration...');

  const allText = reflections.toLowerCase();

  // Enhanced pattern detection with elite habits context
  const patterns = {
    finansial: (allText.match(/\b(juta|ribu|uang|duit|gaji|penghasilan|kaya|kekayaan|finansial|bisnis)\b/g) || []).length,
    kecemasan: (allText.match(/\b(cemas|khawatir|takut|stress|stres|panik|gelisah|overthinking)\b/g) || []).length,
    percayaDiri: (allText.match(/\b(percaya diri|pede|yakin|ragu|minder|insecure|tidak yakin)\b/g) || []).length,
    cinta: (allText.match(/\b(cinta|jodoh|pasangan|pacar|menikah|relationship)\b/g) || []).length,
    kesehatan: (allText.match(/\b(sehat|sakit|penyakit|healing|tubuh|badan)\b/g) || []).length,
    spiritual: (allText.match(/\b(tuhan|allah|doa|sholat|syukur|spiritual|berkah)\b/g) || []).length
  };

  // Find dominant challenge
  const significantPatterns = Object.entries(patterns)
    .filter(([pattern, count]) => count >= 2)
    .sort(([,a], [,b]) => b - a);

  const primaryChallenge = significantPatterns.length > 0
    ? `${significantPatterns[0][0]} - muncul ${significantPatterns[0][1]} kali`
    : "Pola belum terdeteksi jelas";

  const challengeFrequency = significantPatterns.length > 0 ? significantPatterns[0][1] : 0;

  return {
    patterns,
    primaryChallenge,
    challengeFrequency,
    significantPatterns,
    eliteHabitsContext: eliteHabitsAnalysis
  };
}

// ENHANCED SPIRITUAL SCORE CALCULATION
function calculateEnhancedSpirituralScore(journals, eliteHabits, verses, mindfulnessLevel) {
  const journalScore = Math.min(journals * 3, 30); // Max 30
  const eliteHabitsScore = Math.min(eliteHabits * 4, 40); // Max 40 (more weight for mindfulness training)
  const versesScore = Math.min(verses * 10, 20); // Max 20
  const mindfulnessBonus = Math.min(mindfulnessLevel * 0.1, 10); // Max 10 bonus

  return Math.min(journalScore + eliteHabitsScore + versesScore + mindfulnessBonus, 100);
}

// RENATA INSIGHTS GENERATION
function generateRenataInsights(spiritualProfile, eliteHabitsAnalysis) {
  const { primaryChallenge, challengeFrequency } = spiritualProfile;
  const { profile, stressTopeacePower, trainingLevel, totalSessions } = eliteHabitsAnalysis;

  let insights = [];
  let recommendation = "";

  // Base insights from elite habits analysis
  insights.push(`🧘‍♀️ Elite Habits Profile: ${profile.interpretation}`);
  insights.push(`⚡ Stress-to-Peace Power: ${Math.round(stressTopeacePower)}% - ${getStressToPeaceInterpretation(stressTopeacePower)}`);
  insights.push(`🎯 Mindfulness Training Level: ${trainingLevel} (${totalSessions} sessions completed)`);

  // Challenge-specific insights with elite habits integration
  if (primaryChallenge.includes('finansial')) {
    insights.push("💰 Elite habits menunjukkan kamu melatih disiplin fisik, tapi anxiety finansial masih tinggi - perlu align mindfulness training dengan abundance mindset");
    recommendation = `Kombinasi elite habits ${profile.dominant} dengan Verse 4 (Kekayaan). Selama elite habits, visualisasikan abundance flow masuk bersamaan dengan napas. Target: ${Math.max(totalSessions + 10, 30)} sessions dalam 40 hari dengan fokus 'uang mengalir seperti napas - natural dan mudah'. Elite habits mu sudah melatih disiplin, sekarang arahkan ke abundance manifestation.`;
  } else if (primaryChallenge.includes('kecemasan')) {
    insights.push("😰 Elite habits sudah melatih mental strength, tapi overthinking masih dominan - butuh apply mindfulness elite habits ke daily anxiety");
    recommendation = `Power up Verse 1 (Ketenangan) dengan elite habits ${profile.dominant}. Setiap selesai elite habits, praktikkan 5 menit 'anxiety-to-peace conversion' yang sudah kamu latih during exercise. Target: Daily practice 21 hari. Kamu sudah prove bisa tenang under physical pressure - sekarang apply ke mental pressure.`;
  } else if (primaryChallenge.includes('percayaDiri')) {
    insights.push("🌟 Elite habits membuktikan kamu bisa discipline dan commit - ini adalah evidence untuk self-confidence yang kuat");
    recommendation = `Gunakan achievement elite habits sebagai confidence booster dengan Short Verse 1 (Jati Diri). Setiap selesai elite habits, affirm: 'Saya yang bisa complete ${totalSessions} mindful sessions, tentu bisa achieve apapun'. ${Math.round(stressTopeacePower)}% stress-to-peace power kamu adalah proof of inner strength. Target: 40 sessions dengan self-empowerment focus.`;
  } else {
    insights.push("🔮 Elite habits foundation sudah solid - ready untuk advanced spiritual development");
    recommendation = `Dengan ${trainingLevel} level dan ${Math.round(stressTopeacePower)}% conversion power, kamu ready untuk advanced spiritual practice. Fokus pada verse yang align dengan ${profile.dominant} personality. Target: Maintain consistency dan explore deeper mindfulness states during elite habits.`;
  }

  return { insights, recommendation };
}

function getStressToPeaceInterpretation(power) {
  if (power >= 80) return "Master level - kamu sangat baik mengubah pressure jadi power";
  if (power >= 60) return "Advanced - mental strength training berhasil";
  if (power >= 40) return "Developing - sedang belajar mindfulness under pressure";
  if (power >= 20) return "Beginner - mulai merasakan benefit mindful exercise";
  return "Newcomer - fokus pada awareness during activity";
}