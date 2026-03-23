# SKU Mapping Implementation for Webhooks
Date: 20 March 2026

## Context
The user requested adding unique alphanumeric SKU identifiers (e.g. `ebookspaid01`, `paymentpaid01`, `ebookfree01`) for all automated digital products, subscriptions, and physical products. This prevents incorrect emails/whatsapp messages being sent due to typos and allows easier product referencing via webhooks instead of having to pass the exact long string names. A specific verification was also required for the Universal Dark Feminine ID ebook links.

## Actions Taken
1. **`send-ebooks-email`**
   - Modified `getProductKey` to natively accept `ebookspaidXX` combinations and map them directly.
   - Established mappings for 22 different SKUs from `ebookspaid01` (Raja Ranjang) to `ebookspaid22` (Saham Ultimate).
   - Validated that Dark Feminine ID (`ebookspaid06`) cleanly connects to folder `19Hrs9fYFm_PNAQkOGJwI3OWdDb86dkuy` and the Upsell+Audio version (`ebookspaid07`) cleanly connects to `1IZmSrzPDSgGSYwq1sQhhGgBaUExJjhgd`.
2. **`send-payment-email`**
   - Inserted a mapping evaluator for `safeSubscriptionType` utilizing `paymentpaidXX`.
   - Handled mappings for 6 subscription and physical products (`paymentpaid01` through `paymentpaid06`).
3. **`send-ebooks-free`**
   - Modified `getProductKey` to accept `ebookfreeXX` natively within the `lang` or `id` payload fields.
   - Handled mapping for 4 free variation ebooks (`ebookfree01` through `ebookfree04`).
4. **Deployment**
   - Fully deployed all 3 affected functions utilizing the explicit `--no-verify-jwt` directive.

## Solution Outcomes
- Sending webhook payloads with the precise SKU number automatically enforces retrieval of the exact static templates located natively in the Webhook's backend code.
- Fully backwards compatible. Old webhooks transmitting legacy string references will continue processing seamlessly, ensuring zero potential disruptions to current live traffic.

## Bugfix: Dark Feminine Audio Add-on
- **Issue**: Users purchasing the "Audio Add-on" for Dark Feminine were receiving the "Ebook only" version instead.
- **Root Cause**: The UI payload `Universal Dark Feminine ID + Love Magnet` was matching the keyword `dark feminine id` inside `send-ebooks-email` string evaluation *before* it reached the `love magnet` verification step, causing it to prematurely resolve as the non-audio product.
- **Solution**: Shifted the `love magnet` check upwards so it resolves first. The payload now correctly identifies cases containing `love magnet` and successfully sends the Upsell+Audio product version (`ebook_feminine_lovemagnet`).
- **Post-Fix Action**: Redeployed `send-ebooks-email` with `--no-verify-jwt` to immediately enforce the corrected behavior.
