import { WebPlugin } from '@capacitor/core';

import type { BugfenderPlugin } from './definitions';

export class BugfenderWeb extends WebPlugin implements BugfenderPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
