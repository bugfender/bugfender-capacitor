package com.bugfender.sdk.capacitor;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import androidx.activity.result.ActivityResult;
import androidx.annotation.Nullable;
import com.bugfender.sdk.Bugfender;
import com.bugfender.sdk.LogLevel;
import com.bugfender.sdk.ui.FeedbackActivity;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "Bugfender")
public class BugfenderPlugin extends Plugin {

  private static final String OBFUSCATE_REQUEST_EVENT =
    "BugfenderObfuscateNetworkRequest";
  private static final String OBFUSCATE_RESPONSE_EVENT =
    "BugfenderObfuscateNetworkResponse";

  private static class PendingObfuscation {

    final CountDownLatch latch = new CountDownLatch(1);
    final AtomicReference<JSObject> result = new AtomicReference<>();
  }

  private final ConcurrentHashMap<String, PendingObfuscation> pendingObfuscations = new ConcurrentHashMap<>();

  @PluginMethod
  public void init(PluginCall call) {
    // region before init
    String deviceName = call.getString("deviceName");
    if (deviceName != null) {
      Bugfender.overrideDeviceName(deviceName);
    }

    String apiURL = call.getString("apiURL");
    if (apiURL != null) {
      Bugfender.setApiUrl(apiURL);
    }

    String baseURL = call.getString("baseURL");
    if (baseURL != null) {
      Bugfender.setBaseUrl(baseURL);
    }
    // endregion before init

    boolean debug = call.getBoolean(
      "debug",
      call.getBoolean("printToConsole", false)
    );
    Bugfender.init(getContext(), call.getString("appKey"), debug);

    // region after init
    Integer maximumLocalStorageSize = call.getInt("maximumLocalStorageSize");
    Bugfender.setMaximumLocalStorageSize(maximumLocalStorageSize);

    boolean enableLogcatLogging = call.getBoolean("enableLogcatLogging", false);
    if (enableLogcatLogging) {
      Bugfender.enableLogcatLogging();
    }

    boolean logUIEvents = call.getBoolean("logUIEvents", false);
    if (logUIEvents) {
      Bugfender.enableUIEventLogging(getActivity().getApplication());
    }

    boolean registerErrorHandler = call.getBoolean(
      "registerErrorHandler",
      false
    );
    if (registerErrorHandler) {
      Bugfender.enableCrashReporting();
    }

    if (Boolean.TRUE.equals(call.getBoolean("networkLoggingEnabled", false))) {
      Bugfender.setNetworkLoggingEnabled(true);
    }
    if (
      Boolean.TRUE.equals(call.getBoolean("networkLoggingCaptureBodies", false))
    ) {
      Bugfender.setNetworkLoggingCaptureBodies(true);
    }
    if (
      Boolean.TRUE.equals(
        call.getBoolean("networkLoggingCaptureErrorResponseBodies", false)
      )
    ) {
      Bugfender.setNetworkLoggingCaptureErrorResponseBodies(true);
    }
    // endregion after init

    call.resolve();
  }

  @PluginMethod
  public void forceSendOnce(PluginCall call) {
    Bugfender.forceSendOnce();
    call.resolve();
  }

  @PluginMethod
  public void getDeviceURL(PluginCall call) {
    URL url = Bugfender.getDeviceUrl();
    if (url != null) {
      JSObject response = new JSObject();
      response.put("url", url.toString());
      call.resolve(response);
    } else {
      call.reject(
        "Bugfender SDK is not initialized. You should call first to the method Bugfender.init()"
      );
    }
  }

  @PluginMethod
  public void getSessionURL(PluginCall call) {
    URL url = Bugfender.getSessionUrl();
    if (url != null) {
      JSObject response = new JSObject();
      response.put("url", url.toString());
      call.resolve(response);
    } else {
      call.reject(
        "Bugfender SDK is not initialized. You should call first to the method Bugfender.init()"
      );
    }
  }

  @PluginMethod
  public void getUserFeedback(PluginCall call) {
    String title = call.getString("title");
    String hint = call.getString("hint");
    String subjectHint = call.getString("subjectPlaceholder");
    String messageHint = call.getString("feedbackPlaceholder");
    String sendButtonText = call.getString("submitLabel");
    startActivityForResult(
      call,
      Bugfender.getUserFeedbackActivityIntent(
        getActivity().getApplication(),
        title,
        hint,
        subjectHint,
        messageHint,
        sendButtonText
      ),
      "getUserFeedbackResult"
    );
  }

  @ActivityCallback
  private void getUserFeedbackResult(PluginCall call, ActivityResult result) {
    if (call == null) {
      return;
    }
    if (result.getResultCode() == Activity.RESULT_OK) {
      JSObject response = new JSObject();
      response.put(
        "url",
        result.getData().getStringExtra(FeedbackActivity.RESULT_FEEDBACK_URL)
      );
      call.resolve(response);
    } else {
      call.reject("Feedback not sent");
    }
  }

