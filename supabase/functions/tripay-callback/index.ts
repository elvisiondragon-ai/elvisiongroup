import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const payload = await req.json();
    console.log('Tripay callback received:', payload);

    const { reference, status, amount, paid_at } = payload;

    if (!reference) {
      throw new Error('Missing reference in callback');
    }

    // Verify callback signature
    const privateKey = Deno.env.get("TRIPAY_PRIVATE_KEY");
    const callbackSignature = req.headers.get('X-Callback-Signature');
    
    if (privateKey && callbackSignature) {
      const signatureData = JSON.stringify(payload);
      const expectedSignature = await crypto.subtle.importKey(
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

      if (callbackSignature !== expectedSignature) {
        console.warn('Invalid callback signature');
        return new Response('Invalid signature', { status: 401 });
      }
    }

    // Update payment transaction
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .update({
        status: status === 'PAID' ? 'paid' : status.toLowerCase(),
        paid_at: paid_at ? new Date(paid_at * 1000).toISOString() : null,
        callback_data: payload
      })
      .eq('tripay_reference', reference)
      .select('subscription_id, user_id')
      .single();

    if (transactionError) {
      console.error('Transaction update error:', transactionError);
      throw transactionError;
    }

    // If payment is successful, update subscription
    if (status === 'PAID' && transaction) {
      const { data: subscription } = await supabaseClient
        .from('vip_subscriptions')
        .select('subscription_type')
        .eq('id', transaction.subscription_id)
        .single();

      if (subscription) {
        const now = new Date();
        const endDate = new Date(now);
        
        // Calculate subscription end date
        if (subscription.subscription_type === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (subscription.subscription_type === 'yearly') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        // Update subscription status
        await supabaseClient
          .from('vip_subscriptions')
          .update({
            status: 'active',
            subscription_start_date: now.toISOString(),
            subscription_end_date: endDate.toISOString(),
            amount_paid: amount
          })
          .eq('id', transaction.subscription_id);

        console.log(`VIP subscription activated for user ${transaction.user_id}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});