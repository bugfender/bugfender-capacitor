import type { SDKOptions, UserFeedbackOptions, UserFeedbackResult, LogEntry, DeviceKeyValue } from '@bugfender/types';
import type { BugfenderPlugin } from './definitions';
import { WebPlugin } from '@capacitor/core';
import { Bugfender } from '@bugfender/sdk';

export class BugfenderWeb extends WebPlugin implements BugfenderPlugin {
  public init(options: SDKOptions): Promise<void> {
    return Bugfender.init(options);
  }

  public forceSendOnce(): void {
    return Bugfender.forceSendOnce();
  }

  public getDeviceURL(): Promise<string> {
    return Bugfender.getDeviceURL();
  }

  public getSessionURL(): Promise<string> {
    return Bugfender.getSessionURL();
  }

  public getUserFeedback(options?: UserFeedbackOptions): Promise<UserFeedbackResult> {
    return Bugfender.getUserFeedback(options);
  }

  public log(obj: unknown, ...objs: unknown[]): void;
  public log(msg: string, ...subst: unknown[]): void;
  public log(...parameters: unknown[]): void {
    Bugfender.log.apply(Bugfender, parameters as any);
  }

  public warn(obj: unknown, ...objs: unknown[]): void;
  public warn(msg: string, ...subst: unknown[]): void;
  public warn(...parameters: unknown[]): void {
    Bugfender.warn.apply(Bugfender, parameters as any);
  }

  public error(obj: unknown, ...objs: unknown[]): void;
  public error(msg: string, ...subst: unknown[]): void;
  public error(...parameters: unknown[]): void {
    Bugfender.error.apply(Bugfender, parameters as any);
  }

  public trace(obj: unknown, ...objs: unknown[]): void;
  public trace(msg: string, ...subst: unknown[]): void;
  public trace(...parameters: unknown[]): void {
    Bugfender.trace.apply(Bugfender, parameters as any);
  }

  public info(obj: unknown, ...objs: unknown[]): void;
  public info(msg: string, ...subst: unknown[]): void;
  public info(...parameters: unknown[]): void {
    Bugfender.info.apply(Bugfender, parameters as any);
  }

  public fatal(obj: unknown, ...objs: unknown[]): void;
  public fatal(msg: string, ...subst: unknown[]): void;
  public fatal(...parameters: unknown[]): void {
    Bugfender.fatal.apply(Bugfender, parameters as any);
  }

  public removeDeviceKey(key: string): void {
    Bugfender.removeDeviceKey(key);
  }

  public sendLog(log: LogEntry): void {
    Bugfender.sendLog(log);
  }

  public sendIssue(title: string, text: string): Promise<string> {
    return Bugfender.sendIssue(title, text);
  }

  public sendCrash(title: string, text: string): Promise<string> {
    return Bugfender.sendCrash(title, text);
  }

  public sendUserFeedback(title: string, text: string): Promise<string> {
    return Bugfender.sendUserFeedback(title, text);
  }

  public setDeviceKey(key: string, value: DeviceKeyValue): void {
    Bugfender.setDeviceKey(key, value);
  }

  public setForceEnabled(state: boolean): void {
    Bugfender.setForceEnabled(state);
  }
}
