# PayPal Product Payment Flow

This document describes the structure and flow for PayPal-based products, specifically for the USA market.

## Directory Structure

Files are located in `src/pages/usa/`:

- `usa_ebookslim.tsx` (Route: `/usa/usa_ebookslim`): Landing page for the "Slim Without Suffering" ebook ($20). Includes a direct PayPal payment form (email only).
- `usa_3000.tsx` (Route: `/usa/usa_3000`): Landing page for the "VIP 6 Weeks" coaching program ($3000). Redirects to `Pay3000.tsx` for payment.
- `usa_ebookhealth.tsx` (Route: `/usa/usa_ebookhealth`): Landing page for the "Health Recovery Protocol" ebook ($20). Includes a direct PayPal payment form.
- `Pay3000.tsx` (Route: `/usa/Pay3000`): Checkout page for the $3000 VIP program.
- `PayPalFinish.tsx` (Route: `/payment/paypal-finish`): The return URL for all PayPal transactions. It handles:
    - Capturing the order via `tripay-callback` edge function.
    - Displaying success/error messages.
    - Routing users based on the product type (VIP vs Ebook).

## Backend Configuration

The `tripay-create-payment` edge function handles order creation for these products:

- `usa_ebookslim` ($20)
- `ebookhealthlp` ($20)
- `usa_3000` ($3000)
- `VIP6WEEK` ($1500 - Discounted Price)

The edge function hardcodes USD prices for these specific subscription types when the payment method is 'PAYPAL'.

## Usage

To create a new PayPal product page:
1. Copy `src/pages/usa/usa_ebookslim.tsx` as a template.
2. Update the `productNameBackend`, `displayProductName`, and pricing variables.
3. Ensure the `subscriptionType` is added to the `tripay-create-payment` edge function with the correct price.
4. Add the new route to `src/App.tsx`.
