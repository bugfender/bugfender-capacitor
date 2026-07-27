import { Bugfender } from "@bugfender/capacitor";
import type { BugfenderPlugin } from "@bugfender/capacitor";
import type { UserFeedbackResult } from "@bugfender/common";
import { LogLevel } from "@bugfender/common";
import { Capacitor, registerPlugin } from "@capacitor/core";

import config from "../config.json";

// Raw Capacitor plugin (same native bridge as the facade wrapper). Used by the
// network suite for OkHttp/URLSession instrumented requests.
const BugfenderNative = registerPlugin<BugfenderPlugin>("Bugfender");

console.log(Bugfender);

/**
 * Local Bugfender stack (remote-logger-web) overrides.
 * Set `useLocalBugfender: false` in config.json to use production hosts.
 *
 * Hosts:
 * - Android emulator → androidEmulatorHost (usually 10.0.2.2)
 * - Physical device / iOS → localHost (your machine LAN IP)
 */
const useLocal = Boolean(config.useLocalBugfender);
const localHost =
  Capacitor.getPlatform() === "android"
    ? config.androidEmulatorHost || "10.0.2.2"
    : config.localHost;
const apiURL = useLocal
  ? `http://${localHost}:${config.localApiPort || 3100}/`
  : undefined;
const baseURL = useLocal
  ? `https://${localHost}:${config.localBasePort || 3000}/`
  : undefined;

function setStatus(message: string): void {
  const el = document.getElementById("status_message");
  if (el) {
    el.textContent = message;
  }
  console.log(message);
}

function registerNetworkObfuscationHandlers(): void {
  Bugfender.setNetworkLoggingRequestObfuscationHandler(
    (url, headers, body) => {
      const safeHeaders = { ...headers, Authorization: "***REDACTED***" };
      delete safeHeaders.authorization;
      const safeBody =
        body?.replace(
          /"password"\s*:\s*"[^"]*"/,
          '"password":"***REDACTED***"',
        ) ?? null;
      Bugfender.log(
        `obfuscate-request called url=${url} auth=${safeHeaders.Authorization}`,
      );
      return { url, headers: safeHeaders, body: safeBody };
    },
  );
  Bugfender.setNetworkLoggingResponseObfuscationHandler((headers, body) => {
    const safeHeaders = { ...headers, "Set-Cookie": "***REDACTED***" };
    Bugfender.log("obfuscate-response called");
    return { headers: safeHeaders, body };
  });
}

/**
 * Per-request helper: native OkHttp/URLSession via Bugfender plugin so
 * bf_network capture + obfuscation handlers run (CapacitorHttp uses
 * HttpURLConnection on Android and is invisible to the OkHttp adapter).
 * Falls back to fetch on web.
 */
async function suiteFetch(
  label: string,
  url: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
): Promise<string> {
  try {
    if (Capacitor.isNativePlatform()) {
      const result = await BugfenderNative.sendInstrumentedNetworkRequest({
        url,
        method: init?.method ?? "GET",
        headers: init?.headers,
        body: init?.body ?? null,
      });
      return `${label} status=${result.status} capture=${result.shouldCapture}`;
    }

    const response = await fetch(url, {
      method: init?.method,
      headers: init?.headers,
      body: init?.body,
    });
    return `${label} status=${response.status}`;
  } catch (e) {
    const msg = `${label} failed: ${e}`;
    console.warn(msg);
    Bugfender.warn(msg);
    return msg;
  }
}

