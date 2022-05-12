import Foundation

@objc public class Bugfender: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
