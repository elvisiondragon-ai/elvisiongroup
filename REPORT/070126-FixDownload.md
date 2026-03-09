Task: Modify download functionality in `audiotherapy.tsx`.

Description: The user requested to change the download button behavior for audio files. Instead of caching the files in the application's storage, the button should trigger a direct download to the user's device.

Changes made:
- Modified `src/components/VerseAudioCard.tsx`.
- Removed caching logic (`isCached`, `isDownloaded`, `downloadProgress`).
- Updated `handleDownloadClick` to fetch the audio as a blob and trigger a download via a temporary anchor link.
- Simplified the UI to show a loading spinner during download.

Result: The download button now allows users to save audio files directly to their phones or computers.