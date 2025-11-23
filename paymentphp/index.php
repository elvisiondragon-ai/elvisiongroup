<?php
//PHP VERSION - IDENTICAL TO SERVER.JS NODATABASE
// ====================================
// TRIPAY PHP HANDLER - IDENTICAL TO SERVER.JS
// ====================================

// Error reporting untuk development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers untuk CORS jika diperlukan
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Callback-Signature');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ====================================
// KONFIGURASI - LOAD FROM .ENV FILE
// ====================================
// Load environment variables from .env file
$env = parse_ini_file('.env');
if (!$env) {
    sendResponse(['success' => false, 'error' => 'Error: Unable to load .env file'], 500);
}

$tripayApiKey = $env['TRIPAY_API_KEY'] ?? null;
$tripayPrivateKey = $env['TRIPAY_PRIVATE_KEY'] ?? null;
$tripayMerchantCode = $env['TRIPAY_MERCHANT_CODE'] ?? null;

// Validate that all required environment variables are set
if (!$tripayApiKey || !$tripayPrivateKey || !$tripayMerchantCode) {
    sendResponse(['success' => false, 'error' => 'Error: Missing required environment variables in .env file'], 500);
}

// ====================================
// HELPER FUNCTIONS - IDENTICAL TO SERVER.JS
// ====================================

// Generate TriPay Signature untuk CREATE transaction
function generateTransactionSignature($merchantCode, $merchantRef, $amount, $privateKey) {
    return hash_hmac('sha256', $merchantCode . $merchantRef . $amount, $privateKey);
}

// Generate TriPay Signature untuk CALLBACK
function generateCallbackSignature($jsonString, $privateKey) {
    return hash_hmac('sha256', $jsonString, $privateKey);
}

// Get amount berdasarkan subscription type
function getAmount($subscriptionType, $quantity = 1) {
    logMessage('getAmount called with subscriptionType: ' . $subscriptionType . ' and quantity: ' . $quantity);
    $pricing = [
        '1_day' => 4000,
        '1_week' => 30000,
        '1_month' => 100000,
        '1_year' => 800000,
        // --- PERBAIKAN HARGA ---
        '10_credit' => 100000,
        '50_credit' => 450000,
        // --- AKHIR PERBAIKAN ---
        // --- PERUBAHAN ---
        '100_credit' => 1000000,
        'drelf' => 600000 // Base price for drelf
    ];

    if ($subscriptionType === 'drelf') {
        return $pricing['drelf'] * $quantity;
    }

    return isset($pricing[$subscriptionType]) ? $pricing[$subscriptionType] : null;
}

// Generate order items berdasarkan subscription
function generateOrderItems($subscriptionType, $amount, $quantity = 1, $productNameFromRequest = null) {
    $productNames = [
        '1_day' => 'Premium Subscription - 1 Day',
        '1_week' => 'Premium Subscription - 1 Week',
        '1_month' => 'Premium Subscription - 1 Month',
        '1_year' => 'Premium Subscription - 1 Year',
        '10_credit' => 'Photo Credit - 10 Credits',
        '50_credit' => 'Photo Credit - 50 Credits',
        '100_credit' => 'Photo Credit - 100 Credits',
        'drelf' => 'Drelf Product',
        'fitfactor' => 'Fitfactor',
        'hungrylater' => 'Hungrylater',
        'parfum' => 'Parfum',
        'dev' => 'Dev',
        'jewelry' => 'Jewelry',
    ];

    $name = $productNameFromRequest ?: ($productNames[$subscriptionType] ?? 'Premium Subscription');

        $physicalProducts = ['drelf', 'fitfactor', 'hungrylater', 'parfum', 'dev', 'jewelry'];
    $isPhysicalProduct = in_array($subscriptionType, $physicalProducts);

    $itemQuantity = $isPhysicalProduct ? $quantity : 1;
    $pricePerItem = ($isPhysicalProduct && $quantity > 0) ? $amount / $quantity : $amount;

    return [[
        'sku' => strtoupper($subscriptionType),
        'name' => $name,
        'price' => $pricePerItem,
        'quantity' => $itemQuantity,
        'product_url' => 'https://elvisiongroup.com/premium',
        'image_url' => 'https://elvisiongroup.com/assets/premium-icon.jpg'
    ]];
}

