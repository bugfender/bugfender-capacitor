import { registerPlugin } from '@capacitor/core';
import type { BugfenderPlugin } from './definitions';
import {BugfenderCapacitorWrapper} from "./bugfender-capacitor-wrapper";

const BugfenderCapacitor = registerPlugin<BugfenderPlugin>('Bugfender', {
  web: () => import('./web').then(m => new m.BugfenderWeb()),
  electron: () => import('./web').then(m => new m.BugfenderWeb()),
});

const Bugfender = new BugfenderCapacitorWrapper(BugfenderCapacitor)

export * from './definitions';
export { Bugfender };
