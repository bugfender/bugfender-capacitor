/// <reference types="@capacitor/cli" />

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    Bugfender?: {};
  }
}

export interface BugfenderPlugin {
  log(obj: { obj: string }): void
}
