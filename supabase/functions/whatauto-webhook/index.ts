import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔄 Whatauto webhook received request')

    const requestBody = await req.json()
    console.log('📝 Request body:', requestBody)

    const { reflectionData, userInfo } = requestBody

    // Format the analysis request for your whatauto
    const whatautoMessage = `Kamu adalah RENATA, AI spiritual advisor ahli untuk eL Vision.

ANALISIS JURNAL SPIRITUAL:
User: ${userInfo?.userName || 'Spiritual Seeker'}
Total Jurnal: ${userInfo?.totalJournal || 0}
Total Verses: ${userInfo?.totalVerses || 0}

REFLECTIONS DATA:
${reflectionData}

TUGAS:
1. Identifikasi pola spiritual yang muncul 3+ kali dalam jurnal
2. Berikan insight psikologis mendalam
3. Rekomendasikan verse eL Vision yang tepat:
   - Verse 1: Ketenangan (stress, anxiety)
   - Verse 2: Kedamaian introvert
   - Verse 3: Rasa syukur
   - Verse 4: Pencari kekayaan (finansial)
   - Verse 5: Kesehatan UTAMA
   - Short Verse 1: Jati diri
   - Short Verse 2: Deep fokus

PRINSIP: Yang dilepaskan akan didapat

Respond dengan format JSON:
{
  "yangPalingInginDilepaskan": "pola utama yang terdeteksi dengan frekuensi",
  "polaSpiritualLainnya": ["pola lain yang ditemukan"],
  "insights": ["insight mendalam 1", "insight 2", "insight 3"],
  "spiritualRecommendation": "strategi 100 hari berdasarkan pola",
  "manifestationKeywords": "kata kunci yang sering muncul",
  "spiritualGrowthScore": 75
}

Analisis cerdas berdasarkan data nyata, bukan template generik.`

    // Prepare request for your whatauto webhook
    const whatautoRequest = {
      app: "RENATA Analysis",
      sender: "eL Vision App",
      message: whatautoMessage,
      group_name: "Spiritual Analysis",
      phone: userInfo?.userEmail || "analysis@elvision.app"
    }

    console.log('🚀 Sending to whatauto:', whatautoRequest)

    // You'll need to provide your whatauto webhook URL
    const WHATAUTO_WEBHOOK_URL = Deno.env.get('WHATAUTO_WEBHOOK_URL')

    if (!WHATAUTO_WEBHOOK_URL) {
      throw new Error('WHATAUTO_WEBHOOK_URL not configured')
    }

    // Call your whatauto webhook
    const whatautoResponse = await fetch(WHATAUTO_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(whatautoRequest)
    })

    if (!whatautoResponse.ok) {
      throw new Error(`Whatauto webhook error: ${whatautoResponse.status}`)
    }

    const whatautoData = await whatautoResponse.json()
    console.log('✅ Whatauto response:', whatautoData)

    // Parse the reply from whatauto
    let analysisResult
    try {
      // Try to extract JSON from the reply
      const jsonMatch = whatautoData.reply?.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        // Fallback if no JSON found
        analysisResult = {
          yangPalingInginDilepaskan: "Analisis dari whatauto",
          polaSpiritualLainnya: [],
          insights: [whatautoData.reply || "Respons dari whatauto"],
          spiritualRecommendation: "Lanjutkan konsultasi dengan RENATA",
          manifestationKeywords: "spiritual growth",
          spiritualGrowthScore: 70
        }
      }
    } catch (parseError) {
      console.log('📝 Using raw whatauto response')
      analysisResult = {
        yangPalingInginDilepaskan: "Analisis dalam progress",
        polaSpiritualLainnya: [],
        insights: [whatautoData.reply || "Analisis spiritual"],
        spiritualRecommendation: "Konsultasi dengan spiritual advisor",
        manifestationKeywords: "spiritual insight",
        spiritualGrowthScore: 65
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          totalEntries: userInfo?.totalJournal || 0,
          totalVerses: userInfo?.totalVerses || 0,
          focusGoals: [{
            goal: analysisResult.yangPalingInginDilepaskan,
            count: "detected by whatauto",
            percentage: 100
          }],
          insights: analysisResult.insights,
          recommendation: analysisResult.spiritualRecommendation,
          spiritualGrowthScore: analysisResult.spiritualGrowthScore,
          manifestationKeywords: analysisResult.manifestationKeywords,
          yangPalingInginDilepaskan: analysisResult.yangPalingInginDilepaskan,
          whatatutoPowered: true
        },
        processed: new Date().toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('❌ Whatauto webhook error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'whatauto_webhook_error',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})