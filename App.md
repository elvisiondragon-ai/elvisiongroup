# EL VISION App: Developer Workflow Understanding

This document outlines key architectural and workflow patterns within the EL VISION application.

## 1. Authentication

- **Single Source of Truth:** `src/contexts/AuthContext.tsx` is the definitive source for all user authentication data, including session state. All authentication logic is centralized here.
- **Session Propagation:** Other components and pages must consume session or token data directly from this context. They should not implement independent authentication checks.
- **Realtime RLS Protection:** All pages are protected by Supabase's Realtime Row-Level Security (RLS). Pages do not rely on simple client-side auth checks alone; they inherit and operate under the security context provided by the Realtime connection.

## 2. Idle State Management

The app features a robust idle handler to ensure data consistency and seamless reconnection when the user returns after a period of inactivity.

- **Mechanism:** When the app detects the user is no longer idle, it triggers a session refresh and data reload.
- **Reconnection Strategy:** It employs an exponential backoff algorithm that increases the delay between reconnection attempts, capping at 16 seconds, to gracefully handle extended network interruptions.
- **Goal:** This ensures that stale data (like chat messages) is refreshed and the user's session is always valid upon returning to the app.

## 3. Logout Process

The logout functionality has a specific implementation detail for Progressive Web App (PWA) on iOS to ensure a clean exit.

- **iOS PWA:** The Service Worker must be unregistered *before* the logout function is executed.
- **Other Platforms:** This special step is not required for other platforms (web, Android PWA, etc.). The standard logout process applies.

## 4. Global Audio Player (Verse Audio)

To provide a persistent audio experience, the Verse Audio player uses global event listeners.

- **Benefit:** This prevents the UI (e.g., play/pause button state) from becoming disconnected from the actual audio playback state if the user navigates between different tabs or components within the app.

## 5. Chat

- **Realtime Backend:** The primary chat component, `src/components/Chat.tsx`, is powered by Supabase Realtime.
- **Functionality:** This allows for instant message delivery and presence tracking within chat channels.

## 6. Anti-Race Condition for Updates

The application includes a mechanism to prevent data corruption and redundant refreshes from concurrent update operations.

- **Locking Flag:** An "update in progress" flag is set when an update action begins.
- **Conflict Resolution:** If another update action is triggered while this flag is active, the new action is cancelled. This avoids race conditions and potential infinite refresh loops.

## 7. PWA Configuration

- **Display Mode:** The PWA is configured to run in `standalone` mode, providing a native-like app experience.
- **Configuration File:** The build and PWA settings are managed in `vite.config.ts`.
