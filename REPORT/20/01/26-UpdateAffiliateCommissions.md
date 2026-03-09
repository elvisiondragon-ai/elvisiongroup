# Report: Update Affiliate Commissions
Date: 20/01/26

## Changes
1.  **Modified `src/pages/affiliate.tsx`**:
    *   Updated the `productOptions` array to include a `commission` field for each product.
    *   Set specific commission rates:
        *   Sistem Uang Panas: 50%
        *   Fitfactor: 30%
        *   eL Royale Parfum: 30%
        *   Other products: 30% (defaulting to the common rate found in the system).
    *   Added a new **"Struktur Komisi" (Commission Structure)** section in the UI to display these rates in a table.
    *   Updated the **Product Selector** dropdown to display the commission percentage next to each product name.
    *   Cleaned up product names by removing hardcoded commission text (e.g., "(Komisi 50%)") and relying on the new structured data.

## Verification
*   Verified that the `productOptions` array is correctly mapped in both the Select dropdown and the new Commission Structure table.
*   The UI uses consistent styling (Shadcn UI cards and tables) to match the existing dashboard aesthetic.
*   Run lint check (passed for the modified file, ignoring unrelated legacy errors).
