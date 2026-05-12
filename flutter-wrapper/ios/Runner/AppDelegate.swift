import Flutter
import UIKit
import AppVueSDK
import Sentry
import UMCommon
import UMAPM

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  private var channel: FlutterMethodChannel?
  private var sentryChannel: FlutterMethodChannel?
  private var sentryInitialized = false
  private var umengChannel: FlutterMethodChannel?
  private var umengInitialized = false
  private var firebaseChannel: FlutterMethodChannel?

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

    sentryChannel = FlutterMethodChannel(
      name: "com.h5packager.h5_app/sentry",
      binaryMessenger: controller.binaryMessenger
    )
    sentryChannel?.setMethodCallHandler { [weak self] (call, result) in
      guard let self = self else { return }
      switch call.method {
      case "init":
        let dsn = (call.arguments as? [String: Any])?["dsn"] as? String ?? ""
        if dsn.isEmpty {
          result(false)
          return
        }
        SentrySDK.start { options in
          options.dsn = dsn
        }
        self.sentryInitialized = true
        result(true)

      case "captureException":
        guard self.sentryInitialized else { result(false); return }
        let args = call.arguments as? [String: Any]
        let msg = (args?["message"] as? String) ?? "(no message)"
        let stack = (args?["stack"] as? String) ?? ""
        let err = NSError(
          domain: "h5app.h5",
          code: 0,
          userInfo: [NSLocalizedDescriptionKey: "\(msg)\n\(stack)"]
        )
        SentrySDK.capture(error: err)
        result(true)

      case "captureMessage":
        guard self.sentryInitialized else { result(false); return }
        let msg = (call.arguments as? [String: Any])?["message"] as? String ?? ""
        SentrySDK.capture(message: msg)
        result(true)

      default:
        result(FlutterMethodNotImplemented)
      }
    }

    umengChannel = FlutterMethodChannel(
      name: "com.h5packager.h5_app/umeng",
      binaryMessenger: controller.binaryMessenger
    )
    umengChannel?.setMethodCallHandler { [weak self] (call, result) in
      guard let self = self else { return }
      switch call.method {
      case "init":
        let args = call.arguments as? [String: Any]
        let appKey = (args?["appKey"] as? String) ?? ""
        if appKey.isEmpty {
          result(false)
          return
        }
        let channelName = (args?["channel"] as? String) ?? "App Store"
        UMConfigure.initWithAppkey(appKey, channel: channelName)
        UMConfigure.setLogEnabled(false)
        self.umengInitialized = true
        result(true)

      case "logEvent":
        guard self.umengInitialized else { result(false); return }
        let args = call.arguments as? [String: Any]
        guard let name = args?["name"] as? String, !name.isEmpty else {
          result(FlutterError(code: "INVALID_ARGUMENT", message: "name is required", details: nil))
          return
        }
        if let props = args?["props"] as? [String: Any], !props.isEmpty {
          var strProps: [String: String] = [:]
          for (k, v) in props { strProps[k] = "\(v)" }
          MobClick.event(name, attributes: strProps)
        } else {
          MobClick.event(name)
        }
        result(true)

      case "setUserId":
        guard self.umengInitialized else { result(false); return }
        let id = (call.arguments as? [String: Any])?["id"] as? String ?? ""
        if id.isEmpty {
          MobClick.profileSignOff()
        } else {
          MobClick.profileSignIn(withPUID: id)
        }
        result(true)

      case "setUserProperty":
        guard self.umengInitialized else { result(false); return }
        let args = call.arguments as? [String: Any]
        guard let key = args?["key"] as? String, !key.isEmpty else {
          result(FlutterError(code: "INVALID_ARGUMENT", message: "key is required", details: nil))
          return
        }
        let value = (args?["value"] as? String) ?? ""
        MobClick.event("__user_property", attributes: ["key": key, "value": value])
        result(true)

      default:
        result(FlutterMethodNotImplemented)
      }
    }

    firebaseChannel = FlutterMethodChannel(
      name: "com.h5packager.h5_app/firebase",
      binaryMessenger: controller.binaryMessenger
    )
    firebaseChannel?.setMethodCallHandler { (call, result) in
      let helper = FirebaseBridgeHelper.shared
      switch call.method {
      case "init":
        result(helper.initialize())

      case "logEvent":
        guard helper.isReady else { result(false); return }
        let args = call.arguments as? [String: Any]
        guard let name = args?["name"] as? String, !name.isEmpty else {
          result(FlutterError(code: "INVALID_ARGUMENT", message: "name is required", details: nil))
          return
        }
        helper.logEvent(name: name, props: args?["props"] as? [String: Any])
        result(true)

      case "setUserId":
        guard helper.isReady else { result(false); return }
        helper.setUserId((call.arguments as? [String: Any])?["id"] as? String)
        result(true)

      case "setUserProperty":
        guard helper.isReady else { result(false); return }
        let args = call.arguments as? [String: Any]
        guard let key = args?["key"] as? String, !key.isEmpty else {
          result(FlutterError(code: "INVALID_ARGUMENT", message: "key is required", details: nil))
          return
        }
        helper.setUserProperty(key: key, value: args?["value"] as? String)
        result(true)

      case "captureException":
        guard helper.isReady else { result(false); return }
        let args = call.arguments as? [String: Any]
        helper.captureException(
          message: (args?["message"] as? String) ?? "(no message)",
          stack: (args?["stack"] as? String) ?? ""
        )
        result(true)

      case "captureMessage":
        guard helper.isReady else { result(false); return }
        helper.captureMessage((call.arguments as? [String: Any])?["message"] as? String ?? "")
        result(true)

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