function logMessage($message) {
    error_log(date('Y-m-d H:i:s') . ' - ' . $message);
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// ====================================
// ROUTING - IDENTICAL TO SERVER.JS
// ====================================

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove base path if any
$path = str_replace('/payment.elvisiongroup.com', '', $path);

// Get JSON input for POST requests
$input = null;
if ($requestMethod === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
}

// ====================================
// ROUTES - BASIC (IDENTICAL TO SERVER.JS)
// ====================================

// Home route
if ($path === '/' && $requestMethod === 'GET') {
    $envCheck = [
        'tripayApiKey' => !empty($tripayApiKey),
        'tripayPrivateKey' => !empty($tripayPrivateKey),
        'tripayMerchantCode' => !empty($tripayMerchantCode)
    ];
    
    echo '<!DOCTYPE html>
    <html>
    <head>
        <title>TriPay Payment Server - PHP</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .status { color: green; } .error { color: red; }
            ul { list-style-type: none; }
        </style>
    </head>
    <body>
        <h1>🚀 TriPay Payment Server</h1>
        <p><strong>Server Time:</strong> ' . date('Y-m-d H:i:s', time() + 7*3600) . ' WIB</p>
        <p><strong>Architecture:</strong> VPS handles TriPay API only, Edge Functions handle database</p>
        <p><strong>Environment Check:</strong></p>
        <ul>
            <li>TriPay API Key: ' . ($envCheck['tripayApiKey'] ? '✅ Set' : '❌ Missing') . '</li>
            <li>TriPay Private Key: ' . ($envCheck['tripayPrivateKey'] ? '✅ Set' : '❌ Missing') . '</li>
            <li>TriPay Merchant Code: ' . ($envCheck['tripayMerchantCode'] ? '✅ Set' : '❌ Missing') . '</li>
        </ul>
        <p><strong>Endpoints:</strong></p>
        <ul>
            <li>POST /create-payment - Create TriPay transaction (NO DATABASE)</li>
            <li>POST /urlcallback - TriPay callback handler (NO DATABASE)</li>
            <li>GET /check-status - Check payment status</li>
        </ul>
    </body>
    </html>';
    exit();
}

// ====================================
// ROUTES - CREATE PAYMENT (PURE TRIPAY API) - IDENTICAL TO SERVER.JS
// ====================================

if ($path === '/create-payment' && $requestMethod === 'POST') {
    try {
        logMessage('🚀 ===== VPS CREATE PAYMENT - TRIPAY API ONLY =====');
        logMessage('📦 Request body: ' . json_encode($input));
        
        // 1. VALIDASI INPUT dari Frontend
        $baseRequiredFields = ['subscriptionType', 'paymentMethod', 'userName', 'userEmail', 'phoneNumber'];
        foreach ($baseRequiredFields as $field) {
            if (empty($input[$field])) {
                sendResponse(['success' => false, 'error' => "Missing required field: {$field}"], 400);
            }
        }

        $subscriptionType = $input['subscriptionType'];
        
        // Conditional validation for 'drelf' product
        if ($subscriptionType === 'drelf') {
            if (empty($input['quantity']) || empty($input['amount']) || empty($input['merchant_ref'])) {
                sendResponse(['success' => false, 'error' => 'Missing required fields for drelf: quantity, amount, merchant_ref'], 400);
            }
        }

        $paymentMethod = $input['paymentMethod'];
        $userName = $input['userName'];
        $userEmail = $input['userEmail'];
        $phoneNumber = $input['phoneNumber'];
        $quantity = $input['quantity'] ?? 1; // Default to 1 if not provided (for non-drelf products)
        $productName = $input['productName'] ?? null;
        $userId = $input['userId'] ?? null;

        logMessage('✅ Input validation passed');

        // 2. GENERATE DATA SISTEM
        $amount = 0;
        // Jika produknya drelf, gunakan amount dari frontend. Jika tidak, hitung seperti biasa.
            $physicalProducts = ['drelf', 'fitfactor', 'hungrylater', 'parfum', 'dev', 'jewelry'];
        if (in_array($subscriptionType, $physicalProducts)) {
            if (empty($input['quantity']) || empty($input['amount']) || empty($input['productName'])) {
                sendResponse(['success' => false, 'error' => 'Missing required fields for physical product: quantity, amount, productName'], 400);
            }
            $amount = $input['amount'];
            logMessage('✅ Using pre-calculated amount for physical product: ' . $amount);
        } else {
            $amount = getAmount($subscriptionType, $quantity);
        }

        if (!$amount) {
            sendResponse([
                'success' => false,
                'error' => 'Invalid subscription type or amount'
            ], 400);
        }
        
        $merchantRef = 'EVG_' . (time() * 1000) . '_' . $subscriptionType;
        $expiredTime = intval(floor(time()) + (24 * 60 * 60)); // 24 jam
        
        $orderItems = generateOrderItems($subscriptionType, $amount, $quantity, $productName);
        
        logMessage('💰 Amount: ' . $amount);
        logMessage('📋 Merchant Ref: ' . $merchantRef);
        logMessage('⏰ Expired Time: ' . date('Y-m-d H:i:s', $expiredTime));
        
        // 3. GENERATE SIGNATURE
        $signature = generateTransactionSignature($tripayMerchantCode, $merchantRef, $amount, $tripayPrivateKey);
        logMessage('🔐 Signature generated: ' . $signature);
        
        // 4. PREPARE TRIPAY PAYLOAD
        // Conditional callback URL based on product type
        $callbackUrl = 'https://payment.elvisiongroup.com/urlcallback'; // Default for all products (VPS proxy)

        $tripayPayload = [
            'method' => $paymentMethod,
            'merchant_ref' => $merchantRef,
            'amount' => $amount,
            'customer_name' => $userName,
            'customer_email' => $userEmail,
            'customer_phone' => $phoneNumber,
            'order_items' => $orderItems,
            // CRITICAL: Ensure all transactions point to the VPS first.
            'callback_url' => $callbackUrl,
            'return_url' => 'https://payment.elvisiongroup.com/return',
            'expired_time' => $expiredTime,
            'signature' => $signature
        ];
        
        logMessage('📤 TriPay payload: ' . json_encode($tripayPayload));
        
        // 5. KIRIM KE TRIPAY API
        logMessage('🌐 Sending request to TriPay...');
        
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://tripay.co.id/api/transaction/create',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($tripayPayload),
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $tripayApiKey,
                'Content-Type: application/json'
            ],
            CURLOPT_TIMEOUT => 30
        ]);
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $error = curl_error($curl);
        curl_close($curl);
        
        if ($error) {
            logMessage('❌ CURL Error: ' . $error);
            sendResponse([
                'success' => false,
                'error' => 'Connection error to Tripay'
            ], 500);
        }
        
        $tripayData = json_decode($response, true);
        logMessage('📡 TriPay response status: ' . $httpCode);
        logMessage('📡 TriPay response: ' . $response);
        
        // 6. HANDLE RESPONSE
        if ($httpCode !== 200 || !$tripayData['success']) {
            logMessage('❌ TriPay error: ' . json_encode($tripayData));
            sendResponse([
                'success' => false,
                'error' => 'TriPay API error',
                'details' => $tripayData
            ], 400);
        }
        
        // 7. SUCCESS RESPONSE - PURE TRIPAY DATA
        logMessage('✅ Transaction created successfully!');
        logMessage('🔗 Payment URL: ' . ($tripayData['data']['checkout_url'] ?? 'N/A'));
        logMessage('📋 Reference: ' . $tripayData['data']['reference']);
        logMessage('💳 Virtual Account: ' . ($tripayData['data']['pay_code'] ?? 'N/A'));

        // ✅ NO DATABASE OPERATIONS - ONLY TRIPAY API RESPONSE
        logMessage('💾 ===== DATABASE OPERATIONS =====');
        logMessage('✅ Database operations handled by Edge Function');
        logMessage('🎯 VPS focuses ONLY on TriPay API integration');
        logMessage('💾 ===== NO DATABASE WRITES FROM VPS =====');

        // Get data for response
        $userId = isset($input['userId']) ? $input['userId'] : null;
        $tripayReference = $tripayData['data']['reference'];

        logMessage('👤 User ID (from input): ' . ($userId ?? 'null'));
        logMessage('📋 TriPay Reference: ' . $tripayReference);

        // PURE TRIPAY API RESPONSE - NO DATABASE
        $responseData = [
            'success' => true,
            'paymentType' => isset($tripayData['data']['pay_url']) ? 'REDIRECT' : 'DIRECT',
            'checkoutUrl' => $tripayData['data']['checkout_url'] ?? null,
            'payCode' => $tripayData['data']['pay_code'] ?? null,
            'tripay_reference' => $tripayData['data']['reference'],
            'reference' => $tripayData['data']['reference'],
            'merchantRef' => $merchantRef,
            'amount' => $amount,
            'expiredTime' => $expiredTime,
            'paymentMethod' => $paymentMethod,
            'instructions' => $tripayData['data']['instructions'] ?? null,
            'qrString' => $tripayData['data']['qr_string'] ?? null,
            'qrUrl' => $tripayData['data']['qr_url'] ?? null,
            'status' => $tripayData['data']['status'] ?? 'UNPAID'
        ];

        logMessage('🚀 ===== VPS TRIPAY API RESPONSE COMPLETE =====');
        sendResponse($responseData);
        
    } catch (Exception $e) {
        logMessage('❌ ===== VPS CREATE PAYMENT ERROR =====');
        logMessage('❌ Error message: ' . $e->getMessage());
        logMessage('❌ Error stack: ' . $e->getTraceAsString());
        logMessage('❌ ===== ERROR END =====');
        
        sendResponse([
            'success' => false,
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
}

// ====================================
// ROUTES - CHECK PAYMENT STATUS - IDENTICAL TO SERVER.JS
// ====================================

if ($path === '/check-status' && $requestMethod === 'GET') {
    try {
        logMessage('🔍 ===== CHECK PAYMENT STATUS =====');
        
        $reference = $_GET['reference'] ?? $_GET['tripay_reference'] ?? null;
        $referenceToCheck = $_GET['tripay_reference'] ?? $reference;
        
        if (!$referenceToCheck) {
            sendResponse([
                'success' => false,
                'error' => 'Reference or tripay_reference parameter is required'
            ], 400);
        }
        
        logMessage('📋 Checking status for reference: ' . $referenceToCheck);
        
        // Call Tripay Check Status API
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://tripay.co.id/api/transaction/check-status?reference=' . urlencode($referenceToCheck),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $tripayApiKey,
                'Content-Type: application/json'
            ],
            CURLOPT_TIMEOUT => 30
        ]);
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        
        $tripayData = json_decode($response, true);
        logMessage('📡 Tripay check-status response: ' . $response);
        
        if ($httpCode !== 200 || !$tripayData['success']) {
            logMessage('❌ Tripay check-status error: ' . json_encode($tripayData));
            sendResponse([
                'success' => false,
                'error' => 'Failed to check payment status',
                'details' => $tripayData
            ], 400);
        }
        
        // Return status info
        $statusData = $tripayData['data'] ?? [];
        logMessage('✅ Payment status: ' . ($statusData['status'] ?? 'unknown'));
        
        sendResponse([
            'success' => true,
            'tripay_reference' => $statusData['reference'] ?? null,
            'reference' => $statusData['reference'] ?? null,
            'merchant_ref' => $statusData['merchant_ref'] ?? null,
            'status' => $statusData['status'] ?? null,
            'payment_method' => $statusData['payment_method'] ?? null,
            'amount' => $statusData['amount'] ?? null,
            'paid_at' => $statusData['paid_at'] ?? null,
            'checkout_url' => $statusData['checkout_url'] ?? 'https://tripay.co.id/checkout/' . ($statusData['reference'] ?? ''),
            'pay_code' => $statusData['pay_code'] ?? null,
            'expired_time' => $statusData['expired_time'] ?? null
        ]);
        
    } catch (Exception $e) {
        logMessage('❌ Check status error: ' . $e->getMessage());
        sendResponse([
            'success' => false,
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
}

// ====================================
// ROUTES - TRIPAY CALLBACK (NO DATABASE WRITES) - FIX FORWARDING SIGNATURE
// ====================================

if ($path === '/urlcallback' && $requestMethod === 'POST') {
    try {
        logMessage('🎯 ===== TRIPAY CALLBACK RECEIVED (via VPS proxy) =====');
        
        // Get all headers for logging and checking signature
        $allHeaders = getallheaders();
        logMessage('📦 Headers (getallheaders): ' . json_encode($allHeaders));
        
        // 1. VALIDASI SIGNATURE TRIPAY
        // CRITICAL FIX 1: Robustly check for the incoming signature header
        $receivedSignature = $allHeaders['X-Callback-Signature'] 
            ?? $allHeaders['x-callback-signature'] 
            ?? $_SERVER['HTTP_X_CALLBACK_SIGNATURE'] 
            ?? '';

        $jsonString = file_get_contents('php://input');
        $expectedSignature = generateCallbackSignature($jsonString, $tripayPrivateKey);
        
        logMessage('🔐 Signature validation:');
        logMessage('📨 Received: ' . $receivedSignature);
        logMessage('🎯 Expected: ' . $expectedSignature);
        logMessage('✅ Valid: ' . ($receivedSignature === $expectedSignature ? 'true' : 'false'));
        
        if ($receivedSignature !== $expectedSignature) {
            logMessage('❌ Invalid signature - rejecting callback');
            logMessage('❌ ===== CALLBACK REJECTED =====');
            sendResponse(['success' => false, 'message' => 'Invalid signature'], 403);
        }
        
        // 2. PROCESS CALLBACK BERDASARKAN STATUS
        // Body is already loaded into $input at the top of the script
        $status = $input['status'] ?? null;
        $reference = $input['reference'] ?? null;
        $merchantRef = $input['merchant_ref'] ?? null;
        $totalAmount = $input['total_amount'] ?? null;
        $paymentMethod = $input['payment_method'] ?? null;
        $paymentMethodCode = $input['payment_method_code'] ?? null;
        $paidAt = $input['paid_at'] ?? null;
        
        if ($status === 'PAID') {
            logMessage('🎉 ===== PAYMENT SUCCESSFUL =====');
            
            // 3. TRIGGER SUPABASE EDGE FUNCTION FOR DATABASE OPERATIONS
            try {
                logMessage('🚀 Triggering Supabase tripay-callback Edge Function...');
                
                $edgePayload = [
                    'tripay_reference' => $reference,
                    'reference' => $reference,
                    'merchant_ref' => $merchantRef,
                    'amount' => intval($totalAmount),
                    'status' => 'PAID',
                    'payment_method' => $paymentMethod,
                    'payment_method_code' => $paymentMethodCode,
                    'paid_at' => $paidAt
                ];
                
                logMessage('📤 Edge Function payload: ' . json_encode($edgePayload));
                
                // === FIX: FORWARD THE X-CALLBACK-SIGNATURE HEADER ===
                $headersToForward = [
                    'Content-Type: application/json',
                    // This Authorization token must be the Service Role Key or a dedicated key for the Edge Function
                    // NOTE: Use your actual Service Role Key here
                    'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTc4OTM2NCwiZXhwIjoyMDUxMzY1MzY0fQ.qYeOAFqiOHFqrjb7L6H8AJBrWhJHUGVPFevJVabGVFE',
                    // CRITICAL FIX 2: Forward the required signature header!
                    'X-Callback-Signature: ' . $receivedSignature 
                ];
                logMessage('✅ Forwarding Signature to Edge Function: ' . $receivedSignature);
                // ====================================================

                $curl = curl_init();
                curl_setopt_array($curl, [
                    // ⚠️ UPDATE THIS URL TO YOUR ACTUAL SUPABASE PROJECT
                    CURLOPT_URL => 'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => json_encode($edgePayload),
                    CURLOPT_HTTPHEADER => $headersToForward, // Use the fixed headers
                    CURLOPT_TIMEOUT => 30
                ]);
                
                $response = curl_exec($curl);
                $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                curl_close($curl);
                
                $responseText = $response;
                logMessage('🚀 Edge Function raw response: ' . $responseText);

                $edgeResult = null;
                try {
                    $edgeResult = json_decode($responseText, true);
                    logMessage('🚀 Edge Function response status: ' . $httpCode);
                    logMessage('🚀 Edge Function response: ' . json_encode($edgeResult));
                } catch (Exception $parseError) {
                    logMessage('❌ Edge Function JSON parse error: ' . $parseError->getMessage());
                }
                
                if ($httpCode !== 200) {
                    logMessage('❌ Edge Function FAILED with status ' . $httpCode);
                } else {
                    logMessage('✅ Edge Function processed successfully');
                }
                
            } catch (Exception $edgeError) {
                logMessage('❌ Edge Function connection error: ' . $edgeError->getMessage());
            }
            
            logMessage('🎉 ===== PAYMENT PROCESSING COMPLETE =====');
            
        } else {
            logMessage('⚠️  Payment status: ' . $status . ' - No action needed');
        }
        
        logMessage('✅ ===== CALLBACK PROCESSED SUCCESSFULLY (Returning 200 to TriPay) =====');
        // Always return 200 OK to TriPay if validation passed, regardless of Edge Function outcome (to stop retries)
        sendResponse(['success' => true, 'message' => 'Callback processed']);
        
    } catch (Exception $e) {
        logMessage('❌ ===== CALLBACK ERROR =====');
        logMessage('❌ Error: ' . $e->getMessage());
        
        // If there's a catastrophic error in PHP, return 500 to TriPay to signal a retry attempt is needed
        sendResponse(['success' => false, 'error' => 'Internal server error'], 500);
    }
}

// ====================================
// ROUTES - TEST - IDENTICAL TO SERVER.JS
// ====================================

if ($path === '/test' && $requestMethod === 'GET') {
    $testSignature = generateTransactionSignature($tripayMerchantCode, 'INV123', 10000, $tripayPrivateKey);
    
    echo '<!DOCTYPE html>
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
        <p><strong>Architecture:</strong> VPS = TriPay API only, Edge Functions = Database</p>
        <p><strong>Environment Status:</strong></p>
        <ul>
            <li>TriPay API Key: ' . (!empty($tripayApiKey) ? '✅ Set' : '❌ Missing') . '</li>
            <li>TriPay Private Key: ' . (!empty($tripayPrivateKey) ? '✅ Set' : '❌ Missing') . '</li>
            <li>TriPay Merchant Code: ' . ($tripayMerchantCode ?: '❌ Missing') . '</li>
        </ul>
        <p><strong>Test Signature Generation:</strong></p>
        <pre>
Test Data: ' . $tripayMerchantCode . ' + INV123 + 10000
Generated Signature: ' . $testSignature . '
        </pre>
        <p><strong>Database Operations:</strong></p>
        <p>❌ VPS does NOT write to database<br>
        ✅ Edge Functions handle all database operations</p>
        <p><strong>Current Server Time:</strong> ' . date('Y-m-d H:i:s') . '</p>
    </body>
    </html>';
    exit();
}

// Default 404
sendResponse([
    'success' => false,
    'error' => 'Endpoint not found',
    'path' => $path,
    'method' => $requestMethod
], 404);
?>