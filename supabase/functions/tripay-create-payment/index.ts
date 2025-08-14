import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate HMAC signature for Tripay
async function generateHMAC(key: string, message: string): Promise<string> {
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
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const tripayApiKey = Deno.env.get('TRIPAY_API_KEY');
    const tripayPrivateKey = Deno.env.get('TRIPAY_PRIVATE_KEY');
    const tripayMerchantCode = Deno.env.get('TRIPAY_MERCHANT_CODE');
    const proxyIP = Deno.env.get('PROXY_IP');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      tripayApiKey: tripayApiKey ? 'SET' : 'MISSING',
      tripayPrivateKey: tripayPrivateKey ? 'SET' : 'MISSING',
      tripayMerchantCode: tripayMerchantCode ? 'SET' : 'MISSING',
      proxyIP: proxyIP ? 'SET' : 'MISSING'
    });

    if (!tripayApiKey || !tripayPrivateKey || !tripayMerchantCode || !proxyIP) {
      const missingVars = [];
      if (!tripayApiKey) missingVars.push('TRIPAY_API_KEY');
      if (!tripayPrivateKey) missingVars.push('TRIPAY_PRIVATE_KEY');
      if (!tripayMerchantCode) missingVars.push('TRIPAY_MERCHANT_CODE');
      if (!proxyIP) missingVars.push('PROXY_IP');
      
      console.error('Missing environment variables:', missingVars);
      throw new Error(`Missing required credentials: ${missingVars.join(', ')}`);
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    // Parse request body
    const { userEmail, userName } = await req.json();
    
    if (!userEmail) {
      throw new Error('Email is required');
    }

    // Payment details for monthly subscription (100,000 IDR)
    const amount = 100000;
    const merchantRef = `ELVISION_${Date.now()}_${user.id.slice(0, 8)}`;
    
    // Create order items
    const orderItems = [
      {
        sku: 'ELVISION_MONTHLY',
        name: 'eL Vision Group - Monthly Subscription',
        price: amount,
        quantity: 1,
      }
    ];

    // Create signature for Tripay
    const signatureData = `${tripayMerchantCode}${merchantRef}${amount}`;
    const signature = await generateHMAC(tripayPrivateKey, signatureData);

    // Prepare Tripay payment request
    const tripayPayload = {
      method: 'BRIVA', // BRI Virtual Account
      merchant_ref: merchantRef,
      amount: amount,
      customer_name: userName || userEmail.split('@')[0],
      customer_email: userEmail,
      order_items: orderItems,
      callback_url: `https://payment.elvisiongroup.com/api/create-payment`,
      return_url: `${req.headers.get('origin') || 'https://elvisiongroup.com'}/profile?payment=success`,
      expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      signature: signature
    };

    console.log('Creating Tripay payment:', {
      merchantRef,
      amount,
      method: 'BRIVA',
      customer: userEmail
    });

    // Call Tripay API
    const tripayResponse = await fetch('https://tripay.co.id/api/transaction/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tripayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripayPayload)
    });

    if (!tripayResponse.ok) {
      const errorText = await tripayResponse.text();
      console.error('Tripay API error:', errorText);
      throw new Error(`Tripay API error: ${tripayResponse.status}`);
    }

    const tripayData = await tripayResponse.json();
    console.log('Tripay response:', tripayData);

    if (!tripayData.success) {
      throw new Error(`Tripay error: ${tripayData.message}`);
    }

    // Store payment transaction in database
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        tripay_reference: tripayData.data.reference,
        tripay_merchant_ref: merchantRef,
        payment_method: 'BRIVA',
        amount: amount,
        currency: 'IDR',
        status: 'UNPAID',
        payment_url: tripayData.data.checkout_url,
        expires_at: new Date((tripayData.data.expired_time || 0) * 1000).toISOString(),
        callback_data: tripayData.data
      });

    if (transactionError) {
      console.error('Database error:', transactionError);
      throw new Error('Failed to store payment transaction');
    }

    // Create or update VIP subscription record
    const { error: subscriptionError } = await supabase
      .from('vip_subscriptions')
      .upsert({
        user_id: user.id,
        subscription_type: 'monthly',
        status: 'pending',
        amount_paid: amount,
        currency: 'IDR',
        tripay_reference: tripayData.data.reference,
        ip_address: proxyIP
      }, {
        onConflict: 'user_id'
      });

    if (subscriptionError) {
      console.error('Subscription error:', subscriptionError);
      // Don't throw error here, payment is already created
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        reference: tripayData.data.reference,
        merchant_ref: merchantRef,
        checkout_url: tripayData.data.checkout_url,
        qr_string: tripayData.data.qr_string,
        qr_url: tripayData.data.qr_url,
        virtual_account_name: tripayData.data.virtual_account_name,
        virtual_account_number: tripayData.data.virtual_account_number,
        amount: amount,
        expired_time: tripayData.data.expired_time,
        instructions: tripayData.data.instructions
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Tripay create payment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Payment creation failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});