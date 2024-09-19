import Foundation
import Capacitor
import BugfenderSDK

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(BugfenderPlugin)
public class BugfenderPlugin: CAPPlugin {

    @objc func `init`(_ call: CAPPluginCall) {
        // MARK: before init
        if let deviceName = call.getString("deviceName") {
            Bugfender.overrideDeviceName(deviceName)
        }

        if let apiURL = URL(string: call.getString("apiURL", "")) {
            Bugfender.setApiURL(apiURL)
        }

        if let baseURL = URL(string: call.getString("baseURL", "")) {
            Bugfender.setBaseURL(baseURL)
        }

        // MARK: init
        Bugfender.activateLogger(call.getString("appKey")!)

        // MARK: after init
        if let maximumLocalStorageSize = call.getInt("maximumLocalStorageSize") {
            Bugfender.setMaximumLocalStorageSize(UInt(maximumLocalStorageSize))
        }

        let logUIEvents = call.getBool("logUIEvents", false)
        if logUIEvents {
            Bugfender.enableUIEventLogging()
        }

        let registerErrorHandler = call.getBool("registerErrorHandler", false)
        if registerErrorHandler {
            Bugfender.enableCrashReporting()
        }

        call.resolve()
    }

    @objc func forceSendOnce(_ call: CAPPluginCall) {
        Bugfender.forceSendOnce()
        call.resolve()
    }

    @objc func getDeviceURL(_ call: CAPPluginCall) {
        let url = Bugfender.deviceIdentifierUrl()
        if let url = url?.absoluteString {
            call.resolve(["url": url])
        } else {
            call.reject("Bugfender SDK is not initialized. You should call first to the method Bugfender.init()")
        }
    }

    @objc func getSessionURL(_ call: CAPPluginCall) {
        let url = Bugfender.sessionIdentifierUrl()
        if let url = url?.absoluteString {
            call.resolve(["url": url])
        } else {
            call.reject("Bugfender SDK is not initialized. You should call first to the method Bugfender.init()")
        }
    }

    @objc func getUserFeedback(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let feedbackViewController = BFUserFeedbackNavigationController.userFeedbackViewController(
                withTitle: call.getString("title")!,
                hint: call.getString("hint")!,
                subjectPlaceholder: call.getString("subjectPlaceholder")!,
                messagePlaceholder: call.getString("feedbackPlaceholder")!,
                sendButtonTitle: call.getString("submitLabel")!,
                cancelButtonTitle: call.getString("closeLabel")!) { (sent, feedbackUrl) in
                if sent == true,
                   let url = feedbackUrl?.absoluteString {
                    call.resolve(["url": url])
                } else {
                    call.reject("Feedback not sent")
                }
            }

            self.bridge?.viewController?.present(feedbackViewController, animated: true, completion: nil)
        }
    }

    @objc func log(_ call: CAPPluginCall) {
        BFLog(call.getString("text")!)
        call.resolve()
    }

    @objc func warn(_ call: CAPPluginCall) {
        BFLogWarn(call.getString("text")!)
        call.resolve()
    }

    @objc func error(_ call: CAPPluginCall) {
        BFLogErr(call.getString("text")!)
        call.resolve()
    }

    @objc func trace(_ call: CAPPluginCall) {
        BFLogTrace(call.getString("text")!)
        call.resolve()
    }

    @objc func info(_ call: CAPPluginCall) {
        BFLogInfo(call.getString("text")!)
        call.resolve()
    }

    @objc func fatal(_ call: CAPPluginCall) {
        BFLogFatal(call.getString("text")!)
        call.resolve()
    }

    @objc func removeDeviceKey(_ call: CAPPluginCall) {
        Bugfender.removeDeviceKey(call.getString("key")!)
        call.resolve()
    }

    @objc func sendCrash(_ call: CAPPluginCall) {
        let url = Bugfender.sendCrash(withTitle: call.getString("title")!, text: call.getString("text")!)
        if let url = url?.absoluteString {
            call.resolve(["url": url])
        } else {
            call.reject("Bugfender SDK is not initialized. You should call first to the method Bugfender.init()")
        }
    }

    @objc func sendIssue(_ call: CAPPluginCall) {
        let url = Bugfender.sendIssueReturningUrl(withTitle: call.getString("title")!, text: call.getString("text")!)
        if let url = url?.absoluteString {
            call.resolve(["url": url])
        } else {
            call.reject("Bugfender SDK is not initialized. You should call first to the method Bugfender.init()")
        }
    }

    @objc func sendLog(_ call: CAPPluginCall) {
        Bugfender.log(
            lineNumber: call.getInt("line")!,
            method: call.getString("method")!,
            file: call.getString("file")!,
            level: parseLogLevel(call.getInt("level")!),
            tag: call.getString("tag"),
            message: call.getString("text")!
        )
        call.resolve()
    }

    private func parseLogLevel(_ logLevel: Int) -> BFLogLevel {
        switch logLevel {
        case 3:
            return BFLogLevel.trace
        case 4:
            return BFLogLevel.info
        case 5:
            return BFLogLevel.fatal
        case 1:
            return BFLogLevel.warning
        case 2:
            return BFLogLevel.error
        default:
            return BFLogLevel.default
        }
    }

    @objc func sendUserFeedback(_ call: CAPPluginCall) {
        let url = Bugfender.sendUserFeedbackReturningUrl(withSubject: call.getString("title")!, message: call.getString("text")!)
        if let url = url?.absoluteString {
            call.resolve(["url": url])
        } else {
            call.reject("Bugfender SDK is not initialized. You should call first to the method Bugfender.init()")
        }
    }

    @objc func setDeviceBoolean(_ call: CAPPluginCall) {
        let key =  call.getString("key")!
        let value = call.getBool("value")!

        Bugfender.setDeviceBOOL(value, forKey: key)
        call.resolve()
    }

    @objc func setDeviceString(_ call: CAPPluginCall) {
        let key =  call.getString("key")!
        let value = call.getString("value")!

        Bugfender.setDeviceString(value, forKey: key)
        call.resolve()
    }

    @objc func setDeviceInteger(_ call: CAPPluginCall) {
        let key =  call.getString("key")!
        let value = call.getInt("value")!

        Bugfender.setDeviceInteger(UInt64(value), forKey: key)
        call.resolve()
    }

    @objc func setDeviceFloat(_ call: CAPPluginCall) {
        let key =  call.getString("key")!
        let value = call.getDouble("value")!

        Bugfender.setDeviceDouble(value, forKey: key)
        call.resolve()
    }

    @objc func setForceEnabled(_ call: CAPPluginCall) {
        Bugfender.setForceEnabled(call.getBool("state")!)
        call.resolve()
    }
}
