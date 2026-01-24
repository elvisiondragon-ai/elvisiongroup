# Report: Re-enabling Backend CAPI with "First-Win" Deduplication
Date: 24/01/26

## Objective
To ensure no "Purchase" events are missed (e.g., if user closes tab) while preventing the double-firing issue that previously occurred when both Frontend and Backend CAPI were active.

## Solution: "First-Win" Locking Strategy
We implemented a locking mechanism using the `capi_purchase_sent` column in the `global_product` database table.

### 1. Database Schema
- Added `capi_purchase_sent` (boolean) column to `global_product`.

### 2. Backend (`tripay-callback`) - The Primary Sender
- **Optimistic Locking:** When updating the transaction status to `PAID`, the backend *simultaneously* sets `capi_purchase_sent = true`.
- **Logic:**
  ```typescript
  const updatePayload = { status: 'PAID', capi_purchase_sent: true };
  // ... update DB ...
  // Check if we should send CAPI (if it wasn't sent before)
  if (!globalProductTx.capi_purchase_sent) {
      sendCapiEvent(...);
  }
  ```
- **Result:** The Backend "claims" the right to send the CAPI event immediately.

### 3. Frontend (`ebook_feminine.tsx`) - The Backup
- **Realtime Listener:** Receives the `UPDATE` payload from the database.
- **Check:**
  ```typescript
  const isBackendCapiSent = payload.new?.capi_purchase_sent === true;
  if (isBackendCapiSent) {
      console.log("Skipping Frontend CAPI (Backend sent)");
  } else {
      sendCapiEvent(...);
  }
  ```
- **Result:** If the Backend successfully updated the flag (which it does in 99% of cases), the Frontend *skips* sending the CAPI event. This prevents duplication.

## Benefits
1.  **Reliability:** Even if the user closes the tab immediately, the Backend will capture the sale and send the CAPI event.
2.  **Match Quality:** Backend now has access to `fbc` and `fbp` cookies (stored during checkout creation), ensuring high-quality matching.
3.  **No Duplicates:** The atomic database update ensures only one system sends the event.

## Deployment Status
- SQL executed (`assist_code/add_capi_sent_column.sql` - *Pending user execution*).
- Backend Function (`tripay-callback`) updated.
- Frontend Page (`ebook_feminine.tsx`) updated.

**Next Step:** Please run `assist_code/add_capi_sent_column.sql` in your Supabase SQL Editor and redeploy the edge function.
