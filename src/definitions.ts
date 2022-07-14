/// <reference types="@capacitor/cli" />

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    Bugfender?: undefined;
  }
}

export interface BugfenderPlugin {
  log(obj: { obj: string }): void
}
