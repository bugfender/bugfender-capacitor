/// <reference types="@capacitor/cli" />

import type {
  LogEntry,
  SDKOptions,
  UserFeedbackOptions,
} from "@bugfender/common";
import type { PluginListenerHandle } from "@capacitor/core";

import type {
  NetworkHeaders,
  NetworkRequestData,
  NetworkResponseData,
} from "./network-logging.types";

declare module "@capacitor/cli" {
  export interface PluginsConfig {
    Bugfender?: undefined;
  }
}

export interface URLResponse {
  url: string;
}

export interface ObfuscateNetworkRequestEvent {
  requestId: string;
  url: string;
  headers: NetworkHeaders;
  body: string | null;
}

export interface ObfuscateNetworkResponseEvent {
  requestId: string;
  headers: NetworkHeaders;
  body: string | null;
}

export interface BugfenderPlugin {
  init(options: SDKOptions): Promise<void>;

  forceSendOnce(): void;

  getDeviceURL(): Promise<URLResponse>;

  getSessionURL(): Promise<URLResponse>;

  getUserFeedback(options?: UserFeedbackOptions): Promise<URLResponse>;

  log(data: { text: string }): void;

  warn(data: { text: string }): void;

  error(data: { text: string }): void;

  trace(data: { text: string }): void;

  info(data: { text: string }): void;

  fatal(data: { text: string }): void;

  removeDeviceKey(data: { key: string }): void;

  sendCrash(data: { title: string; text: string }): Promise<URLResponse>;

  sendIssue(data: { title: string; text: string }): Promise<URLResponse>;

  sendLog(log: LogEntry): void;

  sendUserFeedback(data: { title: string; text: string }): Promise<URLResponse>;

  setDeviceBoolean(data: { key: string; value: boolean }): void;

  setDeviceString(data: { key: string; value: string }): void;

  setDeviceInteger(data: { key: string; value: number }): void;

  setDeviceFloat(data: { key: string; value: number }): void;

  setForceEnabled(data: { state: boolean }): void;

  setNetworkLoggingEnabled(data: { enabled: boolean }): Promise<void>;

  setNetworkLoggingCaptureBodies(data: { capture: boolean }): Promise<void>;

  setNetworkLoggingCaptureErrorResponseBodies(data: {
    capture: boolean;
  }): Promise<void>;

  setNetworkLoggingURLFilter(data: {
    allowlist: string[] | null;
    denylist: string[] | null;
  }): Promise<void>;

  setNetworkLoggingMaxRequestsPerMinute(data: {
    count: number | null;
  }): Promise<void>;

  setNetworkLoggingRequestObfuscationHandlerEnabled(data: {
    enabled: boolean;
  }): Promise<void>;

  setNetworkLoggingResponseObfuscationHandlerEnabled(data: {
    enabled: boolean;
  }): Promise<void>;

  completeNetworkObfuscation(data: {
    requestId: string;
    result: NetworkRequestData | NetworkResponseData;
  }): Promise<void>;

  /**
   * Example / verification helper: native HTTP via OkHttp (Android) or
   * URLSession (iOS) so Bugfender network logging can observe the traffic.
   * CapacitorHttp uses HttpURLConnection on Android and is not captured.
   */
  sendInstrumentedNetworkRequest(options: {
    url: string;
    method?: string;
    headers?: NetworkHeaders;
    body?: string | null;
  }): Promise<{
    status: number;
    shouldCapture: boolean;
    requestId?: string | null;
  }>;

  addListener(
    eventName: "BugfenderObfuscateNetworkRequest",
    listenerFunc: (event: ObfuscateNetworkRequestEvent) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: "BugfenderObfuscateNetworkResponse",
    listenerFunc: (event: ObfuscateNetworkResponseEvent) => void,
  ): Promise<PluginListenerHandle>;
}
