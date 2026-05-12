package com.h5packager.h5_app

import android.content.Intent
import android.os.Bundle
import com.appvue.sdk.api.AppVue
import com.appvue.sdk.api.Event
import com.appvue.sdk.api.TrackDataCallback
import com.appvue.sdk.api.TrackData
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import com.umeng.analytics.MobclickAgent
import com.umeng.commonsdk.UMConfigure
import io.sentry.Sentry
import io.sentry.SentryLevel
import io.sentry.android.core.SentryAndroid

class MainActivity : FlutterActivity() {
    companion object {
        private const val CHANNEL = "com.h5packager.h5_app/appvue"
        private const val SENTRY_CHANNEL = "com.h5packager.h5_app/sentry"
        private const val UMENG_CHANNEL = "com.h5packager.h5_app/umeng"
        private const val FIREBASE_CHANNEL = "com.h5packager.h5_app/firebase"
    }

    private var channel: MethodChannel? = null
    private var sentryInitialized = false
    private var umengInitialized = false

    override fun onCreate(savedInstanceState: Bundle?) {
        AppVue.preInit(this)
        super.onCreate(savedInstanceState)
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        flutterEngine.plugins.add(ProxyControllerPlugin())

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "h5_app/native_lib_dir")
            .setMethodCallHandler { call, result ->
                if (call.method == "get") {
                    result.success(applicationInfo.nativeLibraryDir)
                } else {
                    result.notImplemented()
                }
            }

