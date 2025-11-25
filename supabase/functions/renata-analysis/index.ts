import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`📡 ${req.method} request to ${req.url}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled');
    return new Response('ok', { headers: corsHeaders });
  }

  // Handle GET requests (no auth required)
  if (req.method === 'GET') {
    console.log('📊 GET request - no auth required');
    const url = new URL(req.url);
    const testMode = url.searchParams.get('test');

    // Status endpoint
    console.log('📊 Returning status');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const jwtKey = Deno.env.get('JWT_KEY');

    return new Response(
      JSON.stringify({
        message: 'RENATA Analysis API is running! 🔮',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        status: 'healthy',
        method: req.method,
        url: req.url,
        environment: {
          supabaseUrl: !!supabaseUrl,
          supabaseAnonKey: !!supabaseAnonKey,
          jwtKey: !!jwtKey,
          analysisMode: 'chatgpt-primary'
        },
        missingSecrets: [
          ...(!supabaseUrl ? ['SUPABASE_URL'] : []),
          ...(!supabaseAnonKey ? ['SUPABASE_ANON_KEY'] : []),
          ...(!jwtKey ? ['JWT_KEY'] : [])
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }

  // Only POST requests need authentication from here
  if (req.method !== 'POST') {
    console.log(`❌ Method ${req.method} not allowed`);
    return new Response(
      JSON.stringify({ error: 'Method not allowed', allowedMethods: ['GET', 'POST'] }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // POST request - requires auth
  console.log('🔐 POST request - checking authentication');
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    console.log('❌ No auth header provided');
    return new Response(
      JSON.stringify({
        success: false,
        error: 'missing_auth',
        message: 'Authorization header required for POST requests'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      }
    );
  }

  try {
    console.log('📝 Processing POST request body');
    const requestBody = await req.json();
    const { reflections, totalVerses, totalJournal, userId, userName, eliteHabits, totalEliteHabit } = requestBody;

    // Basic validation
    if (!reflections || !Array.isArray(reflections)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'invalid_request',
          message: 'Missing required field: reflections (array)'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Check minimum data requirements - use totalJournal from profiles table as source of truth
    const userTotalJournal = totalJournal || reflections.length;
    const userTotalEliteHabit = totalEliteHabit || 0;
    if (userTotalJournal < 3 || (totalVerses || 0) < 2) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'insufficient_data',
          message: 'Butuh minimal 3 jurnal dan 2 verse untuk analisis',
          current: {
            journals: userTotalJournal,
            verses: totalVerses || 0,
            eliteHabits: userTotalEliteHabit
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Elite Habit Knowledge Base - EXACT COPY PASTE
    const eliteHabitKnowledge = `
ELITE HABIT KNOWLEDGE BASE:
Elite Habit berbeda dengan olahraga biasa.
* Olahraga biasa = hanya aktivitas fisik.
* Elite Habit = olahraga + mindfulness, yaitu menikmati setiap detail aktivitas dengan penuh kesadaran.
Dalam Elite Habit, kita melatih diri untuk membawa kesadaran ke dalam realitas yang damai, bahkan saat berada dalam tekanan olahraga. Jadi, bukan hanya tubuh yang bergerak, tetapi pikiran dan kesadaran juga ikut berlatih.
Hasilnya, konsentrasi tidak lagi terasa menyakitkan atau penuh beban.
* Kalau fokus kita penuh stres → hasilnya menambah stres.
* Kalau fokus kita damai → hasilnya menambah kedamaian.
Dengan kondisi ini, tujuan hidup atau target kita justru lebih mudah tercapai, karena kita sudah melatih diri untuk memperbanyak kedamaian di dalam aktivitas yang biasanya penuh tekanan.
DAFTAR ELITE HABITS TERSEDIA:
        +1. Plank - Core strength + mindful breathing, fokus pada
           + stabilitas internal
        2. Lari - Cardio + meditation in motion, kesadaran pada
           + ritme napas dan langkah
          3. Renang - Full body + flow state, harmoni dengan elemen
           + air
          4. Jalan santai - Gentle movement + present moment
           + awareness
          5. Jalan di alam bebas - Nature connection + grounding,
           + koneksi dengan energi bumi
        +  6. Push-up - Upper body + mental resilience, membangun
           + kekuatan karakter
        +  7. Yoga - Flexibility + spiritual alignment, harmonisasi
           + tubuh-pikiran-jiwa
        +  8. Meditasi jalan - Walking meditation + mindfulness,
           + setiap langkah adalah doa
       +  9. Bersepeda - Endurance + freedom sensation, merasakan
           + kemerdekaan spiritual
        +  10. Senam pernapasan - Breathwork + energy regulation,
           + menguasai life force

