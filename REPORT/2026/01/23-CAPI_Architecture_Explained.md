# Report: CAPI Architecture - Why Hybrid Tracking?

**Date:** 2026-01-23
**Topic:** Rationale for splitting CAPI events between Frontend and Backend.

## The Core Question
Why do we send some events (like `PageView`, `AddToCart`) from the **Frontend** (Browser via API) and others (like `Purchase`) strictly from the **Backend**?

## 1. Frontend CAPI (PageView, AddToCart, InitiateCheckout)
For "user intent" events, the Frontend is the best source because it captures the **live state** of the user.

*   **Real-Time Context:** The browser knows exactly when a button is clicked or a page is viewed. To do this from the backend, we would have to send a network request to the server *just* to tell it "user viewed page X", adding unnecessary latency and server load.
*   **Browser Signals:** We can directly grab high-quality matching data like:
    *   **fbc (Click ID) & fbp (Browser ID)** cookies.
    *   **User Agent:** The exact browser version/device.
    *   **IP Address:** The user's real IP address.
*   **User Experience:** Sending an async request from the browser is non-blocking and instant.

## 2. Backend CAPI (Purchase)
For the "money" event, the Backend is the **Authority of Truth**.

*   **Financial Security:** A user clicking "Pay" in the browser does **not** guarantee a successful transaction. They might close the tab, their internet might die, or the bank might decline the card.
*   **Webhooks:** The payment gateway (Tripay/PayPal) sends a secure notification (Webhook) to our server *only* when the money effectively arrives. This is the **only** 100% accurate signal for a sale.
*   **Ad Blockers:** If a user has an ad blocker or privacy browser (Brave, Safari ITP) that blocks the Pixel, the Backend CAPI event will still fire successfully because it happens server-to-server, ensuring we never miss tracking a sale.

## 3. The "Hybrid" Bridge
To make this work seamlessly, we built a bridge (the `add_tracking_columns` migration):

1.  **Capture (Frontend):** When the user initiates payment, we capture their **Real IP** and **User Agent** and send it to the backend.
2.  **Store (Database):** We save these details in the `waiting_payment` or `global_product` table alongside the order.
3.  **Relay (Backend):** When the payment webhook arrives hours or minutes later, the backend retrieves that stored **Real IP** and **User Agent** and sends it to Meta.

**Result:** Meta thinks the Purchase event came directly from the user's device (High Match Quality), even though it was safely verified by our server.
