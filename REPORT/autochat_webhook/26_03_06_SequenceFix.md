# Fix Sequence Conditioning Failure
**Date:** 2026-03-06
**Timestamp:** 20:00:00+07:00

## Root Problem Analysis
1. **AutomationWizard.tsx: No per-button condition logic**: The wizard allowed defining two buttons for Step 4 and Step 5, but there was no way to specify which branching path ("leads to") each button should take. 
2. **autochat-webhook: Step branching is half-broken**: In both `handleFbMessage` and `handleIgMessage`, the logic that parsed the button index clicked hardcoded flow paths. For instance clicking Button 1 in Step 4 rigidly always led to Step 5, while clicking Button 2 always led to Step 6, without allowing any loop-back repeats or skipping.

## Solutions Implemented

### 1. Database Schema
- Deployed a database migration script `sql/015_add_branching_columns.sql` using Supabase DB push.
- Added 4 new text columns to `autochat_triggers` to store logic paths per button:
  - `step4_button1_leads_to` (`step5` or `step6`)
  - `step4_button2_leads_to` (`step5` or `step6`)
  - `step5_button1_leads_to` (`step6` or `repeat_step5`)
  - `step5_button2_leads_to` (`step6` or `repeat_step5`)

### 2. Frontend (`AutomationWizard.tsx`)
- Appended `stepXButtonYLeadsTo` state variables within `AutomationWizard.tsx`.
- Updated the data sent up to the `supabase` `autochat_triggers` table during `handleSave`.
- Implemented small, styled button dropdown toggles under the configuration interface for each button (Step 4 & Step 5) to allow specifying loop or terminal branching paths based on what the user wants per button.

### 3. Backend Webhook (`autochat-webhook/index.ts`)
- Replaced the hardcoded static pathing mapping with dynamic resolutions against the matched trigger.
- Example: Instead of always deciding Step 5 leads to Step 6, it extracts the click type (`B1` / `B2`) and resolves using the loaded condition in the database (i.e. `matchedTrigger.step5_button1_leads_to`), repeating the step if defined as `repeat_step5` instead of closing out early.
- Applied identical changes to both the `handleFbMessage` handler and the `handleIgMessage` handler.

## Verification Status
- Checked the local build via `npm run build` which compiled without issues.
- `supabase db push` executed perfectly mirroring the added schema columns.
- Webhook endpoints reflect the updated dynamic branching.