async function sendTestNetworkRequest(): Promise<void> {
  try {
    const line = await suiteFetch("button", "https://example.com/", {
      method: "POST",
      headers: {
        Authorization: "Bearer button-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ping: true, password: "button-secret" }),
    });
    Bugfender.forceSendOnce();
    setStatus(`${line} — check bf_network / Network tab`);
  } catch (e) {
    Bugfender.error(`Test network request failed: ${e}`);
    setStatus(`Network request failed: ${e}`);
  }
}

async function runNetworkLoggingSuite(): Promise<void> {
  const lines: string[] = [];

  try {
    // 1) Enable + body capture + obfuscation handlers
    Bugfender.setNetworkLoggingEnabled(true);
    Bugfender.setNetworkLoggingCaptureBodies(true);
    Bugfender.setNetworkLoggingCaptureErrorResponseBodies(false);
    Bugfender.setNetworkLoggingURLFilter(null, null);
    Bugfender.setNetworkLoggingMaxRequestsPerMinute(null);
    registerNetworkObfuscationHandlers();

    // 2) Captured + obfuscated POST
    lines.push(
      await suiteFetch("obfuscated POST", "https://example.com/login", {
        method: "POST",
        headers: {
          Authorization: "Bearer secret-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: "sirAlif", password: "super-secret" }),
      }),
    );

    // 3) Denylist should skip capture
    Bugfender.setNetworkLoggingURLFilter(null, ["*/denied/*"]);
    lines.push(
      await suiteFetch("denylist", "https://example.com/denied/secret"),
    );

    // 4) Allowlist should only capture matching URLs
    Bugfender.setNetworkLoggingURLFilter(
      ["https://example.com/allowed/*"],
      null,
    );
    const allowedMiss = await suiteFetch(
      "allow miss",
      "https://example.com/other",
    );
    const allowedHit = await suiteFetch(
      "allow hit",
      "https://example.com/allowed/item",
    );
    lines.push(`${allowedMiss} | ${allowedHit}`);

    // 5) Error-body-only mode
    Bugfender.setNetworkLoggingURLFilter(null, null);
    Bugfender.setNetworkLoggingCaptureBodies(false);
    Bugfender.setNetworkLoggingCaptureErrorResponseBodies(true);
    lines.push(
      await suiteFetch(
        "error-body mode",
        "https://example.com/not-found-bf-test",
      ),
    );

    // 6) Rate limit smoke
    Bugfender.setNetworkLoggingCaptureBodies(true);
    Bugfender.setNetworkLoggingMaxRequestsPerMinute(1);
    const rate1 = await suiteFetch("rate1", "https://example.com/rate-1");
    const rate2 = await suiteFetch("rate2", "https://example.com/rate-2");
    lines.push(`${rate1} | ${rate2}`);

    // Reset for interactive button
    Bugfender.setNetworkLoggingMaxRequestsPerMinute(null);
    Bugfender.setNetworkLoggingURLFilter(null, null);
    Bugfender.setNetworkLoggingCaptureBodies(true);

    Bugfender.log(`network-suite: ${lines.join(" | ")}`);
    Bugfender.forceSendOnce();

    const anyFailed = lines.some((l) => l.includes(" failed:"));
    setStatus(
      (anyFailed
        ? "Network suite finished with some request errors — check bf_network / Network tab\n"
        : "Network suite finished — check bf_network / Network tab\n") +
        lines.join("\n"),
    );
  } catch (e) {
    console.error("Suite failed:", e);
    Bugfender.error(`Network suite failed: ${e}`);
    // Still flush whatever was captured before the unexpected abort.
    try {
      Bugfender.forceSendOnce();
    } catch {
      /* ignore */
    }
    setStatus(`Suite failed: ${e}`);
  }
}

const bfPromise = Bugfender.init({
  appKey: config.appKey,
  ...(apiURL ? { apiURL } : {}),
  ...(baseURL ? { baseURL } : {}),
  overrideConsoleMethods: true,
  printToConsole: true,
  registerErrorHandler: true,
  // Exercise network logging when present on this branch
  networkLoggingEnabled: true,
  networkLoggingCaptureBodies: true,
});

console.log(
  "Executing on %s (local Bugfender: %s)",
  Capacitor.getPlatform(),
  useLocal,
);
Bugfender.log("Hello from Capacitor!");

bfPromise.then(async () => {
  console.log("Bugfender initialized");

  // Register early so button requests and the network suite both redact secrets.
  registerNetworkObfuscationHandlers();

  (document.getElementById("session_url_link") as HTMLLinkElement).href =
    await Bugfender.getSessionURL();
  (document.getElementById("device_url_link") as HTMLLinkElement).href =
    await Bugfender.getDeviceURL();

  setStatus("Bugfender ready — obfuscation handlers registered");
});

document
  .getElementById("send_logs_btn")
  ?.addEventListener("click", function () {
    Bugfender.sendLog({
      level: LogLevel.Debug,
      tag: "REACT",
      text: "Im being called from Capacitor!",
    });

    Bugfender.log("Log without break lines in the middle of the message");
    Bugfender.log("Log with break lines \n\n in the middle of the message");
    Bugfender.warn("Warn log");
    Bugfender.error("Error log");
    Bugfender.fatal("Fatal log");
    Bugfender.trace("Trace log");
    Bugfender.info("Info log");

    console.log("Log from console");
    console.warn("Warn log from console");
    console.error("Error log from console");
    console.debug("Debug log from console");
    console.trace("Trace log from console");
    console.info("Info log from console");

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Debug,
      tag: "tag",
      method: "method",
      file: "file",
      text: "Sending low level debug log.",
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Error,
      tag: "tag",
      method: "method",
      file: "file",
      text: "Sending low level error log.",
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Warning,
      tag: "tag",
      method: "method",
      file: "file",
      text: "Sending low level warn log.",
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Fatal,
      tag: "tag",
      method: "method",
      file: "file",
      text: "Sending low level fatal log.",
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Info,
      tag: "tag",
      method: "method",
      file: "file",
      text: "Sending low level info log.",
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Trace,
      tag: "tag",
      method: "method",
      file: "file",
      text: "Sending low level trace log.",
    });

    Bugfender.setDeviceKey("device.key.string", "fake.string.value");
    Bugfender.setDeviceKey("device.key.boolean", true);
    Bugfender.setDeviceKey("device.key.float", 10.1);
    Bugfender.setDeviceKey("device.key.integer", 102);
    Bugfender.setDeviceKey("device.key.integer2", 104);
    Bugfender.removeDeviceKey("device.key.integer2");

    Bugfender.sendIssue("Issue One", "Issue Message One").then((url: string) =>
      console.log("Issue url: %s", url),
    );
    Bugfender.sendIssue("Issue Two", "Issue Message Two").then((url: string) =>
      console.log("Issue url: %s", url),
    );
    Bugfender.sendIssue("Issue Three", "Issue Message Three").then(
      (url: string) => console.log("Issue url: %s", url),
    );
    Bugfender.sendCrash("Crash title", "Crash text").then((url: string) =>
      console.log("Crash url: %s", url),
    );
    Bugfender.sendUserFeedback("User feedback", "User feedback message").then(
      (url: string) => console.log("Feedback url: %s", url),
    );
    Bugfender.getDeviceURL().then((url: string) =>
      console.log("Device url: %s", url),
    );
    Bugfender.getSessionURL().then((url: string) =>
      console.log("Session url: %s", url),
    );

    Bugfender.forceSendOnce();

    Bugfender.setForceEnabled(true);

    Bugfender.setForceEnabled(false);
  });

