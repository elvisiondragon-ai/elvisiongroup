## Tripay Integration Conclusion

This document summarizes the required data formats for interacting with the Tripay API and the likely implementation of a callback handler, potentially as a serverless "Edge Function". The analysis is based on the provided `DOCS TRIPAY node.txt` and `DOCS TRIPAY PHP.txt` files.

### 1. Tripay Required Format to Accept a Transaction

To initiate a transaction with Tripay, you must send a POST request to their API with a specific set of parameters and a security signature.

**Endpoint:**
`POST https://tripay.co.id/api/transaction/create`

**Authentication:**
An API key must be included in the request header as a Bearer token.
`Authorization: Bearer YOUR_API_KEY`

**Request Body Format:**
The documentation shows two different content types for the POST request body:
- The **PHP example** uses `http_build_query`, which sends the data as `application/x-www-form-urlencoded`.
- The **Node.js example** uses `axios` with a JavaScript object as the payload, which typically sends data as `application/json`.

It is likely that the Tripay API can accept both formats.

**Signature Generation:**
A signature must be generated to ensure data integrity.
- **Algorithm:** HMAC-SHA256
- **Data to Hash:** A concatenated string of `merchant_code` + `merchant_ref` + `amount`.
- **Key:** Your Tripay `privateKey`.
- The resulting hexadecimal hash is sent as the `signature` parameter in the request body.

**Request Parameters:**

**Required:**
- `method` (string): The payment channel code (e.g., `BRIVA`).
- `merchant_ref` (string): Your system's unique invoice or order number.
- `amount` (integer): The total transaction amount.
- `customer_name` (string): The customer's full name.
- `customer_email` (string): The customer's email address.
- `order_items` (array): An array of objects, where each object represents a product and must contain:
    - `name` (string): Product name.
    - `price` (integer): Price of a single unit.
    - `quantity` (integer): Number of units.
- `signature` (string): The HMAC-SHA256 signature you generated.

**Optional:**
- `customer_phone` (string): The customer's phone number.
- `callback_url` (string): A specific URL to receive transaction status notifications for this request, overriding the default merchant setting.
- `return_url` (string): A URL to redirect the customer to after the transaction attempt.
- `expired_time` (integer): A Unix timestamp for when the transaction should expire. The default is 24 hours.

### 2. Data Loaded to an Edge Function (Callback Handler)

The documentation does not explicitly mention "Edge Function," but it describes a **callback mechanism**, which is a perfect use case for a serverless function (like a Vercel Edge Function, AWS Lambda, or Cloudflare Worker). This function's role is to receive asynchronous status updates about transactions from Tripay.

**Trigger:**
The function is triggered when Tripay sends an HTTP `POST` request to the callback URL you have defined in your Tripay merchant settings or in the initial transaction request.

**Data Received from Tripay:**
The function receives a `POST` request with a JSON payload in the request body.

**Headers from Tripay:**
- `Content-Type`: `application/json`
- `X-Callback-Signature`: An HMAC-SHA256 signature of the JSON payload.
- `X-Callback-Event`: The type of event (e.g., `payment_status`).

**JSON Payload Content:**
The JSON body contains detailed information about the transaction status update. Key fields include:
- `reference` (string): Tripay's unique transaction reference.
- `merchant_ref` (string): Your original invoice/order number.
- `status` (string): The new status of the transaction (e.g., `PAID`, `EXPIRED`, `FAILED`).
- `total_amount` (integer): The amount paid by the customer.
- `amount_received` (integer): The net amount you will receive after fees.
- `paid_at` (integer): Unix timestamp of when the payment was completed.
- `is_closed_payment` (integer): A flag indicating the payment type.

**Required Actions for the Function:**

1.  **Verify the Signature:** This is a critical security step. The function must calculate its own HMAC-SHA256 signature of the raw JSON payload using your `privateKey`. This calculated signature must be compared with the one received in the `X-Callback-Signature` header. If they do not match, the request should be rejected as it is not a valid callback from Tripay.
2.  **Parse the JSON:** Decode the JSON payload to access the transaction data.
3.  **Process the Event:** Check the `status` field.
4.  **Update Your System:** Based on the status, update the corresponding invoice or order record in your database (e.g., mark an invoice as "paid").
5.  **Respond to Tripay:** The function must return a JSON response with `{"success": true}` to acknowledge successful receipt of the callback. If it fails to do so, Tripay may retry sending the callback.

By using a serverless function for this purpose, you create a scalable and efficient way to handle transaction updates without managing a dedicated server.

EXAMPLE from docs 

DOCS TRIPAY PHP

REQ TRANSAKSI
https://tripay.co.id/api/transaction/create
POST
Authorization	Bearer {api_key}	Ganti {api_key} dengan API Key merchant Anda 

