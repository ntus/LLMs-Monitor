# Optional ai-bus capacity MVP / 任意のチーム状態表示

This is an offline self-reported capacity snapshot, **not live task/execution monitoring**. LLMs Monitor works normally without this feature, ai-bus, an account token, or a server.

Download the source tool from [LLMs Monitor](https://llmsmonitor.ntus.info/tools/ai-bus/snapshot.py). Save it in a trusted work folder; the command below assumes the repository checkout.

1. Use an existing trusted local checkout whose `origin` is exactly `ntus/ai-bus` on GitHub. The exporter does not fetch. Refresh the checkout through the existing authorized process when needed.
2. Run (replace the local path):

```sh
python3 tools/ai-bus/snapshot.py --repo /path/to/ai-bus --ref origin/main --output /private/tmp/team-status.json
```

Choose a new output filename if it already exists. The exporter refuses to overwrite existing files or symlinks, emits a0600 file, pins the resolved commit once, and reads only `status/chatgpt.md`, `claude.md`, `codex.md`, `grok.md`, `muse.md`. Oversized/missing files yield partial/unknown results. It does not modify the checkout or remote. Flat frontmatter only: exact `level` values `余裕あり`, `注意`, `枯渇に近い`; prose/unknown levels are unconfirmed. Strict ISO timestamps are preserved as self-reports, not official provider reset evidence. No use is made of Markdown body, subjects, envelopes, notes or credentials.
3. Open **チーム / Team** in the top header (before the product link); choose this JSON. File processing stays in this browser, with no upload or telemetry. Only the strict sanitized schema is saved in a separate localStorage key; quotas/history/settings remain independent. Imported files are data, never commands.
4. The panel distinguishes report time from snapshot collection time. More than24h old, missing or future report times become unconfirmed; stale reset times never prove recovery. The capacity counts are not summed quota percentages, live runtime, outages or completed tasks. `complete:false` means some source files could not be read, not healthy/zero.
5. **接続データを消去 / Clear local data** removes only the team snapshot. Default/empty/error behavior does not alter the normal monitor. It does not connect automatically on another browser or domain.

日本語：端末内で作成した状態JSONを任意に読み込む最小版です。自動同期はありません。通常の残量モニターは単独で動作します。GitHub認証付きcollector、リアルタイム実行状況、封筒の未応答/終端照合は将来の別段階です。承認済み設計は [ai-bus dashboard design](../../docs/design/ai-bus-dashboard.md) を参照。PMO助言は承認と同一視しません。

Do not commit generated snapshots or place them in `dist/`, a shared drive, public repository, or deploy archive. The code/package includes no private data or token. Existing Site access and host permissions are unchanged.

## Freshness and collaboration / 鮮度と協業

The panel shows collection time, each report time, why a value is unconfirmed, the fixed-commit source file and the next manual step. The header button stays short; capacity counts appear in its accessible label and panel. Imported data never starts work.

パネルで収集時刻・申告時刻・未確認の理由・固定commitの出典・次の操作を確認できます。ヘッダーボタンは短く保ちます。協業は [チーム資料](../../docs/team/README.md) を参照。各参加者は本人の契約と認証で作業し、APIキー共有・利用枠の移転は行いません。自動同期・割当は未実装です。
