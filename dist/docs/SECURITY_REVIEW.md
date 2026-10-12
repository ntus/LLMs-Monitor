Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md

# Security review — v1.32.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

This review includes current v1.32.0 checks and historical evidence; it is not a guarantee that no vulnerabilities exist. A release owner should also test the packaged extension in current Chrome and Edge with real accounts and submit it to store review.


## v1.32 release audit — 2026-10-12

User approved all manuals/full build and publication to the existing Site/GitHub. Explicit mute uses root-monitor/top-frame validation and a settings queue independent of quota work; current full-setting messages preserve sound. Prior GET results cannot undo local clicks. OFF invalidates audio generation, stops oscillators and all repeated/threshold timers, and late setup/resume checks mute before playback. OS notifications use silent:true. Preview changes neither mute nor the repeat clock. Legacy extensions retain explicit SETTINGS fallback (immediate cancellation requires the updated extension).

Clicked note handoff narrowly replaces worker-only Map with trusted chrome.storage.session browser memory: 20 entries, two-minute read validity, single-use serialized consumption and expiry-alarm cleanup. Worker suspension is covered by a new-VM regression; browser/extension restart clears this area. Invalid origin/frame/service/duplicate parameters cannot read/consume. There is no storage.local handoff, content-script access expansion or server/log transfer. The new optional workspace preference contains manual provider-scoped labels only; default note identity remains unchanged. Claude title reader scopes the exact thread tile/region aria-label or exact sidebar anchor, never pane/message/draft text. The real selected Claude Code heading attributes were inspected; private names/IDs and QA fixtures remain outside the repository. Editor title updates use existing revision conflict checks and keep URLs/checklists.

No manifest permission/host/CSP expansion, no native helper runtime change. Quota fetch/parsing, state/history/batching, API billing, task state/list acquisition, provider panel and floating lifecycle modules are compared to 51957e7; shared.js differs only in APP_VERSION and main CSS is byte-identical. Changed audio/settings and clicked-note modules have focused tests. Fixed Tibo 𝕏 link is staff information, not official status or evidence that the live feed is configured. The optional helper guide explicitly separates native Install.command from Chrome Load unpacked.

Verification: all **266** CJS/MJS/Python regression tests pass; **20** existing core modules are byte-identical to 51957e7. current-asset/package/manifest reference and checksum checks. Synthetic Chrome 240/340px task/notes screens have no horizontal overflow; title edit/save/original-link/count/default retention, English/Japanese and both themes, main OFF→Preview→theme change remaining OFF and fixed Tibo 𝕏 links were checked. Tests use silent mock audio; no private production notes/chats/credentials are collected or changed.

Remaining release gates: installed Chrome/Edge upgrade, real OS audio/notifications, native helper installation and live Tibo feed acceptance. Main-monitor closure intentionally does not uninstall/stop the extension’s background alarms; OFF is the sound preference. Preserve owner-only Site audience. This is evidence of bounded checks, not an absolute security/regression guarantee.

