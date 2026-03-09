// CLOUDFLARE WORKERS - IDENTICAL TO SERVER.JS
// ====================================
// TRIPAY CLOUDFLARE WORKERS HANDLER
// ====================================

// Environment variables will be set in Cloudflare dashboard
const tripayApiKey = 'QqCR6klQq2snkZVKgIMIxfZEidU7jlDuuwiCL6cW';
const tripayPrivateKey = 'iUyqI-ppvL9-7V3q1-7UuHT-Dcb6u';
const tripayMerchantCode = 'T44272';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTc4OTM2NCwiZXhwIjoyMDUxMzY1MzY0fQ.qYeOAFqiOHFqrjb7L6H8AJBrWhJHUGVPFevJVabGVFE';

// ====================================
// HELPER FUNCTIONS - IDENTICAL TO SERVER.JS
// ====================================

// Generate TriPay Signature untuk CREATE transaction
async function generateTransactionSignature(merchantCode, merchantRef, amount) {
  const message = merchantCode + merchantRef + amount;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(tripayPrivateKey);
  const messageData = encoder.encode(message);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate TriPay Signature untuk CALLBACK
async function generateCallbackSignature(jsonString) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(tripayPrivateKey);
  const messageData = encoder.encode(jsonString);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get amount berdasarkan subscription type
function getAmount(subscriptionType) {
  const pricing = {
    '1_day': 4000,
    '1_week': 30000,
    '1_month': 100000,
    '1_year': 800000
  };
  return pricing[subscriptionType] || null;
}

// Generate order items berdasarkan subscription
function generateOrderItems(subscriptionType, amount) {
  const productNames = {
    '1_day': 'Premium Subscription - 1 Day',
    '1_week': 'Premium Subscription - 1 Week',
    '1_month': 'Premium Subscription - 1 Month',
    '1_year': 'Premium Subscription - 1 Year'
  };

  return [{
    sku: subscriptionType.toUpperCase(),
    name: productNames[subscriptionType] || 'Premium Subscription',
    price: amount,
    quantity: 1,
    product_url: 'https://elvisiongroup.com/premium',
    image_url: 'https://elvisiongroup.com/assets/premium-icon.jpg'
  }];
}

function logMessage(message) {
  console.log(`${new Date().toISOString()} - ${message}`);
}

function sendResponse(data, statusCode = 200) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Callback-Signature',
    },
  });
}

