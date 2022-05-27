import { registerPlugin } from '@capacitor/core';
import type { BugfenderPlugin } from './definitions';

const Bugfender = registerPlugin<BugfenderPlugin>('Bugfender', {
  web: () => import('./web').then(m => new m.BugfenderWeb()),
  electron: () => import('./web').then(m => new m.BugfenderWeb()),
});

export * from './definitions';
export { Bugfender };
