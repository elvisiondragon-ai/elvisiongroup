// Import Deno and Supabase modules
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';
// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
// --- SINGLE SOURCE OF TRUTH FOR PRODUCTS ---
const productCatalog = {
  // Digital Subscriptions (require authentication)
  '1_day': {
    name: 'Premium Subscription - 1 Day',
    price: 4000,
    requiresAuth: true,
    physical: false
  },
  '1_week': {
    name: 'Premium Subscription - 1 Week',
    price: 30000,
    requiresAuth: true,
    physical: false
  },
  '1_month': {
    name: 'Premium Subscription - 1 Month',
    price: 100000,
    requiresAuth: true,
    physical: false
  },
  '1_year': {
    name: 'Premium Subscription - 1 Year',
    price: 800000,
    requiresAuth: true,
    physical: false
  },
  '10_credit': {
    name: 'Photo Credit - 10 Credits',
    price: 100000,
    requiresAuth: true,
    physical: false
  },
  '50_credit': {
    name: 'Photo Credit - 50 Credits',
    price: 450000,
    requiresAuth: true,
    physical: false
  },
  '100_credit': {
    name: 'Photo Credit - 100 Credits',
    price: 1000000,
    requiresAuth: true,
    physical: false
  },

  // Physical/Public Products (do not require authentication)
  'webinar_el': {
    name: 'Elvision Webinar',
    price: 200000,
    requiresAuth: false,
    physical: true
  },
  'drelf': {
    name: 'Drelf Collagen',
    price: 600000,
    requiresAuth: false,
    physical: true
  },
  'ebook_diet': {
    name: 'Program Diet eL-Vision',
    price: 200000,
    requiresAuth: false,
    physical: true
  },
  'ebook_elvision': {
    name: 'Ebook eL Vision',
    price: 200000,
    requiresAuth: false,
    physical: true
  }, // New Ebook Product
  'ebook_uangpanas': {
    name: 'Ebook Uang Panas',
    price: 100000,
    requiresAuth: false,
    physical: true
  },
  'ebook_percayadiri': {
    name: 'Ebook Pria Alpha',
    price: 100000,
    requiresAuth: false,
    physical: true
  },
  'ebook_feminine': {
    name: 'Feminine Magnetism',
    price: 100000,
    requiresAuth: false,
    physical: true
  },
  'ebook_health20': {
    name: 'Ebook Health Recovery (Promo)',
    price: 300000,
    requiresAuth: false,
    physical: true
  },
  'ebookhealthlp': {
    name: 'Ebook Health Recovery Protocol',
    price: 300000,
    requiresAuth: false,
    physical: true
  },
  'usa_ebookslim': {
    name: 'Slim Without Suffering Ebook',
    price: 300000,
    requiresAuth: false,
    physical: true
  },
  'usa_ebookfeminine': {
    name: 'Feminine Magnetism (USA)',
    price: 300000,
    requiresAuth: false,
    physical: true
  },
  'sg_elvision_en': {
    name: 'Ebook eL Vision (English Edition)',
    price: 564000, // 47 SGD * 12000 IDR
    requiresAuth: false,
    physical: true
  },
  'sg_elvision_malay': {
    name: 'Ebook eL Vision (Malay Edition)',
    price: 311500, // 89 MYR * 3500 IDR
    requiresAuth: false,
    physical: true
  },
  'VIP6WEEK': {
    name: 'VIP SESSION 6 Week',
    price: 24000000, // 1500 USD * 16000 IDR
    requiresAuth: false,
    physical: true
  },
  'usa_3000': {
    name: 'EL Vision 3000 Coaching',
    price: 48000000, // 3000 USD * 16000 IDR
    requiresAuth: false,
    physical: true
  },
  'usa_webinar20': {
    name: 'usa_webinar20',
    price: 320000, // 20 USD * 16000 IDR
    requiresAuth: false,
    physical: true
  },
  'fitfactor': {
    name: 'Fitfactor',
    price: 0,
    requiresAuth: false,
    physical: true
  },
  'hungrylater': {
    name: 'Hungrylater',
    price: 0,
    requiresAuth: false,
    physical: true
  },
  'parfum': {
    name: 'Parfum',
    price: 0,
    requiresAuth: false,
    physical: true
  },
  'jewelry': {
    name: 'Jewelry',
    price: 0,
    requiresAuth: false,
    physical: true
  },
  'dev': {
    name: 'Dev Service',
    price: 0,
    requiresAuth: false,
    physical: true
  }, // Price determined by request
  'universal': {
    name: 'Universal Product',
    price: 0,
    requiresAuth: false,
    physical: true
  }
};
// Main server function
serve(async (req) => {
  console.log('🚀 UNIFIED CREATE PAYMENT [V7-UNIVERSAL-NAME-FIX] - Edge Function Started');
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // --- 1. INITIALIZE & VALIDATE INPUT ---
    const body = await req.json();
    const { subscriptionType, paymentMethod, userName, userEmail, phoneNumber, quantity = 1, address, affiliateRef, commissionRate, fbc, fbp, userId: bodyUserId, clientIp } = body;

    console.log(`📧 User Attempting Payment: ${userEmail} for ${subscriptionType} via ${paymentMethod}`);
    console.log(`🕵️ Tracking Data - FBC: ${fbc}, FBP: ${fbp}, IP: ${clientIp || 'Auto'}`);

    // --- AUTO-ADD TO MAILKETING LIST ---
    try {
      const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
      if (MAILKETING_API_KEY && userEmail) {
        console.log(`📋 Adding ${userEmail} to Mailketing Lead List (pre-payment)...`);
        const params = new URLSearchParams({
          api_token: MAILKETING_API_KEY,
          list_id: '80713',
          email: userEmail,
          first_name: userName ? userName.split(' ')[0] : userEmail.split('@')[0],
          last_name: userName ? userName.split(' ').slice(1).join(' ') : ''
        });
        fetch(`https://api.mailketing.co.id/api/v1/addsubtolist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        }).then(r => r.json()).then(res => console.log('Mailketing lead res:', res)).catch(e => console.error('Mailketing lead error:', e));
      }
    } catch (e) {
      console.error('Mailketing pre-registration failed:', e);
    }

    const product = productCatalog[subscriptionType];
    if (!product) {
      return new Response(JSON.stringify({
        error: `Invalid subscriptionType: ${subscriptionType}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    // --- UNIVERSAL PRODUCT NAME FORMATTING ---
    let formattedProductName = body.productName || product.name;
    // If the product is physical and the name doesn't already seem to have a quantity, format it.
    if (product.physical && !formattedProductName.includes('(x')) {
      formattedProductName = `${formattedProductName} (x${quantity})`;
    }
    console.log(`Processing order for: ${formattedProductName}`);
    // --- 2. AUTHENTICATION (IF REQUIRED) ---
    let userId = bodyUserId || null; // Use passed userId if available, otherwise null
    let user = null;

    console.log(`Product: ${subscriptionType}, Requires Auth: ${product.requiresAuth}`);

    if (product.requiresAuth) {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({
          error: 'Authorization header required for this product'
        }), {
          status: 401,
          headers: corsHeaders
        });
      }
      const token = authHeader.replace('Bearer ', '');



      const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'));
      const { data: authData, error: authError } = await supabaseClient.auth.getUser(token);

      if (authError || !authData.user) {
        console.error('Authentication error:', authError);
        return new Response(JSON.stringify({
          error: 'Authentication failed'
        }), {
          status: 401,
          headers: corsHeaders
        });
      }
      user = authData.user;
      userId = user.id;
      console.log(`✅ Authenticated user: ${userId}`);
    }
    // --- 3. CALCULATE AMOUNT & GENERATE ORDER DETAILS ---
    // Dynamic Pricing: Priority is given to amount sent from frontend
    let amount = product.price * quantity;

    if (body.amount !== undefined && body.amount !== null) {
      console.log(`💰 Using dynamic price from frontend: ${body.amount}`);
      amount = body.amount;
    }

    // --- CURRENCY LIQUIDITY & IDR ADJUSTMENT ---
    // If currency is provided and not IDR, we adjust to IDR for database and TriPay
    const currency = body.currency || 'IDR';
    if (currency === 'USD') {
      amount = amount * 16000; // Adjust USD to IDR
    } else if (currency === 'SGD') {
      amount = amount * 12000; // Adjust SGD to IDR
    } else if (currency === 'MYR') {
      amount = amount * 3500; // Adjust MYR to IDR
    }

    if (amount < 0) {
      return new Response(JSON.stringify({
        error: 'Invalid amount or quantity for the selected product'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    const merchantRef = `EVG_${Date.now()}_${subscriptionType}`;
    const orderItems = [
      {
        'sku': subscriptionType.toUpperCase(),
        'name': formattedProductName,
        'price': amount / (quantity || 1),
        'quantity': quantity,
        'product_url': 'https://elvisiongroup.com/premium',
        'image_url': 'https://elvisiongroup.com/assets/premium-icon.jpg'
      }
    ];
    // --- 4. PRE-PAYMENT DATABASE INSERTION ---
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    const ipAddress = clientIp || req.headers.get('x-forwarded-for') || req.headers.get('remote-addr');
    const userAgent = req.headers.get('user-agent');
    let dbRecordId = null;

    // Validate affiliateRef is a valid UUID if present (basic check)
    const validAffiliateId = affiliateRef && affiliateRef.length > 20 ? affiliateRef : null;

    if (product.physical) {
      console.log('Inserting into global_product (UNPAID)');
      const { data, error } = await supabase.from('global_product').insert({
        name: userName,
        phone: phoneNumber,
        email: userEmail,
        address: address,
        product_name: formattedProductName,
        amount: amount,
        status: 'UNPAID',
        tripay_reference: paymentMethod === 'BCA_MANUAL' ? "MANUAL-" + merchantRef : null,
        merchant_ref: merchantRef,
        user_id: userId,
        affiliate_id: validAffiliateId, // Save affiliate ID
        commission_rate: commissionRate || 0.30, // Default to 30% if not provided
        fbc: fbc || null,
        fbp: fbp || null,
        ip_address: ipAddress,
        user_agent: userAgent
      }).select('id').single();
      if (error) throw new Error(`Database insert (global_product) failed: ${error.message}`);
      dbRecordId = data.id;
    } else if (product.requiresAuth) {
      console.log('Inserting into waiting_payment (pending)');
      const { data, error } = await supabase.from('waiting_payment').insert({
        user_id: userId,
        user_email: userEmail || user.email,
        user_name: userName,
        customer_phone: phoneNumber,
        subscription_type: subscriptionType,
        amount_paid: amount,
        currency: body.currency || 'IDR',
        status: 'pending',
        tripay_reference: paymentMethod === 'BCA_MANUAL' ? "MANUAL-" + merchantRef : null,
        ip_address: ipAddress,
        user_agent: userAgent,
        affiliate_id: validAffiliateId, // Save affiliate ID
        commission_rate: commissionRate || 0.30 // Default to 30%
      }).select('id').single();
      if (error) throw new Error(`Database insert (waiting_payment) failed: ${error.message}`);
      dbRecordId = data.id;
    }
    console.log(`✅ Pre-payment DB record created with ID: ${dbRecordId} for merchant_ref: ${merchantRef}`);

    // --- 5. BRANCHING LOGIC: PAYPAL VS TRIPAY ---
    if (paymentMethod === 'PAYPAL') {
      console.log('🔵 Processing PayPal Order Creation...');
      const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      const isSandbox = Deno.env.get('PAYPAL_MODE') === 'sandbox'; // Set PAYPAL_MODE in secrets
      const baseUrl = isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

      if (!clientId || !clientSecret) {
        throw new Error("PayPal credentials missing in Supabase secrets.");
      }

      // 5a. Get Access Token
      const auth = btoa(`${clientId}:${clientSecret}`);
      const tokenResp = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      });
      const tokenData = await tokenResp.json();
      if (!tokenResp.ok) throw new Error(`PayPal Token Error: ${JSON.stringify(tokenData)}`);
      const accessToken = tokenData.access_token;

      // 5b. Create Order
      // Note: We hardcode USD for specific products, otherwise convert IDR to USD approx
      let usdAmount = "20.00";
      if (subscriptionType === 'VIP6WEEK') {
        usdAmount = "1500.00";
      } else if (subscriptionType === 'usa_3000') {
        usdAmount = "3000.00";
      } else if (subscriptionType === 'usa_webinar20' || subscriptionType === 'ebookhealthlp' || subscriptionType === 'ebook_health20' || subscriptionType === 'usa_ebookslim' || subscriptionType === 'usa_ebookfeminine') {
        usdAmount = "20.00";
      } else {
        usdAmount = (amount / 16000).toFixed(2);
      }

      const orderPayload = {
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: merchantRef, // Link PayPal to our Merchant Ref
          amount: {
            currency_code: "USD",
            value: usdAmount
          },
          description: formattedProductName
        }],
        application_context: {
          return_url: "https://app.elvisiongroup.com/usa/usa_paypal_finish",
          cancel_url: "https://app.elvisiongroup.com/usa/usa_ebookhealth",
          user_action: "PAY_NOW",
          landing_page: "BILLING"
        }
      };

      const orderResp = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
      });
      const orderData = await orderResp.json();
      if (!orderResp.ok) throw new Error(`PayPal Create Order Error: ${JSON.stringify(orderData)}`);

      console.log(`✅ PayPal Order Created: ${orderData.id}`);

      // Get the approval link
      const approvalUrl = orderData.links.find((l: any) => l.rel === 'approve')?.href;

      // 5c. Update DB with PayPal Order ID (as tripay_reference equivalent)
      const tableToUpdate = product.physical ? 'global_product' : 'waiting_payment';
      let updateQuery;
      if (product.physical) {
        updateQuery = supabase.from(tableToUpdate).update({ tripay_reference: orderData.id }).eq('merchant_ref', merchantRef);
      } else {
        updateQuery = supabase.from(tableToUpdate).update({ tripay_reference: orderData.id }).eq('id', dbRecordId);
      }
      await updateQuery;

      // 5d. Return to Client
      return new Response(JSON.stringify({
        success: true,
        paymentType: 'PAYPAL',
        paypalOrderId: orderData.id,
        checkoutUrl: approvalUrl, // Use the official link
        merchantRef: merchantRef,
        amount: usdAmount,
        currency: 'USD'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    // --- 5.1 BRANCHING LOGIC: BCA MANUAL (Direct to DB) ---
    if (paymentMethod === 'BCA_MANUAL') {
      console.log('✅ BCA_MANUAL detected. Skipping Tripay proxy and returning DB record.');
      return new Response(JSON.stringify({
        success: true,
        paymentType: 'DIRECT',
        tripay_reference: `MANUAL-${merchantRef}`, // We use merchantRef to keep it unique
        reference: `MANUAL-${merchantRef}`,
        merchantRef: merchantRef,
        amount: amount,
        paymentMethod: 'BCA_MANUAL',
        status: 'UNPAID',
        instructions: [] // Instructions already in static frontend
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }

    // --- 6. EXISTING TRIPAY FLOW (Generic PHP Proxy) ---
    const vpsUrl = "https://payment.elvisiongroup.com/create-payment";
    const vpsPayload = {
      method: paymentMethod,
      merchant_ref: merchantRef,
      amount: amount,
      customer_name: userName || (userEmail || 'User').split('@')[0],
      customer_email: userEmail || user.email,
      customer_phone: phoneNumber || '081234567890',
      order_items: orderItems,
      return_url: 'https://elvisiongroup.com/payment/finish'
    };
    console.log('📤 Sending generic payload to PHP proxy:', JSON.stringify(vpsPayload, null, 2));
    const vpsResponse = await fetch(vpsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vpsPayload)
    });
    const responseText = await vpsResponse.text();
    if (!vpsResponse.ok) {
      console.error(`Error from PHP proxy: ${vpsResponse.status} - ${responseText}`);
      throw new Error(`Payment proxy service failed: ${responseText}`);
    }
    const vpsResult = JSON.parse(responseText);
    console.log('✅ Received response from PHP proxy.');
    // --- 7. UPDATE DB WITH TRIPAY REFERENCE ---
    const tripayData = vpsResult.data || {};
    const tripayReference = tripayData.reference;
    if (vpsResult.success && tripayReference) {
      const tableToUpdate = product.physical ? 'global_product' : 'waiting_payment';

      console.log(`[Update Ref] Updating ${tableToUpdate} ID ${dbRecordId} with Tripay Ref: ${tripayReference}`);
      const { data: updatedData, error } = await supabase
        .from(tableToUpdate)
        .update({ tripay_reference: tripayReference })
        .eq('id', dbRecordId)
        .select();

      if (error) {
        console.error(`⚠️ Failed to update ${tableToUpdate} with Tripay reference: ${error.message}`);
        vpsResult.warning = "Failed to link payment reference in database.";
      } else if (!updatedData || updatedData.length === 0) {
        console.error(`⚠️ Warning: Update ran but no rows were modified in ${tableToUpdate} for ID ${dbRecordId}.`);
      } else {
        console.log(`✅ Updated ${tableToUpdate} with Tripay reference ${tripayReference}`);
      }
    }
    // --- 8. FLATTEN & RETURN RESPONSE TO CLIENT ---
    const redirectMethods = ['DANA', 'OVO', 'SHOPEEPAY', 'LINKAJA', 'SAKUKU'];
    const clientResponse = {
      success: vpsResult.success,
      paymentType: (tripayData.pay_url || redirectMethods.includes(paymentMethod)) ? 'REDIRECT' : 'DIRECT',
      checkoutUrl: tripayData.checkout_url,
      payCode: tripayData.pay_code,
      tripay_reference: tripayReference,
      reference: tripayReference,
      merchantRef: tripayData.merchant_ref,
      amount: tripayData.amount,
      expiredTime: tripayData.expired_time,
      paymentMethod: tripayData.payment_method,
      instructions: tripayData.instructions,
      qrString: tripayData.qr_string,
      qrUrl: tripayData.qr_url,
      status: tripayData.status || 'UNPAID',
      ...vpsResult.warning && {
        warning: vpsResult.warning
      }
    };
    return new Response(JSON.stringify(clientResponse), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('💥💥💥 UNIFIED PAYMENT EDGE FUNCTION CRASH 💥💥💥');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
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