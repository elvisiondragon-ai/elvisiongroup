# How to Get API Keys for Watchlist Integration

To make the **Viral Outlier Finder** show real data, you need to connect it to an external API service.

## 1. TikTok API
The official TikTok API is primarily for uploading or logging in. For *scraping* viral content (views, shares, etc.), a third-party service like **RapidAPI** is the easiest and most powerful solution.

### Recommended: TikTok Scraper on RapidAPI
1.  Go to [RapidAPI.com](https://rapidapi.com).
2.  Search for **"TikTok Scraper"** or **"ScrapTik"**.
3.  Sign up and subscribe (most have a free tier for testing).
4.  Copy your **`X-RapidAPI-Key`**.
5.  We will use this key to fetch video stats like `playCount`, `diggCount` (likes), and `shareCount`.

## 2. Instagram API
For Instagram, you have two options:
1.  **Official Meta Graph API** (Free but complex):
    *   Requires a Business/Creator Instagram account.
    *   Requires a linked Facebook Page.
    *   Go to [Meta for Developers](https://developers.facebook.com), create an app, and add "Instagram Graph API".
2.  **RapidAPI (Easier)**:
    *   Search for **"Instagram Scraper"** on RapidAPI.
    *   Similar to TikTok, subscribe and get your key.

## Next Step
Once you have an API Key (e.g., from RapidAPI), provide it here, and I will update the code to fetch *real* viral content instead of the simulation.
