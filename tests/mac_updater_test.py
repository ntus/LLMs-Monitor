import importlib.util
import io
import json
import hashlib
import os
from pathlib import Path
import stat
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('updater', ROOT / 'tools/mac-updater/updater.py')
U = importlib.util.module_from_spec(spec)
spec.loader.exec_module(U)


def manifest(v='1.57.0'):
    return {'manifest_version': 3, 'name': '__MSG_extensionName__', 'version': v, 'background': {'service_worker': 'background.js'}, 'externally_connectable': {'matches': ['https://llmsmonitor.ntus.info/*']}, 'permissions': ['storage']}


def package(m=None, extra=None):
    m = m or manifest('1.58.0')
    out = io.BytesIO()
    with zipfile.ZipFile(out, 'w') as z:
        for f in U.REQUIRED:
            z.writestr(f, json.dumps(m) if f == 'manifest.json' else 'sample code')
        if extra:
            for name, data in extra:
                z.writestr(name, data)
    data = out.getvalue()
    return data, {'schemaVersion': 1, 'version': m['version'], 'package': 'LLMs-Monitor-v' + m['version'] + '.zip', 'sha256': hashlib.sha256(data).hexdigest()}


class Updater(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name).resolve()
        self.target = self.base / 'existing extension folder'
        self.target.mkdir()
        for f in U.REQUIRED:
            (self.target / f).write_text(json.dumps(manifest()) if f == 'manifest.json' else 'old code')
        self.profile = self.base / 'browser-storage-untouched'
        self.profile.write_text('private-state-fixture')

    def old(self):
        self.assertEqual(json.loads((self.target / 'manifest.json').read_text())['version'], '1.57.0')
        self.assertEqual(self.profile.read_text(), 'private-state-fixture')

    def test_apply_backup_and_restore_same_path(self):
        data, info = package()
        result = U.apply(self.target, data, info)
        self.assertEqual(result['status'], 'updated')
        self.assertEqual(result['target'], str(self.target))
        self.assertEqual(json.loads((self.target / 'manifest.json').read_text())['version'], '1.58.0')
        self.assertEqual(json.loads((self.target / 'llms-monitor-update-request.json').read_text())['version'], '1.58.0')
        self.assertTrue(Path(result['backup']).is_dir())
        self.assertEqual(U.rollback(self.target, result['backup']), '1.57.0')
        self.old()

    def test_failed_final_swap_restores_original(self):
        calls = []
        def replace(a, b):
            calls.append((a, b))
            if len(calls) == 2:
                raise OSError('simulated swap failure')
            os.replace(a, b)
        with self.assertRaises(OSError):
            U.apply(self.target, *package(), replace=replace)
        self.old()
        self.assertFalse(list(self.base.glob('.llms-monitor-stage-*')))

    def test_bad_hash_and_version_are_rejected(self):
        data, info = package()
        for bad in [b'not a zip', data + b'x']:
            with self.assertRaises(ValueError):
                U.apply(self.target, bad, info)
            self.old()
        for v in ['../x', None, '1.2.999999', '1.2', '1.2.3.4', '1.2.-1']:
            with self.assertRaises(ValueError):
                U.version(v)

    def test_archive_attacks_are_rejected_before_swap(self):
        sym = zipfile.ZipInfo('link')
        sym.create_system = 3
        sym.external_attr = (stat.S_IFLNK | 0o777) << 16
        for extra in [[('../escape', 'x')], [('/absolute', 'x')], [('a\\b', 'x')], [('MANIFEST.JSON', 'x')], [(sym, '/tmp')], [('same', 'a'), ('SAME', 'b')], [('e\u0301.txt', 'a'), ('é.txt', 'b')]]:
            with self.subTest(extra=str(extra)):
                with self.assertRaises(ValueError):
                    U.apply(self.target, *package(extra=extra))
                self.old()

    def test_product_key_and_required_permissions(self):
        m = manifest('1.58.0')
        m['name'] = 'other'
        with self.assertRaises(ValueError):
            U.apply(self.target, *package(m))
        m = manifest('1.58.0')
        m['key'] = 'changed-id'
        with self.assertRaises(ValueError):
            U.apply(self.target, *package(m))
        m = manifest('1.58.0')
        m['permissions'].append('scripting')
        with self.assertRaises(ValueError):
            U.apply(self.target, *package(m))
        self.old()
        self.assertEqual(U.apply(self.target, *package(m), approve_permissions=lambda old, new: True)['status'], 'updated')

    def test_no_downgrade_no_unrelated_target_or_symlink(self):
        self.assertEqual(U.apply(self.target, *package(manifest('1.56.0')))['status'], 'current')
        self.old()
        with self.assertRaises(ValueError):
            U.target_manifest(self.base)
        link = self.base / 'link'
        link.symlink_to(self.target)
        with self.assertRaises(ValueError):
            U.target_manifest(link)

    def test_no_offsite_fetch_and_single_lock(self):
        with self.assertRaises(ValueError):
            U.fetch('https://evil.example/update.json', 100)
        with U.locked(self.base / 'config'):
            with self.assertRaises(ValueError):
                with U.locked(self.base / 'config'):
                    pass

    def test_gui_app_bundle_launcher_and_restore(self):
        spec = importlib.util.spec_from_file_location('build_updater', ROOT / 'tools/mac-updater/build.py')
        B = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(B)
        path = B.build(self.base / 'updater.zip')
        with zipfile.ZipFile(path) as z:
            self.assertIsNone(z.testzip())
            entries = [i for i in z.infolist() if i.filename.endswith('/MacOS/LLMsMonitorUpdater')]
            self.assertEqual(len(entries), 2)
            self.assertTrue(all(i.external_attr >> 16 & 0o111 for i in entries))
            self.assertTrue(any(b'--restore' in z.read(i) for i in entries))
            self.assertFalse(any('NativeMessagingHosts' in x for x in z.namelist()))

if __name__ == '__main__':
    unittest.main()
