import io
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Final

from PIL import Image

MIN_ICON_SIZE: Final[int] = 1024
MAX_APP_NAME_LENGTH: Final[int] = 64

ANDROID_ICON_SPECS: Final[dict[str, int]] = {
    "mipmap-mdpi/ic_launcher.png": 48,
    "mipmap-hdpi/ic_launcher.png": 72,
    "mipmap-xhdpi/ic_launcher.png": 96,
    "mipmap-xxhdpi/ic_launcher.png": 144,
    "mipmap-xxxhdpi/ic_launcher.png": 192,
}

IOS_ICON_SPECS: Final[dict[str, int]] = {
    "Icon-App-20x20@1x.png": 20,
    "Icon-App-20x20@2x.png": 40,
    "Icon-App-20x20@3x.png": 60,
    "Icon-App-29x29@1x.png": 29,
    "Icon-App-29x29@2x.png": 58,
    "Icon-App-29x29@3x.png": 87,
    "Icon-App-40x40@1x.png": 40,
    "Icon-App-40x40@2x.png": 80,
    "Icon-App-40x40@3x.png": 120,
    "Icon-App-60x60@2x.png": 120,
    "Icon-App-60x60@3x.png": 180,
    "Icon-App-76x76@1x.png": 76,
    "Icon-App-76x76@2x.png": 152,
    "Icon-App-83.5x83.5@2x.png": 167,
    "Icon-App-1024x1024@1x.png": 1024,
}

WINDOWS_ICON_SIZES: Final[list[tuple[int, int]]] = [
    (16, 16),
    (24, 24),
    (32, 32),
    (48, 48),
    (64, 64),
    (128, 128),
    (256, 256),
]

MACOS_ICONSET_SPECS: Final[dict[str, int]] = {
    "icon_16x16.png": 16,
    "icon_16x16@2x.png": 32,
    "icon_32x32.png": 32,
    "icon_32x32@2x.png": 64,
    "icon_128x128.png": 128,
    "icon_128x128@2x.png": 256,
    "icon_256x256.png": 256,
    "icon_256x256@2x.png": 512,
    "icon_512x512.png": 512,
    "icon_512x512@2x.png": 1024,
}

RESAMPLE = Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS


class IconValidationError(ValueError):
    pass


def normalize_app_name(app_name: str) -> str:
    normalized = app_name.strip()
    if not normalized:
        raise ValueError("App name is required")
    if len(normalized) > MAX_APP_NAME_LENGTH:
        raise ValueError(f"App name must be at most {MAX_APP_NAME_LENGTH} characters")
    return normalized


def validate_icon_upload(contents: bytes, content_type: str | None = None) -> None:
    if not contents:
        raise IconValidationError("Icon file is empty")
    if content_type and content_type != "image/png":
        raise IconValidationError("Icon must be a PNG image")

    try:
        with Image.open(io.BytesIO(contents)) as image:
            image.load()
            if image.format != "PNG":
                raise IconValidationError("Icon must be a PNG image")
            width, height = image.size
    except IconValidationError:
        raise
    except Exception as exc:
        raise IconValidationError("Icon must be a PNG image") from exc

    if width != height:
        raise IconValidationError("Icon must be a square image")
    if width < MIN_ICON_SIZE or height < MIN_ICON_SIZE:
        raise IconValidationError(f"Icon must be at least {MIN_ICON_SIZE}x{MIN_ICON_SIZE} pixels")


def generate_android_icons(source_path: str, flutter_dir: str) -> None:
    res_dir = Path(flutter_dir) / "android/app/src/main/res"
    _render_png_variants(source_path, res_dir, ANDROID_ICON_SPECS)


def generate_ios_icons(source_path: str, flutter_dir: str) -> None:
    appiconset_dir = Path(flutter_dir) / "ios/Runner/Assets.xcassets/AppIcon.appiconset"
    _render_png_variants(source_path, appiconset_dir, IOS_ICON_SPECS)


def generate_windows_icon(source_path: str, electron_dir: str) -> str:
    build_resources_dir = Path(electron_dir) / "build-resources"
    build_resources_dir.mkdir(parents=True, exist_ok=True)
    icon_path = build_resources_dir / "icon.ico"
    with Image.open(source_path) as image:
        image.convert("RGBA").save(
            icon_path,
            format="ICO",
            sizes=WINDOWS_ICON_SIZES,
        )
    return str(icon_path)


def generate_macos_icon(source_path: str, electron_dir: str) -> str:
    if shutil.which("iconutil") is None:
        raise RuntimeError("macOS builds require iconutil to generate .icns files")

    build_resources_dir = Path(electron_dir) / "build-resources"
    build_resources_dir.mkdir(parents=True, exist_ok=True)
    icon_path = build_resources_dir / "icon.icns"

    with tempfile.TemporaryDirectory(prefix="iconset-") as temp_dir:
        iconset_dir = Path(temp_dir) / "icon.iconset"
        iconset_dir.mkdir()
        _render_png_variants(source_path, iconset_dir, MACOS_ICONSET_SPECS)
        result = subprocess.run(
            ["iconutil", "-c", "icns", str(iconset_dir), "-o", str(icon_path)],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            stderr = (result.stderr or "").strip()
            raise RuntimeError(stderr or "iconutil failed to generate the macOS icon")

    return str(icon_path)


def _render_png_variants(source_path: str, output_dir: Path, specs: dict[str, int]) -> None:
    with Image.open(source_path) as source_image:
        image = source_image.convert("RGBA")
        for relative_path, size in specs.items():
            target_path = output_dir / relative_path
            target_path.parent.mkdir(parents=True, exist_ok=True)
            resized = image.resize((size, size), RESAMPLE)
            resized.save(target_path, format="PNG")
