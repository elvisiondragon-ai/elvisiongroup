# How to Release the Android Deep Link Fix

I have made the necessary code changes to your project to fix the Android deep linking issue. You must now follow these steps to build and release the updated app.

### Step 1: Sync Your Capacitor Project

Run this command in your terminal to apply the configuration changes to your native Android project:

```bash
npx cap sync android
```

### Step 2: Get Your App's Signing Certificate Fingerprint

The `assetlinks.json` file I created requires your app's unique SHA-256 fingerprint. You can get this from the Google Play Console:

1.  Go to your **Google Play Console**.
2.  Select your app.
3.  Navigate to **Setup > App integrity**.
4.  Go to the **App signing** tab.
5.  Copy the **SHA-256 certificate fingerprint**.
6.  Open the file `public/.well-known/assetlinks.json` and replace the placeholder `REPLACE_WITH_YOUR_SHA256_CERT_FINGERPRINT` with the value you just copied.

### Step 3: Deploy Your Web Code

Make sure the `assetlinks.json` file is accessible online. Deploy your `public` directory so that the file is available at:
`https://app.elvisiongroup.com/.well-known/assetlinks.json`

### Step 4: Rebuild the Signed APK in Android Studio

1.  Open your project's `android` folder in Android Studio:
    ```bash
    npx cap open android
    ```
2.  In Android Studio, go to **Build > Generate Signed Bundle / APK...**.
3.  Select **APK** and follow the prompts to build a new, signed release APK using your existing keystore (the same one you used to publish your app previously).

### Step 5: Update Your App in the Google Play Store

Upload the new signed APK you just created to the Google Play Store as a new release.

### Step 6: Configure Your Supabase URL

As we discussed, you need to tell Supabase where to send users for password resets.

1.  Go to your Supabase project dashboard.
2.  Navigate to **Authentication -> URL Configuration**.
3.  In the **Redirect URLs** section, set the **Password reset** URL to:
    ```
    https://app.elvisiongroup.com/reset-password
    ```

Once your users update to the new version of the app, the password reset links will open the app directly to the correct page.