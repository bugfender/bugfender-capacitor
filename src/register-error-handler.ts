/**
 * Registers a global error handler that will trigger a crash report in Bugfender
 */
import type {BugfenderPlugin} from "./definitions";

export class RegisterErrorHandler {
  constructor(
    protected window: Window,
  ) {
  }

  public init(bugfender: BugfenderPlugin): void {
    this.window.addEventListener('error', (e) => {
      const {message: msg, lineno: line, filename, error} = e;
      let stack;

      if (error?.stack) {
        stack = error.stack;
      }

      if (typeof msg === 'string') {
        bugfender.sendCrash({
          title: msg, text: [
            `Error: ${msg}`,
            `URL: ${filename ? filename : 'N/A'}`,
            `Line: ${line ? line : 'N/A'}`,
            `Stack: ${stack ? stack : 'N/A'}`,
          ].join('\n')
        });
      }
    });
  }
}
