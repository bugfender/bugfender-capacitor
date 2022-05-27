/// <reference types="@capacitor/cli" />

import type { BugfenderFacade } from '@bugfender/types';

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    Bugfender?: {};
  }
}

export interface BugfenderPlugin extends BugfenderFacade {}
