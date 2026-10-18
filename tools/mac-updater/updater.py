#!/usr/bin/env python3
"""User-launched macOS updater. No browser-profile access or native-host changes."""
import contextlib
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import time
import urllib.request
import urllib.parse
import uuid
import unicodedata
import zipfile

TOOL_VERSION = '1.0.1'
FEED = 'https://raw.githubusercontent.com/ntus/LLMs-Monitor/main/dist/update.json'
BASE = 'https://raw.githubusercontent.com/ntus/LLMs-Monitor/main/dist/'
MAX_BYTES = 30 * 1024 * 1024
CONFIG = Path.home() / 'Library/Application Support/LLMs Monitor/Updater'
REQUIRED = ('manifest.json', 'background.js', 'shared.js', 'index.html', 'app.js')


def version(value):
    if not isinstance(value, str) or not re.fullmatch(r'\d{1,5}\.\d{1,5}\.\d{1,5}', value):
        raise ValueError('版番号を確認できません。')
    parts = tuple(map(int, value.split('.')))
    if any(n > 65535 for n in parts):
        raise ValueError('版番号が範囲外です。')
    return parts


def release(value):
    if not isinstance(value, dict) or value.get('schemaVersion') != 1:
        raise ValueError('更新情報の形式が未対応です。')
    version(value.get('version'))
    expected = 'LLMs-Monitor-v' + value['version'] + '.zip'
    if value.get('package') != expected or not re.fullmatch(r'[a-f0-9]{64}', str(value.get('sha256', ''))):
        raise ValueError('更新ファイルの情報が不正です。')
    return value


def fetch(url, limit):
    # Fixed public source, no cookies/tokens/profile state; no off-origin redirect.
    if not url.startswith(BASE):
        raise ValueError('許可されていない更新元です。')
    class Redirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            if not newurl.startswith(BASE):
                raise ValueError('更新元以外への転送を拒否しました。')
            return super().redirect_request(req, fp, code, msg, headers, newurl)
    req = urllib.request.Request(url, headers={'User-Agent': 'LLMs-Monitor-Updater/' + TOOL_VERSION, 'Cache-Control': 'no-cache'})
    with urllib.request.build_opener(Redirect()).open(req, timeout=25) as response:
        data = response.read(limit + 1)
        if len(data) > limit:
            raise ValueError('更新ファイルが大きすぎます。')
        return data


def manifest_ok(m):
    return (isinstance(m, dict) and m.get('manifest_version') == 3
            and m.get('name') == '__MSG_extensionName__'
            and m.get('background', {}).get('service_worker') == 'background.js'
            and 'https://llmsmonitor.ntus.info/*' in m.get('externally_connectable', {}).get('matches', []))


def target_manifest(target):
    target = Path(target).expanduser().absolute()
    if any('/Library/Application Support/' + browser + '/' in str(target) + '/' for browser in ('Google/Chrome', 'Microsoft Edge')):
        raise ValueError('ストア版やブラウザーのプロフィール内は更新できません。手動で読み込んだ拡張機能フォルダーを選んでください。')
    if any(p.is_symlink() for p in (target, *target.parents)):
        raise ValueError('リンク先のフォルダーは更新できません。元のフォルダーを選んでください。')
    if not target.is_dir() or any(not (target / f).is_file() or (target / f).is_symlink() for f in REQUIRED):
        raise ValueError('現在のLLMs Monitor拡張機能フォルダーを選んでください。')
    if (target / 'manifest.json').stat().st_size > 100000:
        raise ValueError('拡張機能の情報が不正です。')
    m = json.loads((target / 'manifest.json').read_text())
    if not manifest_ok(m):
        raise ValueError('LLMs Monitor以外のフォルダーは更新できません。')
    version(m.get('version'))
    return target, m


