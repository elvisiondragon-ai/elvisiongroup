// VPS to Supabase Payment Callback Handler
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('🔄 VPS Payment callback received');
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "", 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", 
      { auth: { persistSession: false } }
    );
    
    // Parse payment data from VPS
    const payload = await req.json();
    console.log('💰 VPS payment data:', payload);
    const { reference, status, amount, paid_at } = payload;
    
    if (!reference) {
      throw new Error('Missing reference in VPS callback');
    }
    
    console.log(`📋 Processing payment: ${reference}, Status: ${status}`);
    
    // Update payment transaction
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .update({
        status: status === 'PAID' ? 'paid' : status.toLowerCase(),
        paid_at: paid_at ? new Date(paid_at * 1000).toISOString() : null,
        callback_data: payload
      })
      .eq('tripay_reference', reference)
      .select('id, subscription_id, user_id')
      .single();
    
    if (transactionError) {
      if (transactionError.code === 'PGRST116') {
        console.warn(`⚠️ Transaction with reference ${reference} not found.`);
        return new Response(JSON.stringify({
          success: true,
          message: 'Transaction not found, but acknowledged.'
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw transactionError;
    }
    
    console.log('✅ Transaction updated:', transaction);
    
    // Process successful payment
    if (status === 'PAID') {
      // Get and update subscription
      const { data: subscription, error: subError } = await supabaseClient
        .from('pro_subscriptions')
        .select('user_id, user_email, subscription_type, amount_paid, currency')
        .eq('id', transaction.subscription_id)
        .single();
      
      if (subError || !subscription) {
        console.error('❌ Subscription not found for transaction:', transaction.subscription_id);
        throw new Error('Subscription not found for this transaction.');
      }
      
      // Update subscription status to active
      await supabaseClient
        .from('pro_subscriptions')
        .update({
          status: 'active',
          subscription_start_date: new Date().toISOString()
        })
        .eq('id', transaction.subscription_id);
      
      // Calculate subscription dates
      const startDate = new Date();
      const { data: endDateResult } = await supabaseClient.rpc('calculate_subscription_end_date', {
        p_subscription_type: subscription.subscription_type,
        p_start_date: startDate.toISOString()
      });
      
      // Create/update pro_user record
      await supabaseClient.from('pro_user').upsert({
        email: subscription.user_email,
        status: 'active',
        subscription_type: subscription.subscription_type,
        start_date: startDate.toISOString(),
        end_date: endDateResult,
        amount: subscription.amount_paid,
        currency: subscription.currency || 'IDR',
        tripay_reference: reference,
        payment_method: payload.payment_method || 'Tripay'
      }, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      });
      
      // Add 'pro' achievement to user profile
      if (subscription.user_id) {
        await supabaseClient
          .from('profiles')
          .update({
            achievements: supabaseClient.raw(`array_append(achievements, 'pro')`),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', subscription.user_id)
          .not('achievements', 'cs', '{"pro"}'); // Only if 'pro' not already in array
      }
      
      console.log(`🎉 Pro subscription activated: ${subscription.user_email}, Type: ${subscription.subscription_type}`);
      
      // Send payment completion email
      try {
        const emailResponse = await supabaseClient.functions.invoke('send-payment-email', {
          body: {
            email: subscription.user_email,
            userName: subscription.user_email.split('@')[0],
            type: 'payment_completed',
            paymentData: {
              amount: subscription.amount_paid || amount,
              currency: subscription.currency || 'IDR',
              reference: reference,
              subscriptionType: subscription.subscription_type,
              paymentMethod: payload.payment_method || 'Tripay'
            }
          }
        });
        
        if (emailResponse.error) {
          console.error('❌ Failed to send completion email:', emailResponse.error);
        } else {
          console.log('✅ Payment completion email sent successfully');
        }
      } catch (emailError) {
        console.error('❌ Error sending payment completion email:', emailError);
      }
    }
    
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    console.error('Callback processing error:', error);
    // Kembalikan status 500 jika ada error tak terduga
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});
