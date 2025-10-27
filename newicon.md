# How to Change Capacitor Android App Icon

This guide outlines the steps to effectively change your Capacitor Android application icon, especially when encountering persistent caching issues.

## Problem

The APK icon does not update after replacing the image file, and you might encounter an `AAPT: error: resource mipmap/ic_launcher not found` during the build process.

## Solution Overview

The most robust solution involves using the `@capacitor/assets` tool to generate all necessary icon assets, followed by a thorough cleaning and rebuilding of the Android project.

## Step-by-Step Guide

1.  **Prepare Your Icon File:**
    *   Ensure your desired icon image is a high-resolution PNG file (preferably at least `1024x1024` pixels for best results).
    *   Place this file in your project's `assets` directory and name it `icon.png`.
        *   *Example:* If your icon is `wingz.png`, rename it and move it to `/Users/eldragon/git/elvisiongroup/assets/icon.png`.

2.  **Update `capacitor.config.ts`:**
    *   Open your `capacitor.config.ts` file.
    *   Add or update the `android` configuration to point to your `icon.png` file.

    ```typescript
    import type { CapacitorConfig } from '@capacitor/cli';

    const config: CapacitorConfig = {
      appId: 'app.elvisiongroup.com', // Your app ID
      appName: 'eL Vision Group',     // Your app name
      webDir: 'dist',
      // ... other configurations
      android: {
        icon: "assets/icon.png" // <--- Ensure this line is present and correct
      }
    };

    export default config;
    ```

3.  **Install `@capacitor/assets`:**
    *   This tool is essential for generating all the various icon sizes and formats required by Android.
    *   Run the following command in your project's root directory:

        ```bash
        npm install @capacitor/assets --save-dev
        ```

4.  **Forcefully Remove Old Icon Directories (Crucial for Caching Issues):**
    *   To eliminate any lingering old icon files that might be causing caching problems, forcefully remove the `mipmap-*` directories from your Android project.

        ```bash
        rm -rf android/app/src/main/res/mipmap-*
        ```
        *(Note: This command is run from the project root, not the `android` directory.)*

5.  **Generate New Icon Assets:**
    *   Use the `@capacitor/assets` tool to generate all the required Android icon files from your `assets/icon.png`.

        ```bash
        npx @capacitor/assets generate --android
        ```
        *This command will create all the `mipmap` directories and their contents, including adaptive icon layers, based on your `icon.png`.*

6.  **Clean Android Build Cache:**
    *   Even after generating new assets, it's vital to clean the Android build cache to ensure the build system picks up the new files.

        ```bash
        cd android
        ./gradlew clean
        cd ..
        ```

7.  **Uninstall the App from Your Device/Emulator:**
    *   **This is a critical step.** Android devices often cache app icons. You *must* uninstall the app completely from any device or emulator where it was previously installed.

8.  **Rebuild and Run Your Application:**
    *   Now, rebuild your Android application. You can do this via Android Studio or by running:

        ```bash
        npx capacitor sync android
        npx capacitor run android
        ```
        or
        ```bash
        cd android
        ./gradlew assembleDebug # or assembleRelease
        # Then install the APK manually or run from Android Studio
        ```

Following these steps should ensure your new icon is correctly displayed on your Android application.
