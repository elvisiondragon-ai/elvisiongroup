# THE "NUKE" OPTION: Disable Browser Purchase Event

**Use this ONLY if you see duplicate sales (e.g., 3 events or more) and want to force the system to use SERVER ONLY.**

If you apply this, the Browser (Pixel) will **STOP** sending purchase data. Only the Backend (CAPI) will report sales.

## How to Apply

1.  Open file: `src/pages/ebook_indo/ebook_feminine.tsx`
2.  Find the `useEffect` listener for `PAID` status (around line 335).
3.  **Delete or Comment Out** the `trackPurchaseEvent` block shown below.

### Code to Remove/Comment:

```typescript
          // --- NUKE TARGET START ---
          
          // Use exact tripay_reference to match Backend CAPI event_id for deduplication
          const eventId = paymentData.tripay_reference;

          // Prepare User Data for Advanced Matching
          const pixelId = '3319324491540889';
          const userData: AdvancedMatchingData = {
            em: userEmail,
            ph: phoneNumber,
            fn: userName,
            external_id: user?.id
          };
          
          // Track Purchase with Advanced Matching and Deduplication
          trackPurchaseEvent({
            content_ids: [productNameBackend],
            content_type: 'product',
            value: totalAmount,
            currency: 'IDR'
          }, eventId, pixelId, userData);

          // --- NUKE TARGET END ---
```

## Result
*   **Browser:** Sends NOTHING when payment succeeds.
*   **Server:** Sends 1 Event (via `tripay-callback`).
*   **Total:** 1 Event. (No Deduplication needed).
