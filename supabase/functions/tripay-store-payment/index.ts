import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StorePaymentRequest {
  subscriptionType: 'monthly' | 'yearly';
  paymentMethod: string;
  tripayData: any;
  merchantRef: string;
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

    const { subscriptionType, paymentMethod, tripayData, merchantRef }: StorePaymentRequest = await req.json();

    // Get or create VIP subscription using UPSERT
    const { data: subscription, error: subError } = await supabaseClient
      .from('vip_subscriptions')
      .upsert({
        user_id: user.id,
        email: user.email,
        subscription_type: subscriptionType,
        status: 'pending',
        tripay_reference: tripayData.reference
      }, {
        onConflict: 'user_id'
      })
      .select('id')
      .single();

    if (subError) {
      console.error('Subscription upsert error:', subError);
      throw new Error('Failed to create/update subscription');
    }

    // Create payment transaction record
    const { error: transError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        subscription_id: subscription.id,
        user_id: user.id,
        tripay_reference: tripayData.reference,
        tripay_merchant_ref: merchantRef,
        payment_method: paymentMethod,
        amount: tripayData.amount,
        currency: 'IDR',
        payment_url: tripayData.checkout_url,
        payment_instructions: tripayData.instructions || [],
        expires_at: new Date(tripayData.expired_time * 1000).toISOString()
      });

    if (transError) {
      console.error('Transaction creation error:', transError);
      throw new Error('Failed to create transaction');
    }

    console.log('Payment data stored successfully:', {
      userId: user.id,
      subscriptionId: subscription.id,
      tripayReference: tripayData.reference,
      merchantRef
    });

    return new Response(JSON.stringify({
      success: true,
      subscription_id: subscription.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Store payment error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});