# Report: Remove Discount on usa_3000.tsx
Date: 22/01/26

## Objective
Remove the 50% discount and promo card from the USA 3000 Coaching page.

## Changes Made
- Modified `src/pages/usa/usa_3000.tsx`:
    - Removed the sticky promo card at the top of the page that advertised a 50% discount ($1,500 instead of $3,000).
    - Removed the "CLAIM 50% DISCOUNT" button at the bottom of the page.
    - Kept the "BOOK A CALL NOW" button which leads to the survey.

## Verification
- Checked for any remaining mentions of "$1,500" or "50% discount" in the file.
- Verified that the success rate "50%" was kept as it was not related to the price discount.
- Verified the structure of the remaining JSX code.
