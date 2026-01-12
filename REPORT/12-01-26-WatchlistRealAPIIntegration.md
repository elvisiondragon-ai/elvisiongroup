# Report: Real API Integration for Watchlist
Date: 12/01/26

## Objective
Connect the Viral Outlier Finder to real TikTok and Instagram data using RapidAPI.

## Integration Details
- **API Key**: `a2fdbd9663msh342f1a25c27383ep14e00ejsn1323bcd10e54`
- **TikTok Scraper**: Using `tiktok-scraper7.p.rapidapi.com` via the `/user/posts` endpoint.
- **Instagram Scraper**: Using `instagram-scraper-stable-api.p.rapidapi.com` via the `/get_user_posts.php` endpoint.

## Changes
1.  **Handle Find Content**: Replaced mock logic with actual `fetch` requests to RapidAPI.
2.  **Data Mapping**: Correctly mapped the different JSON structures from both APIs into a unified `ContentItem` type.
3.  **UI Updates**:
    - Removed the "Demo Mode" banner.
    - Enabled real image thumbnails in the results grid.
    - Added image error handling to show avatars if thumbnails fail to load.
    - Updated sorting to use a combined "Viral Score" derived from real metrics.

## Verification
- Route `/watchlist` is now active with live data fetching.
- Added logic to handle multiple accounts in one batch analysis.
