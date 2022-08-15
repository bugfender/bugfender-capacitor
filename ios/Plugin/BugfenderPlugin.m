#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(BugfenderPlugin, "Bugfender",
           CAP_PLUGIN_METHOD(init, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(forceSendOnce, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getDeviceURL, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getSessionURL, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getUserFeedback, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(log, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(warn, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(error, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(trace, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(info, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(fatal, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(removeDeviceKey, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(sendCrash, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(sendIssue, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(sendLog, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(sendUserFeedback, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setDeviceBoolean, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setDeviceString, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setDeviceInteger, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setDeviceFloat, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setForceEnabled, CAPPluginReturnPromise);
)
