"""Build an unsigned, user-launched macOS app, without modifying installed apps."""
from pathlib import Path
import plistlib
import shutil
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[2]
VERSION = '1.0.0'
LAUNCH = '''#!/bin/zsh
set -eu
for candidate in /Library/Frameworks/Python.framework/Versions/Current/bin/python3 /opt/homebrew/bin/python3 /usr/local/bin/python3 /usr/bin/python3; do
  if [[ -x "$candidate" ]] && "$candidate" -c 'import sys; assert sys.version_info >= (3,9)' >/dev/null 2>&1; then
    exec "$candidate" "${0:A:h}/../Resources/updater.py" EXTRA
  fi
done
/usr/bin/osascript -e 'display dialog "Python 3.9以降が必要です。Pythonを導入してから再実行してください。" with title "LLMs Monitor 更新" buttons {"OK"}'
'''

def build(destination):
    with tempfile.TemporaryDirectory() as temp:
        base = Path(temp)
        for title, extra in [('LLMs Monitor 更新', ''), ('LLMs Monitor 前の版に戻す', '--restore')]:
            app = base / (title + '.app')
            macos, resources = app / 'Contents/MacOS', app / 'Contents/Resources'
            macos.mkdir(parents=True)
            resources.mkdir()
            launcher = macos / 'LLMsMonitorUpdater'
            launcher.write_text(LAUNCH.replace('EXTRA', extra))
            launcher.chmod(0o755)
            shutil.copy2(Path(__file__).with_name('updater.py'), resources / 'updater.py')
            (app / 'Contents/Info.plist').write_bytes(plistlib.dumps({'CFBundleIdentifier': 'info.ntus.llmsmonitor.updater' + ('.restore' if extra else ''), 'CFBundleName': title, 'CFBundleExecutable': launcher.name, 'CFBundleShortVersionString': VERSION, 'CFBundleVersion': VERSION, 'CFBundlePackageType': 'APPL', 'LSMinimumSystemVersion': '11.0', 'NSHighResolutionCapable': True}))
        shutil.copy2(Path(__file__).with_name('README.md'), base / '最初にお読みください.md')
        with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(base.rglob('*')):
                if path.is_file():
                    archive.write(path, path.relative_to(base))
    return destination

if __name__ == '__main__':
    output = ROOT / 'dist' / ('LLMs-Monitor-Mac-Updater-v' + VERSION + '.zip')
    build(output)
    print(output)
