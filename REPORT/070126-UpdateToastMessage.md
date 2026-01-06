Task: Update and activate the `UpdateToast`.

Description: The user requested to update the message displayed in the update toast and to ensure the toast is active when an update is available.

Changes made:
- Modified `src/hooks/UpdateToast.tsx`.
- Updated the `title` of the `toastConfig` to "🎉 Update Januari 2026" and added a `description` "Audio bisa di download di device anda :)". The `duration` was also increased to 5000ms.
- Uncommented the `showUpdateToast()` call within the `onNeedRefresh` function, re-enabling the display of the update notification.

Result: The update toast will now show the new message when an update is available, informing users about the January 2026 update and the new audio download feature.