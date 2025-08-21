package com.md12_reactapp_qathethao

import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "md12_reactApp_QATheThao"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * ✅ Xử lý deep link khi app đang chạy
   */
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    
    // ✅ Gửi deep link data đến React Native
    handleDeepLink(intent)
  }

  /**
   * ✅ Xử lý deep link khi app khởi động
   */
  override fun onStart() {
    super.onStart()
    val intent = intent
    if (intent != null && intent.data != null) {
      handleDeepLink(intent)
    }
  }

  /**
   * ✅ Gửi deep link data đến React Native
   */
  private fun handleDeepLink(intent: Intent) {
    val data = intent.data
    if (data != null) {
      val url = data.toString()
      println("🔗 Deep link received: $url")
      
      // ✅ Parse URL parameters
      try {
        val urlObj = java.net.URI(url)
        val query = urlObj.query
        println("🔍 Query string: $query")
        
        // ✅ Tạo params object từ query string
        val params = mutableMapOf<String, String>()
        if (query != null) {
          val pairs = query.split("&")
          for (pair in pairs) {
            val keyValue = pair.split("=")
            if (keyValue.size == 2) {
              params[keyValue[0]] = java.net.URLDecoder.decode(keyValue[1], "UTF-8")
            }
          }
        }
        println("🔍 Parsed params: $params")
        
        // ✅ Gửi event đến React Native với URL và params
        val context = reactNativeHost.reactInstanceManager.currentReactContext
        if (context != null) {
          val eventEmitter = context.getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          
          // ✅ Gửi URL gốc
          eventEmitter.emit("DeepLinkReceived", url)
          
          // ✅ Gửi params riêng biệt
          eventEmitter.emit("DeepLinkParams", params.toString())
          
          println("✅ Deep link event sent to React Native")
          println("✅ Deep link params sent: $params")
        } else {
          println("❌ React context is null, storing for later")
          // ✅ Lưu URL để gửi sau khi React context sẵn sàng
          globalDeepLinkUrl = url
        }
      } catch (e: Exception) {
        println("❌ Error parsing deep link: ${e.message}")
        
        // ✅ Fallback: gửi URL gốc
        try {
          val context = reactNativeHost.reactInstanceManager.currentReactContext
          if (context != null) {
            context
              .getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit("DeepLinkReceived", url)
            println("✅ Fallback deep link event sent")
          }
        } catch (fallbackError: Exception) {
          println("❌ Fallback error: ${fallbackError.message}")
        }
      }
    }
  }
  
  // ✅ Global variable để lưu deep link URL
  companion object {
    var globalDeepLinkUrl: String? = null
  }
}
