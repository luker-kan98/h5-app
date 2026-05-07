#!/usr/bin/env bash
# Pinned sing-box version — bump deliberately.
set -euo pipefail

SINGBOX_VERSION="${SINGBOX_VERSION:-1.10.7}"
BASE_URL="https://github.com/SagerNet/sing-box/releases/download/v${SINGBOX_VERSION}"

cd "$(dirname "$0")"

fetch_one() {
  local url="$1"
  local dest="$2"
  echo "→ $dest"
  mkdir -p "$(dirname "$dest")"
  curl -fsSL "$url" -o "${dest}.tar.gz" 2>/dev/null || curl -fsSL "$url" -o "${dest}.zip"
}

# NOTE: real release filenames vary by sing-box version; the operator must
# verify the assets against https://github.com/SagerNet/sing-box/releases
# before running this script. The placeholder below shows the expected layout.

echo "Pinned sing-box ${SINGBOX_VERSION}"
echo "Populate the following paths from upstream release artifacts:"
echo "  android/arm64-v8a/sing-box"
echo "  android/armeabi-v7a/sing-box"
echo "  android/x86_64/sing-box"
echo "  darwin/sing-box   (universal or arm64+amd64; pick one)"
echo "  windows/sing-box.exe"
echo
echo "This script intentionally does NOT auto-download. Add the curl/tar"
echo "lines specific to your chosen release asset names below."
