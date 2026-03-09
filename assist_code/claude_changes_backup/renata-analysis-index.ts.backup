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

    // Test analytics endpoint
    if (testMode === 'analytics') {
      console.log('🧪 Returning test analytics');
      const analysis = {
        totalEntries: 3,
        totalVerses: 2,
        focusGoals: [
          { goal: "Kekhawatiran tentang pekerjaan dan uang", count: 2, percentage: 67 },
          { goal: "Rasa tidak percaya diri", count: 1, percentage: 33 }
        ],
        insights: [
          "🌟 Dengan 3 jurnal dan 2 Verses, aktivitas spiritual Anda menunjukkan skor 25/100 - terus tingkatkan untuk mencapai master level!",
          "🧘‍♀️ Verse 1 telah membawa ketenangan dalam hidup Anda - fondasi spiritual yang kuat!",
          "🌸 Verse 2 menciptakan kedamaian untuk para introvert - Anda mulai menemukan kekuatan dalam keheningan.",
          "🔮 Kata kunci manifestasi 'percaya diri, uang, ketenangan' muncul konsisten - prinsip eL Vision bekerja: yang dilepaskan akan didapat!"
        ],
        recommendation: "🎯 Target immediate: Dengarkan Verse 1 & 2 total 21x dalam 7 hari untuk membangun fondasi ketenangan dan kedamaian. Tulis 7 jurnal tentang 'percaya diri' untuk memperkuat manifestasi.",
        spiritualGrowthScore: 25,
        manifestationKeywords: "percaya diri(3x), uang(2x), ketenangan(1x)"
      };

      return new Response(
        JSON.stringify({
          success: true,
          analysis: analysis,
          testMode: true,
          message: "RENATA Analytics Test - Success! 🔮"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

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
          analysisMode: 'template-based'
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
    const { reflections, totalVerses, totalJournal, userId, userName } = requestBody;

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
    if (userTotalJournal < 3 || (totalVerses || 0) < 2) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'insufficient_data',
          message: 'Butuh minimal 3 jurnal dan 2 verse untuk analisis',
          current: {
            journals: userTotalJournal,
            verses: totalVerses || 0
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Try ChatGPT first, fallback to template if it fails
    const chatgptApiKey = Deno.env.get('CHATGPT_API_KEY');
    console.log('🤖 ChatGPT API key available:', !!chatgptApiKey);

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


    // SMART TEMPLATE: Count patterns and use intelligent templates (no ChatGPT needed)
    let analysisData;
    let usesChatGPT = false;

    if (chatgptApiKey) {
      try {
        console.log('🤖 Attempting ChatGPT analysis');

        // Calculate spiritual growth score for prompt
        const spiritualGrowthScore = Math.min(100, (userTotalJournal * 5) + ((totalVerses || 0) * 10));

        const chatgptPrompt = `Kamu adalah RENATA, AI spiritual advisor ahli untuk eL Vision. Analisis mendalam jurnal spiritual berikut:

USER INFO: ${userTotalJournal} jurnal, ${totalVerses || 0} verses (skor spiritual: ${spiritualGrowthScore}/100)

REFLECTIONS:
${reflectionTexts}

TUGAS ANALISIS:
1. Identifikasi pola yang muncul 3+ kali dalam jurnal
2. Berikan insight psikologis mendalam tentang kondisi spiritual user
3. Rekomendasikan verse yang tepat:
   - Verse 1: Ketenangan (anxiety, stress)
   - Verse 2: Kedamaian (introvert, inner peace)
   - Verse 3: Syukur (gratitude)
   - Verse 4: Kekayaan (finansial, uang, juta)
   - Verse 5: Kesehatan (health priority)
   - Short Verse 1: Jati diri (identity)
   - Short Verse 2: Deep focus

PRINSIP: "Yang dilepaskan akan didapat"

Respond dengan JSON format:
{
  "yangPalingInginDilepaskan": "pola utama dengan frekuensi",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "spiritualRecommendation": "strategi spesifik berdasarkan pola"
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
              { role: 'system', content: 'You are RENATA, an expert spiritual advisor. Always respond in Indonesian with deep psychological insights.' },
              { role: 'user', content: chatgptPrompt }
            ],
            temperature: 0.7,
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
            rekomendasiSpiritual: chatgptResult.spiritualRecommendation || "Lanjutkan spiritual journey"
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

    if (!analysisData) {
      console.log('🧠 Using smart template analysis based on actual pattern counting');

      // Count spiritual patterns in reflections
      const allText = reflectionTexts.toLowerCase();

      // Enhanced financial pattern detection
      const finansialMatches = allText.match(/\b(juta|ribu|uang|duit|gaji|penghasilan|kaya|kekayaan|harta|finansial|bisnis|usaha|dapat|dapatkan|rupiah|milyar|miliar|modal|profit|untung|investasi|tabungan|cicilan|hutang|kredit)\b/g) || [];
      const kecemasanMatches = allText.match(/\b(cemas|khawatir|takut|stress|stres|panik|gelisah|overthinking|worry|anxiety|nervous)\b/g) || [];
      const percayaDiriMatches = allText.match(/\b(percaya diri|pede|yakin|ragu|minder|insecure|tidak yakin|kurang percaya|confident|confidence)\b/g) || [];

      console.log('🔍 Financial matches found:', finansialMatches);
      console.log('🔍 Anxiety matches found:', kecemasanMatches);
      console.log('🔍 Self-doubt matches found:', percayaDiriMatches);

      const patternCounts = {
        // Financial patterns (enhanced)
        finansial: finansialMatches.length,

        // Anxiety/stress patterns
        kecemasan: kecemasanMatches.length,

        // Self-doubt patterns
        percayaDiri: percayaDiriMatches.length,

        // Past burden patterns
        masaLalu: (allText.match(/\b(masa lalu|menyesal|trauma|beban|berat|sakit hati|kecewa|ex|mantan)\b/g) || []).length,

        // Love/relationship patterns
        cinta: (allText.match(/\b(cinta|jodoh|pasangan|pacar|menikah|nikah|relationship|keluarga)\b/g) || []).length,

        // Health patterns
        kesehatan: (allText.match(/\b(sehat|sakit|penyakit|healing|recovery|tubuh|badan|dokter)\b/g) || []).length,

        // Spiritual patterns
        spiritual: (allText.match(/\b(tuhan|allah|doa|sholat|syukur|spiritual|berkah|hidayah)\b/g) || []).length
      };

      console.log('📊 Pattern counts:', patternCounts);

      // Find patterns that appear 3+ times
      const significantPatterns = Object.entries(patternCounts)
        .filter(([pattern, count]) => count >= 3)
        .sort(([,a], [,b]) => b - a);

      console.log('🎯 Significant patterns (3+):', significantPatterns);

      if (significantPatterns.length === 0) {
        // No significant patterns found
        analysisData = {
          yangPalingInginDilepaskan: "Pola spiritual belum terdeteksi jelas - butuh lebih banyak jurnal dengan tema konsisten",
          insights: [
            "📝 Jurnal masih terlalu sedikit atau terlalu beragam untuk mendeteksi pola yang kuat",
            "🎯 RENATA membutuhkan minimal 3 kali penyebutan tema yang sama untuk analisis akurat",
            "💡 Coba fokus menulis tentang 1-2 tema spiritual yang paling penting bagi Anda"
          ],
          rekomendasiSpiritual: "Tulis lebih banyak jurnal dengan tema yang konsisten. Fokus pada apa yang benar-benar ingin Anda lepaskan atau capai dalam hidup."
        };
      } else {
        // Use the most frequent pattern
        const [topPattern, topCount] = significantPatterns[0];

        if (topPattern === 'finansial') {
          analysisData = {
            yangPalingInginDilepaskan: `Kekhawatiran dan obsesi tentang uang/finansial - muncul ${topCount} kali dalam jurnal`,
            insights: [
              "💰 Obsesi uang ini menunjukkan kamu belum paham prinsip dasar: yang desperate tidak akan datang. Kamu menciptakan resistance sendiri.",
              "🎯 Setiap kali kamu tulis 'harus dapat juta' - kamu sebenarnya menegaskan KETIADAAN uang di hidupmu. Stop sabotase diri sendiri.",
              "⚖️ Tanggung jawab spiritual: Jika kamu gagal lepaskan obsesi ini, orang-orang yang kamu sayang akan merasakan energi scarcity-mu. Mereka jadi korban pola finansial burukmu."
            ],
            rekomendasiSpiritual: {
              verse: "Verse 4",
              durasi: "40 hari fokus",
              alasan: `karena pola finansial muncul ${topCount} kali dalam jurnal`,
              praktik: [
                "Dengarkan Verse 4 minimal 2x sehari (pagi & malam)",
                "Tulis 7 jurnal gratitude per minggu fokus pada tema finansial",
                "Lakukan pelepasan setiap kali muncul kecemasan tentang uang",
                "Ikuti strategi Project 64: konsistensi 40 hari tanpa skip"
              ],
              targetTransformasi: "Melepaskan tekanan finansial dan membuka aliran rezeki"
            }
          };
        } else if (topPattern === 'kecemasan') {
          analysisData = {
            yangPalingInginDilepaskan: `Kecemasan dan overthinking - muncul ${topCount} kali dalam jurnal`,
            insights: [
              "😰 Kecemasan ini menunjukkan kamu hidup di masa depan yang belum terjadi. Kamu mencuri ketenangan hari ini untuk kekhawatiran yang mungkin tidak pernah terjadi.",
              "🔄 Overthinking adalah bentuk arogansi spiritual - kamu pikir dengan khawatir, kamu bisa kontrol masa depan. Ini ilusi berbahaya.",
              "🧘 Tanggung jawab: Setiap menit kamu cemas, kamu mencuri energi positif dari orang-orang di sekitarmu. Mereka butuh versi tenang dirimu, bukan versi cemas."
            ],
            rekomendasiSpiritual: {
              verse: "Verse 1",
              durasi: "30 hari intensif",
              alasan: `karena pola kecemasan muncul ${topCount} kali dalam jurnal`,
              praktik: [
                "Dengarkan Verse 1 minimal 3x sehari (pagi, siang, malam)",
                "Setiap kali cemas muncul, langsung praktik pelepasan 5 menit",
                "Tulis jurnal harian: 'Hari ini saya pilih tenang untuk orang yang saya sayang'",
                "Meditasi 10 menit setiap pagi - non-negotiable"
              ],
              targetTransformasi: "Menghentikan siklus kecemasan dan menciptakan inner peace yang stabil"
            }
          };
        } else if (topPattern === 'percayaDiri') {
          analysisData = {
            yangPalingInginDilepaskan: `Rasa tidak percaya diri dan keraguan - muncul ${topCount} kali dalam jurnal`,
            insights: [
              "🌟 Keraguan diri ini adalah penghinaan terhadap potensi spiritual yang Tuhan berikan padamu. Kamu menolak gift yang sudah diberikan.",
              "💪 Setiap kali kamu bilang 'saya tidak mampu' - kamu mengajarkan alam semesta untuk tidak memberimu kesempatan. Stop melatih kegagalan.",
              "🔑 Tanggung jawab berat: Orang-orang yang kamu sayang butuh versi terbaik dirimu. Jika kamu terus minder, kamu gagal jadi support system untuk mereka."
            ],
            rekomendasiSpiritual: {
              verse: "Short Verse 1 + Verse 1",
              durasi: "40 hari transformasi",
              alasan: `karena pola keraguan diri muncul ${topCount} kali dalam jurnal`,
              praktik: [
                "Dengarkan Short Verse 1 setiap pagi untuk jati diri",
                "Dengarkan Verse 1 setiap malam untuk ketenangan",
                "Tulis afirmasi harian: 'Saya memilih percaya untuk orang yang saya sayang'",
                "Challenge diri: lakukan 1 hal yang menakutkan tapi benar setiap hari"
              ],
              targetTransformasi: "Membangun kepercayaan diri yang kuat dan stable"
            }
          };
        } else if (topPattern === 'cinta') {
          analysisData = {
            yangPalingInginDilepaskan: `Kekhawatiran tentang cinta dan jodoh - muncul ${topCount} kali dalam jurnal`,
            insights: [
              "💕 Obsesi jodoh ini menunjukkan kamu belum complete sebagai individu. Kamu cari orang lain untuk mengisi kekosongan yang seharusnya kamu isi sendiri.",
              "💔 Desperate energy ini akan mengusir jodoh yang tepat. Orang yang berkualitas tertarik pada yang sudah whole, bukan yang butuh 'diselamatkan'.",
              "✨ Tanggung jawab: Jika kamu masuk relationship dalam kondisi desperate, kamu akan jadi beban emosional untuk pasangan. Itu tidak fair untuk mereka."
            ],
            rekomendasiSpiritual: {
              verse: "Verse 2 + Verse 3",
              durasi: "100 hari inner work",
              alasan: `karena pola kebutuhan cinta muncul ${topCount} kali dalam jurnal`,
              praktik: [
                "Dengarkan Verse 2 untuk kedamaian batin setiap pagi",
                "Dengarkan Verse 3 untuk syukur setiap malam",
                "Tulis jurnal mingguan: hal-hal yang membuat hidup complete tanpa pasangan",
                "Fokus self-love: lakukan 1 aktivitas yang membahagiakan diri sendiri setiap hari"
              ],
              targetTransformasi: "Menjadi whole person yang siap untuk healthy relationship"
            }
          };
        } else {
          // Generic template for other patterns
          analysisData = {
            yangPalingInginDilepaskan: `${topPattern} - muncul ${topCount} kali dalam jurnal`,
            insights: [
              `🎯 Pola ${topPattern} dominan dalam spiritual journey Anda`,
              "📈 Consistency dalam tema menunjukkan area yang butuh spiritual attention",
              "🔄 Prinsip spiritual: awareness adalah langkah pertama transformation"
            ],
            rekomendasiSpiritual: `Fokus pada verse yang relevan dengan tema ${topPattern}. Praktikkan pelepasan konsisten dan trust pada proses spiritual. Target minimum 21 hari untuk melihat perubahan.`
          };
        }
      }
    }

    // Calculate spiritual growth score based on journal + verse activity
    const spiritualGrowthScore = Math.min(100, (userTotalJournal * 5) + ((totalVerses || 0) * 10));

    // Use template analysis result with proper structure
    const analysis = {
      totalEntries: userTotalJournal,
      totalVerses: totalVerses || 0,
      focusGoals: [{
        goal: analysisData.yangPalingInginDilepaskan || "Pola tidak terdeteksi",
        count: "Personal Analysis",
        percentage: 100
      }],
      insights: analysisData.insights || ["Analisis sedang berlangsung"],
      recommendation: typeof analysisData.rekomendasiSpiritual === 'string'
        ? analysisData.rekomendasiSpiritual
        : `${analysisData.rekomendasiSpiritual?.verse} - ${analysisData.rekomendasiSpiritual?.durasi}: ${analysisData.rekomendasiSpiritual?.targetTransformasi}` || "Lanjutkan menulis jurnal untuk insight yang lebih mendalam",
      rekomendasiSpiritual: analysisData.rekomendasiSpiritual,
      spiritualGrowthScore: spiritualGrowthScore,
      manifestationKeywords: "financial manifestation", // Based on 200 juta pattern
      yangPalingInginDilepaskan: analysisData.yangPalingInginDilepaskan || "Tidak terdeteksi - tulis jurnal lebih spesifik",
      templatePowered: !usesChatGPT,
      chatgptPowered: usesChatGPT,
      analysisMethod: usesChatGPT ? 'ChatGPT-4' : 'Smart Templates'
    };

    console.log(`✅ Analysis completed successfully using: ${usesChatGPT ? 'ChatGPT-4' : 'Smart Templates'}`);

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        processed: new Date().toISOString(),
        analysisMethod: usesChatGPT ? 'ChatGPT-4' : 'Smart Templates'
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