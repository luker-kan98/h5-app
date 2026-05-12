plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

// Firebase plugins apply only when google-services.json is present in this
// module — packager injects it when the user enables Firebase, otherwise the
// build proceeds without Firebase.
val firebaseConfigFile = file("google-services.json")
val firebaseEnabled = firebaseConfigFile.exists()
if (firebaseEnabled) {
    apply(plugin = "com.google.gms.google-services")
    apply(plugin = "com.google.firebase.crashlytics")
}

android {
    namespace = "com.h5packager.h5_app"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        applicationId = "com.h5packager.h5_app"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("KEYSTORE_PATH") ?: "${projectDir}/default.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "changeit"
            keyAlias = System.getenv("KEY_ALIAS") ?: "h5packager"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "changeit"
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }

    // sing-box ships as `libsingbox.so` and we exec it via Process.start.
    // Modern AGP defaults to mmap'ing native libs straight from the APK
    // (uncompressed, not extracted) which makes them unusable by Process.start.
    // Force extraction so nativeLibraryDir contains a real file we can exec.
    packagingOptions {
        jniLibs {
            useLegacyPackaging = true
        }
    }
}

dependencies {
    implementation(files("libs/appvue-v1.0.0-release.aar"))
    implementation("androidx.webkit:webkit:1.10.0")
    implementation("io.sentry:sentry-android:7.18.1")
    implementation("com.umeng.umsdk:common:9.7.5")
    implementation("com.umeng.umsdk:asms:1.8.5")
    implementation("com.umeng.umsdk:apm:1.9.5")
    if (firebaseEnabled) {
        implementation(platform("com.google.firebase:firebase-bom:33.5.1"))
        implementation("com.google.firebase:firebase-analytics")
        implementation("com.google.firebase:firebase-crashlytics")
    }
}

flutter {
    source = "../.."
}