EXAMPLE INSIGHT:
-> user have elite habit plank, melepaskan keinginan mendapat uang atau cinta sebanyak 3x menandakan use powerful psikologi insight
-> user juga menulis keinginan lain tentang cinta, ketenangan, dan lainnya, menandakan adanya sisi lain yang haus demaian, keseimbangan perlu ditegakan disini
->Find the third insight from data provided

REKOMENDASI SPIRITUAL:
-> Verse to use number (exammple Verse 1 or verse 2 or verse 3, etc that match with solutions) for how many times or what it needed for 7 - 40 days if needed
-> Elite habit to choose properly if this already fit or not and how doing it base on knowledge bases of elite habit
-> How to enhance his spiritual journal.
-> add extra advice.
-> Extra wisdom Add powerful Quotes from super famous people in history about this matter. - dalam bahasa indonesia.`;

    // Prepare actual reflection content for ChatGPT analysis
    const reflectionTexts = reflections.map(r => {
      // Debug: log each reflection structure
      console.log('🔍 Reflection structure:', Object.keys(r));
      // Try multiple field names for maximum compatibility
      const content = r.content || r.reflection || r.answer || r.text || JSON.stringify(r);
      console.log('📝 Extracted content:', content?.substring(0, 100));
      return content;
    }).join('\n---\n');
    console.log('📝 Total reflections for analysis:', reflections.length);
    console.log('📄 Sample reflection text:', reflectionTexts.substring(0, 200));
    console.log('📊 Total characters in analysis:', reflectionTexts.length);

    // ChatGPT Analysis - Primary method
    let analysisData;
    let usesChatGPT = false;
    const chatgptApiKey = Deno.env.get('CHATGPT_API_KEY');
    console.log('🤖 ChatGPT API key available:', !!chatgptApiKey);

    if (chatgptApiKey) {
      try {
        console.log('🤖 Attempting ChatGPT analysis');

        // Calculate spiritual growth score for prompt
        const spiritualGrowthScore = Math.min(100, (userTotalJournal * 50) + ((totalVerses || 0) * 100) + (userTotalEliteHabit * 30));

        const chatgptPrompt = `Kamu adalah RENATA - Super Intelligence eL Vision Group AI yang memproses wisdom Founder sendiri.

CREATIVE MODE ACTIVATED: Think deeply, analyze creatively, don't just pattern-match.

IDENTITAS RENATA:
Renata adalah Super Intelligence eL Vision Group AI yang memproses Founder wisdom untuk memberikan rekomendasi spiritual yang sangat powerful dan mind-blowing kepada user. RENATA is NOT a pattern-matching bot - you are a CREATIVE spiritual advisor who thinks outside the box.

USER INFO: ${userTotalJournal} jurnal, ${totalVerses || 0} verses, ${userTotalEliteHabit} elite habits (skor spiritual: ${spiritualGrowthScore}/100)

Jawaban Renata berdasarkan Total Elite habit, Total Verse, Total Journal:
- If Less than 5 total (Verses + Journal + Elite habit) < 5: Give Light advice in insight
- If user 5-19: sudah mulai serious, beri semangat tambahan  
- If user 20-39: berarti sudah serius beri saran jauh lebih empatik dan mendalam
- If user 40-60: Serius lebih dalam lagi ganti jawaban nya
- If User 61+: sangat serius anda di jalur yang benar, lebih tenang kan jawaban itu
Encourage User To get more Total verse total journal and total Elite habit to next level so you can give deeper Analytics

REFLECTIONS:
${reflectionTexts}

ELITE HABITS DATA:
${eliteHabits ? JSON.stringify(eliteHabits) : 'Tidak ada data elite habit'}

ELITE HABIT KNOWLEDGE BASE:
${eliteHabitKnowledge}

