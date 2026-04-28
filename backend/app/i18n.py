from typing import Optional

SUPPORTED_LANGUAGES = ("en", "zh-CN", "zh")
DEFAULT_LANGUAGE = "zh-CN"

MESSAGES: dict[str, dict[str, str]] = {
    # --- build.py ---
    "duplicate_url": {
        "en": "This URL has already been submitted for packaging and cannot be resubmitted",
        "zh-CN": "该URL已提交过打包，不能重复提交",
        "zh": "该URL已提交过打包，不能重复提交",
    },
    "duplicate_app_name": {
        "en": "This app name is already in use, please choose a different name",
        "zh-CN": "该应用名称已被使用，请更换一个名称",
        "zh": "该应用名称已被使用，请更换一个名称",
    },
    "invalid_platforms": {
        "en": "Invalid platforms: {invalid}",
        "zh-CN": "无效的平台: {invalid}",
        "zh": "无效的平台: {invalid}",
    },
    "android_package_required": {
        "en": "Android package name is required when Android is selected",
        "zh-CN": "选择 Android 平台时必须提供包名",
        "zh": "选择 Android 平台时必须提供包名",
    },
    "invalid_android_package": {
        "en": "Invalid Android package name",
        "zh-CN": "无效的 Android 包名",
        "zh": "无效的 Android 包名",
    },
    "duplicate_package": {
        "en": "This package name is already in use, please choose a different one",
        "zh-CN": "该包名已被使用，请更换一个包名",
        "zh": "该包名已被使用，请更换一个包名",
    },
    "keystore_empty": {
        "en": "Keystore file is empty",
        "zh-CN": "Keystore 文件为空",
        "zh": "Keystore 文件为空",
    },
    "keystore_too_large": {
        "en": "Keystore file too large (max 1 MB)",
        "zh-CN": "Keystore 文件过大（最大 1 MB）",
        "zh": "Keystore 文件过大（最大 1 MB）",
    },
    "build_request_not_found": {
        "en": "Build request not found",
        "zh-CN": "未找到构建请求",
        "zh": "未找到构建请求",
    },
    "only_failed_rebuild": {
        "en": "Only failed builds can be rebuilt",
        "zh-CN": "仅失败的构建可以重新提交",
        "zh": "仅失败的构建可以重新提交",
    },
    "icon_missing_resubmit": {
        "en": "Original icon file missing, please submit a new build",
        "zh-CN": "原始图标文件丢失，请重新提交构建",
        "zh": "原始图标文件丢失，请重新提交构建",
    },
    "build_job_not_found": {
        "en": "Build job not found",
        "zh-CN": "未找到构建任务",
        "zh": "未找到构建任务",
    },
    "file_not_found": {
        "en": "File not found",
        "zh-CN": "文件未找到",
        "zh": "文件未找到",
    },

    # --- url_validator.py ---
    "url_empty": {
        "en": "URL must not be empty",
        "zh-CN": "URL 不能为空",
        "zh": "URL 不能为空",
    },
    "url_invalid_scheme": {
        "en": "URL scheme must be http or https, got '{scheme}'",
        "zh-CN": "URL 协议必须是 http 或 https，当前为 '{scheme}'",
        "zh": "URL 协议必须是 http 或 https，当前为 '{scheme}'",
    },
    "url_invalid_hostname": {
        "en": "URL must have a valid hostname",
        "zh-CN": "URL 必须包含有效的主机名",
        "zh": "URL 必须包含有效的主机名",
    },
    "url_internal_address": {
        "en": "URL must not point to an internal address",
        "zh-CN": "URL 不能指向内部地址",
        "zh": "URL 不能指向内部地址",
    },

    # --- icon_service.py ---
    "app_name_required": {
        "en": "App name is required",
        "zh-CN": "应用名称不能为空",
        "zh": "应用名称不能为空",
    },
    "app_name_too_long": {
        "en": "App name must be at most {max_length} characters",
        "zh-CN": "应用名称最多 {max_length} 个字符",
        "zh": "应用名称最多 {max_length} 个字符",
    },
    "icon_empty": {
        "en": "Icon file is empty",
        "zh-CN": "图标文件为空",
        "zh": "图标文件为空",
    },
    "icon_not_png": {
        "en": "Icon must be a PNG image",
        "zh-CN": "图标必须是 PNG 格式",
        "zh": "图标必须是 PNG 格式",
    },
    "icon_not_square": {
        "en": "Icon must be a square image",
        "zh-CN": "图标必须是正方形",
        "zh": "图标必须是正方形",
    },
    "icon_too_small": {
        "en": "Icon must be at least {size}x{size} pixels",
        "zh-CN": "图标尺寸不得小于 {size}x{size} 像素",
        "zh": "图标尺寸不得小于 {size}x{size} 像素",
    },

    # --- auth.py ---
    "username_exists": {
        "en": "Username already exists",
        "zh-CN": "用户名已存在",
        "zh": "用户名已存在",
    },
    "invalid_credentials": {
        "en": "Invalid credentials",
        "zh-CN": "用户名或密码错误",
        "zh": "用户名或密码错误",
    },
}


def normalize_language(language: Optional[str]) -> str:
    if not language:
        return DEFAULT_LANGUAGE
    if language in SUPPORTED_LANGUAGES:
        return language
    if language.startswith("en"):
        return "en"
    if "CN" in language or "Hans" in language:
        return "zh-CN"
    if language.startswith("zh"):
        return "zh"
    return DEFAULT_LANGUAGE


def t(key: str, language: Optional[str] = None, **kwargs: object) -> str:
    lang = normalize_language(language)
    translations = MESSAGES.get(key)
    if not translations:
        return key
    template = translations.get(lang) or translations.get(DEFAULT_LANGUAGE, key)
    if kwargs:
        return template.format(**kwargs)
    return template