document
  .getElementById("send_test_network_btn")
  ?.addEventListener("click", () => {
    void sendTestNetworkRequest();
  });

document
  .getElementById("rerun_network_suite_btn")
  ?.addEventListener("click", () => {
    setStatus("Running network suite...");
    void runNetworkLoggingSuite();
  });

document
  .getElementById("generate_js_crash_btn")
  ?.addEventListener("click", function () {
    // Force crash
    const date = new Date(); //Current Date
    const hours = date.getHours(); //Current Hours
    const min = date.getMinutes(); //Current Minutes
    const sec = date.getSeconds(); //Current Seconds
    throw new Error("Force crash" + "Time: " + hours + ":" + min + ":" + sec);
  });

document
  .getElementById("native_feedback_btn")
  ?.addEventListener("click", function () {
    Bugfender.getUserFeedback({
      title: "Feedback",
      // hint: 'Please send us your feedback',
      // subjectPlaceholder: 'This is the reason',
      // feedbackPlaceholder: 'This is the full message',
      // submitLabel: 'Send',
      // closeLabel: 'Cancel',
    }).then((response: UserFeedbackResult) => {
      if (response.isSent) {
        console.log("Feedback sent with url:", response.feedbackURL);
      } else {
        console.log("Feedback not sent");
      }
    });
  });

document
  .getElementById("console_compat_logtext_btn")
  ?.addEventListener("click", () => {
    Bugfender.sendLog({
      text: ["This is a console.* template: %s", "value"],
    });

    Bugfender.sendLog({
      text: ["Just handles array of mixed values", true, 42, { foo: "bar" }],
    });
  });
