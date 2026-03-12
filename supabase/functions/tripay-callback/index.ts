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
serve(async (req) => {
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

  // --- SPECIAL HANDLING: PAYPAL CAPTURE TRIGGER ---
  // Frontend calls this manually after user approves payment
  if (body.action === 'CAPTURE_PAYPAL' && body.orderId) {
    console.log(`🔵 PayPal Capture Triggered for Order: ${body.orderId}`);

    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const isSandbox = Deno.env.get('PAYPAL_MODE') === 'sandbox';
    const baseUrl = isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

    if (!clientId || !clientSecret) return logAndRespond('Server config missing (PayPal)', 500, { success: false }, true);

    try {
      // 1. Get Token
      const auth = btoa(`${clientId}:${clientSecret}`);
      const tokenResp = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: "grant_type=client_credentials"
      });
      const tokenData = await tokenResp.json();
      const accessToken = tokenData.access_token;

      // 2. Capture Order
      const captureResp = await fetch(`${baseUrl}/v2/checkout/orders/${body.orderId}/capture`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" }
      });
      const captureData = await captureResp.json();

      if (!captureResp.ok) {
        // If already captured, we might still want to proceed to ensure DB is synced
        if (captureData.details && captureData.details[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
          console.log('⚠️ Order already captured. Proceeding to sync DB.');
        } else {
          return logAndRespond('PayPal Capture Failed', 400, { error: captureData }, true);
        }
      }

      console.log('✅ PayPal Captured Successfully.');

      // 3. TRANSFORM PAYPAL DATA TO "TRIPAY STYLE" DATA
      // This allows us to reuse the exact same logic below without rewriting it
      // We overwrite 'body' so the rest of the script thinks it came from Tripay
      body = {
        reference: body.orderId, // The PayPal Order ID is our "Tripay Reference"
        merchant_ref: null, // We let the script find it via reference
        status: 'PAID',
        payment_method: 'PAYPAL',
        amount: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '20.00' // Get real amount
      };
      console.log('🔄 Transformed PayPal data for internal processing:', body);

    } catch (err) {
      return logAndRespond('PayPal Integration Error', 500, { error: err.message }, true);
    }
  }
  // --- END SPECIAL HANDLING ---

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

    // FIX: Search regardless of status to allow manual re-triggering via curl
    console.log(`🔍 Searching global_product for reference: ${tripayReference} or merchantRef: ${merchantRef}`);
    let query = supabase.from('global_product')
      .select('id, name, email, phone, product_name, amount, status, tripay_reference, affiliate_id, affiliate_email, fbc, fbp, address, ip_address, user_agent');

    if (merchantRef) {
      query = query.or(`tripay_reference.eq.${tripayReference},merchant_ref.eq.${merchantRef}`);
    } else {
      query = query.eq('tripay_reference', tripayReference);
    }

    const { data: globalProductTxData, error: selectGlobalError } = await query.limit(1);
    console.log(`📊 Query Result count: ${globalProductTxData?.length || 0}`);
    if (selectGlobalError) console.error(`❌ Query Error: ${selectGlobalError.message}`);

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
      console.log(`   - ✅ Found Global Product ID: ${globalProductTx.id}. Attempting atomic update to PAID.`);

      // Update object
      const updatePayload: any = {
        status: 'PAID'
      };
      // Ensure tripay_reference is synced if it was missing
      if (!globalProductTx.tripay_reference && tripayReference) {
        updatePayload.tripay_reference = tripayReference;
      }

      // 2. ATOMIC UPDATE (Optimistic Locking)
      // Only update if the current status is NOT 'PAID'. This prevents race conditions.
      const { data: updatedRows, error: updateError } = await supabase
        .from('global_product')
        .update(updatePayload)
        .eq('id', globalProductTx.id)
        .neq('status', 'PAID') // CRITICAL: Only update if it's NOT ALREADY PAID
        .select();

      if (updateError) {
        console.error('   - ❌ FAILED to update global_product status:', updateError.message);
        return logAndRespond('Failed to update global_product status', 500, {
          success: false,
          error: updateError.message
        }, true);
      }

      // CHECK IF WE WON THE RACE
      if (!updatedRows || updatedRows.length === 0) {
        console.log(`   - ⚠️ Transaction ${globalProductTx.id} was already PAID. Skipping duplicate fulfillment.`);
        return logAndRespond('Transaction already processed.', 200, { success: true });
      } else {
        console.log('   - ✅ Successfully updated global_product to PAID (Winner of race condition).');
      }

      const pName = globalProductTx.product_name || '';
      console.log(`🚀 [ACTIVAING PRODUCT] ${pName} for ${globalProductTx.email}`);

      // --- AUTO INSERT INTO PROFILES AND REVIEWS FOR DARK FEMININE ---
      if (pName.toLowerCase().includes('dark feminine') || pName.toLowerCase().includes('dark feminin') || pName.toLowerCase().includes('feminine magnetism')) {
        console.log(`   - 🌙 Dark Feminine detected (${pName}). Auto-creating profile and review...`);
        try {
          // 1. Create auth user using Admin API (if not exists)
          // This will trigger public.handle_new_user() to insert into profiles automatically
          const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.createUser({
            email: globalProductTx.email,
            email_confirm: true,
            password: 'DfUser' + Math.floor(Math.random() * 1000000), // Random password
            user_metadata: { full_name: globalProductTx.name, phone: globalProductTx.phone }
          });

          if (adminAuthError && !adminAuthError.message.includes('already exists') && !adminAuthError.message.includes('User already registered')) {
            console.error('   - ⚠️ Error creating auth user for DF:', adminAuthError.message);
          } else {
            console.log('   - ✅ Auth user verified/created for DF. They can use Forgot Password to login.');
          }

          // 2. Insert into darkfeminine_reviews (Null comment initially)
          // Detect country from pName if possible
          let defaultCountry = 'ID';
          if (pName.includes('SG')) defaultCountry = 'SG';
          if (pName.includes('EN')) defaultCountry = 'US';

          const { error: reviewErr } = await supabase.from('darkfeminine_reviews').insert({
            user_email: globalProductTx.email,
            name: globalProductTx.name,
            comment: null,
            rating: 5,
            country: defaultCountry
          });

          if (reviewErr && !reviewErr.message.includes('duplicate key')) {
            console.error('   - ⚠️ Error inserting into darkfeminine_reviews:', reviewErr.message);
          } else {
            console.log('   - ✅ Inserted default review into darkfeminine_reviews');
          }
        } catch (dfErr) {
          console.error('   - ⚠️ Failed to auto-insert DF review/profile:', dfErr);
        }
      }

      // --- AUTO INSERT INTO SAHAM CLIENTS ---
      if (pName.toLowerCase().includes('saham')) {
        console.log(`   - 📈 Saham product detected (${pName}). Auto-inserting into saham_clients...`);
        try {
          const { error: clientErr } = await supabase.from('saham_clients').insert({
            user_email: globalProductTx.email.trim().toLowerCase(),
            status: 'active'
          });

          if (clientErr && !clientErr.message.includes('already exists') && !clientErr.message.includes('duplicate key')) {
            console.error('   - ⚠️ Error inserting into saham_clients:', clientErr.message);
          } else {
            console.log('   - ✅ User added to saham_clients for instant fulfillment');
          }
        } catch (sahamErr) {
          console.error('   - ⚠️ Failed to auto-insert into saham_clients:', sahamErr);
        }
      }
      console.log(`✅ [SUCCESS] Fulfillment complete for ${pName}`);

      // --- 2.1 ADD TO USER WEBINAR TABLE ---
      // We check for 'webinar' to catch usa_webinar20, webinar_el, etc.
      if (pName.toLowerCase().includes('webinar')) {
        console.log(`   - 🎟️ Webinar detected (${pName}). Inserting into user_webinar table...`);

        const origin = pName.toLowerCase().includes('usa_webinar') ? 'USA' : 'Indonesia';

        try {
          await supabase.from('user_webinar').insert({
            email: globalProductTx.email,
            name: globalProductTx.name,
            phone_number: globalProductTx.phone,
            order_id: tripayReference,
            paid_at: new Date().toISOString(),
            origin: origin
          });
          console.log(`   - ✅ Inserted into user_webinar (Origin: ${origin})`);
        } catch (webinarError) {
          console.error('   - ⚠️ Failed to insert into user_webinar (non-critical):', webinarError);
        }
      }

      // 3. Kirim email sukses (Opsional)
      try {
        console.log('3. 📧 Sending success email...');
        const lowerPName = pName.toLowerCase();

        // Specific keywords based on Product Catalog names to route to send-ebooks-email
        const ebookSpecificKeywords = [
          'program diet el-vision',
          'ebook el vision',
          'ebook uang panas',
          'ebook pria alpha',
          'feminine magnetism',
          'ebook health recovery',
          'webinar',
          'raja ranjang',
          'dark feminine',
          'love magnet',
          'saham'
        ];

        const isEbook = ebookSpecificKeywords.some(key => lowerPName.includes(key));

        let functionToInvoke = isEbook ? 'send-ebooks-email' : 'send-payment-email';

        // --- CAPI & EMAIL CONFIGURATION ---
        let capiPixelId = null;
        let capiValue = 0;
        let capiCurrency = 'IDR';
        let emailCurrency = 'IDR';
        let displayAmount = amount || globalProductTx.amount;

        const isEbookHealth = pName.includes('Health Recovery') || pName.includes('ebook_health20') || pName.includes('usa_ebookslim') || pName.includes('Slim Without Suffering') || pName.includes('usa_ebookhealth') || pName.includes('usa_webinar');
        const isCoaching3000 = pName.includes('3000 Coaching') || pName.includes('usa_3000') || pName.includes('usa_pay3000');
        const isVIP6Week = pName.includes('VIP SESSION 6 Week') || pName.includes('VIP6WEEK');
        const isEbookPercayaDiri = pName.includes('ebook_percayadiri') || pName.includes('Ebook Percaya Diri') || pName.includes('Ebook Pria Alpha') || pName.includes('Paket Pria Alpha');
        const isEbookFeminine = pName.includes('ebook_feminine') || pName.includes('Feminine Magnetism');
        const isUangPanas = pName.includes('ebook_uangpanas') || pName.includes('Uang Panas') || pName.includes('Sistem Uang Panas');
        const isFitFactor = pName.includes('Fitfactor');
        const isJewelry = pName.toLowerCase().includes('jewelry');
        const isDrelf = pName.toLowerCase().includes('drelf');
        const isWebinar = pName.toLowerCase().includes('webinar');
        const isRajaRanjang = lowerPName.includes('raja ranjang');
        const isSaham = lowerPName.includes('saham');

        // SG/MY eL Vision Editions
        const isSGElvision = pName.includes('sg_elvision_en') || pName.includes('English Edition');
        const isMYElvision = pName.includes('sg_elvision_malay') || pName.includes('Malay Edition');

        console.log(`   - CAPI Logic Check: isEbookHealth=${isEbookHealth}, isCoaching3000=${isCoaching3000}, isVIP6Week=${isVIP6Week}, isEbookPercayaDiri=${isEbookPercayaDiri}, isEbookFeminine=${isEbookFeminine}, isUangPanas=${isUangPanas}, isFitFactor=${isFitFactor}, isWebinar=${isWebinar}, isDrelf=${isDrelf}, isJewelry=${isJewelry}, isSGElvision=${isSGElvision}, isMYElvision=${isMYElvision}, isRajaRanjang=${isRajaRanjang}, isSaham=${isSaham}`);

        if (isEbookHealth || isCoaching3000 || isVIP6Week || pName.includes('usa_ebookfeminine')) {
          capiPixelId = '1393383179182528'; // Manifestation Pixel (USA)
          if (isCoaching3000) capiValue = 3000.00;
          else if (isVIP6Week) capiValue = 1500.00;
          else capiValue = 20.00;

          capiCurrency = 'USD';
          emailCurrency = 'USD';
          displayAmount = capiValue;
        } else if (isSGElvision) {
          capiPixelId = '3319324491540889'; // EbookIndo Pixel
          capiCurrency = 'SGD';
          emailCurrency = 'SGD';
          // Logic: if amount is 564000 IDR, convert back to 47 SGD
          displayAmount = (amount || globalProductTx.amount) / 12000;
          capiValue = displayAmount;
        } else if (isMYElvision) {
          capiPixelId = '3319324491540889'; // EbookIndo Pixel
          capiCurrency = 'MYR';
          emailCurrency = 'MYR';
          // Logic: if amount is 311500 IDR, convert back to 89 MYR
          displayAmount = (amount || globalProductTx.amount) / 3500;
          capiValue = displayAmount;
        } else if (isRajaRanjang) {
          capiPixelId = '934836615539666'; // Raja Ranjang Pixel
          capiCurrency = 'IDR';
          emailCurrency = 'IDR';
          capiValue = amount || globalProductTx.amount || 149000;
          displayAmount = capiValue;
        } else if (isDrelf) {
          capiPixelId = '1749197952320359'; // Drelf SG Pixel
          capiCurrency = 'SGD';
          emailCurrency = 'SGD';
          displayAmount = (amount || globalProductTx.amount) / 12000; // Convert back to SGD
          capiValue = displayAmount;
        } else if (isJewelry) {
          capiPixelId = '874165095242407'; // New Ramadhan Ring / Jewelry Pixel
          capiCurrency = 'SGD';
          emailCurrency = 'SGD';
          displayAmount = (amount || globalProductTx.amount) / 12000; // Convert back to SGD
          capiValue = displayAmount;
        } else if (isSaham) {
          capiPixelId = '1941160619993263'; // Saham Crypto Pixel
          capiCurrency = 'IDR';
          emailCurrency = 'IDR';
          capiValue = amount || globalProductTx.amount || 99000;
          displayAmount = capiValue;
        } else if (isEbookPercayaDiri || isEbookFeminine || isUangPanas || isWebinar || pName.includes('ebook_elvision') || pName.includes('ebook_adhd') || pName.includes('ebook_arif') || pName.includes('ebook_grief') || pName.includes('ebook_langsing') || pName.includes('ebook_tracker') || pName.includes('vip_15jt') || pName.includes('webinar_el')) {
          capiPixelId = '3319324491540889'; // EbookIndo Pixel
          capiValue = amount || globalProductTx.amount || 100000;
          capiCurrency = 'IDR';
          emailCurrency = 'IDR';
          displayAmount = capiValue;
        } else if (isFitFactor) {
          capiPixelId = '1797660474333865'; // Fit Factor Pixel
          capiValue = amount || globalProductTx.amount || 0;
          capiCurrency = 'IDR';
          emailCurrency = 'IDR';
          displayAmount = capiValue;
        } else {
          // --- UNIVERSAL FALLBACK ---
          // Automatically handles new products without needing backend edits.
          console.log(`   - 🌐 Universal Product Fallback Triggered for: ${pName}`);
          capiPixelId = '3319324491540889'; // Default to Main Indo Pixel
          capiValue = amount || globalProductTx.amount || 0;

          // Auto-detect currency from amount size as a fallback if not explicitly defined
          // If the amount is very small (e.g., < 1000), it might be SGD/USD, but create-payment 
          // converts everything to IDR in the database. So the DB amount is always IDR.
          capiCurrency = 'IDR';
          emailCurrency = 'IDR';
          displayAmount = capiValue;
        }

        console.log(`   - CAPI Pixel Selected: ${capiPixelId}`);

        // --- EMAIL INVOKE ---
        console.log(`   - ⏱️ [TIMING] Invoking email function ${functionToInvoke} for product: ${pName} with currency ${emailCurrency}...`);
        const emailStartTime = Date.now();
        await supabase.functions.invoke(functionToInvoke, {
          body: {
            userEmail: globalProductTx.email,
            phone: globalProductTx.phone,
            amount: displayAmount,
            currency: emailCurrency,
            reference: tripayReference,
            subscriptionType: globalProductTx.product_name,
            paymentMethod: paymentMethod,
            status: 'payment_completed',
            userName: globalProductTx.name,
            affiliateEmail: globalProductTx.affiliate_email,
            address: globalProductTx.address
          }
        });
        console.log(`   - ⏱️ [TIMING] ✅ Email function ${functionToInvoke} finished in ${Date.now() - emailStartTime}ms.`);
        console.log('   - 📧 Email sent to:', globalProductTx.email);

        // --- UNIVERSAL CAPI TRACKING ---
        // We check capi_purchase_sent to ensure we only send ONCE (Winner-Takes-All between Frontend and Backend)
        if (capiPixelId && !globalProductTx.capi_purchase_sent) {
          try {
            // TEST MODE CHECK
            const isTestUser = globalProductTx.email === 'elvisiondragon@gmail.com';
            const eventName = isTestUser ? 'Test_Purchase' : 'Purchase';
            if (isTestUser) console.log('   - 🧪 TEST MODE: Sending Test_Purchase event');

            console.log(`   - ⏱️ [TIMING] 🎯 Sending CAPI ${eventName} event via capi-universal to Pixel ${capiPixelId}...`);
            const capiStartTime = Date.now();
            await supabase.functions.invoke('capi-universal', {
              body: {
                pixelId: capiPixelId,
                eventName: eventName,
                customAccessToken: isSaham ? Deno.env.get('CAPI_SAHAM') : (isRajaRanjang ? Deno.env.get('CAPI_RAJA_RANJANG') : undefined),
                userData: {
                  email: globalProductTx.email,
                  ph: globalProductTx.phone,
                  fn: globalProductTx.name ? globalProductTx.name.split(' ')[0] : undefined,
                  fbc: globalProductTx.fbc,
                  fbp: globalProductTx.fbp,
                  client_ip_address: globalProductTx.ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
                  client_user_agent: globalProductTx.user_agent || req.headers.get('user-agent')
                },
                customData: {
                  value: capiValue,
                  currency: capiCurrency,
                  content_name: globalProductTx.product_name,
                  order_id: tripayReference
                },
                eventId: tripayReference,
                testCode: isSaham ? 'TEST88338' : ((globalProductTx.product_name.includes('ebook_feminine') || globalProductTx.product_name.includes('Feminine Magnetism')) ? 'TEST9597' : (globalProductTx.product_name.includes('Jewelry')) ? 'TEST54644' : undefined)
              }
            });

            console.log(`   - ⏱️ [TIMING] ✅ CAPI function finished in ${Date.now() - capiStartTime}ms.`);

            // Mark as sent in DB
            await supabase.from('global_product').update({ capi_purchase_sent: true }).eq('id', globalProductTx.id);
            console.log('   - ✅ CAPI sent (marked as sent in DB)');

          } catch (capiError) {
            console.error('   - ⚠️ CAPI Universal Error (non-critical):', capiError);
          }
        } else {
          console.log(`   - ⏭️ CAPI Skipped: PixelId=${capiPixelId}, SentFlag=${globalProductTx.capi_purchase_sent}`);
        }
      } catch (emailError) {
        console.log('   - ⚠️ Process Error (Email/CAPI):', emailError);
      }
      
      console.log(`   - ⏱️ [TIMING] Deleting from waiting_payment...`);
      const deleteStartTime = Date.now();
      // 4. Hapus dari waiting_payment (jika ada)
      await supabase.from('waiting_payment').delete().eq('tripay_reference', tripayReference);
      console.log(`   - ⏱️ [TIMING] ✅ Deletion finished in ${Date.now() - deleteStartTime}ms.`);
      
      console.log(`   - ⏱️ [TIMING] 🏁 ABOUT TO RETURN FINAL RESPONSE TO CLIENT...`);
      // RETURN HERE: Tidak melanjutkan ke FALLBACK
      return logAndRespond('Global Product purchase processed successfully and global_product updated.', 200, {
        success: true,
        action: 'global_product_activated',
        product_name: globalProductTx.product_name,
        amount: amount || globalProductTx.amount
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
    // 4. Aksi berdasarkan subscription_type
    let rpcResult;
    if (waitingTx.subscription_type === 'credit') {
      console.log('4. 💳 Executing update_credit_by_email RPC...');
      const { data, error } = await supabase.rpc('update_credit_by_email', {
        p_user_email: waitingTx.user_email,
        p_credit_amount: waitingTx.amount_paid
      });
      if (error) console.error('   - ❌ Credit RPC Error:', error.message);
      rpcResult = data;
    } else {
      // //note to next dev do not touch or edit this code this for app monthly subscription
      // Handle all pro subscription types (subscription, 1_day, 1_month, etc.)
      console.log(`4. 👑 Executing activate_pro_subscription RPC for type: ${waitingTx.subscription_type}...`);
      const { data, error } = await supabase.rpc('activate_pro_subscription', {
        p_tripay_reference: tripayReference
      });
      if (error) {
        console.error('   - ❌ Subscription RPC Error:', error.message);
      } else {
        console.log('   - ✅ Subscription activated via RPC.');
      }
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
