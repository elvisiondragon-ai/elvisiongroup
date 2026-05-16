import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';
import { HmacSha256 } from "https://deno.land/std@0.160.0/hash/sha256.ts";

const TRIPAY_PRIVATE_KEY = Deno.env.get('TRIPAY_PRIVATE_KEY') ?? '';
const MOOTA_WEBHOOK_SECRET = Deno.env.get('MOOTA_WEBHOOK_SECRET') ?? '';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const MOOTA_ALLOWED_IPS = [
  "103.236.201.178", // Standard Moota
  "102.129.187.157", // Detected from test
  "13.248.127.235"   // Detected from test
];

function logAndRespond(message: string, status: number, data: any, isError = false) {
  if (isError) console.error(`❌ ${message}`, JSON.stringify(data, null, 2));
  else console.log(`✅ ${message}`, JSON.stringify(data, null, 2));
  return new Response(JSON.stringify({ ...data, message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

serve(async (req: Request) => {
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('remote-addr');
  console.log(`🚀 Unified Payment Callback Started (IP: ${clientIp})`);

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return logAndRespond('Method Not Allowed', 405, { success: false }, true);

  const rawBody = await req.text();
  const mootaSignature = req.headers.get('Signature');
  let body: any;

  try {
    body = JSON.parse(rawBody);
  } catch (e) {
    return logAndRespond('Invalid JSON payload', 400, { success: false }, true);
  }

  // --- 1. MOOTA DETECTION & HANDLER ---
  if (Array.isArray(body) || mootaSignature) {
    console.log('📥 Moota Webhook Detected');
    
    // MOOTA Signature Verification (Primary Security)
    if (!mootaSignature) return logAndRespond('Missing Moota Signature', 401, { success: false }, true);
    const hmac = new HmacSha256(MOOTA_WEBHOOK_SECRET);
    hmac.update(rawBody);
    if (hmac.toString() !== mootaSignature) {
        console.error(`❌ Moota Signature Mismatch! Calculated: ${hmac.toString()}, Received: ${mootaSignature}`);
        return logAndRespond('Moota Signature Mismatch', 401, { success: false }, true);
    }

    const results = [];
    for (const mutation of body) {
      if (mutation.type !== 'CR') continue; // Credit only
      const { amount, mutation_id } = mutation;
      const amountInt = Math.floor(Number(amount));
      console.log(`🔍 [Moota] Searching order for amount: ${amountInt}`);

      // A. Check global_product
      const { data: globalOrders } = await supabase
        .from('global_product')
        .select('*')
        .eq('status', 'UNPAID')
        .ilike('tripay_reference', 'MANUAL-%')
        .eq('amount', amountInt)
        .order('created_at', { ascending: false })
        .limit(1);

      if (globalOrders && globalOrders.length > 0) {
        const order = globalOrders[0];
        const res = await processFulfillment({ ...order, reference: `MOOTA-${mutation_id}`, payment_method: 'BCA_MANUAL' });
        results.push({ mutation_id, status: 'processed_global', order_id: order.id, res });
        continue;
      }

      // B. Check waiting_payment (Subscriptions)
      const { data: waitingTx } = await supabase
        .from('waiting_payment')
        .select('*')
        .neq('status', 'paid')
        .eq('amount_paid', amountInt)
        .order('created_at', { ascending: false })
        .limit(1);

      if (waitingTx && waitingTx.length > 0) {
        const tx = waitingTx[0];
        const res = await processFulfillment({ 
          id: tx.id, 
          isLegacy: true,
          reference: `MOOTA-${mutation_id}`,
          email: tx.user_email,
          subscription_type: tx.subscription_type,
          amount: tx.amount_paid,
          payment_method: 'BCA_MANUAL'
        });
        results.push({ mutation_id, status: 'processed_legacy', order_id: tx.id, res });
        continue;
      }

      results.push({ mutation_id, status: 'not_found' });
    }
    return new Response(JSON.stringify({ success: true, results }), { status: 200, headers: corsHeaders });
  }

  // --- 2. PAYPAL CAPTURE HANDLER ---
  if (body.action === 'CAPTURE_PAYPAL' && body.orderId) {
    console.log(`🔵 PayPal Capture Triggered: ${body.orderId}`);
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const isSandbox = Deno.env.get('PAYPAL_MODE') === 'sandbox';
    const baseUrl = isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResp = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials"
    });
    const { access_token } = await tokenResp.json();

    const captureResp = await fetch(`${baseUrl}/v2/checkout/orders/${body.orderId}/capture`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${access_token}`, "Content-Type": "application/json" }
    });
    const captureData = await captureResp.json();

    if (!captureResp.ok && !captureData.details?.some((d: any) => d.issue === 'ORDER_ALREADY_CAPTURED')) {
      return logAndRespond('PayPal Capture Failed', 400, { error: captureData }, true);
    }

    body = {
      reference: body.orderId,
      status: 'PAID',
      payment_method: 'PAYPAL',
      amount: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '20.00'
    };
  }

  // --- 3. TRIPAY / CONSOLIDATED HANDLER ---
  const { reference: tripayReference, merchant_ref: merchantRef, status: paymentStatus, payment_method: paymentMethod } = body;
  
  if (paymentStatus === 'PAID') {
    console.log(`🎉 [Standard] Processing PAID | reference: ${tripayReference} | merchant_ref: ${merchantRef}`);

    // A. Try global_product — search by tripay_reference OR merchant_ref
    let query = supabase.from('global_product').select('*').neq('status', 'PAID');
    if (merchantRef) query = query.or(`tripay_reference.eq.${tripayReference},merchant_ref.eq.${merchantRef}`);
    else query = query.eq('tripay_reference', tripayReference);

    const { data: globalOrders, error: globalErr } = await query.limit(1);
    console.log(`🔍 global_product query result: ${globalOrders?.length ?? 0} rows | error: ${globalErr?.message ?? 'none'}`);

    if (globalOrders && globalOrders.length > 0) {
        const order = globalOrders[0];
        console.log(`✅ Found global_product order id:${order.id} status:${order.status} ref:${order.tripay_reference}`);
        const res = await processFulfillment({ ...order, reference: tripayReference, payment_method: paymentMethod || 'Standard' });
        return logAndRespond(res.message, 200, res);
    }

    // A2. Fallback — search by merchant_ref only (in case tripay_reference was not stored yet)
    if (merchantRef) {
      const { data: fallbackOrders } = await supabase
        .from('global_product')
        .select('*')
        .eq('merchant_ref', merchantRef)
        .neq('status', 'PAID')
        .limit(1);
      console.log(`🔍 fallback merchant_ref query: ${fallbackOrders?.length ?? 0} rows`);
      if (fallbackOrders && fallbackOrders.length > 0) {
        const order = fallbackOrders[0];
        console.log(`✅ Found via fallback merchant_ref id:${order.id} status:${order.status}`);
        const res = await processFulfillment({ ...order, reference: tripayReference, payment_method: paymentMethod || 'Standard' });
        return logAndRespond(res.message, 200, res);
      }
    }

    // B. Try waiting_payment (Legacy/Subscription)
    const { data: waitingTx } = await supabase.from('waiting_payment').select('*').eq('tripay_reference', tripayReference).neq('status', 'paid').maybeSingle();
    if (waitingTx) {
      const res = await processFulfillment({
        id: waitingTx.id,
        isLegacy: true,
        reference: tripayReference,
        email: waitingTx.user_email,
        subscription_type: waitingTx.subscription_type,
        amount: waitingTx.amount_paid,
        payment_method: paymentMethod || 'Standard'
      });
      return logAndRespond(res.message, 200, res);
    }

    // C. Not found anywhere — log for manual review
    console.error(`❌ PAID callback not matched | tripay_reference: ${tripayReference} | merchant_ref: ${merchantRef}`);
    return logAndRespond(`PAID callback received but no matching UNPAID order found. Manual review needed.`, 200, { success: true, tripayReference, merchantRef });
  }

  return logAndRespond(`Status ${paymentStatus} received. No action taken.`, 200, { success: true });
});

/**
 * Unified Fulfillment Engine
 */
async function processFulfillment(order: any) {
  console.log(`⚙️ Processing fulfillment for ${order.isLegacy ? 'Legacy' : 'Global'} Order ${order.id}`);

  // --- A. LEGACY SUBSCRIPTION LOGIC ---
  if (order.isLegacy) {
    const { error: updateError } = await supabase.from('waiting_payment').update({ status: 'paid' }).eq('id', order.id).neq('status', 'paid');
    if (updateError) return { success: false, message: 'Legacy update failed' };

    let rpcResult;
    if (order.subscription_type === 'credit') {
      const { data, error } = await supabase.rpc('update_credit_by_email', { p_user_email: order.email, p_credit_amount: order.amount });
      if (error) console.error('   - ❌ Credit RPC Error:', error.message);
      rpcResult = data;
    } else {
      const { data, error } = await supabase.rpc('activate_pro_subscription', { p_tripay_reference: order.reference });
      if (error) console.error('   - ❌ Subscription RPC Error:', error.message);
      rpcResult = data;
    }
    return { success: true, message: `Legacy ${order.subscription_type} activated`, rpcResult };
  }

  // --- B. GLOBAL PRODUCT LOGIC ---
  // 1. Atomic PAID Update (Prevents race conditions)
  const { data: updatedRows, error: updateError } = await supabase
    .from('global_product')
    .update({ status: 'PAID', tripay_reference: order.reference })
    .eq('id', order.id)
    .neq('status', 'PAID')
    .select();

  if (updateError || !updatedRows || updatedRows.length === 0) {
    return { success: false, message: 'Already processed or update failed', error: updateError?.message, code: updateError?.code };
  }

  const pName = order.product_name || '';

  // 1.5 Clean up leads from darkfeminine_free
  if (/dark feminine|dark feminin|feminine magnetism/i.test(pName)) {
    try {
      const cleanPhone = order.phone?.replace(/\D/g, '');
      await (supabase.from('darkfeminine_free' as any) as any)
        .delete()
        .or(`user_email.eq.${order.email},phone.eq.${cleanPhone}`);
      console.log(`🧹 Cleaned up darkfeminine_free for ${order.email}`);
    } catch (e: any) { console.error('Lead Cleanup Error:', e.message); }
  }

  // 2. Specialized Logic (Dark Feminine, Saham, Webinar)
  if (/dark feminine|dark feminin|feminine magnetism/i.test(pName)) {
    try {
      await supabase.auth.admin.createUser({
        email: order.email,
        email_confirm: true,
        password: 'DfUser' + Math.floor(Math.random() * 1000000),
        user_metadata: { full_name: order.name, phone: order.phone }
      });
      await supabase.from('reviews_darkfeminine').insert({
        user_email: order.email, name: order.name, rating: 5, comment: null,
        country: pName.includes('SG') ? 'SG' : (pName.includes('EN') ? 'US' : 'ID')
      });
    } catch (e: any) { console.error('DF Error:', e.message); }
  }

  if (/saham/i.test(pName)) {
    try {
      await supabase.from('saham_clients').insert({ user_email: order.email.trim().toLowerCase(), status: 'active' });
    } catch (e: any) { console.error('Saham Error:', e.message); }
  }

  if (/webinar/i.test(pName)) {
    try {
      await supabase.from('user_webinar').insert({
        email: order.email, name: order.name, phone_number: order.phone,
        phone: order.phone, userPhone: order.phone, reference: order.merchantRef, address: order.address,
        order_id: order.reference, paid_at: new Date().toISOString(),
        origin: pName.toLowerCase().includes('usa_webinar') ? 'USA' : 'Indonesia'
      });
    } catch (e: any) { console.error('Webinar Error:', e.message); }
  }

  // 3. Email Notification (isolated — failure does NOT block CAPI)
  try {
    const isEbook = /program diet|ebook|feminine magnetism|webinar|raja ranjang|dark feminine|love magnet|saham/i.test(pName);
    const functionToInvoke = isEbook ? 'send-ebooks-email' : 'send-payment-email';
    const qtyMatch = pName.match(/\(x(\d+)\)/);
    const parsedQty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
    await supabase.functions.invoke(functionToInvoke, {
      body: {
        userEmail: order.email, phone: order.phone, amount: order.amount, currency: 'IDR',
        reference: order.reference, subscriptionType: pName, paymentMethod: order.payment_method,
        status: 'payment_completed', userName: order.name, address: order.address,
        quantity: parsedQty
      }
    });
  } catch (e: any) { console.error('Email Notify Error:', e.message); }

  // 4. CAPI Notification (isolated — always runs regardless of email result)
  try {
    let pixelId = '3319324491540889'; // Default DarkFeminine
    if (/fitfactor/i.test(pName)) pixelId = '1797660474333865';
    else if (/parfum/i.test(pName)) pixelId = '1315644686235886';
    else if (/hungry/i.test(pName)) pixelId = '952231486339176';
    else if (/drelf/i.test(pName)) pixelId = '1749197952320359';
    else if (/jewelry/i.test(pName)) pixelId = '874165095242407';
    else if (/rumah|apartemen|dreamhome/i.test(pName)) pixelId = '1572796670108871';

    let resolvedFbc = order.fbc || null;
    if (!resolvedFbc && order.page_url) {
      try {
        const urlObj = new URL(order.page_url);
        const fbclid = urlObj.searchParams.get('fbclid');
        if (fbclid) resolvedFbc = `fb.1.${Date.now()}.${fbclid}`;
      } catch (_) {}
    }

    await supabase.functions.invoke('capi-universal', {
      body: {
        pixelId, eventName: 'Purchase', action_source: 'website',
        eventSourceUrl: order.page_url || null,
        userData: { email: order.email, ph: order.phone, fn: order.name?.split(' ')[0], fbc: resolvedFbc, fbp: order.fbp, client_ip_address: order.ip_address, client_user_agent: order.user_agent, ctwa_clid: order.ctwa_clid },
        customData: { value: order.amount, currency: 'IDR', content_name: pName, order_id: order.reference },
        eventId: order.reference
      }
    });
    await supabase.from('global_product').update({ capi_purchase_sent: true }).eq('id', order.id);
  } catch (e: any) { console.error('CAPI Notify Error:', e.message); }

  await supabase.from('waiting_payment').delete().eq('tripay_reference', order.reference);
  return { success: true, message: 'Fulfillment complete' };
}
