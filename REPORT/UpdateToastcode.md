# UpdateToast Workflow Report

## Update Detection Conditions

**Toast ONLY shows when ALL conditions are met:**

### 1. Service Worker Registered ✅
- PWA must be properly installed with service worker
- `navigator.serviceWorker` API available

### 2. New Version Available ✅  
- Server has newer app version than cached version
- Different file hashes/timestamps detected
- `onNeedRefresh()` callback triggered by Vite PWA plugin

### 3. User Haven't Clicked Already ✅
- `localStorage.getItem('user-clicked-update')` returns null
- User hasn't dismissed this deployment's update prompt

### 4. PWA Plugin Comparison ✅
- Vite PWA plugin compares:
  - Cached manifest vs server manifest
  - Cached assets vs server assets  
  - Service worker version differences

**If ANY condition fails → NO TOAST SHOWN**

## Simple Workflow

**1. Detect Update Available** → `onNeedRefresh()` triggers when new deployment detected

**2. Clear All Caches** → Immediate cache clearing to prevent white/black screens
   - Service Worker caches: `caches.delete()`
   - LocalStorage: Selective clear (keep auth/audio)
   - Reason: Prevent stale content causing crashes

**3. Backup Critical Data** → Save auth session + audio cache to sessionStorage
   - Reason: Maintain user login and downloaded content

**4. Show Update Toast** → Display "🐢 Initiate Update..." with button
   - Reason: Get user consent before reloading app

**5. User Clicks Update** → Final session refresh + service worker update
   - Reason: Ensure smooth transition to new version

**6. Reload Application** → `window.location.reload()` loads fresh app
   - Reason: Apply new version with cleared caches

**7. Show Success Toast** → Post-reload confirmation message
   - Reason: Confirm update completed successfully

## Overview
The UpdateToast system manages PWA update notifications and cache clearing to prevent white/black screen issues during deployments.

## File Location
`/src/hooks/UpdateToast.tsx`

## Imports and Dependencies

### Core Dependencies
```typescript
import { useToast } from "@/hooks/use-toast";           // Toast notification system
import { useRegisterSW } from 'virtual:pwa-register/react'; // PWA service worker registration
import { supabase } from "@/integrations/supabase/client";   // Database client
import { useAuth } from "@/contexts/AuthContext";           // Authentication context
import { useEffect, useRef } from "react";                  // React hooks
```

### External Dependencies
- **Vite PWA Plugin**: Provides `virtual:pwa-register/react` for SW management
- **Supabase**: For session management and authentication
- **Radix UI Toast**: Underlying toast component system
- **Browser APIs**: `caches`, `navigator.serviceWorker`, `localStorage`

## Workflow Breakdown

### 1. **Initialization** (`useUpdateToast` hook)
- Sets up refs for state management
- Handles success/failure toasts from previous updates
- Detects iOS devices for platform-specific handling

### 2. **Deployment Detection** (`onNeedRefresh` callback)
**Triggers when new app version is available**

#### **IMMEDIATE CACHE CLEARING** (Before user interaction)
```typescript
// Clear all service worker caches
const cacheNames = await caches.keys();
await Promise.all(cacheNames.map(name => caches.delete(name)));

// Clear localStorage (selective - keep critical data)
const criticalKeys = [auth, session, supabase, token, audio, cache data];
localStorage.clear();
// Restore only critical data
```

#### **Session Management**
- Attempts to refresh user session before backup
- Creates comprehensive backup of auth + audio cache data
- Stores backup in sessionStorage for post-update recovery

#### **Show Update Toast**
- Displays update notification with action button
- Uses debounce mechanism to prevent duplicates

### 3. **User Interaction** (Button Click)
```typescript
// Final session refresh attempt
await refreshSession();

// Set success flag for post-update toast
localStorage.setItem('update-success-flag', 'true');

// Update service worker and reload
await updateServiceWorker(true);
window.location.reload();
```

### 4. **Post-Update Recovery** (`useEffect`)
- Checks for update success flags
- Shows appropriate success/warning toasts
- Handles session warnings if refresh failed

## Toast System Integration

### Toast Configuration
```typescript
const toastConfig = {
  title: "🐢 Initiate Update...",
  description: isIOS ? "IOS Device" : "Android",
  action: <UpdateButton />,
  duration: 0, // Persistent until user action
  className: "gradient styling matching app theme"
};
```

### Toast Styling
- Uses app's default gradient theme: `from-slate-900 via-purple-900 to-slate-900`
- Amber text color: `text-amber-100`
- Shadow and ring effects: `shadow-2xl ring-1 ring-white/10`

## Cache Clearing Strategy

### Three Cache Types Handled:
1. **Browser HTTP Cache**: Hash-based filenames in Vite config
2. **Service Worker Caches**: Manual clearing via `caches.delete()`
3. **LocalStorage**: Selective clearing with critical data backup

