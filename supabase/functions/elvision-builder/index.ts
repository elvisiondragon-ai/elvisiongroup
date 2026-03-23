// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.info('El Vision Builder function started');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { 
      storeName, 
      products, 
      targetAudience, 
      style, 
      color, 
      whatsapp, 
      customUrl 
    } = await req.json();

    console.log(`Generating website for: ${storeName} (${style})`);

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Anda adalah pakar Digital Marketing dan Website Builder dari eL Vision Group.
Tugas Anda adalah membuat struktur konten website yang menjual (high-converting) berdasarkan data user.

OUTPUT HARUS DALAM FORMAT JSON BERSIH:
{
  "hero": {
    "headline": "...",
    "subheadline": "..."
  },
  "problem": {
    "title": "...",
    "points": ["...", "...", "..."]
  },
  "solution": {
    "title": "...",
    "description": "...",
    "benefits": ["...", "...", "..."]
  },
  "cta": {
    "text": "...",
    "subtext": "..."
  },
  "metadata": {
    "title": "...",
    "description": "..."
  }
}

Gunakan prinsip PGM (Pain-Gain-Method):
- Pain: Identifikasi masalah audiens.
- Gain: Hasil yang mereka impikan.
- Method: Bagaimana produk/layanan ini adalah solusinya.`
          },
          {
            role: 'user',
            content: `Buatkan konten website untuk:
Nama Toko: ${storeName}
Produk/Layanan: ${products}
Target Audiens: ${targetAudience}
Style/Vibe: ${style}
Warna Utama: ${color}
WhatsApp: ${whatsapp}
URL: ${customUrl}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Gagal menghubungi AI untuk membuat konten.');
    }

    const aiResult = await openaiResponse.json();
    const content = JSON.parse(aiResult.choices[0].message.content);

    return new Response(JSON.stringify({
      success: true,
      data: content,
      config: {
        storeName,
        style,
        color,
        whatsapp,
        customUrl
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
