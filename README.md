# @bugfender/capacitor

Remote logging, crash reporting and in-app user feedback with [Bugfender](https://bugfender.com) and [Capacitor](https://capacitorjs.com).

This module is a plugin for Capacitor since version 4. You can use `@bugfender/capacitor` in Ionic projects for iOS, Android, web and electron platforms.

## Installation

```bash
npm install @bugfender/capacitor @bugfender/sdk @bugfender/common
npx cap sync
```

## Usage

Import Bugfender like this:

```bash
import { Bugfender } from '@bugfender/capacitor';
```

**Note:** in an Ionic/Capacitor project, always import `@bugfender/capacitor` instead of `@bugfender/sdk`. 
This will enable the native features of the SDK that you wouldn't get otherwise.

### Network logging

Network logging is **opt-in** and disabled by default. When enabled, HTTP requests appear in Bugfender as logs tagged `bf_network`.

```typescript
Bugfender.setNetworkLoggingEnabled(true);
// Optional:
Bugfender.setNetworkLoggingCaptureBodies(false);
Bugfender.setNetworkLoggingCaptureErrorResponseBodies(true);
Bugfender.setNetworkLoggingURLFilter(
  ['https://api.example.com/*'],
  ['*/secrets/*']
);
Bugfender.setNetworkLoggingMaxRequestsPerMinute(60);

// Optional: redact sensitive headers/bodies before they are logged
Bugfender.setNetworkLoggingRequestObfuscationHandler((url, headers, body) => ({
  url,
  headers: { ...headers, authorization: '[REDACTED]' },
  body,
}));
Bugfender.setNetworkLoggingResponseObfuscationHandler((headers, body) => ({
  headers,
  body: body ? body.replace(/"token":"[^"]*"/g, '"token":"[REDACTED]"') : null,
}));
```

You can also enable it at init time with `networkLoggingEnabled`, `networkLoggingCaptureBodies`, and `networkLoggingCaptureErrorResponseBodies`.

Platform notes:

- **iOS:** URLSession traffic is captured (including Capacitor HTTP when it uses URLSession). Requires Bugfender iOS SDK **3.0.1+**.
- **Android:** OkHttp traffic is captured via the `android-okhttp` adapter. Requires Bugfender Android SDK **4.x**.
- **Web / Electron:** Uses `@bugfender/sdk` (≥ 4.0.0), which intercepts `fetch` and `XMLHttpRequest`.

## API

Please check the following URL for a complete API reference: [https://js.bugfender.com](https://js.bugfender.com).

<docgen-index>

* [`init(...)`](#init)
* [`forceSendOnce()`](#forcesendonce)
* [`getDeviceURL()`](#getdeviceurl)
* [`getSessionURL()`](#getsessionurl)
* [`getUserFeedback(...)`](#getuserfeedback)
* [`log(...)`](#log)
* [`log(...)`](#log)
* [`warn(...)`](#warn)
* [`warn(...)`](#warn)
* [`error(...)`](#error)
* [`error(...)`](#error)
* [`trace(...)`](#trace)
* [`trace(...)`](#trace)
* [`info(...)`](#info)
* [`info(...)`](#info)
* [`fatal(...)`](#fatal)
* [`fatal(...)`](#fatal)
* [`removeDeviceKey(...)`](#removedevicekey)
* [`sendLog(...)`](#sendlog)
* [`sendIssue(...)`](#sendissue)
* [`sendCrash(...)`](#sendcrash)
* [`sendUserFeedback(...)`](#senduserfeedback)
* [`setDeviceKey(...)`](#setdevicekey)
* [`setForceEnabled(...)`](#setforceenabled)
* [`setSDKType(...)`](#setsdktype)
* [`setNetworkLoggingEnabled(...)`](#setnetworkloggingenabled)
* [`setNetworkLoggingCaptureBodies(...)`](#setnetworkloggingcapturebodies)
* [`setNetworkLoggingCaptureErrorResponseBodies(...)`](#setnetworkloggingcaptureerrorresponsebodies)
* [`setNetworkLoggingRequestObfuscationHandler(...)`](#setnetworkloggingrequestobfuscationhandler)
* [`setNetworkLoggingResponseObfuscationHandler(...)`](#setnetworkloggingresponseobfuscationhandler)
* [`setNetworkLoggingURLFilter(...)`](#setnetworkloggingurlfilter)
* [`setNetworkLoggingMaxRequestsPerMinute(...)`](#setnetworkloggingmaxrequestsperminute)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### init(...)

```typescript
init(options: SDKOptions) => Promise<void>
```

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#sdkoptions">SDKOptions</a></code> |

--------------------


### forceSendOnce()

```typescript
forceSendOnce() => void
```

--------------------


### getDeviceURL()

```typescript
getDeviceURL() => Promise<string>
```

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### getSessionURL()

```typescript
getSessionURL() => Promise<string>
```

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### getUserFeedback(...)

```typescript
getUserFeedback(options?: UserFeedbackOptions | undefined) => Promise<UserFeedbackResult>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code><a href="#userfeedbackoptions">UserFeedbackOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#userfeedbackresult">UserFeedbackResult</a>&gt;</code>

--------------------


### log(...)

```typescript
log(obj: unknown, ...objs: unknown[]) => void
```

| Param      | Type                   |
| ---------- | ---------------------- |
| **`obj`**  | <code>unknown</code>   |
| **`objs`** | <code>unknown[]</code> |

--------------------


### log(...)

```typescript
log(msg: string, ...subst: unknown[]) => void
```

| Param       | Type                   |
| ----------- | ---------------------- |
| **`msg`**   | <code>string</code>    |
| **`subst`** | <code>unknown[]</code> |

--------------------


### warn(...)

```typescript
warn(obj: unknown, ...objs: unknown[]) => void
```

| Param      | Type                   |
| ---------- | ---------------------- |
| **`obj`**  | <code>unknown</code>   |
| **`objs`** | <code>unknown[]</code> |

--------------------


### warn(...)

```typescript
warn(msg: string, ...subst: unknown[]) => void
```

| Param       | Type                   |
| ----------- | ---------------------- |
| **`msg`**   | <code>string</code>    |
| **`subst`** | <code>unknown[]</code> |

--------------------


### error(...)

```typescript
error(obj: unknown, ...objs: unknown[]) => void
```

| Param      | Type                   |
| ---------- | ---------------------- |
| **`obj`**  | <code>unknown</code>   |
| **`objs`** | <code>unknown[]</code> |

--------------------


### error(...)

```typescript
error(msg: string, ...subst: unknown[]) => void
```

| Param       | Type                   |
| ----------- | ---------------------- |
| **`msg`**   | <code>string</code>    |
| **`subst`** | <code>unknown[]</code> |

--------------------


### trace(...)

```typescript
trace(obj: unknown, ...objs: unknown[]) => void
```

| Param      | Type                   |
| ---------- | ---------------------- |
| **`obj`**  | <code>unknown</code>   |
| **`objs`** | <code>unknown[]</code> |

--------------------


### trace(...)

```typescript
trace(msg: string, ...subst: unknown[]) => void
```

| Param       | Type                   |
| ----------- | ---------------------- |
| **`msg`**   | <code>string</code>    |
| **`subst`** | <code>unknown[]</code> |

--------------------


### info(...)

```typescript
info(obj: unknown, ...objs: unknown[]) => void
```

| Param      | Type                   |
| ---------- | ---------------------- |
| **`obj`**  | <code>unknown</code>   |
| **`objs`** | <code>unknown[]</code> |

--------------------


### info(...)

```typescript
info(msg: string, ...subst: unknown[]) => void
```

| Param       | Type                   |
| ----------- | ---------------------- |
| **`msg`**   | <code>string</code>    |
| **`subst`** | <code>unknown[]</code> |

--------------------


### fatal(...)

```typescript
fatal(obj: unknown, ...objs: unknown[]) => void
```

| Param      | Type                   |
| ---------- | ---------------------- |
| **`obj`**  | <code>unknown</code>   |
| **`objs`** | <code>unknown[]</code> |

--------------------


### fatal(...)

```typescript
fatal(msg: string, ...subst: unknown[]) => void
```

| Param       | Type                   |
| ----------- | ---------------------- |
| **`msg`**   | <code>string</code>    |
| **`subst`** | <code>unknown[]</code> |

--------------------


### removeDeviceKey(...)

```typescript
removeDeviceKey(key: string) => void
```

| Param     | Type                |
| --------- | ------------------- |
| **`key`** | <code>string</code> |

--------------------


### sendLog(...)

```typescript
sendLog(log: LogEntry) => void
```

| Param     | Type                                          |
| --------- | --------------------------------------------- |
| **`log`** | <code><a href="#logentry">LogEntry</a></code> |

--------------------


### sendIssue(...)

```typescript
sendIssue(title: string, text: string) => Promise<string>
```

| Param       | Type                |
| ----------- | ------------------- |
| **`title`** | <code>string</code> |
| **`text`**  | <code>string</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### sendCrash(...)

```typescript
sendCrash(title: string, text: string) => Promise<string>
```

| Param       | Type                |
| ----------- | ------------------- |
| **`title`** | <code>string</code> |
| **`text`**  | <code>string</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### sendUserFeedback(...)

```typescript
sendUserFeedback(title: string, text: string) => Promise<string>
```

| Param       | Type                |
| ----------- | ------------------- |
| **`title`** | <code>string</code> |
| **`text`**  | <code>string</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### setDeviceKey(...)

```typescript
setDeviceKey(key: string, value: DeviceKeyValue) => void
```

| Param       | Type                                                      |
| ----------- | --------------------------------------------------------- |
| **`key`**   | <code>string</code>                                       |
| **`value`** | <code><a href="#devicekeyvalue">DeviceKeyValue</a></code> |

--------------------


### setForceEnabled(...)

```typescript
setForceEnabled(state: boolean) => void
```

| Param       | Type                 |
| ----------- | -------------------- |
| **`state`** | <code>boolean</code> |

--------------------


### setSDKType(...)

```typescript
setSDKType(sdkType: string, version: number) => void
```

| Param         | Type                |
| ------------- | ------------------- |
| **`sdkType`** | <code>string</code> |
| **`version`** | <code>number</code> |

--------------------


### setNetworkLoggingEnabled(...)

```typescript
setNetworkLoggingEnabled(enabled: boolean) => void
```

Enable or disable network logging (default: false).

| Param         | Type                 |
| ------------- | -------------------- |
| **`enabled`** | <code>boolean</code> |

--------------------


### setNetworkLoggingCaptureBodies(...)

```typescript
setNetworkLoggingCaptureBodies(capture: boolean) => void
```

Full mode: capture request/response bodies (default: false).

| Param         | Type                 |
| ------------- | -------------------- |
| **`capture`** | <code>boolean</code> |

--------------------


### setNetworkLoggingCaptureErrorResponseBodies(...)

```typescript
setNetworkLoggingCaptureErrorResponseBodies(capture: boolean) => void
```

<a href="#error">Error</a>-only body mode: capture response body only for HTTP status &gt;= 400 (default: false).

| Param         | Type                 |
| ------------- | -------------------- |
| **`capture`** | <code>boolean</code> |

--------------------


### setNetworkLoggingRequestObfuscationHandler(...)

```typescript
setNetworkLoggingRequestObfuscationHandler(handler: ((url: string, headers: Record<string, string>, body: string | null) => { url: string; headers: Record<string, string>; body: string | null; }) | null) => void
```

Request obfuscation — (url, headers, body) =&gt; { url, headers, body }.

| Param         | Type                                                                                                                                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`handler`** | <code>((url: string, headers: <a href="#record">Record</a>&lt;string, string&gt;, body: string \| null) =&gt; { url: string; headers: <a href="#record">Record</a>&lt;string, string&gt;; body: string \| null; }) \| null</code> |

--------------------


### setNetworkLoggingResponseObfuscationHandler(...)

```typescript
setNetworkLoggingResponseObfuscationHandler(handler: ((headers: Record<string, string>, body: string | null) => { headers: Record<string, string>; body: string | null; }) | null) => void
```

Response obfuscation — (headers, body) =&gt; { headers, body }.

| Param         | Type                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`handler`** | <code>((headers: <a href="#record">Record</a>&lt;string, string&gt;, body: string \| null) =&gt; { headers: <a href="#record">Record</a>&lt;string, string&gt;; body: string \| null; }) \| null</code> |

--------------------


### setNetworkLoggingURLFilter(...)

```typescript
setNetworkLoggingURLFilter(allowlist: string[] | null, denylist: string[] | null) => void
```

URL filtering: allowlist / denylist. Null = no filter.

| Param           | Type                          |
| --------------- | ----------------------------- |
| **`allowlist`** | <code>string[] \| null</code> |
| **`denylist`**  | <code>string[] \| null</code> |

--------------------


### setNetworkLoggingMaxRequestsPerMinute(...)

```typescript
setNetworkLoggingMaxRequestsPerMinute(count: number | null) => void
```

Rate limit. Null = no limit.

| Param       | Type                        |
| ----------- | --------------------------- |
| **`count`** | <code>number \| null</code> |

--------------------


### Interfaces


#### SDKOptions

| Prop                                           | Type                                                        | Description                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`appKey`**                                   | <code>string</code>                                         | The app key to log into                                                                                                                                                                                                                                                                                     |
| **`apiURL`**                                   | <code>string</code>                                         | Base URL to Bugfender API                                                                                                                                                                                                                                                                                   |
| **`build`**                                    | <code>string</code>                                         | App build identifier                                                                                                                                                                                                                                                                                        |
| **`baseURL`**                                  | <code>string</code>                                         | Base URL to Bugfender web dashboard                                                                                                                                                                                                                                                                         |
| **`debug`**                                    | <code>boolean</code>                                        | Set SDK in debug mode                                                                                                                                                                                                                                                                                       |
| **`deviceName`**                               | <code>string</code>                                         | Device name, this will be shown on the dashboard devices list. Defaults to browser + OS.                                                                                                                                                                                                                    |
| **`overrideConsoleMethods`**                   | <code>boolean</code>                                        | Override default `window.console` so it also logs to Bugfender. Defaults to `true`.                                                                                                                                                                                                                         |
| **`printToConsole`**                           | <code>boolean</code>                                        | Print also with `window.console` when Bugfender logging methods are called. Defaults to `true`.                                                                                                                                                                                                             |
| **`logBrowserEvents`**                         | <code>boolean</code>                                        | Register a handler for most common browser events to report them to Bugfender. Defaults to `true`.                                                                                                                                                                                                          |
| **`logUIEvents`**                              | <code>boolean</code>                                        | Register a handler for most common UI events to report them to Bugfender. Defaults to `true`.                                                                                                                                                                                                               |
| **`registerErrorHandler`**                     | <code>boolean</code>                                        | Register error handler for uncaught errors that reports a crash to Bugfender. Defaults to `true`.                                                                                                                                                                                                           |
| **`ignoreException`**                          | <code><a href="#exceptionfilter">ExceptionFilter</a></code> | Configure exception filtering to ignore certain exceptions from being reported as crashes. Can be: - A function: `(info) =&gt; info.message.includes('Script error')` - An array of patterns: `['Script error', /^ResizeObserver/i]` - An object with both: `{ filter: (info) =&gt; ..., patterns: [...] }` |
| **`version`**                                  | <code>string</code>                                         | App version identifier                                                                                                                                                                                                                                                                                      |
| **`networkLoggingEnabled`**                    | <code>boolean</code>                                        | Enable network request/response capture. Defaults to `false`. **Web/JS**: requires init before use.                                                                                                                                                                                                         |
| **`networkLoggingCaptureBodies`**              | <code>boolean</code>                                        | When network logging is enabled, capture request/response bodies (full mode). Defaults to `false`.                                                                                                                                                                                                          |
| **`networkLoggingCaptureErrorResponseBodies`** | <code>boolean</code>                                        | Capture only error response bodies for HTTP status &gt;= 400 (without full body capture). Defaults to `false`.                                                                                                                                                                                              |
| **`maximumLocalStorageSize`**                  | <code>number</code>                                         | Set the maximum size to store local log files in bytes. Range accepted is from 1MB to 50MB. Defaults to 5MB. **iOS & Android only**.                                                                                                                                                                        |
| **`enableLogcatLogging`**                      | <code>boolean</code>                                        | Logs all logs written via Logcat. Defaults to `false`. **Android only**.                                                                                                                                                                                                                                    |


#### ExceptionInfo

Information about an exception that can be used to determine if it should be ignored

| Prop           | Type                                    | Description                                                                                          |
| -------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **`message`**  | <code>string</code>                     | The error message                                                                                    |
| **`error`**    | <code><a href="#error">Error</a></code> | The error object, if available                                                                       |
| **`stack`**    | <code>string</code>                     | The stack trace, if available                                                                        |
| **`filename`** | <code>string</code>                     | The filename/URL where the error occurred                                                            |
| **`line`**     | <code>number</code>                     | The line number where the error occurred                                                             |
| **`handler`**  | <code>string</code>                     | The type of handler that caught the error (e.g., '<a href="#error">Error</a>', 'UnhandledRejection') |


#### Error

| Prop          | Type                |
| ------------- | ------------------- |
| **`name`**    | <code>string</code> |
| **`message`** | <code>string</code> |
| **`stack`**   | <code>string</code> |


#### RegExp

| Prop             | Type                 | Description                                                                                                                                                          |
| ---------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`source`**     | <code>string</code>  | Returns a copy of the text of the regular expression pattern. Read-only. The regExp argument is a Regular expression object. It can be a variable name or a literal. |
| **`global`**     | <code>boolean</code> | Returns a Boolean value indicating the state of the global flag (g) used with a regular expression. Default is false. Read-only.                                     |
| **`ignoreCase`** | <code>boolean</code> | Returns a Boolean value indicating the state of the ignoreCase flag (i) used with a regular expression. Default is false. Read-only.                                 |
| **`multiline`**  | <code>boolean</code> | Returns a Boolean value indicating the state of the multiline flag (m) used with a regular expression. Default is false. Read-only.                                  |
| **`lastIndex`**  | <code>number</code>  |                                                                                                                                                                      |

| Method      | Signature                                                                     | Description                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **exec**    | (string: string) =&gt; <a href="#regexpexecarray">RegExpExecArray</a> \| null | Executes a search on a string using a regular expression pattern, and returns an array containing the results of that search. |
| **test**    | (string: string) =&gt; boolean                                                | Returns a Boolean value that indicates whether or not a pattern exists in a searched string.                                  |
| **compile** | () =&gt; this                                                                 |                                                                                                                               |


#### RegExpExecArray

| Prop        | Type                |
| ----------- | ------------------- |
| **`index`** | <code>number</code> |
| **`input`** | <code>string</code> |


#### UserFeedbackResultSuccess

| Prop              | Type                | Description                     |
| ----------------- | ------------------- | ------------------------------- |
| **`isSent`**      | <code>true</code>   | The user has sent the feedback. |
| **`feedbackURL`** | <code>string</code> | Bugfender URL for the feedback. |


#### UserFeedbackResultCancel

| Prop         | Type               | Description                                       |
| ------------ | ------------------ | ------------------------------------------------- |
| **`isSent`** | <code>false</code> | The user has closed the modal without sending it. |


#### UserFeedbackOptions

Options object for `Bugfender.getUserFeedback` with customised modal strings.

| Prop                      | Type                | Description                                                 |
| ------------------------- | ------------------- | ----------------------------------------------------------- |
| **`title`**               | <code>string</code> | Default: `Feedback`.                                        |
| **`hint`**                | <code>string</code> | Default: `Please insert your feedback here and click send`. |
| **`subjectPlaceholder`**  | <code>string</code> | Default: `Subject…`.                                        |
| **`feedbackPlaceholder`** | <code>string</code> | Default: `Your feedback…`.                                  |
| **`submitLabel`**         | <code>string</code> | Default: `Send`.                                            |
| **`closeLabel`**          | <code>string</code> | Default: `Close`. **iOS only**.                             |


#### LogEntry

Log Entry object interface

| Prop         | Type                                          | Description                                                                                               |
| ------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **`line`**   | <code>number</code>                           | The line number where the log was triggered from                                                          |
| **`level`**  | <code><a href="#loglevel">LogLevel</a></code> | The log's level based on <a href="#loglevel">LogLevel</a> constant                                        |
| **`tag`**    | <code>string</code>                           | The log's tag                                                                                             |
| **`method`** | <code>string</code>                           | The method name where the log was triggered from                                                          |
| **`file`**   | <code>string</code>                           | The file name where the log was triggered from                                                            |
| **`text`**   | <code>string \| unknown[]</code>              | Text can be either: - `string` with the content - `unknown[]` array compatible with `console.*` signature |
| **`url`**    | <code>string</code>                           | The log's origin URL. This attribute is ignored on Android & iOS                                          |


### Type Aliases


#### ExceptionFilter

Configuration for ignoring exceptions.
Can be:
- A function that receives exception info and returns boolean
- An array of patterns (strings or <a href="#regexp">RegExp</a>) to match against the error message
- A combination of both (function and patterns)

<code><a href="#exceptionfilterfunction">ExceptionFilterFunction</a> | ExceptionPattern[] | { /** Function to determine if exception should be ignored */ filter?: <a href="#exceptionfilterfunction">ExceptionFilterFunction</a>; /** Patterns to match against error message */ patterns?: ExceptionPattern[]; }</code>


#### ExceptionFilterFunction

A function that determines whether an exception should be ignored.
Return `true` to ignore the exception, `false` to report it.

<code>(info: <a href="#exceptioninfo">ExceptionInfo</a>): boolean</code>


#### ExceptionPattern

A pattern that can be used to match exception messages.
Can be a string (exact or substring match) or a <a href="#regexp">RegExp</a>.

<code>string | <a href="#regexp">RegExp</a></code>


#### UserFeedbackResult

<code><a href="#userfeedbackresultsuccess">UserFeedbackResultSuccess</a> | <a href="#userfeedbackresultcancel">UserFeedbackResultCancel</a></code>


#### DeviceKeyValue

<code>string | number | boolean</code>


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>


### Enums


#### LogLevel

| Members       | Value          |
| ------------- | -------------- |
| **`Debug`**   | <code>0</code> |
| **`Warning`** | <code>1</code> |
| **`Error`**   | <code>2</code> |
| **`Trace`**   | <code>3</code> |
| **`Info`**    | <code>4</code> |
| **`Fatal`**   | <code>5</code> |

</docgen-api>