// ====================================
// MAIN HANDLER
// ====================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Callback-Signature',
        },
      });
    }

    // ====================================
    // HOME ROUTE - IDENTICAL TO SERVER.JS
    // ====================================
    
    if (path === '/' && method === 'GET') {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>TriPay Payment Server - Cloudflare Workers</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .status { color: green; } .error { color: red; }
                ul { list-style-type: none; }
            </style>
        </head>
        <body>
            <h1>🚀 TriPay Payment Server</h1>
            <p><strong>Platform:</strong> Cloudflare Workers</p>
            <p><strong>Server Time:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
            <p><strong>Architecture:</strong> Workers handle TriPay API only, Edge Functions handle database</p>
            <p><strong>Environment Check:</strong></p>
            <ul>
                <li>TriPay API Key: ${tripayApiKey ? '✅ Set' : '❌ Missing'}</li>
                <li>TriPay Private Key: ${tripayPrivateKey ? '✅ Set' : '❌ Missing'}</li>
                <li>TriPay Merchant Code: ${tripayMerchantCode ? '✅ Set' : '❌ Missing'}</li>
            </ul>
            <p><strong>Endpoints:</strong></p>
            <ul>
                <li>POST /create-payment - Create TriPay transaction (NO DATABASE)</li>
                <li>POST /urlcallback - TriPay callback handler (NO DATABASE)</li>
                <li>GET /check-status - Check payment status</li>
                <li>GET /test - Test environment</li>
            </ul>
        </body>
        </html>
      `;
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // ====================================
    // CREATE PAYMENT ROUTE - IDENTICAL TO SERVER.JS
    // ====================================
    
    if (path === '/create-payment' && method === 'POST') {
      try {
        logMessage('🚀 ===== WORKERS CREATE PAYMENT - TRIPAY API ONLY =====');
        
        const input = await request.json();
        logMessage('📦 Request body: ' + JSON.stringify(input));
        
        // 1. VALIDASI INPUT dari Frontend
        if (!input || !input.subscriptionType || !input.paymentMethod || !input.userName || !input.userEmail || !input.phoneNumber) {
          return sendResponse({
            success: false,
            error: 'Missing required fields: subscriptionType, paymentMethod, userName, userEmail, phoneNumber'
          }, 400);
        }
        
        const { subscriptionType, paymentMethod, userName, userEmail, phoneNumber } = input;
        logMessage('✅ Input validation passed');
        
        // 2. GENERATE DATA SISTEM
        const amount = getAmount(subscriptionType);
        if (!amount) {
          return sendResponse({
            success: false,
            error: 'Invalid subscription type'
          }, 400);
        }
        
        const merchantRef = `EVG_${Date.now()}_${subscriptionType}`;
        const expiredTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 jam
        const orderItems = generateOrderItems(subscriptionType, amount);
        
        logMessage('💰 Amount: ' + amount);
        logMessage('📋 Merchant Ref: ' + merchantRef);
        logMessage('⏰ Expired Time: ' + new Date(expiredTime * 1000).toLocaleString('id-ID'));
        
        // 3. GENERATE SIGNATURE
        const signature = await generateTransactionSignature(tripayMerchantCode, merchantRef, amount);
        logMessage('🔐 Signature generated: ' + signature);
        
        // 4. PREPARE TRIPAY PAYLOAD
        const tripayPayload = {
          method: paymentMethod,
          merchant_ref: merchantRef,
          amount: amount,
          customer_name: userName,
          customer_email: userEmail,
          customer_phone: phoneNumber,
          order_items: orderItems,
          callback_url: 'https://payment.elvisiongroup.com/urlcallback',
          return_url: 'https://payment.elvisiongroup.com/return',
          expired_time: expiredTime,
          signature: signature
        };
        
        logMessage('📤 TriPay payload: ' + JSON.stringify(tripayPayload));
        
        // 5. KIRIM KE TRIPAY API
        logMessage('🌐 Sending request to TriPay...');
        
        const tripayResponse = await fetch('https://tripay.co.id/api/transaction/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tripayApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tripayPayload)
        });
        
        const tripayData = await tripayResponse.json();
        logMessage('📡 TriPay response status: ' + tripayResponse.status);
        logMessage('📡 TriPay response: ' + JSON.stringify(tripayData));
        
        // 6. HANDLE RESPONSE
        if (!tripayResponse.ok || !tripayData.success) {
          logMessage('❌ TriPay error: ' + JSON.stringify(tripayData));
          return sendResponse({
            success: false,
            error: 'TriPay API error',
            details: tripayData
          }, 400);
        }
        
        // 7. SUCCESS RESPONSE - PURE TRIPAY DATA
        logMessage('✅ Transaction created successfully!');
        logMessage('🔗 Payment URL: ' + (tripayData.data.checkout_url || 'N/A'));
        logMessage('📋 Reference: ' + tripayData.data.reference);
        logMessage('💳 Virtual Account: ' + (tripayData.data.pay_code || 'N/A'));

        const responseData = {
          success: true,
          paymentType: tripayData.data.pay_url ? 'REDIRECT' : 'DIRECT',
          checkoutUrl: tripayData.data.checkout_url || null,
          payCode: tripayData.data.pay_code || null,
          tripay_reference: tripayData.data.reference,
          reference: tripayData.data.reference,
          merchantRef: merchantRef,
          amount: amount,
          expiredTime: expiredTime,
          paymentMethod: paymentMethod,
          instructions: tripayData.data.instructions || null,
          qrString: tripayData.data.qr_string || null,
          qrUrl: tripayData.data.qr_url || null,
          status: tripayData.data.status || 'UNPAID'
        };

        logMessage('🚀 ===== WORKERS TRIPAY API RESPONSE COMPLETE =====');
        return sendResponse(responseData);
        
      } catch (error) {
        logMessage('❌ ===== WORKERS CREATE PAYMENT ERROR =====');
        logMessage('❌ Error message: ' + error.message);
        logMessage('❌ ===== ERROR END =====');
        
        return sendResponse({
          success: false,
          error: 'Internal server error',
          message: error.message
        }, 500);
      }
    }

    // ====================================
    // CHECK STATUS ROUTE - IDENTICAL TO SERVER.JS
    // ====================================
    
    if (path === '/check-status' && method === 'GET') {
      try {
        logMessage('🔍 ===== CHECK PAYMENT STATUS =====');
        
        const urlParams = new URLSearchParams(url.search);
        const reference = urlParams.get('reference') || urlParams.get('tripay_reference');
        
        if (!reference) {
          return sendResponse({
            success: false,
            error: 'Reference or tripay_reference parameter is required'
          }, 400);
        }
        
        logMessage('📋 Checking status for reference: ' + reference);
        
        // Call Tripay Check Status API
        const tripayResponse = await fetch(`https://tripay.co.id/api/transaction/check-status?reference=${encodeURIComponent(reference)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tripayApiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        const tripayData = await tripayResponse.json();
        logMessage('📡 Tripay check-status response: ' + JSON.stringify(tripayData));
        
        if (!tripayResponse.ok || !tripayData.success) {
          logMessage('❌ Tripay check-status error: ' + JSON.stringify(tripayData));
          return sendResponse({
            success: false,
            error: 'Failed to check payment status',
            details: tripayData
          }, 400);
        }
        
        // Return status info
        const statusData = tripayData.data;
        logMessage('✅ Payment status: ' + statusData.status);
        
        return sendResponse({
          success: true,
          tripay_reference: statusData.reference,
          reference: statusData.reference,
          merchant_ref: statusData.merchant_ref,
          status: statusData.status,
          payment_method: statusData.payment_method,
          amount: statusData.amount,
          paid_at: statusData.paid_at,
          checkout_url: statusData.checkout_url || `https://tripay.co.id/checkout/${statusData.reference}`,
          pay_code: statusData.pay_code,
          expired_time: statusData.expired_time
        });
        
      } catch (error) {
        logMessage('❌ Check status error: ' + error.message);
        return sendResponse({
          success: false,
          error: 'Internal server error',
          message: error.message
        }, 500);
      }
    }

    // ====================================
    // CALLBACK ROUTE - IDENTICAL TO SERVER.JS
    // ====================================
    
    if (path === '/urlcallback' && method === 'POST') {
      try {
        logMessage('🎯 ===== TRIPAY CALLBACK RECEIVED =====');
        
        const bodyText = await request.text();
        const input = JSON.parse(bodyText);
        
        logMessage('📦 Headers: ' + JSON.stringify(Object.fromEntries(request.headers)));
        logMessage('📦 Body: ' + JSON.stringify(input));
        
        // 1. VALIDASI SIGNATURE TRIPAY
        const receivedSignature = request.headers.get('x-callback-signature') || '';
        const expectedSignature = await generateCallbackSignature(bodyText);
        
        logMessage('🔐 Signature validation:');
        logMessage('📨 Received: ' + receivedSignature);
        logMessage('🎯 Expected: ' + expectedSignature);
        logMessage('✅ Valid: ' + (receivedSignature === expectedSignature));
        
        if (receivedSignature !== expectedSignature) {
          logMessage('❌ Invalid signature - rejecting callback');
          logMessage('❌ ===== CALLBACK REJECTED =====');
          return sendResponse({ success: false, message: 'Invalid signature' }, 403);
        }
        
        // 2. PROCESS CALLBACK BERDASARKAN STATUS
        const { status, reference, merchant_ref, total_amount, payment_method, payment_method_code, paid_at } = input;
        
        logMessage('📋 Transaction Details:');
        logMessage('🏷️  Status: ' + status);
        logMessage('📋 Reference (from TriPay): ' + reference);
        logMessage('🏪 Merchant Ref: ' + merchant_ref);
        logMessage('💰 Amount: ' + total_amount);
        logMessage('💳 Method: ' + payment_method);
        
        if (status === 'PAID') {
          logMessage('🎉 ===== PAYMENT SUCCESSFUL =====');
          logMessage('💰 Amount: Rp ' + parseInt(total_amount).toLocaleString('id-ID'));
          logMessage('💳 Payment Method: ' + payment_method);
          logMessage('📅 Paid at: ' + (paid_at ? new Date(paid_at * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'N/A'));
          
          // 3. ✅ NO DATABASE OPERATIONS IN WORKERS - ONLY FORWARD TO EDGE FUNCTION
          logMessage('💾 ===== DATABASE OPERATIONS =====');
          logMessage('✅ Database operations delegated to Edge Functions');
          logMessage('🎯 Workers handle only TriPay API integration');
          logMessage('📋 Payment data available for Edge Function processing');
          
          // 4. TRIGGER SUPABASE EDGE FUNCTION FOR DATABASE OPERATIONS
          try {
            logMessage('🚀 Triggering Supabase tripay-callback Edge Function...');
            
            const edgePayload = {
              tripay_reference: reference,
              reference: reference,
              merchant_ref: merchant_ref,
              amount: parseInt(total_amount),
              status: 'PAID',
              payment_method: payment_method,
              payment_method_code: payment_method_code,
              paid_at: paid_at
            };
            
            logMessage('📤 Edge Function payload: ' + JSON.stringify(edgePayload));
            
            const response = await fetch('https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`
              },
              body: JSON.stringify(edgePayload)
            });
            
            const responseText = await response.text();
            logMessage('🚀 Edge Function raw response: ' + responseText);

            try {
              const edgeResult = JSON.parse(responseText);
              logMessage('🚀 Edge Function response status: ' + response.status);
              logMessage('🚀 Edge Function response: ' + JSON.stringify(edgeResult));
            } catch (parseError) {
              logMessage('❌ Edge Function JSON parse error: ' + parseError.message);
              logMessage('❌ Raw response was: ' + responseText);
              logMessage('⚠️ Continuing anyway - callback acknowledged');
            }
            
            if (!response.ok) {
              logMessage('❌ Edge Function failed but continuing...');
            } else {
              logMessage('✅ Edge Function processed successfully');
            }
            
          } catch (edgeError) {
            logMessage('❌ Edge Function error: ' + edgeError.message);
            logMessage('⚠️ Continuing anyway - callback acknowledged');
          }
          
          logMessage('🎉 ===== PAYMENT PROCESSING COMPLETE =====');
          
        } else {
          logMessage('⚠️  Payment status: ' + status + ' - No action needed');
        }
        
        logMessage('✅ ===== CALLBACK PROCESSED SUCCESSFULLY =====');
        return sendResponse({ success: true, message: 'Callback processed' });
        
      } catch (error) {
        logMessage('❌ ===== CALLBACK ERROR =====');
        logMessage('❌ Error: ' + error.message);
        logMessage('❌ Stack: ' + error.stack);
        logMessage('❌ ===== CALLBACK ERROR END =====');
        
        return sendResponse({ success: false, error: 'Internal server error' }, 500);
      }
    }

    // ====================================
    // TEST ROUTE - IDENTICAL TO SERVER.JS
    // ====================================
    
    if (path === '/test' && method === 'GET') {
      const testSignature = await generateTransactionSignature(tripayMerchantCode, 'INV123', 10000);
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test TriPay Integration</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                pre { background: #f4f4f4; padding: 15px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h2>🧪 Test TriPay Integration</h2>
            <p><strong>Platform:</strong> Cloudflare Workers</p>
            <p><strong>Architecture:</strong> Workers = TriPay API only, Edge Functions = Database</p>
            <p><strong>Environment Status:</strong></p>
            <ul>
                <li>TriPay API Key: ${tripayApiKey ? '✅ Set' : '❌ Missing'}</li>
                <li>TriPay Private Key: ${tripayPrivateKey ? '✅ Set' : '❌ Missing'}</li>
                <li>TriPay Merchant Code: ${tripayMerchantCode ? tripayMerchantCode : '❌ Missing'}</li>
            </ul>
            <p><strong>Test Signature Generation:</strong></p>
            <pre>
Test Data: ${tripayMerchantCode} + INV123 + 10000
Generated Signature: ${testSignature}
            </pre>
            <p><strong>Database Operations:</strong></p>
            <p>❌ Workers do NOT write to database<br>
            ✅ Edge Functions handle all database operations</p>
            <p><strong>Current Server Time:</strong> ${new Date().toISOString()}</p>
        </body>
        </html>
      `;
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Default 404
    return sendResponse({
      success: false,
      error: 'Endpoint not found',
      path: path,
      method: method
    }, 404);
  },
};