def unpack(package, info, stage):
    info = release(info)
    if len(package) > MAX_BYTES or hashlib.sha256(package).hexdigest() != info['sha256']:
        raise ValueError('更新ファイルの検証に失敗しました。更新していません。')
    import io
    with zipfile.ZipFile(io.BytesIO(package)) as z:
        files = z.infolist()
        if len(files) > 2500 or sum(f.file_size for f in files) > 100 * 1024 * 1024:
            raise ValueError('ZIPの展開サイズが大きすぎます。')
        seen = set()
        for item in files:
            p = PurePosixPath(item.filename)
            key = unicodedata.normalize('NFC', str(p)).casefold()
            mode = item.external_attr >> 16
            if (not item.filename or '\\' in item.filename or p.is_absolute() or '..' in p.parts
                    or ':' in item.filename or key in seen or item.flag_bits & 1
                    or stat.S_ISLNK(mode) or (stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR))):
                raise ValueError('安全に展開できないZIPです。')
            seen.add(key)
            if item.is_dir():
                (stage / p).mkdir(parents=True, exist_ok=True)
            else:
                dest = stage / p
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(z.read(item))
                dest.chmod(0o755 if mode & 0o111 else 0o644)
    if any(not (stage / f).is_file() for f in REQUIRED):
        raise ValueError('必要な拡張機能ファイルがありません。')
    if (stage / 'manifest.json').stat().st_size > 100000:
        raise ValueError('拡張機能の情報が大きすぎます。')
    m = json.loads((stage / 'manifest.json').read_text())
    if not manifest_ok(m) or m.get('version') != info['version']:
        raise ValueError('ZIPと更新情報の版が一致しません。')
    return m


def atomic_json(path, value):
    temp = path.with_name(path.name + '.tmp')
    with open(temp, 'w') as out:
        json.dump(value, out, ensure_ascii=False, indent=2)
        out.flush()
        os.fsync(out.fileno())
    os.replace(temp, path)