        channel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
        channel?.setMethodCallHandler { call, result ->
            when (call.method) {
                "init" -> {
                    AppVue.init(this)
                    result.success(null)
                }
                "getInstallData" -> {
                    AppVue.getInstallData(object : TrackDataCallback {
                        override fun onResult(data: TrackData?) {
                            runOnUiThread {
                                if (data != null) {
                                    result.success(mapOf(
                                        "channel" to data.channel,
                                        "referrer" to data.referrer
                                    ))
                                } else {
                                    result.success(null)
                                }
                            }
                        }
                    })
                }
                "getWakeupData" -> {
                    val url = call.argument<String>("url")
                    if (url != null) {
                        val intent = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url))
                        AppVue.getWakeupData(intent, object : TrackDataCallback {
                            override fun onResult(data: TrackData?) {
                                runOnUiThread {
                                    if (data != null) {
                                        result.success(mapOf(
                                            "channel" to data.channel,
                                            "referrer" to data.referrer
                                        ))
                                    } else {
                                        result.success(null)
                                    }
                                }
                            }
                        })
                    } else {
                        result.error("INVALID_ARGUMENT", "url is required", null)
                    }
                }
                "reportEvent" -> {
                    val code = call.argument<String>("code")
                    val value = call.argument<Number>("value")?.toLong() ?: 0L
                    val props = call.argument<Map<String, String>>("props")
                    if (code != null) {
                        val event = Event(code, value)
                        props?.forEach { (k, v) -> event.props[k] = v }
                        AppVue.reportEvent(event)
                        result.success(null)
                    } else {
                        result.error("INVALID_ARGUMENT", "code is required", null)
                    }
                }
                else -> result.notImplemented()
            }
        }

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, SENTRY_CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "init" -> {
                        val dsn = call.argument<String>("dsn")
                        if (dsn.isNullOrBlank()) {
                            result.success(false)
                        } else {
                            try {
                                SentryAndroid.init(applicationContext) { options ->
                                    options.dsn = dsn
                                }
                                sentryInitialized = true
                                result.success(true)
                            } catch (e: Throwable) {
                                result.error("SENTRY_INIT_FAILED", e.message, null)
                            }
                        }
                    }
                    "captureException" -> {
                        if (!sentryInitialized) { result.success(false); return@setMethodCallHandler }
                        val msg = call.argument<String>("message") ?: "(no message)"
                        val stack = call.argument<String>("stack") ?: ""
                        Sentry.captureException(RuntimeException("$msg\n$stack"))
                        result.success(true)
                    }
                    "captureMessage" -> {
                        if (!sentryInitialized) { result.success(false); return@setMethodCallHandler }
                        val msg = call.argument<String>("message") ?: ""
                        Sentry.captureMessage(msg, SentryLevel.INFO)
                        result.success(true)
                    }
                    else -> result.notImplemented()
                }
            }

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, UMENG_CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "init" -> {
                        val appKey = call.argument<String>("appKey")
                        if (appKey.isNullOrBlank()) {
                            result.success(false)
                        } else {
                            try {
                                val channelName = call.argument<String>("channel") ?: "default"
                                UMConfigure.preInit(applicationContext, appKey, channelName)
                                UMConfigure.init(
                                    applicationContext,
                                    appKey,
                                    channelName,
                                    UMConfigure.DEVICE_TYPE_PHONE,
                                    null
                                )
                                MobclickAgent.setPageCollectionMode(
                                    MobclickAgent.PageMode.AUTO
                                )
                                umengInitialized = true
                                result.success(true)
                            } catch (e: Throwable) {
                                result.error("UMENG_INIT_FAILED", e.message, null)
                            }
                        }
                    }
                    "logEvent" -> {
                        if (!umengInitialized) { result.success(false); return@setMethodCallHandler }
                        val name = call.argument<String>("name")
                        if (name.isNullOrBlank()) {
                            result.error("INVALID_ARGUMENT", "name is required", null)
                            return@setMethodCallHandler
                        }
                        val rawProps = call.argument<Map<String, Any?>>("props")
                        if (rawProps.isNullOrEmpty()) {
                            MobclickAgent.onEvent(applicationContext, name)
                        } else {
                            val stringProps = HashMap<String, String>(rawProps.size)
                            for ((k, v) in rawProps) {
                                if (v != null) stringProps[k] = v.toString()
                            }
                            MobclickAgent.onEventObject(applicationContext, name, stringProps as Map<String, Any>)
                        }
                        result.success(true)
                    }
                    "setUserId" -> {
                        if (!umengInitialized) { result.success(false); return@setMethodCallHandler }
                        val id = call.argument<String>("id")
                        if (id.isNullOrEmpty()) {
                            MobclickAgent.onProfileSignOff()
                        } else {
                            MobclickAgent.onProfileSignIn(id)
                        }
                        result.success(true)
                    }
                    "setUserProperty" -> {
                        if (!umengInitialized) { result.success(false); return@setMethodCallHandler }
                        val key = call.argument<String>("key")
                        val value = call.argument<String>("value")
                        if (key.isNullOrBlank()) {
                            result.error("INVALID_ARGUMENT", "key is required", null)
                            return@setMethodCallHandler
                        }
                        // Umeng has no native user-property API; encode as a synthetic event.
                        MobclickAgent.onEventObject(
                            applicationContext,
                            "__user_property",
                            mapOf("key" to key, "value" to (value ?: ""))
                        )
                        result.success(true)
                    }
                    else -> result.notImplemented()
                }
            }

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, FIREBASE_CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "init" -> result.success(FirebaseBridgeHelper.init(applicationContext))
                    "logEvent" -> {
                        if (!FirebaseBridgeHelper.isReady) { result.success(false); return@setMethodCallHandler }
                        val name = call.argument<String>("name")
                        if (name.isNullOrBlank()) {
                            result.error("INVALID_ARGUMENT", "name is required", null)
                            return@setMethodCallHandler
                        }
                        FirebaseBridgeHelper.logEvent(name, call.argument<Map<String, Any?>>("props"))
                        result.success(true)
                    }
                    "setUserId" -> {
                        if (!FirebaseBridgeHelper.isReady) { result.success(false); return@setMethodCallHandler }
                        FirebaseBridgeHelper.setUserId(call.argument<String>("id"))
                        result.success(true)
                    }
                    "setUserProperty" -> {
                        if (!FirebaseBridgeHelper.isReady) { result.success(false); return@setMethodCallHandler }
                        val key = call.argument<String>("key")
                        if (key.isNullOrBlank()) {
                            result.error("INVALID_ARGUMENT", "key is required", null)
                            return@setMethodCallHandler
                        }
                        FirebaseBridgeHelper.setUserProperty(key, call.argument<String>("value"))
                        result.success(true)
                    }
                    "captureException" -> {
                        if (!FirebaseBridgeHelper.isReady) { result.success(false); return@setMethodCallHandler }
                        FirebaseBridgeHelper.captureException(
                            call.argument<String>("message") ?: "(no message)",
                            call.argument<String>("stack") ?: ""
                        )
                        result.success(true)
                    }
                    "captureMessage" -> {
                        if (!FirebaseBridgeHelper.isReady) { result.success(false); return@setMethodCallHandler }
                        FirebaseBridgeHelper.captureMessage(call.argument<String>("message") ?: "")
                        result.success(true)
                    }
                    else -> result.notImplemented()
                }
            }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleDeepLink(intent)
    }

    private fun handleDeepLink(intent: Intent) {
        if (AppVue.hasWakeupData(intent)) {
            AppVue.getWakeupData(intent, object : TrackDataCallback {
                override fun onResult(data: TrackData?) {
                    if (data != null) {
                        runOnUiThread {
                            channel?.invokeMethod("onWakeupData", mapOf(
                                "channel" to data.channel,
                                "referrer" to data.referrer
                            ))
                        }
                    }
                }
            })
        }
    }
}