  @PluginMethod
  public void log(PluginCall call) {
    Bugfender.d("", call.getString("text"));
    call.resolve();
  }

  @PluginMethod
  public void warn(PluginCall call) {
    Bugfender.w("", call.getString("text"));
    call.resolve();
  }

  @PluginMethod
  public void error(PluginCall call) {
    Bugfender.e("", call.getString("text"));
    call.resolve();
  }

  @PluginMethod
  public void trace(PluginCall call) {
    Bugfender.t("", call.getString("text"));
    call.resolve();
  }

  @PluginMethod
  public void info(PluginCall call) {
    Bugfender.i("", call.getString("text"));
    call.resolve();
  }

  @PluginMethod
  public void fatal(PluginCall call) {
    Bugfender.f("", call.getString("text"));
    call.resolve();
  }

  @PluginMethod
  public void removeDeviceKey(PluginCall call) {
    Bugfender.removeDeviceKey(call.getString("key"));
    call.resolve();
  }

  @PluginMethod
  public void sendCrash(PluginCall call) {
    URL url = Bugfender.sendCrash(
      call.getString("title"),
      call.getString("text")
    );
    if (url != null) {
      JSObject response = new JSObject();
      response.put("url", url.toString());
      call.resolve(response);
    } else {
      call.reject(
        "Bugfender SDK is not initialized. You should call first to the method Bugfender.init()"
      );
    }
  }

  @PluginMethod
  public void sendIssue(PluginCall call) {
    URL url = Bugfender.sendIssue(
      call.getString("title"),
      call.getString("text")
    );
    if (url != null) {
      JSObject response = new JSObject();
      response.put("url", url.toString());
      call.resolve(response);
    } else {
      call.reject(
        "Bugfender SDK is not initialized. You should call first to the method Bugfender.init()"
      );
    }
  }

  @PluginMethod
  public void sendLog(PluginCall call) {
    Bugfender.log(
      call.getInt("line"),
      call.getString("method"),
      call.getString("file"),
      parseLogLevel(call.getInt("level")),
      call.getString("tag"),
      call.getString("text")
    );
  }

  private static LogLevel parseLogLevel(int logLevel) {
    switch (logLevel) {
      case 3:
        return LogLevel.Trace;
      case 4:
        return LogLevel.Info;
      case 5:
        return LogLevel.Fatal;
      case 1:
        return LogLevel.Warning;
      case 2:
        return LogLevel.Error;
      case 0:
      default:
        return LogLevel.Debug;
    }
  }

  @PluginMethod
  public void sendUserFeedback(PluginCall call) {
    URL url = Bugfender.sendUserFeedback(
      call.getString("title"),
      call.getString("text")
    );
    if (url != null) {
      JSObject response = new JSObject();
      response.put("url", url.toString());
      call.resolve(response);
    } else {
      call.reject(
        "Bugfender SDK is not initialized. You should call first to the method Bugfender.init()"
      );
    }
  }

  @PluginMethod
  public void setDeviceBoolean(PluginCall call) {
    String key = call.getString("key");
    Boolean value = call.getBoolean("value");

    Bugfender.setDeviceBoolean(key, value);
    call.resolve();
  }

  @PluginMethod
  public void setDeviceString(PluginCall call) {
    String key = call.getString("key");
    String value = call.getString("value");

    Bugfender.setDeviceString(key, value);
    call.resolve();
  }

  @PluginMethod
  public void setDeviceInteger(PluginCall call) {
    String key = call.getString("key");
    Integer value = call.getInt("value");

    Bugfender.setDeviceInteger(key, value);
    call.resolve();
  }

  @PluginMethod
  public void setDeviceFloat(PluginCall call) {
    String key = call.getString("key");
    Float value = call.getFloat("value");

    Bugfender.setDeviceFloat(key, value);
    call.resolve();
  }

  @PluginMethod
  public void setForceEnabled(PluginCall call) {
    Bugfender.setForceEnabled(call.getBoolean("state"));
    call.resolve();
  }

  @PluginMethod
  public void setNetworkLoggingEnabled(PluginCall call) {
    Bugfender.setNetworkLoggingEnabled(
      Boolean.TRUE.equals(call.getBoolean("enabled", false))
    );
    call.resolve();
  }

  @PluginMethod
  public void setNetworkLoggingCaptureBodies(PluginCall call) {
    Bugfender.setNetworkLoggingCaptureBodies(
      Boolean.TRUE.equals(call.getBoolean("capture", false))
    );
    call.resolve();
  }

  @PluginMethod
  public void setNetworkLoggingCaptureErrorResponseBodies(PluginCall call) {
    Bugfender.setNetworkLoggingCaptureErrorResponseBodies(
      Boolean.TRUE.equals(call.getBoolean("capture", false))
    );
    call.resolve();
  }