@contextlib.contextmanager
def locked(config):
    config.mkdir(parents=True, exist_ok=True, mode=0o700)
    with open(config / 'update.lock', 'a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError('別の更新処理が実行中です。終了後に再実行してください。')
        yield


def apply(target, package, info, approve_permissions=lambda old, new: False, replace=os.replace):
    target, old = target_manifest(target)
    info = release(info)
    if version(info['version']) <= version(old['version']):
        return {'status': 'current', 'version': old['version']}
    stage = Path(tempfile.mkdtemp(prefix='.llms-monitor-stage-', dir=target.parent))
    backup = target.with_name('.' + target.name + '.llms-backup-' + time.strftime('%Y%m%d-%H%M%S') + '-' + uuid.uuid4().hex[:6])
    try:
        new = unpack(package, info, stage)
        if old.get('key') != new.get('key'):
            raise ValueError('拡張機能IDが変わる更新は自動適用しません。案内を確認してください。')
        extra = set(new.get('permissions', []) + new.get('host_permissions', [])) - set(old.get('permissions', []) + old.get('host_permissions', []))
        if extra and not approve_permissions(old, new):
            raise ValueError('必要なアクセス権が増えるため、更新を中止しました。')
        # Marker is written only after archive verification, into the staged extension.
        atomic_json(stage / 'llms-monitor-update-request.json', {'schemaVersion': 1, 'version': new['version'], 'nonce': uuid.uuid4().hex})
        # Revalidate before the swap. Chrome storage lives outside this code directory.
        live_target, live = target_manifest(target)
        if live != old or live_target != target:
            raise ValueError('更新先が処理中に変更されました。更新していません。')
        replace(target, backup)
        try:
            replace(stage, target)
        except BaseException:
            replace(backup, target)
            raise
        return {'status': 'updated', 'from': old['version'], 'version': new['version'], 'backup': str(backup), 'target': str(target)}
    finally:
        if stage.exists():
            shutil.rmtree(stage)
        # A successful backup is never deleted automatically.


def rollback(target, backup):
    target, current = target_manifest(target)
    backup, old = target_manifest(backup)
    if target.parent != backup.parent or not backup.name.startswith('.' + target.name + '.llms-backup-'):
        raise ValueError('この更新先のバックアップではありません。')
    if current.get('key') != old.get('key'):
        raise ValueError('IDが異なるバックアップへは戻せません。')
    retained = target.with_name('.' + target.name + '.llms-before-restore-' + uuid.uuid4().hex[:8])
    os.replace(target, retained)
    try:
        os.replace(backup, target)
    except BaseException:
        os.replace(retained, target)
        raise
    return old['version']


def dialog(message):
    # Used only by the user-launched app. No browser/OS settings automation.
    subprocess.run(['/usr/bin/osascript', '-e', 'on run argv', '-e', 'display dialog (item 1 of argv) with title "LLMs Monitor 更新" buttons {"OK"} default button "OK"', '-e', 'end run', message], check=True, capture_output=True)


def choose_target():
    script = 'POSIX path of (choose folder with prompt "Chromeで現在読み込んでいるLLMs Monitorのフォルダーを選択してください。新しい保存先ではありません。")'
    return Path(subprocess.run(['/usr/bin/osascript', '-e', script], check=True, capture_output=True, text=True).stdout.strip())


def approve(old, new):
    extra = sorted(set(new.get('permissions', []) + new.get('host_permissions', [])) - set(old.get('permissions', []) + old.get('host_permissions', [])))
    message = 'この更新では必要なアクセス権が増えます。\n' + '\n'.join(extra) + '\n\n続行しますか？ Chrome側で追加の許可が必要になる場合があります。'
    r = subprocess.run(['/usr/bin/osascript', '-e', 'on run argv', '-e', 'button returned of (display dialog (item 1 of argv) buttons {"中止", "続行"} default button "中止" with title "LLMs Monitor 更新")', '-e', 'end run', message], capture_output=True, text=True)
    return r.returncode == 0 and r.stdout.strip() == '続行'


def main():
    if sys.platform != 'darwin':
        raise ValueError('この更新アプリはmacOS用です。')
    with locked(CONFIG):
        path = CONFIG / 'settings.json'
        settings = json.loads(path.read_text()) if path.exists() else {}
        if '--restore' in sys.argv:
            if not settings.get('backup') or not settings.get('target'):
                raise ValueError('復元できるバックアップがありません。')
            v = rollback(settings['target'], settings['backup'])
            settings.pop('backup', None)
            atomic_json(path, settings)
            dialog('前の版 v' + v + ' に戻しました。Chromeの拡張機能画面で再読み込みしてください。')
            return
        if not settings.get('target'):
            target, _ = target_manifest(choose_target())
            confirmation = subprocess.run(['/usr/bin/osascript', '-e', 'on run argv', '-e', 'button returned of (display dialog (item 1 of argv) buttons {"中止", "このフォルダーを使う"} default button "中止" with title "LLMs Monitor 初回登録")', '-e', 'end run', '更新先：' + str(target) + '\n現在の版：' + _['version'] + '\n\nChrome／Edgeが現在読み込んでいるフォルダーですか？ 次回以降も、この同じ場所の中身だけを更新します。フォルダー名に版番号があっても変更しません。'], capture_output=True, text=True)
            if confirmation.returncode != 0 or confirmation.stdout.strip() != 'このフォルダーを使う':
                return
            settings['target'] = str(target)
            atomic_json(path, settings)
        target, old = target_manifest(settings['target'])
        try:
            info = release(json.loads(fetch(FEED, 16384)))
            package = fetch(BASE + info['package'], MAX_BYTES) if version(info['version']) > version(old['version']) else b''
        except Exception:
            raise ValueError('最新版を取得できませんでした。通信を確認して再実行してください。ファイルは更新していません。')
        result = apply(target, package, info, approve)
        if result['status'] == 'current':
            dialog('現在の v' + result['version'] + ' は配信中の最新版です。')
            return
        settings.update({'backup': result['backup'], 'version': result['version']})
        atomic_json(path, settings)
        first = version(result['from']) < version('1.58.0')
        dialog('v' + result['version'] + ' へ更新しました。\n\n' + ('今回だけChromeの拡張機能画面で再読み込みしてください。次回からは約1分以内に自動で再読み込みします。' if first else '更新対応版が約1分以内に自動で再読み込みします。Chromeを閉じていた場合は次回起動時に反映されます。') + '\n\n更新先のフォルダーは変更していません。設定・履歴は維持されます。\n更新前のファイルはバックアップしました。')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        if '-128' not in str(error.stderr):
            try:
                dialog('操作を完了できませんでした。設定と履歴は変更していません。')
            except Exception:
                pass
    except Exception as error:
        try:
            dialog(str(error))
        except Exception:
            print(str(error), file=sys.stderr)
