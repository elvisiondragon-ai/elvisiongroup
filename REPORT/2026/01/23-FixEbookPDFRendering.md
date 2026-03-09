# Report: Fix Ebook PDF Rendering Issue

**Date:** 2026-01-23
**Task:** Fix invisible/grey text on the cover pages of ebooks when viewed as a PDF in Chrome.

## Issue Description
When users opened the ebook HTML files and attempted to save or view them as a PDF in Google Chrome, the main titles and subtitles appeared white or light grey (effectively invisible).

## Root Cause
*   **Default Browser Behavior:** Google Chrome's print engine (used for "Save as PDF") defaults to "Background Graphics: Off" to save ink.
*   **Styling Conflict:** The ebooks use white text over colored gradient or solid backgrounds. When Chrome stripped the background for the PDF, it left white text on a white page.

## Solution
I implemented the `print-color-adjust` CSS property to force the browser to include background colors and gradients during PDF generation.

### Files Modified:
1.  `src/pages/usa/ebookfeminine.html`
2.  `src/pages/New Folder With Items/ebookwanita.html`
3.  `src/pages/New Folder With Items/uangpanasebook.html`

### Applied Changes:
1.  **Global Print Rule:** Added to the `@media print` block.
    ```css
    body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    ```
2.  **Specific Component Rules:** Applied the properties directly to colored containers (e.g., `.cover`, `.audio-box`, `.section-title`, `.next-step-box`) to guarantee backgrounds are preserved.

## Verification
*   Open any of the HTML files in Chrome.
*   Press `Cmd+P` (or `Ctrl+P`) and select **Save as PDF**.
*   The pages now correctly display the backgrounds with clearly visible white text.
