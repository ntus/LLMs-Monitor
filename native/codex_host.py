#!/usr/bin/env python3
"""Read-only Codex metadata adapter. Never forward previews, turns or events."""
import datetime as dt
import json
import os
from pathlib import Path
import re
import selectors
import shutil
import struct
import subprocess
import sys
import time

HOST = "info.ntus.llmsmonitor.codex"
VERSION = "1.30.2"
LIMIT = 500
ACQUIRE_SECONDS = 21
SHARED_SECONDS = 4
UUID = re.compile(r"^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$", re.I)
METHODS = {"initialize", "thread/list", "thread/read"}


def iso(value=None):
    try:
        return dt.datetime.fromtimestamp(time.time() if value is None else float(value), dt.timezone.utc).isoformat()
    except (ValueError, TypeError, OverflowError, OSError):
        return None


def pinned_ids(home):
    # Compatibility adapter for desktop releases without a public isPinned filter.
    # Only the local pin-ID field is used; settings, auth and other fields are ignored.
    path = home / ".codex-global-state.json"
    try:
        if path.stat().st_size > 4 * 1024 * 1024:
            return [], False
        state = json.loads(path.read_text())
        if not isinstance(state, dict):
            return [], False
        values = state.get("pinned-thread-ids")
        if not isinstance(values, list):
            return [], False
        valid = list(dict.fromkeys(v for v in values if isinstance(v, str) and UUID.fullmatch(v)))
        valid_only = all(isinstance(v, str) and UUID.fullmatch(v) for v in values)
        return valid[:LIMIT], valid_only and len(valid) <= LIMIT
    except (OSError, ValueError, TypeError):
        return [], False


def state_of(thread, live):
    if not live:
        return "unknown"
    state = thread.get("status")
    if not isinstance(state, dict):
        return "unknown"
    kind = state.get("type")
    if kind == "active":
        return "waiting" if any(x in (state.get("activeFlags") or []) for x in ("waitingOnApproval", "waitingOnUserInput")) else "running"
    return {"idle": "idle", "systemError": "failed"}.get(kind, "unknown")


def project(thread, pins, live, checked):
    if not isinstance(thread, dict) or not isinstance(thread.get("id"), str) or not UUID.fullmatch(thread["id"]):
        return None
    # 'preview' can contain the first message; deliberately never use it as a title.
    name = thread.get("name")
    name = re.sub(r"[\x00-\x1f\x7f]", " ", name).strip()[:160] if isinstance(name, str) else ""
    status = state_of(thread, live)
    return {"id": thread["id"], "title": name or "Codex task", "pinned": thread["id"] in pins,
            "status": status, "observedAt": checked if status != "unknown" else None,
            "updatedAt": iso(thread.get("updatedAt")) if thread.get("updatedAt") is not None else None,
            "url": "codex://threads/" + thread["id"]}


class RPC:
    def __init__(self, command, deadline=None):
        self.deadline = deadline if deadline is not None else time.monotonic() + 20
        self.proc = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        self.sel = selectors.DefaultSelector()
        self.sel.register(self.proc.stdout, selectors.EVENT_READ)
        self.buffer = b""
        self.number = 0

    def send(self, value):
        self.proc.stdin.write(json.dumps(value, separators=(",", ":")).encode() + b"\n")
        self.proc.stdin.flush()

    def call(self, method, params):
        if method not in METHODS:
            raise ValueError("Unsupported method")
        self.number += 1
        number = self.number
        self.send({"id": number, "method": method, "params": params})
        while time.monotonic() < self.deadline:
            while b"\n" in self.buffer:
                line, self.buffer = self.buffer.split(b"\n", 1)
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise ValueError("Invalid metadata reply")
                # Drop all notifications (including output/message events).
                if value.get("id") == number and ("result" in value or "error" in value):
                    if "error" in value:
                        raise ValueError("Metadata unavailable")
                    if not isinstance(value["result"], dict):
                        raise ValueError("Invalid metadata reply")
                    return value["result"]
            if not self.sel.select(max(0, min(1, self.deadline - time.monotonic()))):
                continue
            part = os.read(self.proc.stdout.fileno(), 65536)
            if not part:
                raise ValueError("Metadata connection closed")
            self.buffer += part
            if len(self.buffer) > 8 * 1024 * 1024:
                raise ValueError("Metadata reply too large")
        raise TimeoutError("Metadata timeout")

    def close(self):
        self.sel.close()
        if self.proc.poll() is None:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=1)
            except subprocess.TimeoutExpired:
                self.proc.kill()
                self.proc.wait()
        for pipe in (self.proc.stdin, self.proc.stdout):
            pipe.close()


