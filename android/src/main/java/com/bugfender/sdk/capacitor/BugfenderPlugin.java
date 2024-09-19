package com.bugfender.sdk.capacitor;

import android.app.Activity;
import androidx.activity.result.ActivityResult;
import com.bugfender.sdk.Bugfender;
import com.bugfender.sdk.LogLevel;
import com.bugfender.sdk.ui.FeedbackActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.net.URL;

@CapacitorPlugin(name = "Bugfender")
public class BugfenderPlugin extends Plugin {

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
}