Implementation sources: [Chrome session storage](https://developer.chrome.com/docs/extensions/reference/api/storage#property-session), [Chrome silent notification option](https://developer.chrome.com/docs/extensions/reference/api/notifications#property-NotificationOptions-silent).

### 日本語 — v1.32

フルビルド承認済み。通知音OFFを残量処理から分離し、遅延再開・予約／警告2音目・古いGET・他窓の一般設定を検証。OS通知はsilent指定、試聴で有効化しない。旧拡張にはSETTINGSの互換経路を残し、即時取消は更新済み拡張が必要。

メモ受渡しだけprocess Mapからブラウザsessionメモリーへ限定変更。20件／2分／一度限り／専用待ち行列／アラーム消去、frame／origin／service／重複query拒否。処理休止後を別VMで検証し、再起動・拡張更新時は破棄。ディスク／server／logへの受渡し保存や権限追加なし。選択スレッドの見出し属性を実確認し、本文・入力は読まない。識別子／URL／チェックリストと保存競合保護を保持。手動領域選択だけ別キーに保存し、旧defaultを維持。

模擬Chrome 240/340px、日英・両テーマ、編集／保存／リンク／件数、OFF→試聴→テーマ変更後もOFF、Tibo 𝕏リンクを確認。モック音声であり実OS音・実拡張更新・ヘルパー導入・Tiboライブ配信の受入は残る。個人メモ・本文・認証情報は検証物へ入れない。残量／履歴／API／一覧／状態／小窓ライフサイクルの基準差分も確認。所有者限定公開を維持し、絶対的な安全／デグレゼロの保証とはしない。

## Historical v1.31 release audit — 2026-10-11

The user approved a full app/extension/manual build. v1.31 adds a selected-service read-only overview, Task titles and bilingual release guides. Against commit `2d5b0bf773780ee81b39b0adb1f42f396268b95a`, 21 core modules (quota/state/history/audio/status/preferences/billing/window and existing task adapters) are byte-identical; manifest differs only in version and new main CSS is byte-identical to v1.30.0. Background changes add isolated TASKS_MONITOR dispatch/import/queue bypass only; intelligence changes are confined to source-link validation, initial-ready baseline and labels. No permission/origin expansion, new state key, quota parser, history migration or native helper runtime change.

TASKS_MONITOR requires exact approved origin, task path, top frame and a single matching service parameter. Unauthorized requests cannot read storage. It reads only data/providerStatus, returns a bounded selected-service projection with no accounts/history/settings/extras/credits, uses fixed status URLs, suppresses expired values and clears login windows/plan. Real-listener regression blocks the main queue and proves reply/no writes. UI uses textContent; hostile labels cannot become HTML. Task CSP remains connect-src none. Existing explicit notes and automatic lists are separate.

Tibo findings: static Site ships unconfigured and does not deploy the Worker. Full-text matching avoids late reset signals being lost to summary truncation; reset/recovery and unrelated password reset are separated. Worker validates complete pages, bounds eight-second/3MB/four-page reads, advances public cursor only after feed commit, and marks old ready data unavailable. Client first success is silent even after prior failed/unconfigured polls. End-to-end synthetic fixtures run actual background notifications/audio dispatch and verify unchanged private quota/history storage. No real X token/API access/cron/eligible real-post notification was tested. Server source is prepared, **not live deployed**. Keyword matching is not exhaustive and never proves personal reset.

Chrome synthetic UI checks at 240/340px verify no horizontal overflow, EN/JP both themes, expired — vs genuine 0%, stale previous, selected-provider incident and login hiding. Product Japanese hero uses two readable lines at 340px. Fixtures/proof files stay outside source/deployment; production chats/notes were not edited. All 255 automated tests pass, including CJS/MJS and Python host subtests. Package inventory and full-build evidence are recorded in the specification.

Formal release gates: preserve current owner-only Site audience; publicly readable privacy policy and store approval still required. Installed Chrome/Edge upgrade/permissions/real-account state, Linux/Edge helper installation and live Tibo feed must be accepted separately. Historical “not implemented” paragraphs below describe their release dates; current task behavior is defined in TASK_DETAILS.md. This audit does not promise zero vulnerabilities or zero regressions.

## Historical v1.25.0 recovery and metadata adapter

Required/optional permissions and allowed origins remain unchanged. Authenticated billing snapshots bypass only the global queue; existing billing validation and its own storage queue remain. Expired quota projection never modifies history/storage. Metadata-only supplements do not advance quota capture time. Optional reader/audio waits are bounded; late audio resume is cancelled before any tone. All 195 regression tests pass, including task RPC rejection and delayed audio. Japanese/English task demos have no horizontal overflow at 240px.

TASKS_READ uses a separate non-persistent adapter, restricted to approved task routes/top frames/service match. Fresh inactive homes read visible sidebar anchors, excluding bodies/drafts/credentials. Temporary tabs close after a bounded attempt. Only bounded titles, validated links, IDs and unknown states are returned to the selected task window; no server upload, logging or quota-state dependency. Web connect-src remains none. Imports/demo/Clear pause automatic reading and invalidate pending results. Execution state/full inventory/Desktop Codex are explicitly unavailable. X feed infrastructure remains unconfigured, not claimed live. Installed-extension, account-switch, audio and native-window verification remain manual gates.

## v1.24.0 presentation changes

Incident-only rows are selected from already normalized status state at render time; the source state is not mutated. The main status renderer defaults to all rows. No new permissions, networking, storage or audio behavior is added. Task changes are isolated CSS and asset-version updates. All 181 regression tests pass, including actual widget rendering and recovery/unavailable cases. Acquisition/history/audio/lifecycle source files and manifest permissions were compared to the baseline and remain unchanged. Signed-in live accounts, native windows and visual review are pending; this test result is not a security or visual guarantee.

## Attack surface and controls

- **Origins and permissions:** `externally_connectable` permits only the exact custom HTTPS monitor origin and the previous Site origin retained for compatibility; wildcard domains are excluded. Provider content scripts run only on the three official AI sites. Public status feeds have fixed HTTPS URLs and credential-free requests. API billing support adds only optional `scripting` and three optional billing hosts, enabled individually through a direct extension-page gesture. Existing required permissions are unchanged.
- **Message validation:** service snapshots are accepted only from the matching provider origin. The arrays, percentages, labels, and counts are bounded before storage. State-changing settings and window commands require the extension's own origin or the approved monitor origin.
- **Untrusted content:** incident text, provider-derived labels, and the new ChatGPT reset wording are length-bounded and escaped before HTML rendering. Links are fixed to official HTTPS pages. No remote scripts, `eval`, or arbitrary URL navigation are used for status content.
- **X intelligence boundary:** the extension receives only normalized public-post data from the fixed companion endpoint. X credentials remain a server runtime secret. Current intelligence links are restricted to exact HTTPS X post routes without credentials or ports; Nerf Bench is link-only; the first successful feed is a silent baseline and IDs prevent repeat alerts.
- **Network and storage:** status responses have an 8-second timeout and a 3 MB cap. Incident requests omit credentials. Account data, history, and the last status summary remain in browser storage; no developer analytics endpoint receives them. Existing stored history is not migrated or deleted.
- **Reset-expiry recovery:** only a verified available entitlement with no expiry triggers a check of the already-permitted ChatGPT usage origin. A pre-existing tab is reloaded only when its content reader is absent, with a five-minute per-tab cooldown. If no tab exists, an inactive official tab is opened briefly and closed after acquisition or at a 45-second alarm. Only its tab ID is temporarily stored for cleanup; no new host or broad `tabs` permission is requested.
- **Notification behavior:** a new issue signature triggers one browser popup and one audio sequence. Repeated one-minute checks of the same signature do not retrigger. Unknown source state is shown as unavailable, not as healthy. Recovery is based only on a subsequent official healthy response and is retained for ten minutes.

- **API billing isolation:** a new `apiCredits` key holds only bounded amount/currency/status, a billing-scope fingerprint and observation time. Incoming values require an enabled provider, granted host, exact HTTPS billing origin/path and top frame. Configuration changes are extension-page-only. The reader never collects input fields, API keys or payment details and never navigates or purchases automatically. It does not alter usage, history, reset rights or sounds. Multiple balances, absent data and postpaid are not fabricated as zero. Disconnect removes host access.

The v1.24.0 origin regression executes the actual external listener: both approved origins can GET and update settings; HTTP, lookalike hosts, alternate ports and localhost cannot read or mutate state. Stored history is unchanged. Live Chrome/Edge pairing on the custom domain still requires manual acceptance.

## Verification and limits

`node --test tests/*.test.cjs tests/*.test.mjs` exercises the status parser, hostile summary escaping, service filtering, duplicate-incident signature, and existing regression contracts. `python3 build.py --package` checks version alignment and packages only the `extension/` tree. The regression suite distinguishes missing, expired, failed, and genuinely exhausted Claude sessions and guards a contradictory API zero against a positive official-page value. The server credential, KV binding, cron, and live X responses remain externally unconfigured and require manual verification. This is static and unit-level review; live provider responses, browser permission dialogs, accessibility, audio quality, and store policy acceptance still require manual review. Google's Workspace status feed may not report every Gemini consumer issue. False negatives remain possible when providers omit incidents or change their feeds.

---

## Web-only task trial v1.23.1

The new route denies network connections in CSP, loads only its independent local scripts/styles, and handles explicitly selected JSON in memory. Inputs are capped at 512 KiB/500 nodes/12 levels; duplicate IDs, cycles, missing or cross-project/cross-kind parents and mismatched services are rejected. Rendering uses textContent, not HTML injection. Chat links require the selected provider’s exact HTTPS host and a conversation route, with no credentials, port, query or fragment. New windows sever opener; link fallback uses noopener/noreferrer. Demos carry an explicit synthetic label. Private snapshots stay outside the repository/deployment, are not logged, and are cleared by reload/close/Clear. Existing extension permissions, GET fields and ZIP are untouched. Live provider task acquisition is not implemented.


## v1.26.0 task-state boundary

The optional independent task window checks already-open provider conversation tabs approximately every five seconds while visible and Auto ON. It reads only editable-composer presence and scoped button accessibility/test attributes and visibility, not messages, draft values, credentials or account data. States remain in memory and expire after 15 seconds. No tabs are navigated, no new permissions are requested, and no titles or states are stored or uploaded. 208 automated checks pass, including route/account mismatches, stale or conflicting observations, unauthorized RPC senders, bounded tab concurrency, stalled quota queues and old-extension compatibility. The quota/history/parser/audio sources are byte-identical to the previous release; only isolated task dispatch and the display version change. Japanese/English mock state UI was checked at 240px without horizontal overflow. Actual installed-extension generation checks remain required after the update; mock fixtures are not account-level proof.


## v1.27.0 — Closed Claude Code sessions

TASK-CODE-001 reads exact accessibility labels from rendered Claude Code sidebar session links via a fresh inactive Code home, alongside the normal sidebar. Individual conversation tabs need not be open. Input-needed and idle are list observations; unread replies and merged pull requests never imply completion. One-minute acquisition remains bounded and closes both owned tabs; partial success is accepted. List evidence expires after 90 seconds, open-tab evidence after 15 seconds; conflicting evidence stays unknown. No quota/history/audio, permission, message-body or credential changes. Official list labels were inspected on 2026-10-11; installed-package end-to-end behavior is still unverified.

<a id="ja"></a>

## 現行v1.31.0精査

利用者承認済みフルビルド。基準2d5b0bfと比較し主残量・状態・履歴・音・障害・設定・API請求・外窓・既存タスク取得の21モジュールが同一。Manifestは版だけ、主CSSも同一。タスク概要RPCは厳密な送信元・単一service・トップフレーム検証と対象サービスの保存値投影だけで、取得・履歴・設定・音声を変更しない。実listenerの待ち行列停止テストで独立性と書込なしを確認。本文／秘密／他社値を返さず、ログアウト／期限切れ／前回値／真0を区別。

Tiboは現行静的配信が未設定と判明。長文後半・復旧／リセット・初回失敗後の過去通知・不完全取得・古いcacheを修正し、ページ／カーソル／取得制限／実background通知呼出しを模擬検証。API Secret・KV・cron・配信経路と実投稿の通知は未検証で、サーバーコードの準備を稼働完了とは扱わない。

Chrome模擬画面240/340px・日英・両テーマで横はみ出しなし、対象社障害、期限切れ／0／前回／ログアウトを確認。製品紹介日本語見出しは340pxで2行。個人メモ・本文を変更せず、模擬データとスクショはリポジトリ外。正式公開は所有者限定範囲を勝手に変えず、一般閲覧プライバシー・ストア審査・実Chrome/Edge・ヘルパー・Tibo実投稿の受入が残る。無欠陥／無デグレの絶対保証ではない。以下は各リリース当時の検証記録。


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

## v1.25.0 日本語検証記録

必須／任意権限と許可originは維持。請求SNAPSHOTの全体待ち行列だけを分離し、既存の請求検証と専用保存待ち行列を残す。期限切れ残量の表示投影は履歴／保存を変更せず、補足だけで残量取得日時を新しくしない。音声・任意読取を時間制限する。

タスク取得は専用経路・トップフレーム・許可origin・service一致、新しい非アクティブホームのサイドバーリンクのみ。本文・入力・認証を収集せず、一時タブ終了、件数・文字数・URL検証、窓内メモリー、ログ／サーバー／履歴への非混入を確認する。消去／読込／サンプルで自動停止と保留応答無効化。実行状態・全件・デスクトップCodexを取得済みとしない。X配信基盤は未設定。インストール更新後の実取得・アカウント切替・音・外窓の確認は手動項目として残す。

現行1.25.0検証: 195件成功。狭幅240pxの日英サンプルで横はみ出しなし。実インストール後のアカウント比較・自動取得・音声は別途確認する。遅延した音声再開は発音前に取消す。

## v1.26.0 タスク状態の保護範囲

独立タスク小窓は表示中かつ自動ONの間、開いている公式会話の入力欄存在と周辺ボタンのアクセシビリティ／テスト属性・可視性だけを約5秒ごとに確認する。本文・入力値・認証情報・アカウント情報は取得しない。状態はメモリー内で15秒後に失効。タブ遷移・追加権限・タイトルや状態の保存／送信を行わない。自動テスト208件成功。経路／アカウント不一致、古い観測、複数タブ不一致、不正送信元、タブ同時数、残量待ち行列停止、旧拡張互換性を検証。残量／履歴／解析／音声のソースは前版と同一で、独立タスク受付と表示版だけを追加。240px幅の日本語・英語模擬画面で横はみ出しなし。実インストール後の生成中取得は別途確認し、模擬画面を本番成功と扱わない。

## v1.27.0 — 閉じたClaude Codeセッション

TASK-CODE-001は公式Codeホームの表示済みサイドバーにある明示的な状態属性だけを取得する。会話タブを開かず「入力待ち」「アイドル」「未読の返答」を一覧由来として表示し、未読やPRマージから完了を推測しない。通常ホームとCodeホームを非アクティブで取得し、1分周期・時間制限・一時タブ終了・部分成功を維持。一覧状態は90秒、会話操作状態は15秒で失効し、不一致は未確認。本文・入力・認証情報・追加権限・残量／履歴／音は変更しない。2026-10-11に公式一覧属性を実確認。更新済み拡張での一連の動作確認は別途必要。

### v1.28 task notes and promotional credits / 作業メモとプロモーションクレジット
EN: Automatic task titles remain memory-only. The user explicitly authorizes saving user-authored notes/checklists (including their chosen task title and link) in `llms-task-notes-v1`, separately from monitor state. Use separate workspace labels for accounts; no automatic cloud sharing. Export/clipboard requires a click. Verified sidebar names and explicit pins only; full coverage is not guaranteed. Promotional API credits remain separate from paid credits and all monthly quotas, with no inference from grants.
JP: 自動取得した一覧は従来どおりメモリ内のみ。利用者が明示保存する作業メモ・チェックリスト（選択したタイトル・リンクを含む）は `llms-task-notes-v1` に隔離保存。アカウントごと作業領域名を分け、クラウド同期しない。書出し／コピーはクリック時のみ。公式で確認した名前・ピンのみを使い全件保証はしない。APIプロモーションクレジットは購入残高・月額枠と別扱いで、付与額から推測しない。

## v1.29.0 — pin scanning, official work-note registration and section disclosures

EN: Fresh inactive acquisition homes expand known sidebar sections and scan scrollable sidebar content with bounded passes, accumulating explicit pins independently from the 500-task ceiling. Claude artifact/taskboard links permit only their exact official route and optional UUID org routing. Counts, rejected rows, limits and rendered-end confirmation are exposed. A missing pin section never proves zero account pins. The official DOM provides no authoritative account-wide count; rendered-end confirmation is not a full-account guarantee.

The independent closed-shadow registration button appears on verified conversation routes and Claude Code project-thread routes. An explicit click transfers only title/URL/provider through a maximum 20-entry memory buffer, 2-minute TTL and single-use opaque handle. The tall editor opens on the existing companion; provider title/URL are absent from the browser query. Sender extension ID, provider route, URL match, service, task origin/route and top frame are validated. Save remains explicit in the browser/site-local workspace. The workspace label can be selected in the editor. No messages, input values, credentials, automatic sending, quota/history/audio or floating lifecycle changes.

Pins, notes and the entire task tree have separate default-open disclosures. Redraws preserve section state; global Expand/Collapse includes all three. Existing task state expiry and sidebar refresh remain unchanged. Required/optional permissions remain unchanged. Package release is v1.29.0; unmodified manuals/PDFs are not regenerated. Installed official pages need a user reload after saving drafts to receive the new button.

JP: 新しい非アクティブ取得ホームだけ既知の一覧を展開・スクロールし、複数回の読取結果からピンを合併。会話500件上限で後続ピンを取りこぼさない。Claudeのタスクボードも公式artifact経路＋org UUIDだけ許可。取得数・対象数・未対応・上限・表示一覧末尾確認を示す。ピン欄未取得を0件と断定しない。公式DOMに全アカウントの確定総数がないため、表示一覧末尾確認とアカウント全件保証を区別する。

公式会話に独立した［作業メモへ登録］ボタンを設け、クリックでタイトル・URL・事業者のみを縦長の別画面へ渡す。本文・入力値・認証情報を読まず、自動保存／送信もしない。最大20件・2分のメモリ内一度限りハンドルを厳密な送信元へ渡し、URLのqueryに会話タイトル／URLを載せない。メモ画面で作業領域を選択し明示保存。残量・履歴・音・小窓ライフサイクルとは独立。

ピン留め・作業メモ・タスク一覧全体はそれぞれ開閉可能、初期は展開。定期更新・言語切替でも閉じた状態を保持し、全て展開／閉じるの対象にも含む。権限追加なし。v1.29.0として本体＋拡張機能のみビルド。既存公式タブは入力保存後に利用者が再読込して新ボタンを有効にする。


## v1.30.0 — optional Codex native metadata

TASK-CODEX-001 adds optional nativeMessaging, never a required grant. User click in the exact own extension setup page; provider content scripts cannot configure it. External requests require one of the existing exact HTTPS task origins, chatgpt service and top frame. Native host accepts only a fixed read request, binds to one installed extension ID, bounds length/time/count, and sends only initialize/thread/list/thread/read(includeTurns=false). CLI API previews/events are not used or forwarded. Local desktop pin IDs use a disclosed compatibility field; no auth/config fields leave the host. No network listener, admin installation, task execution, settings mutation or inference requests. Independent stdio does not claim live status; shared observations expire at 90 seconds. Automatic titles/links stay in task-window memory; only the boolean opt-in is stored. Existing quota/history/audio/floating logic and manuals are unchanged.

JP: 任意権限を専用画面の直接クリックで許可。固定の読取要求と正規送信元を検証し、本文・preview・イベント・認証を渡さない。端末内ピンの互換形式を明示、別ホスト全件保証なし。21秒取得・24秒接続・500件上限、停止／消去時の応答破棄。Python 3ヘルパーはユーザー領域＋指定拡張IDのみ、Windows導入未対応。実Codexメタ情報取得は確認済みだがChrome/Edge導入後の権限・共有接続・アカウント比較は手動確認が必要。

Verification v1.30.0: 237 tests pass, including native host protocol/projection/pagination/installer, adversarial senders, optional permission, late-result invalidation and actual RPC bypass of a stalled quota queue. Python has 5 embedded subtests. Real local Codex metadata: 16 tasks, pins 7/7, metadata-only. Browser native installation and shared-state observations remain unverified; no absolute no-regression/security guarantee is claimed.

## v1.33.0 scoped fixes

Offscreen uses only runtime; SOUND-OFFSCREEN-001 returns a boolean after exact own-extension offscreen route validation, independently of quota queue. Mute cancels through worker STOP; missing acknowledgements fail closed. Permissions, host list, CSP and acquisition/history boundaries are unchanged. TASK-NOTE-UX-001 fixes display:contents wrappers using only exact thread-ID and visible region heading attributes. No message/draft reads or account inference. Synthetic nested worker/player and registration/session/note-store tests cover these boundaries; installed Chrome/Edge sound and current-provider registration still require separate acceptance. Build preserves manuals/helper hashes.

## Helper v1.30.1 / Web v1.33.1 (2026-10-12)

Shared socket existence no longer consumes the whole host deadline: all shared metadata operations have a four-second attempt budget, followed by process cleanup and independent stdio within the existing total21seconds. Returned fallback state remains Unknown; no permission/origin/route/method/storage changes. Diagnose only aggregate counts/status, never private title/ID/URL/auth payloads. Extension source/package1.33.0, quota/history/audio/CSS remain unchanged. New Web link targets only the same approved HTTPS companion helper ZIP. Installed Chrome native acceptance remains user verification after reinstall; live read-only host check is distinguished from browser messaging. Future macOS/Windows/iOS/Android app/shared-data requirements do not authorize automatic private uploads in this release.

## v1.34.0 native API recovery

No permission, CSP, host or native adapter expansion. Setup exposes only enabled/permission/API-availability booleans and an explicit runtime.reload button. Missing API is checked before native launch/cooldown; no settings/history/notes writes or automatic restart. Restart briefly suspends the extension and clears session-memory note handoffs; persisted data remains. Helper ZIPs unchanged. Real Chrome reports granted permission but undefined API; recovery success remains a live acceptance gate.

Verification: 277 CJS/MJS regression tests pass (including the existing Python suite). Fifteen main acquisition/state/history/audio/settings/CSS modules are byte-identical to the previous release; shared.js differs only in APP_VERSION. New ZIP CRC and exact source entries checked; both helper ZIPs and unnamed manuals retain hashes. Installed Chrome/Edge recovery remains unverified.

## v1.35.0 Codex cooldown result handoff

Validated automatic metadata is shared across authorized read callers in worker memory only, within the existing 90-second observation validity. Strict sender guards, enabled/native permission/API checks precede reuse. Explicit configuration resets the cache; extension restart drops it. No storage, logs, remote transfer or additional permissions; acquisition throttle remains 55 seconds. Main quota/history/audio modules and unchanged helper ZIPs retain bytes. Live installation acceptance remains unverified.

Verification: all 278 CJS/MJS regressions pass, including the existing Python host tests and successful setup-to-task cooldown reuse. Main acquisition/state/history/audio modules retain previous bytes, package CRC/source entries match, helper ZIPs and unchanged manuals retain hashes. Installed-browser handoff acceptance remains pending.

## Web v1.35.1 favorites review

Explicit star clicks persist only existing validated note routes and bounded titles; no automatic acquisition/body persistence. Optional note fields retain existing key/schema; unstar is nondestructive. Provider/workspace scope and revision validation protect reorder and editing. Foreign drops are ignored; drag payload is a constant marker without title/URL. Export/import remains explicit; no cloud synchronization. Main monitor/native/extension ZIPs remain unchanged. Local DOM verification uses synthetic tasks only.

Verification: all 281 CJS/MJS tests pass including Python host regressions. Synthetic local browser UI confirms star registration, unstar/re-add, keyboard order and persistence after reload; 240px viewport has no horizontal overflow. Drag handlers and revision conflict/JSON round-trip are covered by automated tests; physical pointer drag in installed Chrome/Edge remains a manual acceptance check. Favorite controls apply to existing validated conversation/thread/Codex note URLs; project-only pin links remain links, without widening note route permissions. Production notes were not modified.