def collect(rpc, pins, pins_known, live):
    checked = iso()
    records = {}
    missing = 0
    for ident in pins:
        try:
            reply = rpc.call("thread/read", {"threadId": ident, "includeTurns": False})
            row = project(reply.get("thread"), pins, live, checked)
            if row and row["id"] == ident:
                records[ident] = row
            else:
                missing += 1
        except ValueError:
            missing += 1
    cursor, seen, limited = None, set(), False
    while len(records) < LIMIT:
        params = {"limit": min(100, LIMIT - len(records)), "archived": False, "useStateDbOnly": True,
                  "sourceKinds": ["cli", "vscode", "exec", "appServer", "unknown"], "modelProviders": []}
        if cursor:
            params["cursor"] = cursor
        reply = rpc.call("thread/list", params)
        for thread in reply.get("data", []):
            row = project(thread, pins, live, checked)
            if row:
                records[row["id"]] = row
        cursor = reply.get("nextCursor")
        if not cursor:
            break
        if cursor in seen:
            limited = True
            break
        seen.add(cursor)
    limited = limited or bool(cursor)
    resolved = sum(ident in records for ident in pins)
    tasks = sorted(records.values(), key=lambda row: (not row["pinned"], -(dt.datetime.fromisoformat(row["updatedAt"]).timestamp() if row["updatedAt"] else 0), row["id"]))
    return {"status": "ready", "schemaVersion": 1, "checkedAt": checked, "scope": "local-desktop",
            "runtime": "shared" if live else "metadata-only", "limited": limited,
            "pinAudit": {"observed": len(pins), "resolved": resolved, "complete": pins_known and resolved == len(pins), "source": "desktop-compatibility"},
            "tasks": tasks[:LIMIT]}


def acquire():
    deadline = time.monotonic() + ACQUIRE_SECONDS
    home = Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))).expanduser()
    candidates = [shutil.which("codex"), "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex", "/Applications/Codex.app/Contents/Resources/codex"]
    binary = next((v for v in candidates if v and Path(v).is_file() and os.access(v, os.X_OK)), None)
    if not binary:
        return {"status": "codex-not-found"}
    pins, known = pinned_ids(home)
    socket = home / "app-server-control" / "app-server-control.sock"
    commands = [([binary, "app-server", "proxy", "--sock", str(socket)], True)] if socket.exists() else []
    # A separate stdio instance reads metadata but cannot observe the desktop runtime.
    commands.append(([binary, "app-server", "--stdio"], False))
    for command, live in commands:
        rpc = None
        try:
            # A stale/unresponsive shared socket must not spend the fallback's
            # entire budget. Bound all shared RPCs, including pin/list reads.
            attempt_deadline = min(deadline, time.monotonic() + SHARED_SECONDS) if live else deadline
            rpc = RPC(command, attempt_deadline)
            rpc.call("initialize", {"clientInfo": {"name": "llms_monitor_codex", "version": VERSION}, "capabilities": {"experimentalApi": False}})
            rpc.send({"method": "initialized", "params": {}})
            return collect(rpc, pins, known, live)
        except (OSError, ValueError, TimeoutError, KeyError, TypeError):
            pass
        finally:
            if rpc:
                rpc.close()
    return {"status": "unavailable"}


def read_message(stream):
    header = stream.read(4)
    if len(header) != 4:
        raise ValueError("Incomplete message")
    length = struct.unpack("=I", header)[0]
    if not 0 < length <= 1024:
        raise ValueError("Invalid message size")
    raw = stream.read(length)
    if len(raw) != length:
        raise ValueError("Incomplete message")
    value = json.loads(raw)
    if value != {"type": "CODEX_TASKS_READ"}:
        raise ValueError("Unsupported request")


def write_message(stream, value):
    raw = json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode()
    if len(raw) > 512 * 1024:
        raw = b'{"status":"unavailable"}'
    stream.write(struct.pack("=I", len(raw)) + raw)
    stream.flush()


def main():
    if sys.argv[1:] == ["--check"]:
        reply = acquire()
        # Check reports counts only; no private title, link, ID or path is printed.
        print(json.dumps({k: reply.get(k) for k in ("status", "runtime", "limited", "pinAudit")} | {"tasks": len(reply.get("tasks", []))}))
        return
    # Browser origin is checked against the exact ID selected during installation.
    try:
        config = json.loads(Path(__file__).with_name("allowed-origin.json").read_text())
        if len(sys.argv) < 2 or sys.argv[1] != config["origin"]:
            return
        read_message(sys.stdin.buffer)
        write_message(sys.stdout.buffer, acquire())
    except (OSError, ValueError, KeyError, TypeError):
        write_message(sys.stdout.buffer, {"status": "unavailable"})


if __name__ == "__main__":
    main()
