import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  subscriptionType: 'monthly' | 'yearly';
  paymentMethod: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { subscriptionType, paymentMethod }: PaymentRequest = await req.json();
    
    // Get Tripay credentials
    const apiKey = Deno.env.get("TRIPAY_API_KEY");
    const privateKey = Deno.env.get("TRIPAY_PRIVATE_KEY");
    const merchantCode = Deno.env.get("TRIPAY_MERCHANT_CODE");
    
    if (!apiKey || !privateKey || !merchantCode) {
      throw new Error("Tripay credentials not configured");
    }

    // Calculate amount based on subscription type
    const amount = subscriptionType === 'monthly' ? 100000 : 800000;
    const merchantRef = `VIP_${user.id}_${Date.now()}`;
    const customerName = user.email.split('@')[0];

    // Create signature for Tripay API
    const signatureData = merchantCode + merchantRef + amount;
    const signature = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(privateKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    ).then(key => 
      crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signatureData))
    ).then(signature => 
      Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    );

    // Create payment request to Tripay via VPS proxy (static IP)
    const tripayPayload = {
      method: paymentMethod,
      merchant_ref: merchantRef,
      amount: amount,
      customer_name: customerName,
      customer_email: user.email,
      order_items: [{
        sku: `VIP_${subscriptionType}`,
        name: `VIP Subscription ${subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'}`,
        price: amount,
        quantity: 1
      }],
      callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/tripay-callback`,
      return_url: `${req.headers.get("origin")}/profile?payment=success`,
      expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      signature: signature
    };

    console.log('Calling VPS proxy server for Tripay payment...');
    const tripayResponse = await fetch('http://103.67.244.250:3000/api/tripay/create-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tripayPayload)
    });

    const tripayResult = await tripayResponse.json();

    if (!tripayResult.success) {
      throw new Error(`Tripay API error: ${tripayResult.message}`);
    }

    const transaction = tripayResult.data;

    // Get or create VIP subscription
    const { data: existingSub } = await supabaseClient
      .from('vip_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let subscriptionId = existingSub?.id;

    if (!subscriptionId) {
      const { data: newSub, error: subError } = await supabaseClient
        .from('vip_subscriptions')
        .insert({
          user_id: user.id,
          email: user.email,
          subscription_type: subscriptionType,
          status: 'pending',
          tripay_reference: transaction.reference
        })
        .select('id')
        .single();

      if (subError) throw subError;
      subscriptionId = newSub.id;
    } else {
      await supabaseClient
        .from('vip_subscriptions')
        .update({
          subscription_type: subscriptionType,
          status: 'pending',
          tripay_reference: transaction.reference
        })
        .eq('id', subscriptionId);
    }

    // Create payment transaction record
    await supabaseClient
      .from('payment_transactions')
      .insert({
        subscription_id: subscriptionId,
        user_id: user.id,
        tripay_reference: transaction.reference,
        tripay_merchant_ref: merchantRef,
        payment_method: paymentMethod,
        amount: amount,
        currency: 'IDR',
        payment_url: transaction.checkout_url,
        payment_instructions: transaction.instructions || [],
        expires_at: new Date(transaction.expired_time * 1000).toISOString()
      });

    return new Response(JSON.stringify({
      success: true,
      payment_url: transaction.checkout_url,
      reference: transaction.reference,
      amount: amount,
      expires_at: transaction.expired_time
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});