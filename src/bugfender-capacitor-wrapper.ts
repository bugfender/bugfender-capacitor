import type {
  BugfenderFacade,
  DeviceKeyValue,
  LogEntry,
  SDKOptions,
  UserFeedbackOptions,
  UserFeedbackResult} from "@bugfender/types";
import {
  format
} from "@bugfender/types";

import type {BugfenderPlugin} from "./definitions";

export class BugfenderCapacitorWrapper implements BugfenderFacade {

  constructor(private readonly bugfenderCapacitor: BugfenderPlugin) {
  }

  init(options: SDKOptions): Promise<void> {
    return this.bugfenderCapacitor.init(options)
  }

  forceSendOnce(): void {
    this.bugfenderCapacitor.forceSendOnce()
  }

  getDeviceURL(): Promise<string> {
    // TODO handle response
    return this.bugfenderCapacitor.getDeviceURL()
  }

  getSessionURL(): Promise<string> {
    // TODO handle response
    return this.bugfenderCapacitor.getSessionURL()
  }

  getUserFeedback(options?: UserFeedbackOptions): Promise<UserFeedbackResult> {
    // TODO handle response
    return this.bugfenderCapacitor.getUserFeedback(options);
  }

  log(obj: unknown, ...objs: unknown[]): void;
  log(msg: string, ...subst: unknown[]): void;
  log(...parameters: unknown[]): void {
    this.bugfenderCapacitor.log({text: format([...parameters])})
  }

  warn(obj: unknown, ...objs: unknown[]): void;
  warn(msg: string, ...subst: unknown[]): void;
  warn(...parameters: unknown[]): void {
    this.bugfenderCapacitor.warn({text: format([...parameters])})
  }

  error(obj: unknown, ...objs: unknown[]): void;
  error(msg: string, ...subst: unknown[]): void;
  error(...parameters: unknown[]): void {
    this.bugfenderCapacitor.error({text: format([...parameters])})
  }

  trace(obj: unknown, ...objs: unknown[]): void;
  trace(msg: string, ...subst: unknown[]): void;
  trace(...parameters: unknown[]): void {
    this.bugfenderCapacitor.trace({text: format([...parameters])})
  }

  info(obj: unknown, ...objs: unknown[]): void;
  info(msg: string, ...subst: unknown[]): void;
  info(...parameters: unknown[]): void {
    this.bugfenderCapacitor.info({text: format([...parameters])})
  }

  fatal(obj: unknown, ...objs: unknown[]): void;
  fatal(msg: string, ...subst: unknown[]): void;
  fatal(...parameters: unknown[]): void {
    this.bugfenderCapacitor.fatal({text: format([...parameters])})
  }

  removeDeviceKey(key: string): void {
    this.bugfenderCapacitor.removeDeviceKey({key: key})
  }

  sendCrash(title: string, text: string): Promise<string> {
    // TODO handle response
    return this.bugfenderCapacitor.sendCrash({title: title, text: text})
  }

  sendIssue(title: string, text: string): Promise<string> {
    // TODO handle response
    return this.bugfenderCapacitor.sendIssue({title: title, text: text})
  }

  sendLog(log: LogEntry): void {
    this.bugfenderCapacitor.sendLog(log)
  }

  sendUserFeedback(title: string, text: string): Promise<string> {
    // TODO handle response
    return this.bugfenderCapacitor.sendUserFeedback({title: title, text: text})
  }

  setDeviceKey(key: string, value: DeviceKeyValue): void {
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
    this.bugfenderCapacitor.setForceEnabled({state: state})
  }
}
