import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';
// HAPUS SEMUA IMPOR DAN LOGIKA CRYPTO/SIGNATURE.
// Keamanan Signature diasumsikan sudah diverifikasi oleh VPS payment.elvisiongroup.com.
// Ambil kunci rahasia dari environment variables
const TRIPAY_PRIVATE_KEY = Deno.env.get('TRIPAY_PRIVATE_KEY') ?? '';
// Inisialisasi Klien Supabase (Service Role)
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
// Fungsi helper untuk logging dan response
function logAndRespond(message, status, data, isError = false) {
  if (isError) {
    console.error(`❌ ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`✅ ${message}`, JSON.stringify(data, null, 2));
  }
  return new Response(JSON.stringify({
    ...data,
    message
  }), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
// Fungsi verifyTriPaySignature dihilangkan
serve(async (req)=>{
  console.log('🚀 Tripay callback Edge Function started (Processing Only)');
  console.log('📝 Method:', req.method);
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  if (req.method !== 'POST') {
    return logAndRespond('Method Not Allowed', 405, {
      success: false,
      error: 'Method Not Allowed'
    }, true);
  }
  // Ambil body mentah yang dikirim oleh PHP VPS
  const rawBody = await req.text();
  let body;
  try {
    body = JSON.parse(rawBody);
    console.log('📥 Edge Function payload received:', JSON.stringify(body, null, 2));
  } catch (e) {
    return logAndRespond('Invalid JSON payload received from proxy', 400, {
      success: false,
      error: 'Invalid JSON payload'
    }, true);
  }
    const { reference: tripayReference, merchant_ref: merchantRef, status: paymentStatus, payment_method: paymentMethod, amount } = body;
    console.log('✅ Callback data received:', {
      tripayReference,
      merchantRef,
      paymentStatus,
      amount
    });
  
    if (!tripayReference || !paymentStatus) {
      return logAndRespond('Missing required fields in payload (reference, status)', 400, {
        success: false,
        error: 'Missing required fields'
      }, true);
    }
  
    // ===================================
    // ALUR A: Status PAID (Utama)
    // ===================================
    if (paymentStatus === 'PAID') {
      console.log(`🎉 Payment PAID for ${tripayReference}. Processing...`);
  
      // --- 1. Cek Global Product (Drelf/FitFactor) ---
      console.log(`1. 🔍 Searching for product transaction '${tripayReference}' or merchant_ref '${merchantRef}' in global_product...`);
      
            // FIX: Search by tripay_reference OR merchant_ref to handle cases where the update missed
            let query = supabase.from('global_product')
              .select('id, name, email, product_name, amount, status, tripay_reference, affiliate_id') // Added affiliate_id
              .neq('status', 'PAID');
      
            if (merchantRef) {
               query = query.or(`tripay_reference.eq.${tripayReference},merchant_ref.eq.${merchantRef}`);
            } else {
               query = query.eq('tripay_reference', tripayReference);
            }
            
            const { data: globalProductTxData, error: selectGlobalError } = await query.limit(1);
      
            if (selectGlobalError) {
              console.error('   - ❌ CRITICAL DB Select Error (global_product):', selectGlobalError.message);
              return logAndRespond('Database Select Error', 500, {
                success: false,
                error: selectGlobalError.message
              }, true);
            }
      
            // Ambil data pertama dari hasil select (jika ada)
            const globalProductTx = globalProductTxData ? globalProductTxData[0] : null;
      
            if (globalProductTx) {
              console.log(`   - ✅ Found Global Product ID: ${globalProductTx.id}. Updating status to PAID.`);
              
              // Update object
              const updatePayload: any = { status: 'PAID' };
              // Ensure tripay_reference is synced if it was missing
              if (!globalProductTx.tripay_reference && tripayReference) {
                  updatePayload.tripay_reference = tripayReference;
              }
      
        // 2. Update Status di global_product
        const { error: updateError } = await supabase.from('global_product').update(updatePayload).eq('id', globalProductTx.id);
      if (updateError) {
        console.error('   - ❌ FAILED to update global_product status:', updateError.message);
        return logAndRespond('Failed to update global_product status', 500, {
          success: false,
          error: updateError.message
        }, true);
      }
      console.log('   - ✅ Successfully updated global_product to PAID.');
      // 3. Kirim email sukses (Opsional)
      try {
        console.log('3. 📧 Sending success email...');
        const isEbookDiet = globalProductTx.product_name && globalProductTx.product_name.includes('Ebook Diet');
        const isEbookElVision = globalProductTx.product_name && globalProductTx.product_name.includes('Ebook eL-Vision');
        let functionToInvoke;
        if (isEbookDiet) {
          functionToInvoke = 'ebook-diet-mail';
        } else if (isEbookElVision) {
          functionToInvoke = 'ebook-elvision-mail';
        } else {
          functionToInvoke = 'send-payment-email';
        }
        await supabase.functions.invoke(functionToInvoke, {
          body: {
            userEmail: globalProductTx.email,
            amount: amount || globalProductTx.amount,
            currency: 'IDR',
            reference: tripayReference,
            subscriptionType: globalProductTx.product_name,
            paymentMethod: paymentMethod,
            status: 'payment_completed',
            userName: globalProductTx.name // Pass userName for email personalization
          }
        });
        console.log('   - 📧 Email sent to:', globalProductTx.email);
      } catch (emailError) {
        console.log('   - ⚠️ Email failed (non-critical):', emailError);
      }
      // 4. Hapus dari waiting_payment (jika ada)
      await supabase.from('waiting_payment').delete().eq('tripay_reference', tripayReference);
      // RETURN HERE: Tidak melanjutkan ke FALLBACK
      return logAndRespond('Global Product purchase processed successfully and global_product updated.', 200, {
        success: true,
        action: 'global_product_activated'
      });
    }
        // --- OLD FLOW: Fallback ke waiting_payment (Hanya dijalankan jika global_product tidak ditemukan) ---
        console.log(`2. 🔍 Searching for pending transaction '${tripayReference}' in waiting_payment...`);
        // FIX: Menggunakan .maybeSingle() agar tidak crash jika tidak ada transaksi
        // Added affiliate_id to selection
        const { data: waitingTx, error: selectError } = await supabase.from('waiting_payment').select('*').eq('tripay_reference', tripayReference).neq('status', 'paid').maybeSingle();
    
        if (selectError) {
          console.error('   - ❌ DB Select Error (Waiting Payment):', selectError.message);
          return logAndRespond('Critical DB Error: Duplicate pending transaction found.', 500, {
            success: false,
            error: selectError.message
          }, true);
        }
    
        if (!waitingTx) {
          // Jika tidak ditemukan di global_product DAN tidak ditemukan di waiting_payment
          return logAndRespond('Callback received but no matching pending transaction found.', 200, {
            success: true,
            info: 'No matching pending transaction'
          }, true);
        }
    
            // 3. Update status di waiting_payment
            const { error: updateWaitingError } = await supabase.from('waiting_payment').update({
              status: 'paid'
            }).eq('id', waitingTx.id);
            if (updateWaitingError) {
              console.error('   - ❌ FAILED to update waiting_payment status:', updateWaitingError.message);
              return logAndRespond('Failed to update waiting_payment status', 500, {
                success: false,
                error: updateWaitingError.message
              }, true);
            }
            // 4. Aksi berdasarkan subscription_type    let rpcResult;
    if (waitingTx.subscription_type === 'credit') {
      console.log('4. 💳 Executing update_credit_by_email RPC...');
      const { data, error } = await supabase.rpc('update_credit_by_email', {
        p_user_email: waitingTx.user_email,
        p_credit_amount: waitingTx.amount_paid
      });
      if (error) console.error('   - ❌ Credit RPC Error:', error.message);
      rpcResult = data;
    } else if (waitingTx.subscription_type === 'subscription') {
      console.log('4. 👑 Executing activate_pro_subscription RPC...');
      const { data, error } = await supabase.rpc('activate_pro_subscription', {
        p_user_email: waitingTx.user_email
      });
      if (error) console.error('   - ❌ Subscription RPC Error:', error.message);
      rpcResult = data;
    }
    // 5. Kirim Email (Logika lama)
    // ...
    return logAndRespond(`Callback PAID processed for ${waitingTx.subscription_type}.`, 200, {
      success: true,
      action: `${waitingTx.subscription_type}_activated`,
      rpcData: rpcResult
    });
  // ===================================
  // ALUR B, C, D (FAILED, EXPIRED, PARTIAL) remains the same
  // ===================================
  } else if (paymentStatus === 'PARTIAL_PAID') {
    console.log(`🟡 Payment PARTIAL_PAID for ${tripayReference}. No automated action taken.`);
    return logAndRespond(`Callback PARTIAL_PAID processed. No action taken.`, 200, {
      success: true,
      info: 'Partial payment received. Waiting for full payment.'
    });
  } else if (paymentStatus === 'FAILED' || paymentStatus === 'EXPIRED') {
    console.log(`🚫 Payment ${paymentStatus} for ${tripayReference}.`);
    console.log(`🗑️ Deleting ${paymentStatus} transaction from waiting_payment...`);
    const { error: deleteWaitingError } = await supabase.from('waiting_payment').delete().eq('tripay_reference', tripayReference);
    console.log(`🗑️ Updating ${paymentStatus} transaction status in global_product...`);
    const { error: updateGlobalError } = await supabase.from('global_product').update({
      status: paymentStatus
    }).eq('tripay_reference', tripayReference);
    if (deleteWaitingError || updateGlobalError) {
      console.error('   - ❌ Failed to clean up database:', deleteWaitingError?.message || updateGlobalError?.message);
      return logAndRespond('Failed to clean up expired/failed transaction', 500, {
        success: false,
        error: `Cleanup failed. waiting_payment: ${deleteWaitingError?.message}, global_product: ${updateGlobalError?.message}`
      }, true);
    }
    console.log('   - ✅ Database cleanup complete.');
    return logAndRespond(`Callback ${paymentStatus} processed.`, 200, {
      success: true,
      info: `Transaction ${paymentStatus}`
    });
  } else {
    console.log(`🔔 Received non-actionable status: ${paymentStatus}. Ignoring.`);
    return logAndRespond(`Status ${paymentStatus} received. No action taken.`, 200, {
      success: true,
      info: `Status ${paymentStatus} received`
    });
  }
});
