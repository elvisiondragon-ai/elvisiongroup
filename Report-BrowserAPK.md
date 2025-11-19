# Report: Resolving APK Deep Linking and UI Rendering Issues

This report details the investigation and resolution of two distinct issues:
1.  An Android deep linking problem causing the app to hijack all web links from its domain.
2.  A UI rendering problem causing a new survey page to appear as a black screen.

---

## 1. Android App Links Opening in App Instead of Browser

### Problem
When a URL from the app's domain (`app.elvisiongroup.com`) was clicked, it would always open directly in the Android application, rather than giving the user the option to open it in a web browser. This is different from the behavior of apps like Instagram, which can open links in an in-app browser view. The specific example was that `app.elvisiongroup.com/formid` was not opening in a browser.

### Investigation and Cause
The root cause was identified in the `android/app/src/main/AndroidManifest.xml` file. The configuration contained the following `<intent-filter>`:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="app.elvisiongroup.com" />
</intent-filter>
```

This filter, combined with `android:autoVerify="true"`, establishes Android App Links for the domain. Because the `<data>` tag did not specify a path (`android:path`, `android:pathPrefix`, or `android:pathPattern`), it acted as a catch-all, instructing the Android OS to open **every single URL** from `app.elvisiongroup.com` within the app.

### Solution
To fix this, the intent filter was made more specific. By adding a path prefix, we can designate only certain URLs to be opened by the app, letting a web browser handle all others.

I modified the `<data>` tag by adding `android:pathPrefix="/app"`:

```xml
<data android:scheme="https" android:host="app.elvisiongroup.com" android:pathPrefix="/app" />
```

With this change, only URLs that explicitly start with `https://app.elvisiongroup.com/app/` will open the application directly. All other URLs (like `/formid` or any other page) will now correctly open in the user's web browser.

---

## 2. Black Screen on New `/formai` Survey Page

### Problem
After creating the new survey page at the `/formai` route, the page rendered with a black background, showing only the header title ("5-question smart survey"). The actual survey questions and options were not visible.

### Investigation and Cause
The issue stemmed from a mismatch in the UI frameworks being used. My initial implementation of the `FormAI.tsx` component was built using Ionic Framework components (`<IonPage>`, `<IonContent>`, `<IonList>`, etc.).

However, upon inspecting other pages in the project (specifically `Formid.tsx`), it became clear that the application is built with a standard React stack and styled with **Tailwind CSS**, not Ionic. The project was not configured to load the necessary Ionic stylesheets, so the Ionic components were rendering without any styles, making them invisible against the application's default dark theme background.

### Solution
The solution was to completely rewrite the `src/pages/FormAI.tsx` component to align with the project's existing architecture.

1.  **Removed Ionic Components:** All `<Ion...>` components were removed.
2.  **Used Standard HTML & Tailwind CSS:** The component was rebuilt using standard HTML elements (`<div>`, `<h1>`, `<label>`, `<input>`, etc.).
3.  **Applied Existing Styles:** I applied the same Tailwind CSS classes used in `Formid.tsx` to ensure a consistent look and feel, including `bg-background`, `text-foreground`, `font-exo`, `bg-card`, and `border-border`.

By rebuilding the component with the correct UI library and styling conventions, the page now renders correctly with the intended theme and layout.
