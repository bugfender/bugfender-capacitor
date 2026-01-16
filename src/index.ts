import type { BugfenderFacade, UserFeedbackResult } from "@bugfender/common";
import { LogLevel } from "@bugfender/common";
import { Bugfender as BugfenderWeb } from "@bugfender/sdk";
import { Capacitor, registerPlugin } from "@capacitor/core";

import { BugfenderCapacitorWrapper } from "./bugfender-capacitor-wrapper";
import type { BugfenderPlugin } from "./definitions";
import { getVersionNumber } from "./version";

// Non-native platforms (web & electron) return directly the `Bugfender` instance from `@bugfender/sdk` ("pretty" API).
// For native we get a `BugfenderPlugin` instance with the Capacitor "ugly" API.
const BugfenderCapacitor = registerPlugin<BugfenderPlugin | BugfenderFacade>(
  "Bugfender",
  {
    web: BugfenderWeb,
    electron: BugfenderWeb,
  },
);

// eslint-disable-next-line import/no-mutable-exports
let Bugfender: BugfenderFacade;

if (Capacitor.isNativePlatform()) {
  // `BugfenderPlugin` uses the Capacitor "ugly" API which is very limited & opinionated.
  // We instead want to expose `BugfenderFacade` which is the interface used by other Bugfender
  // NPM packages. For that, we just wrap `BufenderPlugin` into something that implements
  // `BugfenderFacade` API.
  Bugfender = new BugfenderCapacitorWrapper(
    BugfenderCapacitor as BugfenderPlugin,
  );
} else {
  Bugfender = BugfenderCapacitor as BugfenderFacade;
}

// Automatically set SDK type to "capacitor" with the current version for web platforms
Bugfender.setSDKType("capacitor", getVersionNumber());

export * from "./definitions";
export { Bugfender };
export { LogLevel };
export { UserFeedbackResult };
