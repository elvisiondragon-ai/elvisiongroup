/**
 * Cloudflare Worker for handling Tripay and Moota webhooks
 * Provides static IP solution for payment gateway webhooks
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Callback-Signature',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route webhooks based on path
      if (path === '/tripay/process') {
        return await handleTripayWebhook(request, env);
      } else if (path === '/api/moota-webhook') {
        return await handleMootaWebhook(request, env);
      } else if (path === '/api/tripay-create-payment') {
        return await handleTripayCreatePayment(request, env);
      } else {
        return new Response('Webhook endpoint not found', { 
          status: 404,
          headers: corsHeaders 
        });
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Handle Tripay webhook callbacks
 */
async function handleTripayWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await request.text();
  const signature = request.headers.get('X-Callback-Signature');
  
  // Verify Tripay signature
  const privateKey = env.TRIPAY_PRIVATE_KEY || 'DEV-Wr3eLhJGnGECQ1WsRGh9fvNjVZi6vLKpW52ksKmS';
  const expectedSignature = await generateHMAC(privateKey, body);
  
  if (signature !== expectedSignature) {
    console.error('Invalid Tripay signature');
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid signature' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Forward to Supabase edge function
  const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback';
  
  const response = await fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw'}`,
    },
    body: body
  });

  const result = await response.text();
  
  console.log('Tripay webhook forwarded:', {
    status: response.status,
    result: result
  });

  return new Response(result, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handle Moota webhook callbacks
 */
async function handleMootaWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await request.text();
  let webhookData;
  
  try {
    webhookData = JSON.parse(body);
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid JSON' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verify Moota webhook token
  const webhookToken = env.MOOTA_WEBHOOK_SECRET || 'FPtVHJck';
  const providedToken = webhookData.token || request.headers.get('X-Webhook-Token');
  
  if (providedToken !== webhookToken) {
    console.error('Invalid Moota webhook token');
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid webhook token' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Forward to Supabase edge function
  const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/moota-webhook-handler';
  
  const response = await fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw'}`,
    },
    body: body
  });

  const result = await response.text();
  
  console.log('Moota webhook forwarded:', {
    status: response.status,
    result: result
  });

  return new Response(result, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handle Tripay payment creation (proxy to Tripay API)
 */
async function handleTripayCreatePayment(request, env) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const payload = await request.json();
    const { subscriptionType, paymentMethod, userId, userEmail, authToken } = payload;

    // Get Tripay credentials
    const apiKey = env.TRIPAY_API_KEY;
    const privateKey = env.TRIPAY_PRIVATE_KEY;
    const merchantCode = env.TRIPAY_MERCHANT_CODE;
    
    if (!apiKey || !privateKey || !merchantCode) {
      throw new Error('Tripay credentials not configured');
    }

    // Calculate amount and create merchant reference
    const amount = subscriptionType === 'monthly' ? 100000 : 800000;
    const merchantRef = `VIP_${userId}_${Date.now()}`;
    const customerName = userEmail.split('@')[0];

    // Create signature for Tripay API
    const signatureData = merchantCode + merchantRef + amount;
    const signature = await generateHMAC(privateKey, signatureData);

    // Create payment request to Tripay
    const tripayPayload = {
      method: paymentMethod,
      merchant_ref: merchantRef,
      amount: amount,
      customer_name: customerName,
      customer_email: userEmail,
      order_items: [{
        sku: `VIP_${subscriptionType}`,
        name: `VIP Subscription ${subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'}`,
        price: amount,
        quantity: 1
      }],
      callback_url: `https://elvisiongroup.com/tripay/process`,
      return_url: `${request.headers.get("origin") || 'https://nlrgdhpmsittuwiiindq.supabase.co'}/profile?payment=success`,
      expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      signature: signature
    };

    // Call Tripay API
    const tripayResponse = await fetch('https://tripay.co.id/api/transaction/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tripayPayload)
    });

    const tripayResult = await tripayResponse.json();

    if (!tripayResult.success) {
      throw new Error(`Tripay API error: ${tripayResult.message}`);
    }

    // Forward payment data to Supabase for storage
    const supabaseResponse = await fetch(`https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-store-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'apikey': env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw'
      },
      body: JSON.stringify({
        subscriptionType,
        paymentMethod,
        tripayData: tripayResult.data,
        merchantRef
      })
    });

    if (!supabaseResponse.ok) {
      console.error('Failed to store payment data in Supabase');
    }

    return new Response(JSON.stringify({
      success: true,
      payment_url: tripayResult.data.checkout_url,
      reference: tripayResult.data.reference,
      amount: amount,
      expires_at: tripayResult.data.expired_time
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Tripay payment creation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Generate HMAC SHA256 signature for Tripay
 */
async function generateHMAC(key, message) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}