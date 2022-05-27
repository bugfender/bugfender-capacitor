/// <reference types="@bugfender/capacitor" />
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bugfender.sdk.capacitor.example',
  appName: 'Bugfender Capacitor Example',
  webDir: 'www',
  plugins: {
    Bugfender: {},
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
