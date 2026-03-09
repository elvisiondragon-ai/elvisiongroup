# Affiliate Landing Page Setup

This setup allows affiliates to share a landing page (`fitfactorlp.tsx`) while still maintaining tracking when the user moves to the payment page (`fitfactor.tsx`).

## Changes Made:

1.  **`src/pages/affiliate.tsx`**:
    *   Added `Fitfactor LP` to the `productOptions` list.
    *   Removed the direct `Fitfactor` payment link to encourage using the landing page.

2.  **`src/pages/fitfactorlp.tsx`**:
    *   Now captures the `ref` parameter from the URL using `useSearchParams`.
    *   The `handlePay` function appends the `ref` parameter to the redirection URL: `https://app.elvisiongroup.com/fitfactor?ref=AFFILIATE_ID`.

## How to use:

Affiliates can now select "Fitfactor LP" from their dashboard and share the generated link. When a visitor clicks "Pesan Sekarang" on the landing page, they are redirected to the payment page with the affiliate's ID preserved in the URL.
