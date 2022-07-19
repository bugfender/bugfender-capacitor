/// <reference types="@capacitor/cli" />

import type { LogEntry, SDKOptions, UserFeedbackOptions, UserFeedbackResult} from "@bugfender/types";

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    Bugfender?: undefined;
  }
}

export interface BugfenderPlugin {

  init(options: SDKOptions): Promise<void>

  forceSendOnce(): void

  getDeviceURL(): Promise<string>

  getSessionURL(): Promise<string>

  getUserFeedback(options?: UserFeedbackOptions): Promise<UserFeedbackResult>

  log(data: { text: string }): void

  warn(data: { text: string }): void

  error(data: { text: string }): void

  trace(data: { text: string }): void

  info(data: { text: string }): void

  fatal(data: { text: string }): void

  removeDeviceKey(data: {key: string}): void

  sendCrash(data: { title: string, text: string }): Promise<string>

  sendIssue(data: { title: string, text: string }): Promise<string>

  sendLog(log: LogEntry): void

  sendUserFeedback(data: { title: string, text: string }): Promise<string>

  setDeviceBoolean(data: { key: string, value: boolean }): void

  setDeviceString(data: { key: string, value: string }): void

  setDeviceInteger(data: { key: string, value: number }): void

  setDeviceFloat(data: { key: string, value: number }): void

  setForceEnabled(data: {state: boolean}): void
}
