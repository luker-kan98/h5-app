package com.h5packager.h5_app

import androidx.webkit.ProxyConfig
import androidx.webkit.ProxyController
import androidx.webkit.WebViewFeature
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

/**
 * Bridges `androidx.webkit.ProxyController.setProxyOverride()` to Dart so
 * the wrapper can route WebView traffic through the local sing-box HTTP
 * inbound. setProxyOverride only takes effect for WebViewControllers
 * created AFTER the override is applied — call from Dart before creating
 * the WebViewController.
 */
class ProxyControllerPlugin : FlutterPlugin, MethodChannel.MethodCallHandler {
    private lateinit var channel: MethodChannel

    companion object {
        const val CHANNEL = "h5_app/proxy_controller"
    }

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(binding.binaryMessenger, CHANNEL)
        channel.setMethodCallHandler(this)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "isSupported" -> {
                result.success(WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE))
            }
            "setProxy" -> {
                val proxyUrl = call.argument<String>("httpProxyUrl")
                if (proxyUrl == null) {
                    result.error("ARG", "httpProxyUrl missing", null); return
                }
                if (!WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE)) {
                    result.error("UNSUPPORTED", "ProxyController not supported", null); return
                }
                val cfg = ProxyConfig.Builder().addProxyRule(proxyUrl).build()
                ProxyController.getInstance().setProxyOverride(cfg, { it.run() }) {
                    result.success(null)
                }
            }
            "clearProxy" -> {
                if (!WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE)) {
                    result.success(null); return
                }
                ProxyController.getInstance().clearProxyOverride({ it.run() }) {
                    result.success(null)
                }
            }
            else -> result.notImplemented()
        }
    }
}
