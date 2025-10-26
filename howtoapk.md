# How to Build the Android APK

This document provides the necessary steps to build the Android APK for this project using the Capacitor workflow.

## Prerequisites

Before you begin, ensure you have the following installed and configured on your system:

*   **Android Studio:** Make sure you have Android Studio installed and the Android SDK is properly configured.
*   **Node.js and npm:** Required for running the Capacitor CLI.

## Building the APK

1.  **Open your terminal or command prompt.**

2.  **Sync the web assets with the Android project.** This command copies your web app into the native Android project.
    ```sh
    npx cap sync android
    ```

3.  **Open the Android project in Android Studio.**
    ```sh
    npx cap open android
    ```

4.  **Build the APK in Android Studio:**
    *   Once the project is open in Android Studio, wait for it to sync and build.
    *   Go to the **Build** menu.
    *   Select **Build Bundle(s) / APK(s)** -> **Build APK(s)**.

## Locating the APK

After a successful build, the APK file will be located in the following directory:

`android/app/build/outputs/apk/release/app-release.apk`

## Generating a Signed APK for Production

For production distribution (e.g., on the Google Play Store), you must generate a signed APK.

1.  **In Android Studio, go to the "Build" menu.**
2.  **Select "Generate Signed Bundle / APK..."**
3.  **Choose "APK" and click "Next".**
4.  **Select your key store path, and enter your key store password, key alias, and key password.** If you don't have a key store, you can create one using the "Create new..." button.
5.  **Click "Next", choose the "release" build variant, and click "Finish".**

The signed APK will be generated in the location you specified during the signing process.