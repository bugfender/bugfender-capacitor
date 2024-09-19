import { format } from "@bugfender/common";

import type { BugfenderPlugin } from "./definitions";

/**
 * Overrides the `window.console` methods in order to execute the Bugfender equivalent logging
 * methods while keeping the original browser functionality.
 */
export class OverrideConsoleMethods {
  constructor(protected window: Window) {}

  public init(bugfender: BugfenderPlugin): void {
    (this.window as any).console = (function (console: Console) {
      return {
        ...console,
        log: function (...parameters: unknown[]) {
          console.log(...parameters);
          bugfender.log({ text: format([...parameters]) });
        },
        debug: function (...parameters: unknown[]) {
          console.debug(...parameters);
          bugfender.log({ text: format([...parameters]) });
        },
        trace: function (...parameters: unknown[]) {
          console.trace(...parameters);
          bugfender.trace({ text: format([...parameters]) });
        },
        info: function (...parameters: unknown[]) {
          console.info(...parameters);
          bugfender.info({ text: format([...parameters]) });
        },
        warn: function (...parameters: unknown[]) {
          console.warn(...parameters);
          bugfender.warn({ text: format([...parameters]) });
        },
        error: function (...parameters: unknown[]) {
          console.error(...parameters);
          bugfender.error({ text: format([...parameters]) });
        },
      };
    })((this.window as any).console);
  }
}
