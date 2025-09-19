//SERVERjs NODATABASE
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// ====================================
// KONFIGURASI ENVIRONMENT VARIABLES
// ====================================
const tripayApiKey = process.env.TRIPAY_API_KEY;
const tripayPrivateKey = process.env.TRIPAY_PRIVATE_KEY;
const tripayMerchantCode = process.env.TRIPAY_MERCHANT_CODE;

// ❌ REMOVED: Supabase client - VPS should NOT touch database
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ====================================
// HELPER FUNCTIONS
// ====================================

// Generate TriPay Signature untuk CREATE transaction
function generateTransactionSignature(merchantCode, merchantRef, amount) {
  return crypto.createHmac('sha256', tripayPrivateKey)
    .update(merchantCode + merchantRef + amount)
    .digest('hex');
}

// Generate TriPay Signature untuk CALLBACK
function generateCallbackSignature(jsonString) {
  return crypto.createHmac('sha256', tripayPrivateKey)
    .update(jsonString)
    .digest('hex');
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

// ====================================
// ROUTES - BASIC
// ====================================

app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 TriPay Payment Server</h1>
    <p><strong>Server Time:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
    <p><strong>Architecture:</strong> VPS handles TriPay API only, Edge Functions handle database</p>
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
    </ul>
  `);
});

// ====================================
// ROUTES - CREATE PAYMENT (PURE TRIPAY API)
// ====================================

app.post('/create-payment', async (req, res) => {
  try {
    console.log('🚀 ===== VPS CREATE PAYMENT - TRIPAY API ONLY =====');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    // 1. VALIDASI INPUT dari Frontend
    const { subscriptionType, paymentMethod, userName, userEmail, phoneNumber } = req.body;
    
    if (!subscriptionType || !paymentMethod || !userName || !userEmail || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: subscriptionType, paymentMethod, userName, userEmail, phoneNumber'
      });
    }
    
    console.log('✅ Input validation passed');
    
    // 2. GENERATE DATA SISTEM
    const amount = getAmount(subscriptionType);
    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription type'
      });
    }
    
    const merchantRef = `EVG_${Date.now()}_${subscriptionType}`;
    const expiredTime = parseInt(Math.floor(new Date() / 1000) + (24 * 60 * 60)); // 24 jam
    const orderItems = generateOrderItems(subscriptionType, amount);
    
    console.log('💰 Amount:', amount);
    console.log('📋 Merchant Ref:', merchantRef);
    console.log('⏰ Expired Time:', new Date(expiredTime * 1000).toLocaleString('id-ID'));
    
    // 3. GENERATE SIGNATURE
    const signature = generateTransactionSignature(tripayMerchantCode, merchantRef, amount);
    console.log('🔐 Signature generated:', signature);
    
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
    
    console.log('📤 TriPay payload:', JSON.stringify(tripayPayload, null, 2));
    
    // 5. KIRIM KE TRIPAY API
    console.log('🌐 Sending request to TriPay...');
    
    const tripayResponse = await fetch('https://tripay.co.id/api/transaction/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tripayApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tripayPayload)
    });
    
    const tripayData = await tripayResponse.json();
    console.log('📡 TriPay response status:', tripayResponse.status);
    console.log('📡 TriPay response:', JSON.stringify(tripayData, null, 2));
    
    // 6. HANDLE RESPONSE
    if (!tripayResponse.ok || !tripayData.success) {
      console.log('❌ TriPay error:', tripayData);
      return res.status(400).json({
        success: false,
        error: 'TriPay API error',
        details: tripayData
      });
    }
    
    // 7. SUCCESS RESPONSE - PURE TRIPAY DATA
    console.log('✅ Transaction created successfully!');
    console.log('🔗 Payment URL:', tripayData.data.checkout_url);
    console.log('📋 Reference:', tripayData.data.reference);
    console.log('💳 Virtual Account:', tripayData.data.pay_code || 'N/A');

    // ✅ NO DATABASE OPERATIONS - ONLY TRIPAY API RESPONSE
    console.log('💾 ===== DATABASE OPERATIONS =====');
    console.log('✅ Database operations handled by Edge Function');
    console.log('🎯 VPS focuses ONLY on TriPay API integration');
    console.log('💾 ===== NO DATABASE WRITES FROM VPS =====');

    // Get data for response
    const userId = req.body.userId || null;
    const tripayReference = tripayData.data.reference;

    console.log('👤 User ID (from Edge Function):', userId);
    console.log('📋 TriPay Reference:', tripayReference);

    // PURE TRIPAY API RESPONSE - NO DATABASE
    res.json({
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
    });

    console.log('🚀 ===== VPS TRIPAY API RESPONSE COMPLETE =====');
  
  } catch (error) {
    console.log('❌ ===== VPS CREATE PAYMENT ERROR =====');
    console.log('❌ Error message:', error.message);
    console.log('❌ Error stack:', error.stack);
    console.log('❌ ===== ERROR END =====');
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// ====================================
// ROUTES - CHECK PAYMENT STATUS
// ====================================

app.get('/check-status', async (req, res) => {
  try {
    console.log('🔍 ===== CHECK PAYMENT STATUS =====');
    
    const { reference, tripay_reference } = req.query;
    const referenceToCheck = tripay_reference || reference;
    
    if (!referenceToCheck) {
      return res.status(400).json({
        success: false,
        error: 'Reference or tripay_reference parameter is required'
      });
    }
    
    console.log('📋 Checking status for reference:', referenceToCheck);
    
    // Call Tripay Check Status API
    const tripayResponse = await fetch(`https://tripay.co.id/api/transaction/check-status?reference=${referenceToCheck}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tripayApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const tripayData = await tripayResponse.json();
    console.log('📡 Tripay check-status response:', JSON.stringify(tripayData, null, 2));
    
    if (!tripayResponse.ok || !tripayData.success) {
      console.log('❌ Tripay check-status error:', tripayData);
      return res.status(400).json({
        success: false,
        error: 'Failed to check payment status',
        details: tripayData
      });
    }
    
    // Return status info
    const statusData = tripayData.data;
    console.log('✅ Payment status:', statusData.status);
    
    res.json({
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
    console.log('❌ Check status error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// ====================================
// ROUTES - TRIPAY CALLBACK (NO DATABASE WRITES)
// ====================================

app.post('/urlcallback', async (req, res) => {
  try {
    console.log('🎯 ===== TRIPAY CALLBACK RECEIVED =====');
    console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    
    // 1. VALIDASI SIGNATURE TRIPAY
    const receivedSignature = req.headers['x-callback-signature'];
    const jsonString = JSON.stringify(req.body);
    const expectedSignature = generateCallbackSignature(jsonString);
    
    console.log('🔐 Signature validation:');
    console.log('📨 Received:', receivedSignature);
    console.log('🎯 Expected:', expectedSignature);
    console.log('✅ Valid:', receivedSignature === expectedSignature);
    
    if (receivedSignature !== expectedSignature) {
      console.log('❌ Invalid signature - rejecting callback');
      console.log('❌ ===== CALLBACK REJECTED =====');
      return res.status(403).json({ success: false, message: 'Invalid signature' });
    }
    
    // 2. PROCESS CALLBACK BERDASARKAN STATUS
    const { status, reference, merchant_ref, total_amount, payment_method, payment_method_code, paid_at } = req.body;
    
    console.log('📋 Transaction Details:');
    console.log('🏷️  Status:', status);
    console.log('📋 Reference (from TriPay):', reference);
    console.log('🏪 Merchant Ref:', merchant_ref);
    console.log('💰 Amount:', total_amount);
    console.log('💳 Method:', payment_method);
    
    if (status === 'PAID') {
      console.log('🎉 ===== PAYMENT SUCCESSFUL =====');
      console.log('💰 Amount: Rp', parseInt(total_amount).toLocaleString('id-ID'));
      console.log('💳 Payment Method:', payment_method);
      console.log('📅 Paid at:', new Date(paid_at * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
      
      // 3. ✅ NO DATABASE OPERATIONS IN VPS - ONLY FORWARD TO EDGE FUNCTION
      console.log('💾 ===== DATABASE OPERATIONS =====');
      console.log('✅ Database operations delegated to Edge Functions');
      console.log('🎯 VPS handles only TriPay API integration');
      console.log('📋 Payment data available for Edge Function processing');
      
      // 4. TRIGGER SUPABASE EDGE FUNCTION FOR DATABASE OPERATIONS
      try {
        console.log('🚀 Triggering Supabase tripay-callback Edge Function...');
        
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
        
        console.log('📤 Edge Function payload:', JSON.stringify(edgePayload, null, 2));
        
        // ⚠️ UPDATE THIS URL TO YOUR ACTUAL SUPABASE PROJECT
         const response = await fetch('https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify(edgePayload)
        });
        
        const responseText = await response.text();
  console.log('🚀 Edge Function raw response:', responseText);

  let edgeResult;
  try {
    edgeResult = JSON.parse(responseText);
    console.log('🚀 Edge Function response status:', response.status);
    console.log('🚀 Edge Function response:', JSON.stringify(edgeResult, null, 2));
  } catch (parseError) {
    console.log('❌ Edge Function JSON parse error:', parseError.message);
    console.log('❌ Raw response was:', responseText);
    console.log('⚠️ Continuing anyway - callback acknowledged');
  }

        
        if (!response.ok) {
          console.log('❌ Edge Function failed but continuing...');
        } else {
          console.log('✅ Edge Function processed successfully');
        }
        
      } catch (edgeError) {
        console.log('❌ Edge Function error:', edgeError.message);
        console.log('⚠️ Continuing anyway - callback acknowledged');
      }
      
      console.log('🎉 ===== PAYMENT PROCESSING COMPLETE =====');
      
    } else {
      console.log('⚠️  Payment status:', status, '- No action needed');
    }
    
    console.log('✅ ===== CALLBACK PROCESSED SUCCESSFULLY =====');
    res.status(200).json({ success: true, message: 'Callback processed' });
    
  } catch (error) {
    console.log('❌ ===== CALLBACK ERROR =====');
    console.log('❌ Error:', error.message);
    console.log('❌ Stack:', error.stack);
    console.log('❌ ===== CALLBACK ERROR END =====');
    
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ====================================
// ROUTES - TEST
// ====================================

app.get('/test', (req, res) => {
  res.send(`
    <h2>🧪 Test TriPay Integration</h2>
    <p><strong>Architecture:</strong> VPS = TriPay API only, Edge Functions = Database</p>
    <p><strong>Environment Status:</strong></p>
    <ul>
      <li>TriPay API Key: ${tripayApiKey ? '✅ Set' : '❌ Missing'}</li>
      <li>TriPay Private Key: ${tripayPrivateKey ? '✅ Set' : '❌ Missing'}</li>
      <li>TriPay Merchant Code: ${tripayMerchantCode ? tripayMerchantCode : '❌ Missing'}</li>
    </ul>
    <p><strong>Test Signature Generation:</strong></p>
    <pre>
Test Data: ${tripayMerchantCode || 'MISSING'} + INV123 + 10000
Generated Signature: ${tripayMerchantCode ? generateTransactionSignature(tripayMerchantCode, 'INV123', 10000) : 'Cannot generate - missing merchant code'}
    </pre>
    <p><strong>Database Operations:</strong></p>
    <p>❌ VPS does NOT write to database<br>
    ✅ Edge Functions handle all database operations</p>
  `);
});

// ====================================
// SERVER START
// ====================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 ===== TRIPAY PAYMENT SERVER STARTED =====');
  console.log('🎯 CLEAN ARCHITECTURE: VPS = TriPay API only');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📡 Callback URL: https://payment.elvisiongroup.com/urlcallback`);
  console.log(`🧪 Test URL: https://payment.elvisiongroup.com/test`);
  console.log('📋 Environment Check:');
  console.log(`   - TriPay API Key: ${tripayApiKey ? '✅' : '❌'}`);
  console.log(`   - TriPay Private Key: ${tripayPrivateKey ? '✅' : '❌'}`);
  console.log(`   - TriPay Merchant Code: ${tripayMerchantCode ? tripayMerchantCode : '❌'}`);
  console.log('💾 Database: ❌ No database operations in VPS');
  console.log('🚀 ===== SERVER READY =====');
});
