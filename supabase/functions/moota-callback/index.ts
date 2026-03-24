import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';
import { HmacSha256 } from "https://deno.land/std@0.160.0/hash/sha256.ts";

const MOOTA_WEBHOOK_SECRET = Deno.env.get('MOOTA_WEBHOOK_SECRET') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ALLOWED_IP = "103.236.201.178";

serve(async (req) => {
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  console.log(`📥 Incoming Moota Webhook from IP: ${clientIp}`);

  // 1. IP Whitelisting
  if (clientIp && !clientIp.startsWith(ALLOWED_IP)) {
    console.error(`🚫 Restricted IP: ${clientIp}`);
    return new Response(JSON.stringify({ error: "Unauthorized IP" }), { status: 403 });
  }

  if (req.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('Signature');

  // 2. Signature Verification
  if (!signature) {
    console.error("❌ Missing Signature header");
    return new Response(JSON.stringify({ error: "Missing Signature" }), { status: 401 });
  }

  const hmac = new HmacSha256(MOOTA_WEBHOOK_SECRET);
  hmac.update(rawBody);
  const calculatedSignature = hmac.toString();

  if (calculatedSignature !== signature) {
    console.error("❌ Signature Mismatch!");
    console.log("Calculated:", calculatedSignature);
    console.log("Received:", signature);
    return new Response(JSON.stringify({ error: "Invalid Signature" }), { status: 401 });
  }

  let mutations;
  try {
    mutations = JSON.parse(rawBody);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  console.log(`✅ Signature Verified. Processing ${mutations.length} mutations...`);

  const results = [];

  for (const mutation of mutations) {
    // Only process Credit (Incoming) mutations
    if (mutation.type !== 'CR') {
      console.log(`⏭️ Skipping non-CR mutation: ${mutation.mutation_id}`);
      continue;
    }

    const { amount, description, mutation_id } = mutation;
    console.log(`🔍 Searching order for amount: ${amount}, desc: ${description}`);

    // Find UNPAID order with matching amount
    // Note: We search for exact amount match in global_product
    const { data: orders, error: searchError } = await supabase
      .from('global_product')
      .select('*')
      .eq('status', 'UNPAID')
      .ilike('tripay_reference', 'MANUAL-%')
      .eq('amount', amount)
      .order('created_at', { ascending: false })
      .limit(1);

    if (searchError) {
      console.error(`❌ DB Search Error: ${searchError.message}`);
      continue;
    }

    if (!orders || orders.length === 0) {
      console.log(`⚠️ No matching UNPAID order found for amount ${amount}`);
      results.push({ mutation_id, status: 'not_found' });
      continue;
    }

    const order = orders[0];
    console.log(`🎉 Match found! Order ID: ${order.id}. Activating...`);

    // 3. Mark as PAID (Atomic update)
    const { data: updated, error: updateError } = await supabase
      .from('global_product')
      .update({ status: 'PAID', tripay_reference: `MOOTA-${mutation_id}` })
      .eq('id', order.id)
      .neq('status', 'PAID')
      .select();

    if (updateError || !updated || updated.length === 0) {
      console.error(`❌ Failed to update order status or already processed: ${updateError?.message}`);
      continue;
    }

    const pName = order.product_name || '';

    // --- SPECIAL FULFILLMENT: DARK FEMININE ---
    if (pName.toLowerCase().includes('dark feminine') || pName.toLowerCase().includes('dark feminin') || pName.toLowerCase().includes('feminine magnetism')) {
      console.log(`🌙 Dark Feminine detected. Auto-creating profile...`);
      try {
        await supabase.auth.admin.createUser({
          email: order.email,
          email_confirm: true,
          password: 'DfUser' + Math.floor(Math.random() * 1000000),
          user_metadata: { full_name: order.name, phone: order.phone }
        });
        await supabase.from('darkfeminine_reviews').insert({
          user_email: order.email,
          name: order.name,
          comment: null,
          rating: 5,
          country: pName.includes('SG') ? 'SG' : (pName.includes('EN') ? 'US' : 'ID')
        });
      } catch (e: any) { console.error('DF fulfillment error:', e.message); }
    }

    // --- SPECIAL FULFILLMENT: SAHAM ---
    if (pName.toLowerCase().includes('saham')) {
      console.log(`📈 Saham product detected. Adding to clients...`);
      try {
        await supabase.from('saham_clients').insert({
          user_email: order.email.trim().toLowerCase(),
          status: 'active'
        });
      } catch (e) { console.error('Saham fulfillment error:', e.message); }
    }

    // --- SPECIAL FULFILLMENT: WEBINAR ---
    if (pName.toLowerCase().includes('webinar')) {
      console.log(`🎟️ Webinar detected. Adding to user_webinar...`);
      try {
        await supabase.from('user_webinar').insert({
          email: order.email,
          name: order.name,
          phone_number: order.phone,
          phone: order.phone, // Added
          userPhone: order.phone, // Added
          reference: order.tripay_reference, // Added
          address: order.address, // Added
          order_id: `MOOTA-${mutation_id}`,
          paid_at: new Date().toISOString(),
          origin: pName.toLowerCase().includes('usa_webinar') ? 'USA' : 'Indonesia'
        });
      } catch (e) { console.error('Webinar fulfillment error:', e.message); }
    }

    // 4. Trigger fulfillment emails
    try {
      const ebookSpecificKeywords = ['program diet', 'ebook', 'feminine magnetism', 'webinar', 'raja ranjang', 'dark feminine', 'love magnet', 'saham'];
      const isEbook = ebookSpecificKeywords.some(key => pName.toLowerCase().includes(key));
      const functionToInvoke = 'send-paid-notif';
      
      console.log(`📧 Invoking ${functionToInvoke}...`);
      await supabase.functions.invoke(functionToInvoke, {
        body: {
          userEmail: order.email, phone: order.phone, amount: order.amount, currency: 'IDR',
          reference: `MOOTA-${mutation_id}`, subscriptionType: order.product_name,
          paymentMethod: 'BCA_MANUAL', status: 'payment_completed', userName: order.name,
          affiliateEmail: order.affiliate_email, address: order.address
        }
      });
    } catch (e) { console.error('Email invocation error:', e.message); }

    // 5. CAPI Tracking (PIXEL EL VISION CONSOLIDATION)
    try {
      const capiPixelId = '3319324491540889';
      console.log(`🎯 Sending CAPI event...`);
      await supabase.functions.invoke('capi-universal', {
        body: {
          pixelId: capiPixelId, eventName: 'Purchase',
          userData: { email: order.email, ph: order.phone, fn: order.name?.split(' ')[0], fbc: order.fbc, fbp: order.fbp, client_ip_address: order.ip_address, client_user_agent: order.user_agent },
          customData: { value: order.amount, currency: 'IDR', content_name: order.product_name, order_id: `MOOTA-${mutation_id}` },
          eventId: `MOOTA-${mutation_id}`
        }
      });
      await supabase.from('global_product').update({ capi_purchase_sent: true }).eq('id', order.id);
    } catch (e) { console.error('CAPI error:', e.message); }

    results.push({ mutation_id, status: 'processed', order_id: order.id });
  }

  return new Response(JSON.stringify({ success: true, results }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
