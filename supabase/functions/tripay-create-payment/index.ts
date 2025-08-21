import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log('🚀 Edge Function started');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Hanya terima POST
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    console.log('📥 Parsing request body...');
    const body = await req.json();
    console.log('✅ Received body:', JSON.stringify(body));

    // URL VPS
    const vpsUrl = "https://payment.elvisiongroup.com/api/create-payment";
    
    // Forward ke VPS langsung tanpa signature
    console.log('🌐 Sending request to VPS:', vpsUrl);
    const vpsResponse = await fetch(vpsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    console.log('📡 VPS Response status:', vpsResponse.status);
    console.log('📡 VPS Response ok:', vpsResponse.ok);

    // Baca response sebagai text dulu
    const responseText = await vpsResponse.text();
    console.log('📄 VPS Response text length:', responseText.length);
    console.log('📄 VPS Response preview:', responseText.substring(0, 200));

    // Coba parse sebagai JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ Parsed JSON successfully');
      console.log('📋 Result keys:', Object.keys(result));
    } catch (parseError) {
      console.log('⚠️ JSON parse failed:', parseError.message);
      // Jika bukan JSON, bungkus dalam object
      result = {
        success: vpsResponse.ok,
        status: vpsResponse.status,
        data: responseText
      };
    }

    // Jika VPS return 502, berikan error yang jelas
    if (vpsResponse.status === 502) {
      console.log('💥 502 Bad Gateway detected');
      return new Response(
        JSON.stringify({ 
          error: 'Payment service temporarily unavailable',
          message: 'VPS backend service is down. Please check your payment server.',
          vps_response: responseText
        }), 
        {
          status: 503, // Service Unavailable
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Returning successful response');
    // Return response normal
    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: vpsResponse.status
    });

  } catch (error) {
    console.error('💥 Edge Function error:', error.message);
    console.error('💥 Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});