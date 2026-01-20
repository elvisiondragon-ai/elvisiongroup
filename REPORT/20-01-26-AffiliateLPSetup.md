# Report: Affiliate Landing Page Setup (20/01/26)

## Task Description:
Enable affiliates to use the Fitfactor Landing Page (`fitfactorlp.tsx`) for promotion while ensuring affiliate tracking persists when users navigate to the payment page (`fitfactor.tsx`).

## Actions Taken:
1.  **Modified `src/pages/affiliate.tsx`**:
    *   Added "Fitfactor LP" to the product options list.
    *   Removed the direct "Fitfactor" link to ensure affiliates use the landing page.
2.  **Modified `src/pages/fitfactorlp.tsx`**:
    *   Implemented `useSearchParams` to capture the `ref` (affiliate ID) from the URL.
    *   Updated the `handlePay` function to append the `ref` parameter to the payment redirection URL.
3.  **Verification**:
    *   Verified that `handlePay` is used in all CTA buttons on the landing page.
    *   Confirmed `fitfactor.tsx` already handles the `ref` parameter.

## Outcome:
Affiliates can now promote the high-converting landing page, and their commissions will still be correctly tracked through the payment process.
