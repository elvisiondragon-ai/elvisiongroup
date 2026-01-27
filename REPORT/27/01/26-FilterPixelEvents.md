# Pixel Event Filtering Report - 27/01/26

## Overview
Modified the pixel logging and processing systems to only capture and display specific high-value events: `Purchase`, `Test_Purchase`, `AddToCart`, and `AddPaymentInfo`.

## Changes

### 1. Frontend: Pixels Log Page (`src/pages/tools_pages/pixels.tsx`)
- Updated the main Supabase query to filter `event_name` using `.in(['Purchase', 'Test_Purchase', 'AddToCart', 'AddPaymentInfo'])`.
- Updated the Realtime subscription handler to ignore any events not in the allowed list before updating the UI state.
- This ensures the dashboard only shows relevant conversion-related events.

### 2. Edge Function: CAPI Universal (`supabase/functions/capi-universal/index.ts`)
- Added a guard clause at the beginning of the function to check the `eventName`.
- If the event is not one of `Purchase`, `Test_Purchase`, `AddToCart`, or `AddPaymentInfo`, the function logs a warning and returns early with a 200 status.
- This prevents non-essential events (like `PageView` or `ViewContent`) from being logged to the `pixel_events` table or sent to Meta via CAPI, saving database space and reducing unnecessary API calls.

## Verification
- Initial load of Pixels page now only shows the filtered events.
- Realtime updates will only trigger for the filtered events.
- `capi-universal` now explicitly skips disallowed events.
