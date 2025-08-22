// File: supabase/functions/tripay-callback/index.ts (Versi Final Diperbaiki)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  // Clone request agar body bisa dibaca dua kali (sekali sebagai teks, sekali sebagai JSON)
  const reqClone = req.clone();
  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        persistSession: false
      }
    });
    // --- BLOK VALIDASI SIGNATURE YANG DIPERBAIKI ---
    const privateKey = Deno.env.get("TRIPAY_PRIVATE_KEY");
    const callbackSignature = req.headers.get('X-Callback-Signature');
    if (!privateKey || !callbackSignature) {
      console.warn("Callback received without signature or private key not configured.");
      // Anda bisa memilih untuk melanjutkan tanpa validasi atau menolak
      // Untuk keamanan, sebaiknya menolak jika signature tidak ada
      return new Response('Signature missing', {
        status: 400
      });
    }
    // 1. Baca body sebagai teks MENTAH untuk validasi
    const rawBody = await req.text();
    const expectedSignature = hmac("sha256", privateKey, rawBody, "utf-8", "hex");
    if (callbackSignature !== expectedSignature) {
      console.error('Invalid callback signature');
      return new Response('Invalid signature', {
        status: 401
      });
    }
    console.log('Callback signature is valid.');
    // ---------------------------------------------
    // 2. Sekarang, baca body dari clone sebagai JSON untuk diproses
    const payload = await reqClone.json();
    console.log('Tripay callback payload:', payload);
    const { reference, status, amount, paid_at } = payload;
    if (!reference) throw new Error('Missing reference in callback');
    // Update payment transaction
    const { data: transaction, error: transactionError } = await supabaseClient.from('payment_transactions').update({
      status: status === 'PAID' ? 'paid' : status.toLowerCase(),
      paid_at: paid_at ? new Date(paid_at * 1000).toISOString() : null,
      callback_data: payload
    }).eq('tripay_reference', reference).select('id, subscription_id, user_id')
    .single();
    if (transactionError) {
      // Jika error karena referensi tidak ditemukan, tetap kembalikan status 200
      // agar Tripay tidak mengirim ulang.
      if (transactionError.code === 'PGRST116') {
        console.warn(`Transaction with reference ${reference} not found.`);
        return new Response(JSON.stringify({
          success: true,
          message: 'Transaction not found, but acknowledged.'
        }), {
          status: 200
        });
      }
      throw transactionError;
    }
    // Process payment and create/update pro_user subscription
    if (status === 'PAID') {
      // Get user email from pro_subscriptions
      const { data: subscription, error: subError } = await supabaseClient
        .from('pro_subscriptions')
        .select('user_email, subscription_type, amount_paid, currency')
        .eq('id', transaction.subscription_id)
        .single();
      
      if (subError || !subscription) {
        console.error('Subscription not found for transaction:', transaction.subscription_id);
        throw new Error('Subscription not found for this transaction.');
      }
      
      // Calculate subscription dates using the database function
      const startDate = new Date();
      const { data: endDateResult } = await supabaseClient.rpc('calculate_subscription_end_date', {
        p_subscription_type: subscription.subscription_type,
        p_start_date: startDate.toISOString()
      });
      
      // Insert or update pro_user record
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
      
      console.log(`Pro user subscription activated for email: ${subscription.user_email}, type: ${subscription.subscription_type}`);
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
