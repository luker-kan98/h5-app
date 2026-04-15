package com.h5packager.h5_app

import android.os.Bundle
import androidx.core.cp.Worker
import io.flutter.embedding.android.FlutterActivity

class MainActivity: FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Worker.V_V(this)
    }
}
