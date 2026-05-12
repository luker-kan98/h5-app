import Foundation

/// Reflection-based wrapper around Firebase Analytics + Crashlytics ObjC APIs.
///
/// Firebase is an optional SDK — pods are only installed when the packager has
/// dropped GoogleService-Info.plist into Runner/. A static `import Firebase`
/// would make Runner uncompilable without pods. The Swift runtime can resolve
/// FIRApp / FIRAnalytics / FIRCrashlytics by name; when absent, every call
/// degrades to a logged no-op.
@objc final class FirebaseBridgeHelper: NSObject {
  @objc static let shared = FirebaseBridgeHelper()

  private(set) var isReady: Bool = false

  private var firAppClass: AnyClass?
  private var firAnalyticsClass: AnyClass?
  private var firCrashlyticsClass: AnyClass?
  private var crashlyticsInstance: AnyObject?

  @discardableResult
  func initialize() -> Bool {
    let firAppCls: AnyClass? = NSClassFromString("FIRApp")
    let firAnalyticsCls: AnyClass? = NSClassFromString("FIRAnalytics")
    let firCrashCls: AnyClass? = NSClassFromString("FIRCrashlytics")
    guard let firApp = firAppCls else {
      NSLog("[firebase] SDK absent; bridge stays in no-op mode")
      isReady = false
      return false
    }

    // FIRApp.defaultApp() returns nil until +configure has been called. The
    // google-services plugin's GoogleService-Info.plist drives configuration
    // values automatically.
    let defaultAppSel = NSSelectorFromString("defaultApp")
    let alreadyConfigured = (firApp as AnyObject).perform(defaultAppSel)?.takeUnretainedValue() != nil
    if !alreadyConfigured {
      (firApp as AnyObject).perform(NSSelectorFromString("configure"))
    }

    firAppClass = firApp
    firAnalyticsClass = firAnalyticsCls
    firCrashlyticsClass = firCrashCls
    if let crashCls = firCrashCls {
      crashlyticsInstance = (crashCls as AnyObject)
        .perform(NSSelectorFromString("crashlytics"))?
        .takeUnretainedValue()
    }
    isReady = true
    NSLog("[firebase] bridge initialized (analytics=%@, crashlytics=%@)",
          firAnalyticsCls == nil ? "no" : "yes",
          firCrashCls == nil ? "no" : "yes")
    return true
  }

  func logEvent(name: String, props: [String: Any]?) {
    guard isReady, let cls = firAnalyticsClass else { return }
    let sel = NSSelectorFromString("logEventWithName:parameters:")
    _ = (cls as AnyObject).perform(sel, with: name, with: props ?? [:])
  }

  func setUserId(_ id: String?) {
    guard isReady, let cls = firAnalyticsClass else { return }
    _ = (cls as AnyObject).perform(NSSelectorFromString("setUserID:"), with: id)
  }

  func setUserProperty(key: String, value: String?) {
    guard isReady, let cls = firAnalyticsClass else { return }
    let sel = NSSelectorFromString("setUserPropertyString:forName:")
    _ = (cls as AnyObject).perform(sel, with: value, with: key)
  }

  func captureException(message: String, stack: String) {
    guard isReady, let crash = crashlyticsInstance else { return }
    let err = NSError(
      domain: "h5app.h5",
      code: 0,
      userInfo: [NSLocalizedDescriptionKey: "\(message)\n\(stack)"]
    )
    _ = (crash as AnyObject).perform(NSSelectorFromString("recordError:"), with: err)
  }

  func captureMessage(_ message: String) {
    guard isReady, let crash = crashlyticsInstance else { return }
    _ = (crash as AnyObject).perform(NSSelectorFromString("log:"), with: message)
  }
}
