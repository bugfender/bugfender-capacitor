/// <reference types="@capacitor/cli" />

import type {LogEntry} from "@bugfender/common";

import type {ISDKOptions} from "./types/sdk-options";
import type {UserFeedbackOptions} from "./user-feedback";

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    Bugfender?: undefined;
  }
}

interface URLResponse {
  url: string
}

export interface BugfenderPlugin {

  init(options: ISDKOptions): Promise<void>

  forceSendOnce(): void

  getDeviceURL(): Promise<URLResponse>

  getSessionURL(): Promise<URLResponse>

  getUserFeedback(options?: UserFeedbackOptions): Promise<URLResponse>

  log(data: { text: string }): void

  warn(data: { text: string }): void

  error(data: { text: string }): void

  trace(data: { text: string }): void

  info(data: { text: string }): void

  fatal(data: { text: string }): void

  removeDeviceKey(data: { key: string }): void

  sendCrash(data: { title: string, text: string }): Promise<URLResponse>

  sendIssue(data: { title: string, text: string }): Promise<URLResponse>

  sendLog(log: LogEntry): void

  sendUserFeedback(data: { title: string, text: string }): Promise<URLResponse>

  setDeviceBoolean(data: { key: string, value: boolean }): void

  setDeviceString(data: { key: string, value: string }): void

  setDeviceInteger(data: { key: string, value: number }): void

  setDeviceFloat(data: { key: string, value: number }): void

  setForceEnabled(data: { state: boolean }): void
}