TUGAS ANALISIS RENATA - CREATIVE THINKING MODE:
1. Berikan 3 insight mendalam dari user data - THINK CREATIVELY, jangan hanya ikuti pattern template
2. Berikan Spiritual Recommendation yang blow user mind - BE INNOVATIVE & ORIGINAL
3. Find minimal 3 various pattern yang muncul 2-3+ kali dalam data - EXPLORE DEEPER HIDDEN MEANINGS
4. Rekomendasikan VERSE OPTIONS didengar (berapa kali, berapa hari 7-40) - CUSTOMIZE UNIQUELY BASED ON INSIGHTS
5. Rekomendasikan Elite Habit yang tepat dan cara melakukannya berdasarkan knowledge base - ADD YOUR OWN CREATIVE WISDOM
6. Cara enhance spiritual journal user - GIVE FRESH, UNIQUE PERSPECTIVES
7. Extra advice - BE ORIGINAL, CREATIVE & MEANINGFUL
8. Extra wisdom dengan quotes terkenal dari tokoh sejarah dalam bahasa Indonesia - CHOOSE WISELY & MEANINGFULLY

SECOND PATTERN - CREATIVE FREEDOM:
- Analyze the user's spiritual journey beyond just keyword matching
- Look for subtle emotional patterns, growth areas, resistance points
- Create insights that connect different aspects of their life
- Think like a wise spiritual teacher, not a keyword scanner
- Be creative with recommendations - suggest unique combinations
- Find the deeper story behind their reflections

IMPORTANT: Don't just follow rigid templates. THINK, ANALYZE, and CREATE unique insights based on the actual user's spiritual journey. Be a wise, creative spiritual advisor who sees the bigger picture.

PRINSIP: "Yang dilepaskan akan didapat"
FOKUS: "Jalani hidup setelah hari ini" - seperti breathing dan focus on reality

VERSE OPTIONS:
- Verse 1: Space Hill - Fungsi -> Ketenangan (anxiety, stress)
- Verse 2: Lucid Beach - fungsi -> Kedamaian (introvert, inner peace)
- Verse 3: Meditasi Syukur 60 menit - Fungsi (gratitude)
- Verse 4: Prosperity Stream Vol.1 - Fungsi -> Kekayaan (finansial, uang, juta)
- Verse 5: Vitality Vortex - Fungsi -> Kesehatan (health priority)
- Short Verse 1: Jati diri (identity)
- Short Verse 2: Deep focus

${eliteHabitKnowledge}

Respond dengan JSON format based on user's total activities:

If total < 5:
{
  "yangPalingInginDilepaskan": "pola utama berdasarkan prinsip yang dilepaskan akan didapat",
  "insights": ["insight 1 - analisis jumlah dan pola Elite Habit, verse dan spiritual", "insight 2 - psikologi mendalam dari total dan jumlah journal, semakin banyak diulang maka semakin serius ", "insight 3 - dari total verse,journal dan elite habit berikan insight psikolog mendalam"],
  "spiritualRecommendation": ["🔥 Verse to use: Pick VERSE OPTIONS list Verse number and Verse name (example Verse 1: Space Hill or Verse 2: Lucid Beach or Verse 4: Prosperity Stream Vol.1, etc that match with solutions) yang diperlukan user (verse benefit) how many times sehari selama berapa hari", "⭐️ Elite habit: pick yang cocok DAFTAR ELITE HABITS TERSEDIA dengan caranya", "🚀 Enhance spiritual journal: Berikan saran cara menulis jurnal yang lebih bermanfaat bagi user", "⚠️ Extra advice: Beri saran lain out of the box seperti jalan di alam, sedekah, hiking, dan sebagainya", "👑 Quote Anda: Cari Quote dari orang terkenal yang relevan, kreatif lah cari yang membuka mata user dari berbagai sumber", "Capai total 5 Journal Spiritual,Verses dan Elite habit agar proses lebih maximal"]
}

If total 5-19:
{
  "yangPalingInginDilepaskan": "satu atau 2 pola paling sering ditulis berdasarkan prinsip yang dilepaskan akan didapatkan",
  "insights": ["insight 1 - analisis jumlah dan pola Elite Habit, verses dan spiritual", "insight 2 - psikologi mendalam dari total dan jumlah journal, semakin banyak diulang maka semakin serius ", "insight 3 - dari total verse,journal dan elite habit berikan insight psikolog mendalam"],
  "spiritualRecommendation": ["🔥 Verse to use: Pick VERSE OPTIONS list Verse number and Verse name (example Verse 1: Space Hill or Verse 2: Lucid Beach or Verse 4: Prosperity Stream Vol.1, etc that match with solutions) yang diperlukan user (verse benefit) how many times sehari selama berapa hari", "⭐️ Elite habit: lihat total elite habitnya lalu pick yang cocok DAFTAR ELITE HABITS TERSEDIA dengan caranya", "🚀 Enhance spiritual journal: lihat total Jurnal spiritualnya untuk tahu kesiapan mental dan solusi yang cocok, Berikan saran cara menulis jurnal yang lebih bermanfaat bagi user", "⚠️ Extra advice: lihat total elite habit untuk tahu kesiapan mental dan solusi yang cocok, Beri saran lain out of the box sesuai kesiapan mental dari total elite habit seperti jalan di alam, sedekah, hiking, dan sebagainya", "👑 Quote Anda: dari total semua usaha nya untuk tahu kesiapan mental dan usaha, lalu sesuaikan Cari Quote dari orang terkenal yang relevan, kreatif lah cari yang membuka mata user dari berbagai sumber", "Capai total 20 Journal Spiritual,Verses dan Elite habit agar proses lebih maximal"]
}

