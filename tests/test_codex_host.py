import importlib.util
import io
import json
from pathlib import Path
import struct
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("codex_host", ROOT / "native/codex_host.py")
H = importlib.util.module_from_spec(spec)
spec.loader.exec_module(H)
spec = importlib.util.spec_from_file_location("codex_install", ROOT / "native/install.py")
I = importlib.util.module_from_spec(spec)
spec.loader.exec_module(I)


def ident(n):
    return "00000000-0000-0000-0000-" + str(n).zfill(12)


def thread(n, status=None):
    return {"id": ident(n), "name": "Synthetic " + str(n), "preview": "PRIVATE_MESSAGE_DO_NOT_FORWARD", "turns": [{"text": "PRIVATE_TURN"}], "updatedAt": 1700000000 + n, "status": status or {"type": "notLoaded"}}


class Fake:
    def __init__(self, pages, missing=()):
        self.pages = pages
        self.calls = []
        self.missing = missing

    def call(self, method, params):
        self.calls.append((method, params))
        if method == "thread/read":
            if params["threadId"] in self.missing:
                raise ValueError("missing")
            return {"thread": thread(int(params["threadId"].split("-")[-1]))}
        return self.pages.pop(0)


class HostTests(unittest.TestCase):
    def test_all_local_pins_resolve_even_outside_recent_list_and_pages_dedupe(self):
        pins = [ident(100), ident(101)]
        rpc = Fake([{"data": [thread(1), thread(2)], "nextCursor": "next"}, {"data": [thread(2), thread(3)], "nextCursor": None}])
        reply = H.collect(rpc, pins, True, False)
        self.assertEqual(reply["pinAudit"], {"observed": 2, "resolved": 2, "complete": True, "source": "desktop-compatibility"})
        self.assertEqual(len(reply["tasks"]), 5)
        self.assertTrue(all(t["pinned"] for t in reply["tasks"][:2]))
        self.assertTrue(all(t["status"] == "unknown" for t in reply["tasks"]))
        self.assertNotIn("PRIVATE", json.dumps(reply))
        for method, params in rpc.calls:
            if method == "thread/read":
                self.assertIs(params["includeTurns"], False)
            else:
                self.assertTrue(params["useStateDbOnly"])
                self.assertFalse(params["archived"])
                self.assertIn("appServer", params["sourceKinds"])

    def test_runtime_mapping_is_evidenced_and_not_loaded_or_idle_never_completed(self):
        for value, expected in [("idle", "idle"), ("notLoaded", "unknown"), ("systemError", "failed"), ("active", "running")]:
            source = thread(1, {"type": value, "activeFlags": []})
            self.assertEqual(H.state_of(source, True), expected)
            self.assertEqual(H.state_of(source, False), "unknown")
        self.assertEqual(H.state_of(thread(1, {"type": "active", "activeFlags": ["waitingOnApproval"]}), True), "waiting")
        self.assertEqual(H.state_of(thread(1, {"type": "active", "activeFlags": ["waitingOnUserInput"]}), True), "waiting")
        self.assertIsNone(H.project(thread(1), [], False, "now")["observedAt"])
        no_name = thread(1)
        no_name.pop("name")
        self.assertEqual(H.project(no_name, [], True, "now")["title"], "Codex task")

    def test_missing_pins_unknown_schema_repeated_cursor_and_limit_are_explicit(self):
        rpc = Fake([{"data": [], "nextCursor": "same"}, {"data": [], "nextCursor": "same"}], missing=[ident(1)])
        reply = H.collect(rpc, [ident(1)], True, True)
        self.assertFalse(reply["pinAudit"]["complete"])
        self.assertEqual(reply["pinAudit"]["resolved"], 0)
        self.assertTrue(reply["limited"])
        reply = H.collect(Fake([{"data": [thread(n) for n in range(500)], "nextCursor": "more"}]), [], True, False)
        self.assertEqual(len(reply["tasks"]), 500)
        self.assertTrue(reply["limited"])
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            self.assertEqual(H.pinned_ids(home), ([], False))
            (home / ".codex-global-state.json").write_text(json.dumps({"pinned-thread-ids": [ident(1), ident(1)], "auth": "DO_NOT_USE"}))
            self.assertEqual(H.pinned_ids(home), ([ident(1)], True))
            (home / ".codex-global-state.json").write_text(json.dumps({"pinned-thread-ids": [ident(1), "bad"]}))
            self.assertEqual(H.pinned_ids(home), ([ident(1)], False))

    def test_native_protocol_accepts_only_fixed_read_request_and_size(self):
        for value in [{"type": "CODEX_TASKS_READ", "command": "run"}, {"type": "turn/start"}, {"type": "CODEX_TASKS_READ", "path": "/private"}]:
            raw = json.dumps(value).encode()
            with self.assertRaises(ValueError):
                H.read_message(io.BytesIO(struct.pack("=I", len(raw)) + raw))
        raw = b'{"type":"CODEX_TASKS_READ"}'
        H.read_message(io.BytesIO(struct.pack("=I", len(raw)) + raw))
        for raw in [b"", struct.pack("=I", 2000), struct.pack("=I", 4) + b"{}"]:
            with self.assertRaises(ValueError):
                H.read_message(io.BytesIO(raw))
        result = io.BytesIO()
        H.write_message(result, {"title": "日本語"})
        data = result.getvalue()
        self.assertEqual(struct.unpack("=I", data[:4])[0], len(data[4:]))
        self.assertEqual(json.loads(data[4:])["title"], "日本語")
        with self.assertRaises(ValueError):
            H.RPC.call(object(), "turn/start", {})

    def test_installer_is_per_user_exact_origin_and_preserves_other_hosts(self):
        with tempfile.TemporaryDirectory(prefix="codex helper ") as directory:
            home = Path(directory)
            base = I.install("a" * 32, home, "darwin")
            manifest = home / "Library/Application Support/Google/Chrome/NativeMessagingHosts" / (I.HOST + ".json")
            data = json.loads(manifest.read_text())
            self.assertEqual(data["allowed_origins"], ["chrome-extension://" + "a" * 32 + "/"])
            self.assertEqual(Path(data["path"]), base / "launch")
            self.assertEqual((base / "launch").stat().st_mode & 0o777, 0o700)
            self.assertIn('"$@"', (base / "launch").read_text())
            manifest.write_text(json.dumps({"path": "/unrelated"}))
            with self.assertRaises(ValueError):
                I.install("a" * 32, home, "darwin")
        with self.assertRaises(ValueError):
            I.install("../bad", Path("/tmp"), "darwin")
        with self.assertRaises(ValueError):
            I.install("a" * 32, Path("/tmp"), "win32")


if __name__ == "__main__":
    unittest.main()
