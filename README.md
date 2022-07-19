# @bugfender/capacitor

Remote logging with Bugfender

## Install

```bash
npm install @bugfender/capacitor
npx cap sync
```

## API

<docgen-index>

* [`init(...)`](#init)
* [`forceSendOnce()`](#forcesendonce)
* [`getDeviceURL()`](#getdeviceurl)
* [`getSessionURL()`](#getsessionurl)
* [`getUserFeedback(...)`](#getuserfeedback)
* [`log(...)`](#log)
* [`warn(...)`](#warn)
* [`error(...)`](#error)
* [`trace(...)`](#trace)
* [`info(...)`](#info)
* [`fatal(...)`](#fatal)
* [`removeDeviceKey(...)`](#removedevicekey)
* [`sendCrash(...)`](#sendcrash)
* [`sendIssue(...)`](#sendissue)
* [`sendLog(...)`](#sendlog)
* [`sendUserFeedback(...)`](#senduserfeedback)
* [`setDeviceBoolean(...)`](#setdeviceboolean)
* [`setDeviceString(...)`](#setdevicestring)
* [`setDeviceInteger(...)`](#setdeviceinteger)
* [`setDeviceFloat(...)`](#setdevicefloat)
* [`setForceEnabled(...)`](#setforceenabled)
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
log(data: { text: string; }) => void
```

| Param      | Type                           |
| ---------- | ------------------------------ |
| **`data`** | <code>{ text: string; }</code> |

--------------------


### warn(...)

```typescript
warn(data: { text: string; }) => void
```

| Param      | Type                           |
| ---------- | ------------------------------ |
| **`data`** | <code>{ text: string; }</code> |

--------------------


### error(...)

```typescript
error(data: { text: string; }) => void
```

| Param      | Type                           |
| ---------- | ------------------------------ |
| **`data`** | <code>{ text: string; }</code> |

--------------------


### trace(...)

```typescript
trace(data: { text: string; }) => void
```

| Param      | Type                           |
| ---------- | ------------------------------ |
| **`data`** | <code>{ text: string; }</code> |

--------------------


### info(...)

```typescript
info(data: { text: string; }) => void
```

| Param      | Type                           |
| ---------- | ------------------------------ |
| **`data`** | <code>{ text: string; }</code> |

--------------------


### fatal(...)

```typescript
fatal(data: { text: string; }) => void
```

| Param      | Type                           |
| ---------- | ------------------------------ |
| **`data`** | <code>{ text: string; }</code> |

--------------------


### removeDeviceKey(...)

```typescript
removeDeviceKey(data: { key: string; }) => void
```

| Param      | Type                          |
| ---------- | ----------------------------- |
| **`data`** | <code>{ key: string; }</code> |

--------------------


### sendCrash(...)

```typescript
sendCrash(data: { title: string; text: string; }) => Promise<string>
```

| Param      | Type                                          |
| ---------- | --------------------------------------------- |
| **`data`** | <code>{ title: string; text: string; }</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### sendIssue(...)

```typescript
sendIssue(data: { title: string; text: string; }) => Promise<string>
```

| Param      | Type                                          |
| ---------- | --------------------------------------------- |
| **`data`** | <code>{ title: string; text: string; }</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### sendLog(...)

```typescript
sendLog(log: LogEntry) => void
```

| Param     | Type                                          |
| --------- | --------------------------------------------- |
| **`log`** | <code><a href="#logentry">LogEntry</a></code> |

--------------------


### sendUserFeedback(...)

```typescript
sendUserFeedback(data: { title: string; text: string; }) => Promise<string>
```

| Param      | Type                                          |
| ---------- | --------------------------------------------- |
| **`data`** | <code>{ title: string; text: string; }</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### setDeviceBoolean(...)

```typescript
setDeviceBoolean(data: { key: string; value: boolean; }) => void
```

| Param      | Type                                          |
| ---------- | --------------------------------------------- |
| **`data`** | <code>{ key: string; value: boolean; }</code> |

--------------------


### setDeviceString(...)

```typescript
setDeviceString(data: { key: string; value: string; }) => void
```

| Param      | Type                                         |
| ---------- | -------------------------------------------- |
| **`data`** | <code>{ key: string; value: string; }</code> |

--------------------


### setDeviceInteger(...)

```typescript
setDeviceInteger(data: { key: string; value: number; }) => void
```

| Param      | Type                                         |
| ---------- | -------------------------------------------- |
| **`data`** | <code>{ key: string; value: number; }</code> |

--------------------


### setDeviceFloat(...)

```typescript
setDeviceFloat(data: { key: string; value: number; }) => void
```

| Param      | Type                                         |
| ---------- | -------------------------------------------- |
| **`data`** | <code>{ key: string; value: number; }</code> |

--------------------


### setForceEnabled(...)

```typescript
setForceEnabled(data: { state: boolean; }) => void
```

| Param      | Type                             |
| ---------- | -------------------------------- |
| **`data`** | <code>{ state: boolean; }</code> |

--------------------


### Interfaces


#### SDKOptions

| Prop                         | Type                 | Description                                                                                        |
| ---------------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| **`appKey`**                 | <code>string</code>  | The app key to log into                                                                            |
| **`apiURL`**                 | <code>string</code>  | Base URL to Bugfender API                                                                          |
| **`build`**                  | <code>string</code>  | App build identifier                                                                               |
| **`baseURL`**                | <code>string</code>  | Base URL to Bugfender web dashboard                                                                |
| **`debug`**                  | <code>boolean</code> | Set SDK in debug mode                                                                              |
| **`deviceName`**             | <code>string</code>  | Device name, this will be shown on the dashboard devices list. Defaults to browser + OS.           |
| **`overrideConsoleMethods`** | <code>boolean</code> | Override default `window.console` so it also logs to Bugfender. Defaults to `true`.                |
| **`printToConsole`**         | <code>boolean</code> | Print also with `window.console` when Bugfender logging methods are called. Defaults to `true`.    |
| **`logBrowserEvents`**       | <code>boolean</code> | Register a handler for most common browser events to report them to Bugfender. Defaults to `true`. |
| **`logUIEvents`**            | <code>boolean</code> | Register a handler for most common UI events to report them to Bugfender. Defaults to `true`.      |
| **`registerErrorHandler`**   | <code>boolean</code> | Register error handler for uncaught errors that reports a crash to Bugfender. Defaults to `true`.  |
| **`version`**                | <code>string</code>  | App version identifier                                                                             |


#### UserFeedbackResult

| Prop              | Type                 |
| ----------------- | -------------------- |
| **`isSent`**      | <code>boolean</code> |
| **`feedbackURL`** | <code>string</code>  |


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

| Prop                      | Type                | Description                |
| ------------------------- | ------------------- | -------------------------- |
| **`title`**               | <code>string</code> | Default: `Feedback`.       |
| **`hint`**                | <code>string</code> | Default: `undefined`.      |
| **`subjectPlaceholder`**  | <code>string</code> | Default: `Subject…`.       |
| **`feedbackPlaceholder`** | <code>string</code> | Default: `Your feedback…`. |
| **`submitLabel`**         | <code>string</code> | Default: `Send`.           |


#### LogEntry

Log Entry object interface

| Prop         | Type                                          | Description                                                        |
| ------------ | --------------------------------------------- | ------------------------------------------------------------------ |
| **`line`**   | <code>number</code>                           | The line number where the log was triggered from                   |
| **`level`**  | <code><a href="#loglevel">LogLevel</a></code> | The log's level based on <a href="#loglevel">LogLevel</a> constant |
| **`tag`**    | <code>string</code>                           | The log's tag                                                      |
| **`method`** | <code>string</code>                           | The method name where the log was triggered from                   |
| **`file`**   | <code>string</code>                           | The file name where the log was triggered from                     |
| **`text`**   | <code>string</code>                           | The log's text content                                             |
| **`url`**    | <code>string</code>                           | The log's origin URL. This attribute is ignored on Android & iOS   |


### Type Aliases


#### UserFeedbackResult

<code><a href="#userfeedbackresultsuccess">UserFeedbackResultSuccess</a> | <a href="#userfeedbackresultcancel">UserFeedbackResultCancel</a></code>


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
