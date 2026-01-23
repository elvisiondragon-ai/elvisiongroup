# Report: Pixel Dashboard Enhancement - Pixel Names
Date: 23/01/26

## Objective
Add human-readable names for specific Pixel IDs in the `/pixels` dashboard to make it easier to identify the source of each event.

## Changes Made
- Modified `src/pages/Pixels.tsx`:
    - Added `PIXEL_NAMES` mapping object:
        - `1393383179182528`: **USA KAYA PIXEL**
        - `1797660474333865`: **Fit Factor PIXEL**
        - `3319324491540889`: **GENESIS200 PIXEL**
    - Updated the table to display the Pixel Name in bold blue text, with the raw ID underneath in small font.

## Verification
- Checked the `/pixels` page to confirm that events from these IDs now show their respective names.