### Critical Data Preserved:
- Authentication tokens (`sb-*`, `auth`, `session`, `supabase`, `token`)
- Audio cache data (`audio`, `cache`)
- Update flags (`update-success-flag`, `sw-update-success`)

## Platform Differences

### iOS Handling
- Same behavior as Android (simplified from previous complex logic)
- Shows single toast notification
- No platform-specific workarounds

### Android Handling
- Standard toast display
- Reliable button interaction
- No special handling needed

## Error Handling

### Service Worker Update Failures
```typescript
catch (error) {
  toast({
    title: "Update Error",
    description: "Service worker update failed, forcing reload anyway",
    duration: 2000,
  });
  
  // Still attempt reload after 2 seconds
  setTimeout(() => window.location.reload(), 2000);
}
```

### Session Refresh Failures
- Shows warning toast about potential re-login requirement
- Sets warning flag for post-update notification
- Continues with update process

## Integration Points

### AuthContext Integration
- Uses `refreshSession()` method for session management
- Accesses `user` state for conditional logic
- Leverages session backup/recovery mechanisms

### PWA Integration
- Hooks into Vite PWA plugin lifecycle
- Manages service worker registration and updates
- Handles update prompts and user consent

### Supabase Integration
- Session management and refresh
- Authentication state preservation
- Database client for session operations

## User Click Flag System

### Current Implementation (PREVENTS DUPLICATE PROMPTS)
```typescript
// Check if user already clicked update button (survives refresh)
if (localStorage.getItem('user-clicked-update')) {
  console.log('🚫 User already clicked update, not showing toast until next refresh');
  return;
}

// On user click - set flag
localStorage.setItem('user-clicked-update', 'true');

// On new deployment - clear flag
localStorage.removeItem('user-clicked-update');
```

### User Experience:
```
Deploy 1 → Toast shows
User clicks → Flag set in localStorage
Same Deploy 1 triggers again → Toast BLOCKED
User refreshes page → Flag survives, toast still BLOCKED
Deploy 2 (new) → Flag cleared, toast shows again
```

### Why This Is Necessary:
1. **Prevents Spam**: User won't see same update prompt repeatedly
2. **Survives Refresh**: Flag persists through page reloads
3. **Respects User Choice**: If user clicked once, don't nag again
4. **New Deployments**: Only shows for genuinely new updates

## Multiple Deployment Scenarios

### Previous Implementation (PROBLEMATIC)
```typescript
// OLD CODE - BLOCKED SUBSEQUENT TOASTS
if (toastShownRef.current) {
  console.log('🚫 Toast already shown, preventing duplicate');
  return; // BLOCKS all subsequent updates
}
toastShownRef.current = true;
```

#### Scenario 1: User Ignores First Toast
```
Deploy 1 → Toast shows ("Update available")
Deploy 2 → BLOCKED (toastShownRef = true)
Deploy 3 → BLOCKED 
Deploy 4-10 → ALL BLOCKED
Result: User sees old update, never gets latest fixes
```

#### Scenario 2: User Away During Multiple Deploys
```
Deploy 1-10 happen while user away
Only 1st toast shows
User returns 30 minutes later
Sees outdated update prompt (Deploy 1)
Misses critical fixes from Deploy 10
```

### Current Implementation (FIXED)
```typescript
// NEW CODE - ALWAYS SHOWS LATEST
const showUpdateToast = () => {
  // Allow latest toast - dismiss any existing and show new one
  console.log('🔄 Showing latest update toast');
  toastShownRef.current = true;
  // ... toast config
};
```

#### Fixed Behavior:
```
Deploy 1 → Toast shows
Deploy 2 → Replaces previous toast with latest
Deploy 3-10 → Each replaces previous with newest
Result: User ALWAYS sees the latest deployment (Deploy 10)
```

#### Why This Change Was Necessary:
1. **Critical Bug Fixes**: If Deploy 10 contains security fixes, user must get it
2. **User Experience**: Seeing outdated update prompts is confusing
3. **Cache Consistency**: Each deployment clears caches, so toast must match latest state
4. **Real-world Usage**: Multiple deployments per day are common in active development

## Key Features

### Proactive Cache Clearing
- Clears caches **before** user sees update prompt
- Prevents white/black screen issues
- Ensures clean slate for new version

### Session Preservation
- Maintains user authentication across updates
- Backs up audio cache (user downloads)
- Graceful degradation if session refresh fails

### User Experience
- Non-intrusive update prompts
- Clear visual feedback
- Maintains app state where possible
- **Always shows latest deployment** (not outdated ones)

## Dependencies Summary

**Must Have:**
- Vite PWA plugin for service worker management
- Supabase for authentication
- AuthContext for session management
- Toast system for user notifications

**Browser APIs:**
- Service Worker API
- Cache API
- Local/Session Storage
- Navigator API

**React Ecosystem:**
- React hooks (useEffect, useRef)
- Custom hooks (useToast, useAuth)
- Component lifecycle management