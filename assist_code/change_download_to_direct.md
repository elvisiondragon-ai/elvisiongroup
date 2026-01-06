The download functionality in `audiotherapy.tsx` and its child component `VerseAudioCard.tsx` was modified.

Previously, the download button would save the audio file to the application's cache storage.

The changes implement a direct download functionality:
1.  The `handleDownloadClick` function in `VerseAudioCard.tsx` was updated to fetch the audio file as a blob.
2.  A temporary anchor (`<a>`) element is created with a blob URL.
3.  The `download` attribute is set on the anchor tag.
4.  The anchor tag is programmatically clicked to trigger the browser's download prompt.
5.  The blob URL is revoked after the download is initiated.
6.  The caching logic, including `isCached`, `isDownloaded`, and `downloadProgress`, was removed from `VerseAudioCard.tsx`.