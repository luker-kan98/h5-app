package com.h5packager.h5_app

import android.content.Context
import android.os.Bundle
import android.util.Log

/**
 * Thin reflection-based wrapper around Firebase Analytics + Crashlytics.
 *
 * Firebase is an optional SDK: the packager only ships its dependencies when
 * the user enables Firebase in the build config (gated on the presence of
 * google-services.json by the gradle script). Direct imports here would make
 * the Kotlin source uncompilable in builds without Firebase. Reflection lets
 * the same source compile either way and degrade to no-ops at runtime.
 */
object FirebaseBridgeHelper {
    private const val TAG = "FirebaseBridge"

    private var analyticsInstance: Any? = null
    private var crashlyticsInstance: Any? = null
    private var analyticsLogEvent: java.lang.reflect.Method? = null
    private var analyticsSetUserId: java.lang.reflect.Method? = null
    private var analyticsSetUserProperty: java.lang.reflect.Method? = null
    private var crashlyticsLog: java.lang.reflect.Method? = null
    private var crashlyticsRecordException: java.lang.reflect.Method? = null

    var isReady: Boolean = false
        private set

    fun init(context: Context): Boolean {
        return try {
            // Firebase auto-initializes via the google-services plugin's
            // ContentProvider on Android, so we just resolve instances here.
            val analyticsCls = Class.forName("com.google.firebase.analytics.FirebaseAnalytics")
            val getInstance = analyticsCls.getMethod("getInstance", Context::class.java)
            analyticsInstance = getInstance.invoke(null, context)
            analyticsLogEvent = analyticsCls.getMethod(
                "logEvent", String::class.java, Bundle::class.java
            )
            analyticsSetUserId = analyticsCls.getMethod("setUserId", String::class.java)
            analyticsSetUserProperty = analyticsCls.getMethod(
                "setUserProperty", String::class.java, String::class.java
            )

            val crashCls = Class.forName("com.google.firebase.crashlytics.FirebaseCrashlytics")
            val getCrash = crashCls.getMethod("getInstance")
            crashlyticsInstance = getCrash.invoke(null)
            crashlyticsLog = crashCls.getMethod("log", String::class.java)
            crashlyticsRecordException = crashCls.getMethod(
                "recordException", Throwable::class.java
            )

            isReady = true
            Log.i(TAG, "Firebase bridge initialized")
            true
        } catch (cnfe: ClassNotFoundException) {
            // Firebase SDK not bundled — expected for builds without firebase enabled.
            Log.i(TAG, "Firebase SDK absent; bridge stays in no-op mode")
            isReady = false
            false
        } catch (t: Throwable) {
            Log.w(TAG, "Firebase init failed: $t")
            isReady = false
            false
        }
    }

    fun logEvent(name: String, props: Map<String, Any?>?) {
        if (!isReady) return
        try {
            val bundle = Bundle()
            props?.forEach { (k, v) ->
                when (v) {
                    is String -> bundle.putString(k, v)
                    is Int -> bundle.putInt(k, v)
                    is Long -> bundle.putLong(k, v)
                    is Double -> bundle.putDouble(k, v)
                    is Float -> bundle.putFloat(k, v)
                    is Boolean -> bundle.putBoolean(k, v)
                    null -> {}
                    else -> bundle.putString(k, v.toString())
                }
            }
            analyticsLogEvent?.invoke(analyticsInstance, name, bundle)
        } catch (t: Throwable) {
            Log.w(TAG, "logEvent failed: $t")
        }
    }

    fun setUserId(id: String?) {
        if (!isReady) return
        try {
            analyticsSetUserId?.invoke(analyticsInstance, id)
        } catch (t: Throwable) {
            Log.w(TAG, "setUserId failed: $t")
        }
    }

    fun setUserProperty(key: String, value: String?) {
        if (!isReady) return
        try {
            analyticsSetUserProperty?.invoke(analyticsInstance, key, value)
        } catch (t: Throwable) {
            Log.w(TAG, "setUserProperty failed: $t")
        }
    }

    fun captureException(message: String, stack: String) {
        if (!isReady) return
        try {
            crashlyticsRecordException?.invoke(
                crashlyticsInstance,
                RuntimeException("$message\n$stack")
            )
        } catch (t: Throwable) {
            Log.w(TAG, "captureException failed: $t")
        }
    }

    fun captureMessage(message: String) {
        if (!isReady) return
        try {
            crashlyticsLog?.invoke(crashlyticsInstance, message)
        } catch (t: Throwable) {
            Log.w(TAG, "captureMessage failed: $t")
        }
    }
}
