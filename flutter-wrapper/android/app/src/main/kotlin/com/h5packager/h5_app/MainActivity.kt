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

class MainActivity : FlutterActivity() {
    companion object {
        private const val CHANNEL = "com.h5packager.h5_app/appvue"
    }

    private var channel: MethodChannel? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        AppVue.preInit(this)
        super.onCreate(savedInstanceState)
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

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
