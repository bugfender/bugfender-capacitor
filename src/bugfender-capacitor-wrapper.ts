import type {
  BugfenderFacade,
  DeviceKeyValue,
  LogEntry, SDKOptions,
  UserFeedbackOptions,
  UserFeedbackResult
} from "@bugfender/common";
import {
  format,
  LogLevel,
  PrintToConsole,
  RegisterErrorHandler,
  UserFeedbackOptionsValidator
} from "@bugfender/common";

import type {BugfenderPlugin} from "./definitions";
import {OverrideConsoleMethods} from "./override-console-methods";
import {SdkOptionsValidator} from "./sdk-options-validator";

export class BugfenderCapacitorWrapper implements BugfenderFacade {
  private overrideConsoleMethods = new OverrideConsoleMethods(window);
  private printToConsole = new PrintToConsole(global.console);
  private sdkOptionsValidator: SdkOptionsValidator = new SdkOptionsValidator();
  private initialized = false;

  constructor(private readonly bugfenderCapacitor: BugfenderPlugin) {
  }

  init(options: SDKOptions): Promise<void> {
    let promise: Promise<void>;

    if (!this.initialized) {
      const sanitizedOptions = this.sdkOptionsValidator.init(options);

      promise = this.bugfenderCapacitor.init(sanitizedOptions)

      if (sanitizedOptions.overrideConsoleMethods) {
        this.overrideConsoleMethods.init(this.bugfenderCapacitor);
      }
      this.printToConsole.init(sanitizedOptions.printToConsole ?? true);

      if (sanitizedOptions.registerErrorHandler) {
        new RegisterErrorHandler(window).init(this);
      }
    } else {
      promise = Promise.resolve()
    }

    this.initialized = true;

    return promise
  }

  forceSendOnce(): void {
    this.printToConsole.info(`Force send once`);
    this.bugfenderCapacitor.forceSendOnce()
  }

  getDeviceURL(): Promise<string> {
    return this.mapPromise(
      this.bugfenderCapacitor.getDeviceURL(),
      this.urlToString
    )
  }

  getSessionURL(): Promise<string> {
    return this.mapPromise(
      this.bugfenderCapacitor.getSessionURL(),
      this.urlToString
    )
  }

  getUserFeedback(options?: UserFeedbackOptions): Promise<UserFeedbackResult> {
    const sanitizedOptions = new UserFeedbackOptionsValidator().init(options)
    return new Promise<UserFeedbackResult>((resolve) =>
      this.bugfenderCapacitor.getUserFeedback(sanitizedOptions)
        .then(response => resolve({isSent: true, feedbackURL: response.url}))
        .catch(() => resolve({isSent: false})));
  }

  log(obj: unknown, ...objs: unknown[]): void;
  log(msg: string, ...subst: unknown[]): void;
  log(...parameters: unknown[]): void {
    this.printToConsole.log(...parameters);

    this.bugfenderCapacitor.log({text: format([...parameters])})
  }

  warn(obj: unknown, ...objs: unknown[]): void;
  warn(msg: string, ...subst: unknown[]): void;
  warn(...parameters: unknown[]): void {
    this.printToConsole.warn(...parameters);
    this.bugfenderCapacitor.warn({text: format([...parameters])})
  }

  error(obj: unknown, ...objs: unknown[]): void;
  error(msg: string, ...subst: unknown[]): void;
  error(...parameters: unknown[]): void {
    this.printToConsole.error(...parameters);
    this.bugfenderCapacitor.error({text: format([...parameters])})
  }

  trace(obj: unknown, ...objs: unknown[]): void;
  trace(msg: string, ...subst: unknown[]): void;
  trace(...parameters: unknown[]): void {
    this.printToConsole.trace(...parameters);
    this.bugfenderCapacitor.trace({text: format([...parameters])})
  }

  info(obj: unknown, ...objs: unknown[]): void;
  info(msg: string, ...subst: unknown[]): void;
  info(...parameters: unknown[]): void {
    this.printToConsole.info(...parameters);
    this.bugfenderCapacitor.info({text: format([...parameters])})
  }

  fatal(obj: unknown, ...objs: unknown[]): void;
  fatal(msg: string, ...subst: unknown[]): void;
  fatal(...parameters: unknown[]): void {
    this.printToConsole.error(...parameters);
    this.bugfenderCapacitor.fatal({text: format([...parameters])})
  }

  removeDeviceKey(key: string): void {
    this.printToConsole.info(`Device key "${key}" removed`);
    this.bugfenderCapacitor.removeDeviceKey({key: key})
  }

  sendCrash(title: string, text: string): Promise<string> {
    this.printToConsole.error(`Crash: ${title}.\n${text}`);
    return this.mapPromise(
      this.bugfenderCapacitor.sendCrash({title: title, text: text}),
      this.urlToString
    )
  }

  sendIssue(title: string, text: string): Promise<string> {
    this.printToConsole.warn(`Issue: ${title}.\n${text}`);
    return this.mapPromise(
      this.bugfenderCapacitor.sendIssue({title: title, text: text}),
      this.urlToString
    )
  }

  sendLog(log: LogEntry): void {
    this.printToConsole.printLog(log);
    this.bugfenderCapacitor.sendLog({
      line: log.line ?? 0,
      method: log.method ?? '',
      file: log.file ?? '',
      level: log.level ?? LogLevel.Debug,
      tag: log.tag ?? '',
      text: log.text ?? ''
    })
  }

  sendUserFeedback(title: string, text: string): Promise<string> {
    this.printToConsole.info(`User Feedback: ${title}.\n${text}`);
    return this.mapPromise(
      this.bugfenderCapacitor.sendUserFeedback({title: title, text: text}),
      this.urlToString
    )
  }

  setDeviceKey(key: string, value: DeviceKeyValue): void {
    this.printToConsole.info(`Device key "${key}" set to "${value}"`);
    if (typeof value === 'boolean') {
      this.bugfenderCapacitor.setDeviceBoolean({key: key, value: value});
    } else if (typeof value === 'string') {
      this.bugfenderCapacitor.setDeviceString({key: key, value: value});
    } else {
      // typeof value === 'number'
      if (Number.isInteger(value)) {
        this.bugfenderCapacitor.setDeviceInteger({key: key, value: value});
      } else {
        this.bugfenderCapacitor.setDeviceFloat({key: key, value: value});
      }
    }
  }

  setForceEnabled(state: boolean): void {
    this.printToConsole.info(`Set force enabled set to ${state}`);
    this.bugfenderCapacitor.setForceEnabled({state: state})
  }

  private mapPromise<A, B>(promise: Promise<A>, mappingWith: (from: A) => B): Promise<B> {
    return promise.then(response => mappingWith(response));
  }

  private urlToString(from: { url: string }): string {
    return from.url;
  }
}