  @PluginMethod
  public void setNetworkLoggingURLFilter(PluginCall call) {
    Bugfender.setNetworkLoggingURLFilter(
      toStringList(call.getArray("allowlist")),
      toStringList(call.getArray("denylist"))
    );
    call.resolve();
  }

  @PluginMethod
  public void setNetworkLoggingMaxRequestsPerMinute(PluginCall call) {
    if (!call.getData().has("count") || call.getData().isNull("count")) {
      Bugfender.setNetworkLoggingMaxRequestsPerMinute(null);
    } else {
      Bugfender.setNetworkLoggingMaxRequestsPerMinute(call.getInt("count"));
    }
    call.resolve();
  }

  @PluginMethod
  public void setNetworkLoggingRequestObfuscationHandlerEnabled(
    PluginCall call
  ) {
    setObfuscationHandler(
      "setNetworkLoggingRequestObfuscationHandler",
      Boolean.TRUE.equals(call.getBoolean("enabled", false))
        ? createRequestObfuscationHandler()
        : null
    );
    call.resolve();
  }

  @PluginMethod
  public void setNetworkLoggingResponseObfuscationHandlerEnabled(
    PluginCall call
  ) {
    setObfuscationHandler(
      "setNetworkLoggingResponseObfuscationHandler",
      Boolean.TRUE.equals(call.getBoolean("enabled", false))
        ? createResponseObfuscationHandler()
        : null
    );
    call.resolve();
  }

  @PluginMethod
  public void completeNetworkObfuscation(PluginCall call) {
    String requestId = call.getString("requestId");
    if (requestId == null) {
      call.resolve();
      return;
    }
    PendingObfuscation pending = pendingObfuscations.get(requestId);
    if (pending != null) {
      pending.result.set(call.getObject("result"));
      pending.latch.countDown();
    }
    call.resolve();
  }

  /**
   * Android SDK 4.0.1 ships R8-obfuscated handler types. Resolve them via
   * reflection so this plugin compiles against the published Maven artifact.
   */
  private void setObfuscationHandler(String methodName, Object handler) {
    try {
      Method setter = findBugfenderMethod(methodName, 1);
      if (setter == null) {
        return;
      }
      setter.invoke(null, handler);
    } catch (Exception ignored) {
      // Optional API; ignore if unavailable.
    }
  }

  @Nullable
  private static Method findBugfenderMethod(String name, int paramCount) {
    for (Method method : Bugfender.class.getMethods()) {
      if (
        name.equals(method.getName()) &&
        method.getParameterTypes().length == paramCount
      ) {
        return method;
      }
    }
    return null;
  }

  @Nullable
  private Object createRequestObfuscationHandler() {
    Method setter = findBugfenderMethod(
      "setNetworkLoggingRequestObfuscationHandler",
      1
    );
    if (setter == null) {
      return null;
    }
    Class<?> handlerType = setter.getParameterTypes()[0];
    return Proxy.newProxyInstance(
      handlerType.getClassLoader(),
      new Class<?>[] { handlerType },
      (proxy, method, args) -> {
        if (method.getDeclaringClass() == Object.class) {
          return invokeObjectMethod(proxy, method, args);
        }
        if (args == null || args.length < 3) {
          return null;
        }
        String url = args[0] instanceof String ? (String) args[0] : "";
        @SuppressWarnings("unchecked")
        Map<String, String> headers = args[1] instanceof Map
          ? (Map<String, String>) args[1]
          : new HashMap<>();
        String body = args[2] instanceof String ? (String) args[2] : null;

        JSObject payload = new JSObject();
        payload.put("url", url != null ? url : "");
        payload.put("headers", toJSObject(headers));
        payload.put("body", body);

        JSObject response = invokeJsObfuscation(
          OBFUSCATE_REQUEST_EVENT,
          payload
        );
        String obfuscatedUrl = url;
        Map<String, String> obfuscatedHeaders = headers;
        String obfuscatedBody = body;
        if (response != null) {
          if (response.has("url") && !response.isNull("url")) {
            obfuscatedUrl = response.getString("url");
          }
          obfuscatedHeaders =
            headersFromJSObject(response.getJSObject("headers"));
          obfuscatedBody = null;
          if (response.has("body") && !response.isNull("body")) {
            obfuscatedBody = response.getString("body");
          }
        }
        return newNetworkData(
          method.getReturnType(),
          obfuscatedUrl,
          obfuscatedHeaders,
          obfuscatedBody
        );
      }
    );
  }

