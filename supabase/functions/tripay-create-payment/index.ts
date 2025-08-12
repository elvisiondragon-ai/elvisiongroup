import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req)=>{
  // 1. Handle Preflight Request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    // 2. Inisialisasi Supabase Client (menggunakan secrets dari environment Loveable AI)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
      
    // 3. Autentikasi Pengguna
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) throw new Error("User not authenticated");

    // 4. Baca Data dari Body Permintaan
    const { subscriptionType, paymentMethod } = await req.json();
    if (!subscriptionType || !paymentMethod) {
      throw new Error("Missing subscriptionType or paymentMethod in request body");
    }

    // 5. Siapkan Data untuk Dikirim ke Proxy
    const amount = subscriptionType === 'monthly' ? 100000 : 800000;
    const customerName = user.email?.split('@')[0] || 'Customer';
    const proxyPayload = {
      method: paymentMethod,
      amount: amount,
      customer_name: customerName,
      customer_email: user.email,
      order_items: [
        {
          sku: `VIP_${subscriptionType}`,
          name: `VIP Subscription ${subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'}`,
          price: amount,
          quantity: 1
        }
      ],
      callback_url: "https://elvisiongroup.com/tripay/process",
      return_url: `${req.headers.get("origin")}/profile?payment=success`
    };

    // 6. Panggil VPS Proxy dengan Domain Stabil
    console.log('[OK] Calling VPS proxy server with unsigned data...');
    const vpsProxyUrl = 'https://payment.elvisiongroup.com/api/tripay/create-transaction';
    const tripayResponse = await fetch(vpsProxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proxyPayload)
    });

    const responseData = await tripayResponse.json();
    if (!tripayResponse.ok) {
      throw new Error(responseData.message || `Error from VPS proxy: Status ${tripayResponse.status}`);
    }

    // 7. Simpan Data Transaksi Awal ke Database
    console.log('[OK] Saving transaction to database...');
    const transaction = responseData.data;
    const { error: insertError } = await supabaseClient.from('payment_transactions').insert({
      user_id: user.id,
      status: 'UNPAID',
      tripay_reference: transaction.reference,
      merchant_ref: transaction.merchant_ref,
      payment_method: transaction.payment_method,
      amount: transaction.amount,
      payment_url: transaction.checkout_url,
      qr_string: transaction.qr_string,
      qr_url: transaction.qr_url,
      pay_code: transaction.pay_code
    });
    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save transaction to database.');
    }
    console.log('[OK] Transaction saved successfully.');

    // 8. Kembalikan respons sukses ke Frontend
    return new Response(JSON.stringify(responseData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
    });

  } catch (error) {
    // 9. Tangani semua error yang mungkin terjadi
    console.error('Final Payment Creation Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
    });
  }
});