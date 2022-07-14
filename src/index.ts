import type { BugfenderFacade } from '@bugfender/types';
import { Capacitor, registerPlugin } from '@capacitor/core';

import { BugfenderCapacitorWrapper } from './bugfender-capacitor-wrapper';
import type { BugfenderPlugin } from './definitions';

// Non-native platforms (web & electron) return directly the `Bugfender` instance from `@bugfender/sdk`.
// For native we get a `BugfenderPlugin`.
const BugfenderCapacitor = registerPlugin<BugfenderPlugin | BugfenderFacade>('Bugfender', {
  web: () => import('@bugfender/sdk').then(m => m.Bugfender),
  electron: () => import('@bugfender/sdk').then(m => m.Bugfender),
});

// eslint-disable-next-line import/no-mutable-exports
let Bugfender: BugfenderFacade;

if (Capacitor.isNativePlatform()) {
  // Wrap `BugfenderPlugin` with a class that implements `BugfenderFacade` this is needed
  // to homogeinize the user facing API. Capacitor is very limited & opinionated on how
  // the plugin API should be.
  Bugfender = new BugfenderCapacitorWrapper(BugfenderCapacitor as BugfenderPlugin);
} else {
  Bugfender = BugfenderCapacitor as BugfenderFacade;
}

export * from './definitions';
export { Bugfender };
