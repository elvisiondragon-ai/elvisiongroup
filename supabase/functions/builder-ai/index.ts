// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.info('Builder AI function started');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data = await req.json();
    const { storeName, products, targetAudience, style, color, whatsapp } = data;

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
            content: `Anda adalah pakar Digital Marketing. Kembalikan JSON untuk mengisi template website.
PENTING: Gunakan kunci (keys) ini persis:
STORE_NAME, META_TAGLINE, META_DESCRIPTION, BRAND_COLOR, BRAND_RGB, BG_COLOR, BG_IS_DARK, NAV_CTA_TEXT, HERO_EYEBROW, HERO_HEADLINE_LINE1, HERO_HEADLINE_EM, HERO_HEADLINE_DIM, HERO_SUBHEADLINE, HERO_CTA_PRIMARY, HERO_CTA_SECONDARY, HERO_TRUST_TEXT, PRODUCT_1_EMOJI, PRODUCT_1_NAME, PRODUCT_1_PRICE, PRODUCT_1_DESC, PRODUCT_2_EMOJI, PRODUCT_2_NAME, PRODUCT_2_PRICE, PRODUCT_2_DESC, PRODUCT_3_EMOJI, PRODUCT_3_NAME, PRODUCT_3_PRICE, PRODUCT_3_DESC, PAIN_SECTION_TITLE, PAIN_SECTION_TITLE_EM, PAIN_SECTION_DESC, PAIN_1_ICON, PAIN_1_TITLE, PAIN_1_DESC, PAIN_2_ICON, PAIN_2_TITLE, PAIN_2_DESC, PAIN_3_ICON, PAIN_3_TITLE, PAIN_3_DESC, PRODUCTS_SECTION_TITLE, PRODUCTS_SECTION_TITLE_EM, PRODUCTS_SECTION_DESC, ORDER_BTN_SHORT, BENEFIT_SECTION_TITLE, BENEFIT_SECTION_TITLE_EM, BENEFIT_SECTION_DESC, BENEFIT_1_ICON, BENEFIT_1_TITLE, BENEFIT_1_DESC, BENEFIT_2_ICON, BENEFIT_2_TITLE, BENEFIT_2_DESC, BENEFIT_4_ICON, BENEFIT_4_TITLE, BENEFIT_4_DESC, BENEFIT_5_ICON, BENEFIT_5_TITLE, BENEFIT_5_DESC, TESTI_SECTION_TITLE, TESTI_SECTION_TITLE_EM, TESTI_SECTION_DESC, TESTI_1_TEXT, TESTI_1_EMOJI, TESTI_1_NAME, TESTI_1_ROLE, TESTI_2_TEXT, TESTI_2_EMOJI, TESTI_2_NAME, TESTI_2_ROLE, TESTI_3_TEXT, TESTI_3_EMOJI, TESTI_3_NAME, TESTI_3_ROLE, ORDER_CARD_TITLE, ORDER_CARD_TITLE_EM, ORDER_CARD_SUB, ORDER_BTN_TEXT, ORDER_NOTE_TEXT, FOOTER_TAGLINE, STORE_WHATSAPP.`
          },
          {
            role: 'user',
            content: `Buatkan konten untuk: ${storeName}, Produk: ${products}, Style: ${style}, Warna: ${color}, Target: ${targetAudience}, WA: ${whatsapp}.`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const aiResult = await openaiResponse.json();
    const content = JSON.parse(aiResult.choices[0].message.content);

    return new Response(JSON.stringify({ success: true, data: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