  @Nullable
  private Object createResponseObfuscationHandler() {
    Method setter = findBugfenderMethod(
      "setNetworkLoggingResponseObfuscationHandler",
      1
    );
    if (setter == null) {
      return null;
    }
    Class<?> handlerType = setter.getParameterTypes()[0];
    return Proxy.newProxyInstance(
      handlerType.getClassLoader(),
      new Class<?>[] { handlerType },
      (proxy, method, args) -> {
        if (method.getDeclaringClass() == Object.class) {
          return invokeObjectMethod(proxy, method, args);
        }
        if (args == null || args.length < 2) {
          return null;
        }
        @SuppressWarnings("unchecked")
        Map<String, String> headers = args[0] instanceof Map
          ? (Map<String, String>) args[0]
          : new HashMap<>();
        String body = args[1] instanceof String ? (String) args[1] : null;

        JSObject payload = new JSObject();
        payload.put("headers", toJSObject(headers));
        payload.put("body", body);

        JSObject response = invokeJsObfuscation(
          OBFUSCATE_RESPONSE_EVENT,
          payload
        );
        Map<String, String> obfuscatedHeaders = headers;
        String obfuscatedBody = body;
        if (response != null) {
          obfuscatedHeaders =
            headersFromJSObject(response.getJSObject("headers"));
          obfuscatedBody = null;
          if (response.has("body") && !response.isNull("body")) {
            obfuscatedBody = response.getString("body");
          }
        }
        return newNetworkData(
          method.getReturnType(),
          null,
          obfuscatedHeaders,
          obfuscatedBody
        );
      }
    );
  }

  @Nullable
  private static Object newNetworkData(
    Class<?> type,
    @Nullable String url,
    Map<String, String> headers,
    @Nullable String body
  ) throws Exception {
    for (Constructor<?> constructor : type.getConstructors()) {
      Class<?>[] params = constructor.getParameterTypes();
      if (
        params.length == 3 &&
        params[0] == String.class &&
        Map.class.isAssignableFrom(params[1]) &&
        params[2] == String.class
      ) {
        return constructor.newInstance(url, headers, body);
      }
      if (
        params.length == 2 &&
        Map.class.isAssignableFrom(params[0]) &&
        params[1] == String.class
      ) {
        return constructor.newInstance(headers, body);
      }
    }
    return null;
  }

  private static Object invokeObjectMethod(
    Object proxy,
    Method method,
    @Nullable Object[] args
  ) {
    String name = method.getName();
    if ("toString".equals(name)) {
      return "BugfenderNetworkObfuscationHandlerProxy";
    }
    if ("hashCode".equals(name)) {
      return System.identityHashCode(proxy);
    }
    if ("equals".equals(name)) {
      return proxy == (args != null && args.length > 0 ? args[0] : null);
    }
    return null;
  }

  @Nullable
  private JSObject invokeJsObfuscation(String eventName, JSObject body) {
    // Avoid deadlocking the UI thread while waiting for JS.
    if (Looper.myLooper() == Looper.getMainLooper()) {
      return null;
    }

    String requestId = UUID.randomUUID().toString();
    PendingObfuscation pending = new PendingObfuscation();
    pendingObfuscations.put(requestId, pending);
    body.put("requestId", requestId);

    new Handler(Looper.getMainLooper())
      .post(() -> notifyListeners(eventName, body));

    try {
      if (!pending.latch.await(3, TimeUnit.SECONDS)) {
        pendingObfuscations.remove(requestId);
        return null;
      }
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      pendingObfuscations.remove(requestId);
      return null;
    }

    pendingObfuscations.remove(requestId);
    return pending.result.get();
  }

  private static JSObject toJSObject(@Nullable Map<String, String> headers) {
    JSObject map = new JSObject();
    if (headers == null) {
      return map;
    }
    for (Map.Entry<String, String> entry : headers.entrySet()) {
      if (entry.getKey() != null) {
        map.put(
          entry.getKey(),
          entry.getValue() != null ? entry.getValue() : ""
        );
      }
    }
    return map;
  }

  private static Map<String, String> headersFromJSObject(
    @Nullable JSObject map
  ) {
    Map<String, String> result = new HashMap<>();
    if (map == null) {
      return result;
    }
    Iterator<String> keys = map.keys();
    while (keys.hasNext()) {
      String key = keys.next();
      try {
        if (map.isNull(key)) {
          result.put(key, "");
        } else {
          Object value = map.get(key);
          result.put(key, value != null ? String.valueOf(value) : "");
        }
      } catch (JSONException ignored) {
        result.put(key, "");
      }
    }
    return result;
  }

  @Nullable
  private static List<String> toStringList(@Nullable JSArray array) {
    if (array == null) {
      return null;
    }
    List<String> list = new ArrayList<>();
    try {
      for (int i = 0; i < array.length(); i++) {
        Object value = array.get(i);
        if (value != null && value != JSONObject.NULL) {
          list.add(String.valueOf(value));
        }
      }
    } catch (JSONException ignored) {
      // Return whatever we collected.
    }
    return list;
  }
}
