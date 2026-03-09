require('dotenv').config();
const crypto = require('crypto');

const privateKey = process.env.TRIPAY_PRIVATE_KEY || 'iUyqI-ppvL9-7V3q1-7UuHT-Dcb6u';
const merchantCode = process.env.TRIPAY_MERCHANT_CODE || 'T44272';
const apiKey = process.env.TRIPAY_API_KEY || 'YOUR_API_KEY';

// Paket harga yang tersedia
const packages = {
    '1_hari': {
        name: '1 Hari',
        amount: 3000, // Ubah ke number, bukan string
        duration: '1 day'
    },
    '1_minggu': {
        name: '1 Minggu', 
        amount: 30000,
        duration: '7 days'
    },
    '1_bulan': {
        name: '1 Bulan',
        amount: 100000, 
        duration: '30 days'
    },
    '1_tahun': {
        name: '1 Tahun',
        amount: 800000,
        duration: '365 days'
    }
};

// Fungsi untuk generate signature CREATE PAYMENT (sesuai docs Tripay)
function generateTripaySignature(merchantCode, merchantRef, amount, privateKey) {
    const data = merchantCode + merchantRef + amount;
    return crypto.createHmac('sha256', privateKey).update(data).digest('hex');
}

// Fungsi untuk generate signature CALLBACK (untuk verifikasi)
function generateCallbackSignature(callbackBody, privateKey) {
    const json = JSON.stringify(callbackBody);
    return crypto.createHmac('sha256', privateKey).update(json).digest('hex');
}

// Fungsi untuk generate payment untuk paket tertentu
function createPaymentForPackage(packageType, paymentMethod = 'BCAVA', customMerchantRef = null) {
    const pkg = packages[packageType];
    if (!pkg) {
        throw new Error(`Package '${packageType}' tidak ditemukan!`);
    }

    // Generate merchant_ref unik jika tidak disediakan
    const merchantRef = customMerchantRef || `INV${packageType.toUpperCase()}_${Date.now()}`;
    
    // Generate signature untuk CREATE PAYMENT (sesuai docs Tripay)
    const signature = generateTripaySignature(merchantCode, merchantRef, pkg.amount, privateKey);
    
    // Body request untuk Tripay API
    const requestBody = {
        method: paymentMethod,
        merchant_ref: merchantRef,
        amount: pkg.amount,
        customer_name: "Test Customer",
        customer_email: "test@example.com",
        customer_phone: "081234567890",
        order_items: [
            {
                sku: packageType,
                name: pkg.name,
                price: pkg.amount,
                quantity: 1,
                product_url: "",
                image_url: ""
            }
        ],
        callback_url: "https://payment.elvisiongroup.com/urlcallback",
        return_url: "https://payment.elvisiongroup.com/success",
        expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 jam
        signature: signature
    };
    
    return {
        package: pkg,
        merchantRef: merchantRef,
        signature: signature,
        requestBody: requestBody,
        // cURL untuk CREATE PAYMENT ke Tripay API (BUKAN ke callback!)
        curlCommand: `curl -X POST https://tripay.co.id/api/transaction/create \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '${JSON.stringify(requestBody)}'`
    };
}

// Fungsi untuk test callback signature
function createTestCallback(packageType, status = 'PAID') {
    const pkg = packages[packageType];
    if (!pkg) {
        throw new Error(`Package '${packageType}' tidak ditemukan!`);
    }

    const merchantRef = `INV${packageType.toUpperCase()}_${Date.now()}`;
    
    // Contoh callback body dari Tripay
    const callbackBody = {
        reference: `T${merchantCode}${Date.now()}`,
        merchant_ref: merchantRef,
        payment_method: "BCA Virtual Account",
        payment_method_code: "BCAVA",
        total_amount: pkg.amount,
        fee_merchant: Math.floor(pkg.amount * 0.025), // 2.5% fee
        fee_customer: 0,
        total_fee: Math.floor(pkg.amount * 0.025),
        amount_received: pkg.amount - Math.floor(pkg.amount * 0.025),
        is_closed_payment: 1,
        status: status,
        paid_at: status === 'PAID' ? Math.floor(Date.now() / 1000) : null,
        note: null
    };

    // Generate signature untuk callback
    const callbackSignature = generateCallbackSignature(callbackBody, privateKey);

    return {
        callbackBody: callbackBody,
        callbackSignature: callbackSignature,
        // cURL untuk test callback ke server Anda
        testCallbackCurl: `curl -X POST https://payment.elvisiongroup.com/urlcallback \\
  -H "Content-Type: application/json" \\
  -H "x-callback-signature: ${callbackSignature}" \\
  -d '${JSON.stringify(callbackBody)}'`
    };
}

// Fungsi untuk menampilkan semua paket
function showAllPackages() {
    console.log('=== DAFTAR PAKET BERLANGGANAN ===\n');
    
    Object.keys(packages).forEach((key, index) => {
        const pkg = packages[key];
        console.log(`${index + 1}. ${pkg.name}`);
        console.log(`   Harga: Rp ${parseInt(pkg.amount).toLocaleString('id-ID')}`);
        console.log(`   Durasi: ${pkg.duration}`);
        console.log(`   Package ID: ${key}\n`);
    });
}

// Test CREATE PAYMENT
console.log('=== TESTING CREATE PAYMENT (ke Tripay API) ===\n');

Object.keys(packages).forEach(packageType => {
    console.log(`--- ${packages[packageType].name} ---`);
    try {
        const payment = createPaymentForPackage(packageType, 'BCAVA');
        console.log(`Harga: Rp ${parseInt(payment.package.amount).toLocaleString('id-ID')}`);
        console.log(`Merchant Ref: ${payment.merchantRef}`);
        console.log(`Signature: ${payment.signature}`);
        console.log(`\n📤 CREATE PAYMENT cURL:`);
        console.log(payment.curlCommand);
        console.log('\n' + '='.repeat(80) + '\n');
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
    }
});

// Test CALLBACK SIGNATURE
console.log('=== TESTING CALLBACK SIGNATURE (untuk test server) ===\n');

Object.keys(packages).forEach(packageType => {
    console.log(`--- Test Callback ${packages[packageType].name} ---`);
    try {
        const callback = createTestCallback(packageType, 'PAID');
        console.log(`Callback Signature: ${callback.callbackSignature}`);
        console.log(`\n📥 TEST CALLBACK cURL:`);
        console.log(callback.testCallbackCurl);
        console.log('\n' + '='.repeat(80) + '\n');
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
    }
});

// Export fungsi untuk digunakan di file lain
module.exports = {
    packages,
    generateTripaySignature,
    generateCallbackSignature,
    createPaymentForPackage,
    createTestCallback,
    showAllPackages
};

console.log('💡 CATATAN PENTING:');
console.log('1. CREATE PAYMENT cURL → kirim ke Tripay API (https://tripay.co.id/api/transaction/create)');
console.log('2. TEST CALLBACK cURL → kirim ke server Anda (https://payment.elvisiongroup.com/urlcallback)');
console.log('3. Pastikan TRIPAY_API_KEY sudah benar di .env file');
