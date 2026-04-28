import Flutter
import UIKit
import AppVueSDK

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  private var channel: FlutterMethodChannel?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    AppVue.preInit()
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)

    guard let controller = window?.rootViewController as? FlutterViewController else { return }
    channel = FlutterMethodChannel(
      name: "com.h5packager.h5_app/appvue",
      binaryMessenger: controller.binaryMessenger
    )

    channel?.setMethodCallHandler { [weak self] (call, result) in
      switch call.method {
      case "init":
        AppVue.initializeSDK(window: self?.window)
        result(nil)

      case "getInstallData":
        AppVue.getInstallData { trackData in
          DispatchQueue.main.async {
            if let data = trackData {
              result([
                "channel": data.channel as Any,
                "referrer": data.referrer as Any
              ])
            } else {
              result(nil)
            }
          }
        }

      case "getWakeupData":
        guard let args = call.arguments as? [String: Any],
              let urlString = args["url"] as? String,
              let url = URL(string: urlString) else {
          result(FlutterError(code: "INVALID_ARGUMENT", message: "url is required", details: nil))
          return
        }
        AppVue.getWakeupData(url: url) { trackData in
          DispatchQueue.main.async {
            if let data = trackData {
              result([
                "channel": data.channel as Any,
                "referrer": data.referrer as Any
              ])
            } else {
              result(nil)
            }
          }
        }

      case "reportEvent":
        guard let args = call.arguments as? [String: Any],
              let code = args["code"] as? String else {
          result(FlutterError(code: "INVALID_ARGUMENT", message: "code is required", details: nil))
          return
        }
        let value = (args["value"] as? NSNumber)?.int64Value ?? 0
        let event = AVEvent(code: code, value: value)
        if let props = args["props"] as? [String: String] {
          for (k, v) in props {
            event.prop(k, v)
          }
        }
        AppVue.reportEvent(event)
        result(nil)

      case "setLoggingEnabled":
        let enabled = (call.arguments as? [String: Any])?["enabled"] as? Bool ?? true
        AppVue.setLoggingEnabled(enabled)
        result(nil)

      default:
        result(FlutterMethodNotImplemented)
      }
    }
  }

  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    AppVue.getWakeupData(url: url) { [weak self] trackData in
      if let data = trackData {
        DispatchQueue.main.async {
          self?.channel?.invokeMethod("onWakeupData", arguments: [
            "channel": data.channel as Any,
            "referrer": data.referrer as Any
          ])
        }
      }
    }
    return super.application(app, open: url, options: options)
  }
}
