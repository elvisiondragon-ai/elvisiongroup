import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';
import { HmacSha256 } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { encode as encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, x-client-info, content-type, authorization, x-callback-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const tripayPrivateKey = Deno.env.get('TRIPAY_PRIVATE_KEY');
function generateCallbackSignature(jsonString, privateKey) {
  const hmac = new HmacSha256(privateKey);
  hmac.update(jsonString);
  return encodeHex(hmac.digest());
}
serve(async (req)=>{
  console.log('--- PUBLIC-CALLBACK FUNCTION INVOCATION START ---');
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const body = await req.json();
    console.log('📦 Public Callback Received Body:', JSON.stringify(body, null, 2));
    const receivedSignature = req.headers.get('x-callback-signature');
    const jsonString = JSON.stringify(body);
    if (!tripayPrivateKey) {
      throw new Error("Missing TRIPAY_PRIVATE_KEY environment variable");
    }
    const expectedSignature = generateCallbackSignature(jsonString, tripayPrivateKey);
    if (receivedSignature !== expectedSignature) {
      console.error(`❌ Invalid signature.`);
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid signature'
      }), {
        status: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    console.log('✅ Signature validation passed');
    const { status, reference, merchant_ref, total_amount } = body;
    const tripayReference = reference;
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    if (status === 'PAID') {
      console.log(`🎉 Payment PAID for reference: ${tripayReference}`);
      console.log(`🔍 Searching for reference in waiting_payment: ${tripayReference}`);
      const { data: waitingData, error: selectError } = await supabase.from('waiting_payment').select('*').eq('tripay_reference', tripayReference).single();
      if (selectError || !waitingData) {
        console.error('❌ Error fetching from waiting_payment:', selectError?.message || 'No record found');
        throw new Error(`Could not find waiting payment record for reference: ${tripayReference}`);
      }
      console.log('✅ Found waiting payment record:', JSON.stringify(waitingData));
      console.log('➕ Inserting into global_product...');
      const { error: insertError } = await supabase.from('global_product').insert({
        name: waitingData.user_name,
        phone: waitingData.customer_phone,
        email: waitingData.user_email,
        tripay_reference: tripayReference,
        merchant_ref: merchant_ref,
        product_name: 'Drelf Collagen',
        status: 'PAID',
        amount: total_amount
      });
      if (insertError) {
        console.error('❌ Error inserting into global_product:', insertError.message);
        throw new Error(`Failed to insert into global_product: ${insertError.message}`);
      }
      console.log('✅ Successfully inserted into global_product');
      console.log('🔄 Updating status in waiting_payment to COMPLETED...');
      const { error: updateError } = await supabase.from('waiting_payment').update({
        status: 'COMPLETED',
        updated_at: new Date().toISOString()
      }).eq('tripay_reference', tripayReference);
      if (updateError) {
        console.warn('⚠️ Warning: Failed to update waiting_payment status:', updateError.message);
      } else {
        console.log('✅ Status updated in waiting_payment.');
      }
    } else {
      console.log(`🔄 Updating status in waiting_payment to ${status}...`);
      const { error: updateError } = await supabase.from('waiting_payment').update({
        status: status,
        updated_at: new Date().toISOString()
      }).eq('tripay_reference', tripayReference);
      if (updateError) {
        console.warn(`⚠️ Warning: Failed to update waiting_payment status to ${status}:`, updateError.message);
      }
    }
    console.log('--- PUBLIC-CALLBACK FUNCTION INVOCATION END ---');
    return new Response(JSON.stringify({
      success: true,
      message: 'Callback processed'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('💥 Error processing callback:', error.message);
    console.log('--- PUBLIC-CALLBACK FUNCTION INVOCATION END WITH ERROR ---');
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
