# Security review — v1.24.0 beta

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

This review records the checks performed for the 1.24.0 beta; it is not a guarantee that no vulnerabilities exist. A release owner should also test the packaged extension in current Chrome and Edge with real accounts and submit it to store review.

## v1.24.0 presentation changes

Incident-only rows are selected from already normalized status state at render time; the source state is not mutated. The main status renderer defaults to all rows. No new permissions, networking, storage or audio behavior is added. Task changes are isolated CSS and asset-version updates. All 181 regression tests pass, including actual widget rendering and recovery/unavailable cases. Acquisition/history/audio/lifecycle source files and manifest permissions were compared to the baseline and remain unchanged. Signed-in live accounts, native windows and visual review are pending; this test result is not a security or visual guarantee.

## Attack surface and controls

- **Origins and permissions:** `externally_connectable` permits only the exact custom HTTPS monitor origin and the previous Site origin retained for compatibility; wildcard domains are excluded. Provider content scripts run only on the three official AI sites. Public status feeds have fixed HTTPS URLs and credential-free requests. API billing support adds only optional `scripting` and three optional billing hosts, enabled individually through a direct extension-page gesture. Existing required permissions are unchanged.
- **Message validation:** service snapshots are accepted only from the matching provider origin. The arrays, percentages, labels, and counts are bounded before storage. State-changing settings and window commands require the extension's own origin or the approved monitor origin.
- **Untrusted content:** incident text, provider-derived labels, and the new ChatGPT reset wording are length-bounded and escaped before HTML rendering. Links are fixed to official HTTPS pages. No remote scripts, `eval`, or arbitrary URL navigation are used for status content.
- **X intelligence boundary:** the extension receives only normalized public-post data from the fixed companion endpoint. X credentials remain a server runtime secret. External links are restricted to X and BridgeBench HTTPS hosts; the first successful feed is a silent baseline and IDs prevent repeat alerts.
- **Network and storage:** status responses have an 8-second timeout and a 3 MB cap. Incident requests omit credentials. Account data, history, and the last status summary remain in browser storage; no developer analytics endpoint receives them. Existing stored history is not migrated or deleted.
- **Reset-expiry recovery:** only a verified available entitlement with no expiry triggers a check of the already-permitted ChatGPT usage origin. A pre-existing tab is reloaded only when its content reader is absent, with a five-minute per-tab cooldown. If no tab exists, an inactive official tab is opened briefly and closed after acquisition or at a 45-second alarm. Only its tab ID is temporarily stored for cleanup; no new host or broad `tabs` permission is requested.
- **Notification behavior:** a new issue signature triggers one browser popup and one audio sequence. Repeated one-minute checks of the same signature do not retrigger. Unknown source state is shown as unavailable, not as healthy. Recovery is based only on a subsequent official healthy response and is retained for ten minutes.

- **API billing isolation:** a new `apiCredits` key holds only bounded amount/currency/status, a billing-scope fingerprint and observation time. Incoming values require an enabled provider, granted host, exact HTTPS billing origin/path and top frame. Configuration changes are extension-page-only. The reader never collects input fields, API keys or payment details and never navigates or purchases automatically. It does not alter usage, history, reset rights or sounds. Multiple balances, absent data and postpaid are not fabricated as zero. Disconnect removes host access.

The v1.24.0 origin regression executes the actual external listener: both approved origins can GET and update settings; HTTP, lookalike hosts, alternate ports and localhost cannot read or mutate state. Stored history is unchanged. Live Chrome/Edge pairing on the custom domain still requires manual acceptance.

## Verification and limits

`node --test tests/*.test.cjs` exercises the status parser, hostile summary escaping, service filtering, duplicate-incident signature, and existing regression contracts. `python3 build.py --package` checks version alignment and packages only the `extension/` tree. The regression suite distinguishes missing, expired, failed, and genuinely exhausted Claude sessions and guards a contradictory API zero against a positive official-page value. The server credential, KV binding, cron, and live X responses remain externally unconfigured and require manual verification. This is static and unit-level review; live provider responses, browser permission dialogs, accessibility, audio quality, and store policy acceptance still require manual review. Google's Workspace status feed may not report every Gemini consumer issue. False negatives remain possible when providers omit incidents or change their feeds.

---

## Web-only task trial v1.23.1

