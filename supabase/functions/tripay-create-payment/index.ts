import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-proxy-key'
};

serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Get the authorization header to identify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with service role for admin operations
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    
    // Get the user from the auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    // Parse the request body
    const { subscriptionType, paymentMethod, userEmail, userName } = await req.json();
    if (!subscriptionType || !paymentMethod || !userEmail) {
      throw new Error('Missing required parameters');
    }
    console.log('Creating payment for user:', user.id, 'subscription:', subscriptionType, 'method:', paymentMethod);

    // Calculate amounts based on subscription type
    const amounts = {
      monthly: 50000,
      yearly: 500000
    };
    const amount = amounts[subscriptionType];
    if (!amount) {
      throw new Error('Invalid subscription type');
    }
    
    // Prepare data for the VPS proxy
    const proxyPayload = {
      method: paymentMethod,
      customer_name: userName || userEmail.split('@')[0],
      customer_email: userEmail,
      order_items: [
        {
          sku: `ELVISION_${subscriptionType.toUpperCase()}`,
          name: `eL Vision Group - ${subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
          price: amount,
          quantity: 1,
        }
      ],
      // Menggunakan URL dari Nginx yang sudah kita perbaiki
      callback_url: "https://elvisiongroup.com/api/tripay-callback", 
      return_url: `${req.headers.get('origin') || 'https://elvisiongroup.com'}/profile?payment=success`,
    };

    console.log('Sending request to VPS proxy:', proxyPayload);

    // --- PERUBAHAN UTAMA ADA DI SINI ---
    // Mengubah URL agar sesuai dengan konfigurasi Nginx yang baru
    const vpsProxyUrl = 'https://elvisiongroup.com/api/create-payment';

    const tripayResponse = await fetch(vpsProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-proxy-key': Deno.env.get("PROXY_API_KEY") ?? "" // Kunci rahasia untuk VPS
      },
      body: JSON.stringify(proxyPayload)
    });

    if (!tripayResponse.ok) {
      const errorText = await tripayResponse.text();
      console.error('VPS proxy error:', errorText);
      throw new Error(`Payment gateway error: ${tripayResponse.status}`);
    }

    const tripayData = await tripayResponse.json();
    console.log('Tripay response received:', tripayData);

    // Store payment transaction
    const { error: transactionError } = await supabaseClient.from('payment_transactions').insert({
      user_id: user.id,
      tripay_reference: tripayData.data?.reference,
      merchant_ref: tripayData.data?.merchant_ref,
      payment_method: paymentMethod,
      amount: amount,
      status: 'UNPAID',
      payment_url: tripayData.data?.checkout_url,
      pay_code: tripayData.data?.pay_code,
      qr_string: tripayData.data?.qr_string,
      qr_url: tripayData.data?.qr_url,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      throw new Error('Failed to store payment transaction');
    }

    console.log('Payment transaction created successfully.');
    
    // Return success response
    return new Response(JSON.stringify(tripayData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Tripay create payment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Payment creation failed',
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
    console.error('Tripay create payment error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Payment creation failed',
        message: 'Failed to create payment. Please try again.'
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})