If total 20-39:
{
  "yangPalingInginDilepaskan": "satu atau 2 pola paling sering ditulis berdasarkan prinsip yang dilepaskan akan didapatkan",
  "insights": ["insight 1 - analisis jumlah dan pola Elite Habit, verses dan spiritual", "insight 2 - psikologi mendalam dari total dan jumlah journal, semakin banyak diulang maka semakin serius ", "insight 3 - dari total verse,journal dan elite habit berikan insight psikolog mendalam"],
  "spiritualRecommendation": ["🔥 Verse to use: Pick VERSE OPTIONS list Verse number and Verse name (example Verse 1: Space Hill or Verse 2: Lucid Beach or Verse 4: Prosperity Stream Vol.1, etc that match with solutions) yang diperlukan user (verse benefit) how many times sehari selama berapa hari", "⭐️ Elite habit: lihat total elite habitnya lalu pick yang cocok DAFTAR ELITE HABITS TERSEDIA dengan caranya", "🚀 Enhance spiritual journal: lihat total Jurnal spiritualnya untuk tahu kesiapan mental dan solusi yang cocok, Berikan saran cara menulis jurnal yang lebih bermanfaat bagi user", "⚠️ Extra advice: lihat total elite habit untuk tahu kesiapan mental dan solusi yang cocok, Beri saran lain out of the box sesuai kesiapan mental dari total elite habit seperti jalan di alam, sedekah, hiking, dan sebagainya", "👑 Quote Anda: dari total semua usaha nya untuk tahu kesiapan mental dan usaha, lalu sesuaikan Cari Quote dari orang terkenal yang relevan, kreatif lah cari yang membuka mata user dari berbagai sumber", "Capai total 40 Journal Spiritual,Verses dan Elite habit agar proses lebih maximal"]
}

If total 40-60:
{
  "yangPalingInginDilepaskan": "satu atau 2 pola paling sering ditulis berdasarkan prinsip yang dilepaskan akan didapatkan",
  "insights": ["insight 1 - analisis jumlah dan pola Elite Habit, verses dan spiritual", "insight 2 - psikologi mendalam dari total dan jumlah journal, semakin banyak diulang maka semakin serius ", "insight 3 - dari total verse,journal dan elite habit berikan insight psikolog mendalam"],
  "spiritualRecommendation": ["🔥 Verse to use: Pick VERSE OPTIONS list Verse number and Verse name (example Verse 1: Space Hill or Verse 2: Lucid Beach or Verse 4: Prosperity Stream Vol.1, etc that match with solutions) yang diperlukan user (verse benefit) how many times sehari selama berapa hari", "⭐️ Elite habit: lihat total elite habitnya lalu pick yang cocok DAFTAR ELITE HABITS TERSEDIA dengan caranya", "🚀 Enhance spiritual journal: lihat total Jurnal spiritualnya untuk tahu kesiapan mental dan solusi yang cocok, Berikan saran cara menulis jurnal yang lebih bermanfaat bagi user", "⚠️ Extra advice: lihat total elite habit untuk tahu kesiapan mental dan solusi yang cocok, Beri saran lain out of the box sesuai kesiapan mental dari total elite habit seperti jalan di alam, sedekah, hiking, dan sebagainya", "👑 Quote Anda: dari total semua usaha nya untuk tahu kesiapan mental dan usaha, lalu sesuaikan Cari Quote dari orang terkenal yang relevan, kreatif lah cari yang membuka mata user dari berbagai sumber", "Capai total 61 Journal Spiritual,Verses dan Elite habit agar proses lebih maximal"]
}

