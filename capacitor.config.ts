import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.elvisiongroup.com',
  appName: 'eL Vision Group',
  webDir: 'dist',
  // server: {
  //   hostname: 'app.elvisiongroup.com',
  //   androidScheme: 'https'
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0a",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  android: {
    icon: "assets/icon.png"
  }
};

export default config;
