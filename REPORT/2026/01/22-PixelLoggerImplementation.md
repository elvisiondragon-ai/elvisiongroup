# Report: Pixel Logger Implementation
Date: 22/01/26

## Objective
Enable debugging of Facebook Pixel/CAPI events to investigate discrepancies between Ads Manager (5 purchases) and reality (0). The user specifically wants to know what product or URL parameter is triggering these events.

## Solution
Since Facebook does not provide an API to fetch raw historical event logs with custom parameters, we implemented a **server-side logger** that captures every event *before* it is sent to Meta.

## Implementation Details

1.  **Database Table (`public.pixel_events`)**:
    - Created a SQL definition (`assist_code/create_pixel_events_table.sql`) for a table to store event logs.
    - Columns include: `pixel_id`, `event_name`, `custom_data` (product info), `user_data`, `meta_response`, `status`.

2.  **Edge Function Modification (`capi-universal`)**:
    - Modified `supabase/functions/capi-universal/index.ts`.
    - Added logic to `insert` a record into `pixel_events` immediately upon receiving a request.
    - Updates the record with the status (`sent` or `failed`) and the raw response from Meta after the API call.

3.  **Frontend Dashboard (`/pixels`)**:
    - Created `src/pages/Pixels.tsx`.
    - Connects to Supabase to fetch and display the `pixel_events` logs in real-time.
    - Shows `Time`, `Event Name`, `Pixel ID`, `Status`, `Custom Data` (URL/Product), and `Meta Response`.

## Next Steps
1.  **Execute SQL:** Run the SQL in `assist_code/create_pixel_events_table.sql` in your Supabase SQL Editor.
2.  **Deploy Function:** Redeploy the `capi-universal` function:
    ```bash
    supabase functions deploy capi-universal --no-verify-jwt
    ```
3.  **Monitor:** Visit `https://app.elvisiongroup.com/pixels` (or localhost) to watch events come in.

## Deduplication Verification
- Confirmed that `usa_3000.tsx` generates a unique `eventId` and sends it to both the Browser Pixel (`fbq`) and the Server CAPI (`sendCAPIEvent`). This ensures Meta can correctly deduplicate events.