The new route denies network connections in CSP, loads only its independent local scripts/styles, and handles explicitly selected JSON in memory. Inputs are capped at 512 KiB/500 nodes/12 levels; duplicate IDs, cycles, missing or cross-project/cross-kind parents and mismatched services are rejected. Rendering uses textContent, not HTML injection. Chat links require the selected provider’s exact HTTPS host and a conversation route, with no credentials, port, query or fragment. New windows sever opener; link fallback uses noopener/noreferrer. Demos carry an explicit synthetic label. Private snapshots stay outside the repository/deployment, are not logged, and are cleared by reload/close/Clear. Existing extension permissions, GET fields and ZIP are untouched. Live provider task acquisition is not implemented.

<a id="ja"></a>

# 日本語 — セキュリティ検証記録

[🌍 EN](#en) · [🇯🇵 JP](#ja)

v1.24.0 βで確認した範囲の記録です。「脆弱性が存在しない」という保証ではありません。正式公開前には最新版Chrome／Edgeの実アカウントで配布ZIPを確認し、ストア審査を受けてください。

外部接続先は独自ドメインと互換性用旧URLの2つのHTTPS origin、ページ内スクリプトは3社の公式サイトに限定しています。障害情報は固定した公式HTTPS URLから認証情報なしで取得し、8秒でタイムアウト、3 MB超の応答を拒否します。受信したスナップショットの型・件数・数値範囲を検証します。障害の文章はHTML表示時にエスケープし、リンク先は公式URLに固定します。新しい障害だけ通知し、同じ障害を1分ごとに鳴らし直しません。取得失敗は正常扱いせず「確認できません」と表示します。

自動テストとZIP生成で回帰を確認しますが、実サービス応答、ブラウザー権限表示、アクセシビリティ、ストア規約は手動検証が必要です。Google Workspaceの公開情報にはGemini個別の障害がすべて載るとは限りません。


v1.17.0: Existing ChatGPT usage tabs are reloaded once after an extension update so the current parser can observe an official entitlement expiry. The utility directory contains static external HTTPS links only. Nerf Bench monitoring is disabled.


v1.17.1: The AI tool directory uses static HTTPS links in the existing card layout and is hidden in fullscreen. No permissions, data collection, storage, or network polling changed.

API請求連携は任意の事業者別ホスト権限とscriptingのみを追加します。正規の請求パス・トップフレーム・許可済みかつ有効な事業者のみ受理し、金額・通貨・状態・請求範囲の指紋・観測時刻を独立保存します。入力欄や決済情報は収集せず、既存の利用枠・履歴・リセット権・通知音は変更しません。未取得と後払いを0円にしません。Claude／Geminiのログイン済み請求画面は引き続き手動検証が必要です。

Diagnostic events are restricted to numeric fields and fixed categories in extension-owned IndexedDB; export requires an extension-page click. Quota or IndexedDB failure is nonfatal to usage refresh. Live-account/manual review remains required before store submission.

診断イベントは拡張機能内IndexedDBの数値と固定区分に限定し、書出しは拡張機能画面の手動操作のみとする。容量不足・IndexedDB失敗時も残量更新を止めない。ストア提出前の実アカウント確認は引き続き必要。

1.24.0の接続元テストは実際の外部メッセージ処理を実行し、許可済み2originのGETと設定更新、紛らわしいhost・HTTP・別port・localhostの拒否、履歴の保持を確認する。実Chrome／Edgeでの独自ドメイン接続は手動確認が必要。

## Web限定タスク試作 v1.23.1

新画面はCSPでネットワーク通信を禁止し、独立したローカルスクリプト/CSSだけを読む。選択JSONはメモリー内のみで扱い、512 KiB・500件・12階層以内に限定する。重複ID、循環、存在しない親、別プロジェクト/別種別の親、別サービス入力を拒否する。textContentで描画し、外部文面をHTMLにしない。リンクは対象事業者の厳密なHTTPSホストとチャットパスのみで、認証情報・port・query・fragmentを拒否する。別窓はopenerを切り、別タブへの代替リンクはnoopener/noreferrerを使う。サンプルは架空と明示。個人の一覧はリポジトリ/配布物の外に置き、ログへ記録せず、再読込・終了・消去で破棄する。既存権限・GET・ZIPは変更しない。各社タスクの実取得は未実装。

## v1.24.0 表示調整

障害行の選択は正規化済みの表示値に限り、元状態を変更しない。主画面は全社表示のまま。新権限・通信・保存・音処理は追加せず、タスク調整は独立CSSと資産版だけ。全181件の回帰テスト、ZIP整合性、取得/履歴/音/ライフサイクルソースと権限の変更前比較に合格。実アカウント・実画面・ネイティブ窓は未確認であり、安全性や表示の完全保証としない。