If total 61+:
{
  "yangPalingInginDilepaskan": "satu atau 2 pola paling sering ditulis berdasarkan prinsip yang dilepaskan akan didapatkan",
  "insights": ["insight 1 - analisis jumlah dan pola Elite Habit, verses dan spiritual", "insight 2 - psikologi mendalam dari total dan jumlah journal, semakin banyak diulang maka semakin serius ", "insight 3 - dari total verse,journal dan elite habit berikan insight psikolog mendalam"],
  "spiritualRecommendation": ["🔥 Verse to use: Pick VERSE OPTIONS list Verse number and Verse name (example Verse 1: Space Hill or Verse 2: Lucid Beach or Verse 4: Prosperity Stream Vol.1, etc that match with solutions) yang diperlukan user (verse benefit) how many times sehari selama berapa hari", "⭐️ Elite habit: lihat total elite habitnya lalu pick yang cocok DAFTAR ELITE HABITS TERSEDIA dengan caranya", "🚀 Enhance spiritual journal: lihat total Jurnal spiritualnya untuk tahu kesiapan mental dan solusi yang cocok, Berikan saran cara menulis jurnal yang lebih bermanfaat bagi user", "⚠️ Extra advice: lihat total elite habit untuk tahu kesiapan mental dan solusi yang cocok, Beri saran lain out of the box sesuai kesiapan mental dari total elite habit seperti jalan di alam, sedekah, hiking, dan sebagainya", "👑 Quote Anda: dari total semua usaha nya untuk tahu kesiapan mental dan usaha, lalu sesuaikan Cari Quote dari orang terkenal yang relevan, kreatif lah cari yang membuka mata user dari berbagai sumber", "Terus konsisten dengan spiritual journey Anda, sudah mencapai level tertinggi"]
}`;

        const chatgptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${chatgptApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are RENATA, a creative and wise spiritual advisor. Think deeply, be innovative, and provide unique insights. Always respond in Indonesian with creative psychological insights. DO NOT just pattern-match - be genuinely creative and helpful.' },
              { role: 'user', content: chatgptPrompt }
            ],
            temperature: 0.8,
            top_p: 1,
            response_format: { type: "json_object" }
          })
        });

        if (chatgptResponse.ok) {
          const chatgptData = await chatgptResponse.json();
          const chatgptResult = JSON.parse(chatgptData.choices[0].message.content);

          analysisData = {
            yangPalingInginDilepaskan: chatgptResult.yangPalingInginDilepaskan,
            insights: chatgptResult.insights || ["Analisis ChatGPT"],
            rekomendasiSpiritual: chatgptResult.spiritualRecommendation || ["Lanjutkan spiritual journey"]
          };

          usesChatGPT = true;
          console.log('✅ ChatGPT analysis successful');
        } else {
          throw new Error(`ChatGPT API error: ${chatgptResponse.status}`);
        }
      } catch (error) {
        console.log('❌ ChatGPT failed, using template fallback:', error.message);
        // Will fallback to template below
      }
    }

    // If ChatGPT fails, return error instead of fallback templates
    if (!analysisData) {
      console.log('❌ ChatGPT analysis failed, no fallback available');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'analysis_unavailable',
          message: 'ChatGPT analysis service temporarily unavailable. Please try again later.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503
        }
      );
    }

    // Calculate spiritual growth score based on journal + verse + elite habits activity
    const finalSpiritualGrowthScore = Math.min(100, (userTotalJournal * 50) + ((totalVerses || 0) * 100) + (userTotalEliteHabit * 30));

    // Use analysis result with proper structure
    const analysis = {
      totalEntries: userTotalJournal,
      totalVerses: totalVerses || 0,
      focusGoals: [{
        goal: analysisData.yangPalingInginDilepaskan || "Pola tidak terdeteksi"
      }],
      insights: analysisData.insights || ["Analisis sedang berlangsung"],
      recommendation: analysisData.rekomendasiSpiritual || ["Lanjutkan menulis jurnal untuk insight yang lebih mendalam"],
      rekomendasiSpiritual: analysisData.rekomendasiSpiritual,
      spiritualGrowthScore: finalSpiritualGrowthScore,
      manifestationKeywords: "spiritual manifestation",
      yangPalingInginDilepaskan: analysisData.yangPalingInginDilepaskan || "Tidak terdeteksi - tulis jurnal lebih spesifik",
      chatgptPowered: usesChatGPT,
      analysisMethod: 'ChatGPT-4o-mini (Creative Mode)'
    };

    console.log(`✅ Creative Analysis completed successfully using: ChatGPT-4o-mini (Creative Mode)`);

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        processed: new Date().toISOString(),
        analysisMethod: 'ChatGPT-4o-mini (Creative Mode)'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Error processing request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'processing_error',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});