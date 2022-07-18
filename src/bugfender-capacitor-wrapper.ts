// @ts-nocheck
// TODO remove ts-nocheck
import {
  BugfenderFacade,
  DeviceKeyValue,
  LogEntry,
  SDKOptions,
  UserFeedbackOptions,
  UserFeedbackResult
} from "@bugfender/common";
import {BugfenderPlugin} from "./definitions";

export class BugfenderCapacitorWrapper implements BugfenderFacade {
  constructor(private readonly bugfenderCapacitor: BugfenderPlugin) {

  }

  error(obj: unknown, ...objs: unknown[]): void;
  error(msg: string, ...subst: unknown[]): void;
  error(obj: unknown, ...objs: unknown[]): void {
  }

  fatal(obj: unknown, ...objs: unknown[]): void;
  fatal(msg: string, ...subst: unknown[]): void;
  fatal(obj: unknown, ...objs: unknown[]): void {

  }

  forceSendOnce(): void {
  }

  getDeviceURL(): Promise<string> {
    return Promise.resolve("")
  }

  getSessionURL(): Promise<string> {
    return Promise.resolve("");
  }

  getUserFeedback(options?: UserFeedbackOptions): Promise<UserFeedbackResult> {
    return Promise.resolve({isSent: false, feedbackURL: ""});
  }

  info(obj: unknown, ...objs: unknown[]): void;
  info(msg: string, ...subst: unknown[]): void;
  info(obj: unknown, ...objs: unknown[]): void {
  }

  init(options: SDKOptions): Promise<void> {
    return Promise.resolve(undefined);
  }

  log(obj: unknown, ...objs: unknown[]): void;
  log(msg: string, ...subst: unknown[]): void;
  log(obj: unknown, ...objs: unknown[]): void {
    this.bugfenderCapacitor.log({obj: "hola que tal"})
  }

  removeDeviceKey(key: string): void {
  }

  sendCrash(title: string, text: string): Promise<string> {
    return Promise.resolve("");
  }

  sendIssue(title: string, text: string): Promise<string> {
    return Promise.resolve("");
  }

  sendLog(log: LogEntry): void {
  }

  sendUserFeedback(title: string, text: string): Promise<string> {
    return Promise.resolve("");
  }

  setDeviceKey(key: string, value: DeviceKeyValue): void {
  }

  setForceEnabled(state: boolean): void {
  }

  trace(obj: unknown, ...objs: unknown[]): void;
  trace(msg: string, ...subst: unknown[]): void;
  trace(obj: unknown, ...objs: unknown[]): void {
  }

  warn(obj: unknown, ...objs: unknown[]): void;
  warn(msg: string, ...subst: unknown[]): void;
  warn(obj: unknown, ...objs: unknown[]): void {
  }
}
