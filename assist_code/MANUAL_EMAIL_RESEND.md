# Manual Ebook Email Resend Procedure

## Overview
When a customer pays but fails to receive the automated ebook delivery email, you can manually trigger the `send-ebooks-email` edge function using `curl`.

## Command Template

```bash
curl -X POST https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/send-ebooks-email \
  -H "Authorization: Bearer <YOUR_SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -d 
    "{
    "userEmail": "CUSTOMER_EMAIL",
    "subscriptionType": "PRODUCT_KEY",
    "reference": "ORDER_REFERENCE",
    "amount": AMOUNT_PAID,
    "userName": "CUSTOMER_NAME",
    "currency": "USD_OR_IDR"
  }"
```

## Parameter Guide

- **`userEmail`**: (Required) The email address of the buyer.
- **`subscriptionType`**: (Required) Use the exact product key (e.g., `ebook_uangpanas`, `usa_ebookslim`, `usa_ebookhealth`, `ebook_percayadiri`).
- **`reference`**: (Optional) The payment reference (e.g., `T4427230106592FT8SK`).
- **`amount`**: (Optional) The numeric amount paid (e.g., `100000` or `20`).
- **`currency`**: (Optional) `IDR` or `USD`.
- **`userName`**: (Optional) The customer's display name.

## Valid Product Keys (`subscriptionType`)

- `usa_ebookhealth`: Health Recovery Protocol (English)
- `usa_ebookslim`: Slim Without Suffering (English)
- `usa_3000`: VIP 6 Weeks Program (English)
- `ebook_uangpanas`: Sistem Uang Panas (Indonesian)
- `ebook_percayadiri`: Paket Pria Alpha (Indonesian)
- `ebook_feminine`: Feminine Magnetism (Indonesian)
- `ebook_diet`: Program Diet (Indonesian)
- `ebook_elvision`: eL Vision Premium (Indonesian)

## Example (Rejoinmart Incident)

To resend the email for the specific incident on 18/01/26:

```bash
curl -X POST https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/send-ebooks-email \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d 
    "{
    "userEmail": "rejoinmart@gmail.com",
    "subscriptionType": "ebook_uangpanas",
    "reference": "T4427230106592FT8SK",
    "amount": 100000,
    "userName": "rejoinmart"
  }"
```

## Admin Verification
Every time this function is called, a copy is automatically sent to:
- `support@elvisiongroup.com`
- `elreyzandra@gmail.com`
- `elvisiondragon@gmail.com`

```