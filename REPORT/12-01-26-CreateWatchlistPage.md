# Report: Create Watchlist (Viral Outlier Finder) Page
Date: 12/01/26

## Objective
Create a "Viral Outlier Finder" page (`src/pages/watchlist.tsx`) similar to viraloutliers.com.

## Features Implemented
1. **Watchlist Management**:
   - Users can add accounts (Username + Platform) to a local state list.
   - Ability to remove accounts from the list.
   - Includes platform icons (TikTok, Instagram, YouTube).

2. **Filtering System**:
   - **Time Range**: 1 Month, 3 Months, All Time filters.
   - **Platform**: Filter results by All, TikTok, Instagram, or YouTube.

3. **"Find Content" Logic (Mock)**:
   - Button triggers a simulation of analyzing the watchlist.
   - Generates mock "viral posts" for each account in the watchlist.
   - Sorts content by a "Viral Score" (weighted combination of Views, Likes, Shares) to find the top outliers.

4. **UI/UX**:
   - Modern layout using `shadcn/ui` components (Card, Badge, Input, Select, Tabs).
   - Responsive grid layout for results.
   - Loading states and empty states for better user feedback.

## Files Created/Modified
- `src/pages/watchlist.tsx` (New)
- `src/App.tsx` (Route added)

## Access
Route: `/watchlist`
URL: `https://app.elvisiongroup.com/watchlist`
