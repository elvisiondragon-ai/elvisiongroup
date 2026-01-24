# Fix: Multiple Server Events (Race Condition)

**Date:** 2026-01-24
**Issue:** User reported "3 Events" for a single purchase (1 Browser + 2 Server). This caused inaccurate ad reporting and failed deduplication.

## Root Cause: Race Condition in `tripay-callback`
The payment gateway (Tripay/PayPal) often sends multiple webhooks (e.g., "PAID" notification followed immediately by a "Settled" notification, or simple network retries).

The previous logic in `tripay-callback` was:
1.  Find transaction where `status != 'PAID'`.
2.  Found it (Status is UNPAID).
3.  **...processing time...**
4.  Update status to 'PAID'.
5.  Send CAPI.

If two webhooks arrived within milliseconds of each other:
*   **Request A** finds UNPAID.
*   **Request B** finds UNPAID (because Request A hasn't finished updating yet).
*   **Request A** updates to PAID and sends CAPI (Server Event 1).
*   **Request B** updates to PAID and sends CAPI (Server Event 2).

This resulted in **Two Server Events** with the same Event ID.

## Solution: Optimistic Locking
I modified `supabase/functions/tripay-callback/index.ts` to use an atomic update strategy.

**Old Logic:**
```typescript
const globalProductTx = ...; // select
// ...
await supabase.from('global_product').update({ status: 'PAID' }).eq('id', globalProductTx.id);
// Send CAPI
```

**New Logic:**
```typescript
const { data: updatedRows } = await supabase
    .from('global_product')
    .update({ status: 'PAID' })
    .eq('id', globalProductTx.id)
    .neq('status', 'PAID') // CRITICAL: Only update if NOT already PAID
    .select();

if (!updatedRows || updatedRows.length === 0) {
    // We lost the race. Another process already handled this.
    return; 
}
// Send CAPI (Only the winner gets here)
```

## Answer to User Questions

**Q: "what is the issue ??"**
A: The issue was a **Backend Race Condition**. The server was processing the same payment twice because the webhooks arrived too fast, causing it to send two Server Events.

**Q: "what is the solution for this ? not sending from browser at all ?"**
A: **NO.** You should continue sending from the Browser.
*   **Do not stop Browser events.** The Hybrid model (Browser + Server) is Meta's recommended standard. It ensures you catch users with ad-blockers (via Server) and users with cookies/fbc (via Browser).
*   Now that the Server only sends **1** event, and the Browser sends **1** event, Meta will see **2 events total**.
*   Since both use the exact same `eventID` (`tripay_reference`), Meta will **deduplicate** them into **1 valid Purchase**.

## Regarding "Missing FBC"
*   Your logs showed `fbc: null` in the database.
*   This happens if the user visits organically (without clicking an ad).
*   However, if the Browser Pixel sends the event (which it does), it *might* have the `fbc` cookie even if the server didn't catch it.
*   **With the Race Condition fixed, deduplication should work even if FBC is missing in one source, provided the Event IDs match.**

## Verification
The fix is deployed. Next purchase should show:
*   **Server:** 1 Event
*   **Browser:** 1 Event
*   **Meta Ads Manager:** 1 Event (Deduped)
