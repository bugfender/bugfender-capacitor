import Foundation
import Capacitor
import BugfenderSDK

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(BugfenderPlugin)
// swiftlint:disable:next type_body_length
public class BugfenderPlugin: CAPPlugin {
    private var pendingObfuscations: [String: PendingObfuscation] = [:]
    private let pendingObfuscationsQueue = DispatchQueue(label: "com.bugfender.capacitor.obfuscation")

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

        if call.getBool("networkLoggingEnabled", false) {
            Bugfender.setNetworkLoggingEnabled(true)
        }
        if call.getBool("networkLoggingCaptureBodies", false) {
            Bugfender.setNetworkLoggingCaptureBodies(true)
        }
        if call.getBool("networkLoggingCaptureErrorResponseBodies", false) {
            Bugfender.setNetworkLoggingCaptureErrorResponseBodies(true)
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

    @objc func setNetworkLoggingEnabled(_ call: CAPPluginCall) {
        Bugfender.setNetworkLoggingEnabled(call.getBool("enabled", false))
        call.resolve()
    }

    @objc func setNetworkLoggingCaptureBodies(_ call: CAPPluginCall) {
        Bugfender.setNetworkLoggingCaptureBodies(call.getBool("capture", false))
        call.resolve()
    }

    @objc func setNetworkLoggingCaptureErrorResponseBodies(_ call: CAPPluginCall) {
        Bugfender.setNetworkLoggingCaptureErrorResponseBodies(call.getBool("capture", false))
        call.resolve()
    }

    @objc func setNetworkLoggingURLFilter(_ call: CAPPluginCall) {
        let allowlist = call.getArray("allowlist", String.self)
        let denylist = call.getArray("denylist", String.self)
        Bugfender.setNetworkLoggingURLFilter(allowlist: allowlist, denylist: denylist)
        call.resolve()
    }

    @objc func setNetworkLoggingMaxRequestsPerMinute(_ call: CAPPluginCall) {
        if call.getValue("count") == nil || call.getValue("count") is NSNull {
            Bugfender.setNetworkLoggingMaxRequestsPerMinute(nil)
        } else if let count = call.getInt("count") {
            Bugfender.setNetworkLoggingMaxRequestsPerMinute(count)
        } else {
            Bugfender.setNetworkLoggingMaxRequestsPerMinute(nil)
        }
        call.resolve()
    }

    @objc func setNetworkLoggingRequestObfuscationHandlerEnabled(_ call: CAPPluginCall) {
        if call.getBool("enabled", false) {
            installRequestObfuscationHandler()
        } else {
            Bugfender.setNetworkLoggingRequestObfuscationHandler(nil)
        }
        call.resolve()
    }

    @objc func setNetworkLoggingResponseObfuscationHandlerEnabled(_ call: CAPPluginCall) {
        if call.getBool("enabled", false) {
            installResponseObfuscationHandler()
        } else {
            Bugfender.setNetworkLoggingResponseObfuscationHandler(nil)
        }
        call.resolve()
    }

    @objc func completeNetworkObfuscation(_ call: CAPPluginCall) {
        guard let requestId = call.getString("requestId"), !requestId.isEmpty else {
            call.resolve()
            return
        }

        var pending: PendingObfuscation?
        pendingObfuscationsQueue.sync {
            pending = pendingObfuscations[requestId]
        }
        if let pending = pending {
            pending.response = call.getObject("result")
            pending.semaphore.signal()
        }
        call.resolve()
    }

    /// Example / verification helper: URLSession request so traffic appears as `bf_network`.
    @objc func sendInstrumentedNetworkRequest(_ call: CAPPluginCall) {
        let urlString = call.getString("url") ?? "https://example.com/"
        let httpMethod = (call.getString("method") ?? "GET").uppercased()
        let body = call.getString("body")
        let extraHeaders = call.getObject("headers") ?? [:]

        guard let url = URL(string: urlString) else {
            call.reject("Invalid URL")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = httpMethod
        request.timeoutInterval = 15.0

        var hasAuthorization = false
        for (key, value) in extraHeaders {
            if let stringValue = value as? String {
                request.setValue(stringValue, forHTTPHeaderField: key)
                if key.compare("Authorization", options: .caseInsensitive) == .orderedSame {
                    hasAuthorization = true
                }
            }
        }
        if !hasAuthorization {
            request.setValue("secret-token", forHTTPHeaderField: "Authorization")
        }

        if let body = body,
           !body.isEmpty,
           httpMethod == "POST" || httpMethod == "PUT" || httpMethod == "PATCH" {
            request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
            request.httpBody = body.data(using: .utf8)
        }

        let task = URLSession.shared.dataTask(with: request) { _, response, error in
            if let error = error {
                call.reject(error.localizedDescription)
                return
            }
            let status: Int
            if let httpResponse = response as? HTTPURLResponse {
                status = httpResponse.statusCode
            } else {
                status = 0
            }
            DispatchQueue.main.async {
                Bugfender.forceSendOnce()
                call.resolve([
                    "status": status,
                    "shouldCapture": true,
                    "requestId": NSNull()
                ])
            }
        }
        task.resume()
    }

    private func installRequestObfuscationHandler() {
        Bugfender.setNetworkLoggingRequestObfuscationHandler { [weak self] url, headers, body in
            guard let self = self else {
                return (url: url, headers: headers, body: body)
            }

            let response = self.invokeJSObfuscation(
                eventName: "BugfenderObfuscateNetworkRequest",
                data: [
                    "url": url,
                    "headers": headers,
                    "body": body as Any
                ]
            )
            guard let response = response else {
                return (url: url, headers: headers, body: body)
            }

            let obfuscatedUrl = response["url"] as? String ?? url
            let obfuscatedHeaders = self.stringMap(from: response["headers"])
            let obfuscatedBody = response["body"] as? String
            return (url: obfuscatedUrl, headers: obfuscatedHeaders, body: obfuscatedBody)
        }
    }

    private func installResponseObfuscationHandler() {
        Bugfender.setNetworkLoggingResponseObfuscationHandler { [weak self] headers, body in
            guard let self = self else {
                return (headers: headers, body: body)
            }

            let response = self.invokeJSObfuscation(
                eventName: "BugfenderObfuscateNetworkResponse",
                data: [
                    "headers": headers,
                    "body": body as Any
                ]
            )
            guard let response = response else {
                return (headers: headers, body: body)
            }

            let obfuscatedHeaders = self.stringMap(from: response["headers"])
            let obfuscatedBody = response["body"] as? String
            return (headers: obfuscatedHeaders, body: obfuscatedBody)
        }
    }

    private func invokeJSObfuscation(eventName: String, data: [String: Any]) -> [String: Any]? {
        // Avoid deadlocking the platform/UI thread while waiting for JS.
        if Thread.isMainThread {
            return nil
        }

        let requestId = UUID().uuidString
        let pending = PendingObfuscation()
        pendingObfuscationsQueue.sync {
            pendingObfuscations[requestId] = pending
        }

        var payload = data
        payload["requestId"] = requestId

        DispatchQueue.main.async { [weak self] in
            self?.notifyListeners(eventName, data: payload)
        }

        let waitResult = pending.semaphore.wait(timeout: .now() + 3.0)
        pendingObfuscationsQueue.sync {
            pendingObfuscations.removeValue(forKey: requestId)
        }

        if waitResult == .timedOut {
            return nil
        }
        return pending.response
    }

    private func stringMap(from value: Any?) -> [String: String] {
        guard let raw = value as? [AnyHashable: Any] else {
            return [:]
        }
        var mapped: [String: String] = [:]
        for (key, entry) in raw {
            if entry is NSNull {
                mapped[String(describing: key)] = ""
            } else {
                mapped[String(describing: key)] = String(describing: entry)
            }
        }
        return mapped
    }
}

private final class PendingObfuscation {
    let semaphore = DispatchSemaphore(value: 0)
    var response: [String: Any]?
}