<?php

$apiKey       = 'api_key_anda';
$privateKey   = 'private_key_anda';
$merchantCode = 'kode merchant anda';
$merchantRef  = 'nomor referensi merchant anda';
$amount       = 1000000;

$data = [
    'method'         => 'BRIVA',
    'merchant_ref'   => $merchantRef,
    'amount'         => $amount,
    'customer_name'  => 'Nama Pelanggan',
    'customer_email' => 'emailpelanggan@domain.com',
    'customer_phone' => '081234567890',
    'order_items'    => [
        [
            'sku'         => 'FB-06',
            'name'        => 'Nama Produk 1',
            'price'       => 500000,
            'quantity'    => 1,
            'product_url' => 'https://tokokamu.com/product/nama-produk-1',
            'image_url'   => 'https://tokokamu.com/product/nama-produk-1.jpg',
        ],
        [
            'sku'         => 'FB-07',
            'name'        => 'Nama Produk 2',
            'price'       => 500000,
            'quantity'    => 1,
            'product_url' => 'https://tokokamu.com/product/nama-produk-2',
            'image_url'   => 'https://tokokamu.com/product/nama-produk-2.jpg',
        ]
    ],
    'return_url'   => 'https://domainanda.com/redirect',
    'expired_time' => (time() + (24 * 60 * 60)), // 24 jam
    'signature'    => hash_hmac('sha256', $merchantCode.$merchantRef.$amount, $privateKey)
];

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_FRESH_CONNECT  => true,
    CURLOPT_URL            => 'https://tripay.co.id/api/transaction/create',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => false,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer '.$apiKey],
    CURLOPT_FAILONERROR    => false,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($data),
    CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4
]);

$response = curl_exec($curl);
$error = curl_error($curl);

curl_close($curl);

echo empty($error) ? $response : $error;

?>


===================================================================================================  

SIGNATURE CREATE PAYMENT 

<?php

$privateKey   = 'ytf6ooi2gmlNPfpchd94jDOk8hRWOu';
$merchantCode = 'T0001';
$merchantRef  = 'INV55567';
$amount       = 1500000;

$signature = hash_hmac('sha256', $merchantCode.$merchantRef.$amount, $privateKey);

// result
// 9f167eba844d1fcb369404e2bda53702e2f78f7aa12e91da6715414e65b8c86a

?>
===================================================================================================  

DETAIL TRANSAKSI 
GET
Authorization	Bearer {api_key}
https://tripay.co.id/api/transaction/detail



<?php

$apiKey = 'api_key_anda';

$payload = ['reference'	=> 'T0001000000000000006'];

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_FRESH_CONNECT  => true,
    CURLOPT_URL            => 'https://tripay.co.id/api/transaction/detail?'.http_build_query($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => false,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer '.$apiKey],
    CURLOPT_FAILONERROR    => false,
    CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4
]);

$response = curl_exec($curl);
$error = curl_error($curl);

curl_close($curl);

echo empty($error) ? $response : $error;

?>

===================================================================================================  
CEK STATUS TRANSAKSI

GET
https://tripay.co.id/api/transaction/check-status
Authorization	Bearer {api_key}

<?php

$apiKey = 'api_key_anda';

$payload = [
    'reference' => 'T0001000000455HFGRY',
];

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_FRESH_CONNECT  => true,
    CURLOPT_URL            => 'https://tripay.co.id/api/transaction/check-status?'.http_build_query($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => false,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer '.$apiKey],
    CURLOPT_FAILONERROR    => false,
    CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4
]);

$response = curl_exec($curl);
$error = curl_error($curl);

curl_close($curl);

echo empty($error) ? $response : $error;

?>

===================================================================================================  

INSTRUKSI PEMBAYARAN

GET
https://tripay.co.id/api/payment/instruction
Authorization	Bearer {api_key}
<?php

$apiKey = 'api_key_anda';

$payload = ['code' => 'BRIVA'];

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_FRESH_CONNECT  => true,
    CURLOPT_URL            => 'https://tripay.co.id/api/payment/instruction?'.http_build_query($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => false,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer '.$apiKey],
    CURLOPT_FAILONERROR    => false,
    CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4
]);

$response = curl_exec($curl);
$error = curl_error($curl);

curl_close($curl);

echo empty($error) ? $response : $error;

?>

===================================================================================================  

CALLBACK
Pembuatan Signature
POST
https://payment.elvisiongroup.com/urlcallback

<?php

$privateKey = 'private_key_anda';

// ambil data json callback notifikasi
$json = file_get_contents('php://input');
$signature = hash_hmac('sha256', $json, $privateKey);

// result
// 9f167eba844d1fcb369404e2bda53702e2f78f7aa12e91da6715414e65b8c86a

?>