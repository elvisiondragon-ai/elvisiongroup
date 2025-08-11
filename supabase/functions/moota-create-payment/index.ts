import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('No authorization header');
    }

    const jwt = authorization.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { subscriptionType, paymentMethod } = await req.json();
    
    if (paymentMethod !== 'BCA_MANUAL') {
      throw new Error('Invalid payment method for Moota');
    }

    // Calculate amount based on subscription type
    const amount = subscriptionType === 'yearly' ? 240000 : 25000; // IDR
    
    // Generate unique transaction reference
    const merchantRef = `MOOTA-${user.id.slice(0, 8)}-${Date.now()}`;
    
    // Create Moota payment request using API v2
    const mootaApiKey = Deno.env.get('MOOTA_API_KEY');
    if (!mootaApiKey) {
      throw new Error('Moota API key not configured');
    }

    // For BCA Manual, we'll create a virtual account number
    const virtualAccount = `88808${Date.now().toString().slice(-8)}`;
    
    // Create or update VIP subscription record using UPSERT
    const { data: subscription, error: subError } = await supabaseClient
      .from('vip_subscriptions')
      .upsert({
        user_id: user.id,
        email: user.email,
        subscription_type: subscriptionType,
        status: 'pending',
        currency: 'IDR',
        amount_paid: amount
      }, {
        onConflict: 'user_id'
      })
      .select('id')
      .single();

    if (subError) {
      console.error('Subscription creation error:', subError);
      throw new Error('Failed to create subscription');
    }

    // Create payment transaction record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    const { data: transaction, error: transError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        subscription_id: subscription.id,
        amount: amount,
        currency: 'IDR',
        payment_method: 'BCA_MANUAL',
        tripay_merchant_ref: merchantRef,
        tripay_reference: virtualAccount,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        bank_account: '0881234567890', // BCA account for manual transfer
        payment_instructions: {
          bank: 'BCA',
          account_number: '0881234567890',
          account_name: 'PT ELVISION GROUP',
          amount: amount,
          virtual_account: virtualAccount,
          reference: merchantRef
        }
      })
      .select()
      .single();

    if (transError) {
      console.error('Transaction creation error:', transError);
      throw new Error('Failed to create transaction');
    }

    console.log('Moota payment created:', {
      merchantRef,
      virtualAccount,
      amount,
      userId: user.id
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        merchant_ref: merchantRef,
        virtual_account: virtualAccount,
        amount: amount,
        currency: 'IDR',
        payment_method: 'BCA_MANUAL',
        bank_account: '0881234567890',
        account_name: 'PT ELVISION GROUP',
        expires_at: expiresAt.toISOString(),
        payment_instructions: transaction.payment_instructions
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Moota payment creation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});