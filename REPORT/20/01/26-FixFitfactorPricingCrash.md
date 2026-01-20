# Report: Fix Fitfactor Quantity Pricing and Edge Function Crash
Date: 20/01/26

## Issues Fixed
1.  **Edge Function Crash (Quantities 6 & 9)**: 
    *   **Root Cause**: The Edge Function calculated unit price as `amount / quantity`. For 800k/6 or 1.2M/9, this resulted in non-integer decimals (e.g., 133,333.33), causing the payment proxy/gateway to crash.
    *   **Fix**: Modified `src/pages/fitfactor.tsx` to send `quantity: 1` to the Edge Function while formatting the `productName` as `Fitfactor (x6)`. This ensures the calculated unit price is always an integer.

2.  **Pricing UI Correction**:
    *   Updated the display to show the "Normal Price" (quantity * 150,000) with a strike-through.
    *   Added specific labels for the bonus discounts on 6 boxes (100k off) and 9 boxes (150k off).

## Files Modified
*   `src/pages/fitfactor.tsx`

## UI Text Updates
*   Standardized all quantity units to "box".
*   Updated labels to:
    *   3 boxes: "Anda pilih: Paket 3 box seharga Rp 450.000"
    *   6 boxes: "Anda pilih: Paket 6 box seharga Rp 800.000 - Lebih hemat 100.000"
    *   9 boxes: "Anda pilih: Paket 9 box seharga Rp 1.200.000 - anda lebih hemat"

## Verification
*   Verified `handleCreatePayment` payload structure.
*   Verified UI pricing logic for cases 3, 6, 9, and >9.
