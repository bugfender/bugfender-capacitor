// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "BugfenderCapacitor",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "BugfenderCapacitor",
            targets: ["BugfenderPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/bugfender/BugfenderSDK-iOS.git", from: "3.0.1")
    ],
    targets: [
        .target(
            name: "BugfenderPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "BugfenderLibrary", package: "BugfenderSDK-iOS")
            ],
            path: "ios/Plugin",
            exclude: [
                "BugfenderPlugin.h",
                "BugfenderPlugin.m",
                "Info.plist"
            ]
        )
    ]
)
