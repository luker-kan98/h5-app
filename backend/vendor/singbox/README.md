# sing-box vendored binaries

The `apply_flutter` and `apply_electron` injectors copy platform-specific
sing-box executables from this directory into per-build wrapper copies.

## Layout

```
backend/vendor/singbox/
├── android/
│   ├── arm64-v8a/sing-box
│   ├── armeabi-v7a/sing-box
│   └── x86_64/sing-box
├── darwin/sing-box
└── windows/sing-box.exe
```

## Acquisition

Run `./fetch.sh` once per environment (host, CI cache). The script downloads
the pinned sing-box release from the upstream GitHub release page and
populates the layout above. **Binaries are gitignored** — every machine that
builds proxy-enabled apps must run the script.

The pinned version is documented at the top of `fetch.sh`.
