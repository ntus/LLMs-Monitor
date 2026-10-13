#!/usr/bin/env python3
"""Install a per-user, extension-ID-bound metadata host. No admin access."""
import argparse
import json
from pathlib import Path
import re
import shlex
import shutil
import sys

HOST = "info.ntus.llmsmonitor.codex"


def install(extension_id, home, platform):
    if not re.fullmatch(r"[a-p]{32}", extension_id):
        raise ValueError("Extension ID must contain 32 letters a–p")
    if platform not in ("darwin", "linux"):
        raise ValueError("This helper installer supports macOS and Linux")
    base = home / ("Library/Application Support/LLMs Monitor/Codex" if platform == "darwin" else ".local/share/llms-monitor/codex")
    targets = [home / "Library/Application Support" / browser / "NativeMessagingHosts" for browser in ("Google/Chrome", "Microsoft Edge")] if platform == "darwin" else [home / ".config" / browser / "NativeMessagingHosts" for browser in ("google-chrome", "microsoft-edge")]
    # Never overwrite an unrelated host/installation at our reserved paths.
    for directory in targets:
        existing = directory / (HOST + ".json")
        if existing.exists() and json.loads(existing.read_text()).get("path") != str(base / "launch"):
            raise ValueError("An unrelated native host already uses this name")
    base.mkdir(parents=True, exist_ok=True, mode=0o700)
    base.chmod(0o700)
    shutil.copyfile(Path(__file__).with_name("codex_host.py"), base / "codex_host.py")
    (base / "codex_host.py").chmod(0o600)
    origin = "chrome-extension://" + extension_id + "/"
    (base / "allowed-origin.json").write_text(json.dumps({"origin": origin}) + "\n")
    (base / "allowed-origin.json").chmod(0o600)
    launcher = base / "launch"
    launcher.write_text("#!/bin/sh\nexec " + shlex.quote(sys.executable) + " " + shlex.quote(str(base / "codex_host.py")) + ' "$@"\n')
    launcher.chmod(0o700)
    manifest = {"name": HOST, "description": "LLMs Monitor: read-only local Codex task metadata", "path": str(launcher), "type": "stdio", "allowed_origins": [origin]}
    for directory in targets:
        directory.mkdir(parents=True, exist_ok=True)
        target = directory / (HOST + ".json")
        target.write_text(json.dumps(manifest, indent=2) + "\n")
        target.chmod(0o600)
    return base


def configured_id():
    config = Path(__file__).with_name("extension-id.json")
    if not config.exists():
        return None
    if config.stat().st_size > 1024:
        raise ValueError("Invalid installer configuration")
    value = json.loads(config.read_text()).get("extension_id")
    if not isinstance(value, str) or not re.fullmatch(r"[a-p]{32}", value):
        raise ValueError("Invalid configured extension ID")
    return value


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Install the local Codex metadata helper for Chrome/Edge")
    parser.add_argument("--extension-id")
    args = parser.parse_args()
    try:
        extension_id = args.extension_id or configured_id() or input("LLMs Monitor extension ID / 拡張機能ID: ").strip()
        install(extension_id, Path.home(), sys.platform)
        print("Installed. Open LLMs Monitor Codex connection settings and enable access.\n導入完了。LLMs MonitorのCodex連携画面で接続を有効にしてください。")
    except (OSError, ValueError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
