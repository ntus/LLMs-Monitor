# Task details and work notes — v1.32.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

## v1.32 — Registration, titles and workspace

Click **Add to work notes** on an official conversation to open the independent editor; the main monitor need not remain open. The title and validated link are passed through a single-use handle with a two-minute expiry in `chrome.storage.session` (browser memory, not disk). Worker suspension no longer loses this handoff. Browser restart or extension reload/update clears it; click again on the refreshed official page after saving drafts. No automatic saving, sending or message/draft reading.

Claude Code project threads use the selected thread pane’s exact heading attribute. Ambiguous/missing headings show **Thread (title unavailable)**; type the correct **Note title** in the editor. Existing notes can also be renamed without changing their link, identity or checklist. A project/browser title is not treated as a thread name.

**Notes workspace (optional)** is your label, not a detected provider account. Blank means **Shared (unspecified)** and retains existing `default` notes; it does not move or delete them. The last manually chosen label is remembered per provider on this browser/site. Choose distinct labels yourself for distinct accounts. Saved titles open their original link and **Edit** stays on the right; note counts follow the selected workspace.



## Read your capacity and remember your work

Each service’s **Task details** opens an independent tall 420×780 resizable window; popup blocking falls back to a safe new tab. Header and document title are `LLMs Monitor -Task- ChatGPT`, `…Claude` or `…Gemini`. Initial language/theme are inherited, then changes apply only to this window.

Below the title, compact bars show **selected-provider saved usage** and its official incident. Current, previous, unknown, signed-out and expired values are distinct. A reset past its deadline masks the old percentage as — rather than inventing 100% or retaining a current 0%. The `TASKS_MONITOR` RPC reads only existing `data`/`providerStatus`, whitelists selected-service fields, and never fetches provider quota, writes storage/history, changes settings or plays sounds. It bypasses the main refresh queue. Local reads occur about every 10 seconds while visible; source acquisition remains about one minute. Older extensions show a connection/update prompt. This is the narrowly scoped v1.31 read-only exception to earlier “no quota RPC” task isolation.

## Lists, pins and states

Pair extension v1.32.0 in the main monitor on the same origin. Task lists start on opening and about once a minute while visible and Auto ON. Fresh inactive official homes provide sidebar/project/group names and explicit pins. The adapter expands/scrolls only its owned tabs and closes them in `finally`; existing user chats/drafts are not reloaded. Requests coalesce per service, with a 55-second cooldown, 20-second acquisition budget and 2.5-second reader bounds. Missing/loading/failed lists retain the previous list; an empty response is not proof of an empty account.

ChatGPT normal and project conversations, Claude normal/Code/Cowork sessions, Gemini current-account conversations are grouped by verified labels. Unresolved membership is described as unconfirmed rather than “unassigned”; internal IDs are not display headings. Pins precede other items. Projects, chats and artifacts retain their type; a pinned project does not make every child chat pinned. Coverage is **rendered-list/partial**, with observed/accepted/rejected/limited/end-of-scan counts. Browser providers do not guarantee all account pins. ChatGPT browser pins can differ from the desktop app; Codex uses a separate opt-in local adapter.

Every item begins with a state mark, independently of 📌. Text remains alongside marks: generating/running, awaiting input/approval, response idle, failed or Unknown. Exact visible controls establish generating/idle for ordinary chats. Idle is not completion; Code/Cowork input readiness alone does not establish idle. Open conversation controls are observed about every five seconds and expire after **15 seconds**. Closed ordinary chats, mismatched accounts/routes, stale or conflicting duplicate tabs remain Unknown. Exact official Claude Code sidebar icon labels can describe closed sessions and expire after **90 seconds**; unread/merged never means completed. State observation time is separate from task update time.

The observer checks ≤40 existing tabs, four workers, 900ms per response/3500ms overall. Only composer presence/editability, button aria/test attributes and visibility are read; no message or draft values. No user-tab navigation, state persistence, task execution, extra permissions or external requests. Auto OFF pauses list/state acquisition. Clear/Demo/import pauses it and invalidates pending responses; Manual refresh reads one list without turning Auto ON. Imported states are historical, not authenticated live proof.

## Save a work note

Use **Register work note** on a supported official conversation, or the task’s **Work notes / handoff** button. The editor inherits the validated source title/link. Select a workspace/account label, enter purpose/current situation/next actions/waiting/cautions/checklist, then **Save notes**. Manual phase (Working/Review/Waiting/Done) is separate from observed response state. Saved title opens the source; **Edit** sits at the right edge, and headings show scoped counts. Notes remain when a conversation is missing from the latest list. Sections for pins, notes and tasks start expanded and retain disclosure through refresh/language changes.

**Copy handoff** requires a click: paste the text into another chat yourself. JSON export/import is deliberate transfer, not automatic cloud sharing. Notes use `llms-task-notes-v1` in this browser/site’s localStorage, keyed by provider/workspace/validated URL. A different origin/profile has a different store. Export before clearing data or migrating domains. Read/write failures and concurrent revision/import overlap reject without silently replacing notes. Limits: 1 MiB total, 500 notes, 50 checklist items per note; current situation ≤4000 characters, other prose fields ≤2000, checklist item ≤300.

Registration is independent and explicit: supported conversation route/top frame/origin/service, ≤20 single-use memory handles, two-minute expiry. Launch queries contain neither conversation titles nor URLs. The handoff opens a separate task editor; nothing is saved until the user clicks Save. Bodies/drafts/credentials are never read or copied. Dismissed registration UI does not change the conversation.

## Optional Codex

macOS quick path: **Connect Codex → extract helper ZIP → Install.command (or `python3 install.py`) → paste the extension ID → Enable connection → Check connection → Refresh list**. Python 3.9+ is required. The helper is not an extension; do not use Load unpacked for it. Linux has a command installer; Windows installation is not implemented. The current installation guide is revised 2026-10-12; Web v1.33.1 and helper v1.30.1 fix the shared-connection timeout; extension v1.33.0 is unchanged.

[macOS helper installation](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md#macos-en) is initially disabled and requires an extension-page permission click plus separate per-user helper installation. The helper runtime is v1.30.1. Local read-only App Server metadata provides IDs/titles/pins/update times; previews, turns, events and authentication fields are discarded. Only fixed metadata methods are permitted. Desktop local pin IDs use an explicitly labelled compatibility adapter; the local audit is not a remote-host/account guarantee. Maximum 500 tasks. Independent metadata cannot observe runtime; an already-existing shared server can provide evidence valid for 90 seconds. Idle never implies completed. No task execution, automatic server start/restart, network port or cloud upload. Pause/Clear/import invalidates the separate Codex path too.

## Implementation and acceptance

Independent `web/tasks-*`, `extension/task-*`, `extension/codex-*` modules; the main monitor receives the launcher only. RPC requires exact approved HTTPS origin, `/tasks` or `/tasks.html`, selected service and top frame. The overview additionally requires one unambiguous service query. Required/optional permissions are unchanged in v1.31.

Task JSON: UTF-8 ≤512 KiB, ≤500 nodes/12 levels; schemaVersion 1, matching service, ISO capture time, unique ID ≤120, title ≤200, summary ≤500, consistent parent/project/kind. Reject cycles, duplicate/missing/cross-project/cross-kind parents; discard unknown fields. HTTPS provider conversation links must have exact host/route, no credentials, alternate port, query or fragment. Codex notes allow only exact validated Codex deep links. Render with textContent, self-only scripts/styles, `connect-src 'none'`, denied objects/base/forms, severed opener and safe links. Nothing private enters logs, server bundles or Git. Automatic titles remain memory-only; explicitly saved notes are the separate authorized exception.

Run CJS **and MJS** tests and full build, inspect ZIP/permission diff, verify 240–420px EN/JP both themes, expired/missing/zero/previous, single-provider incident, existing notes and all pause/late-response races. Unchanged main acquisition/history/audio files must remain identical. Installed Chrome/Edge permissions, genuine response controls, native helper and complete provider inventory remain live acceptance checks; synthetic fixtures do not prove account-wide success. [Specification](SPECIFICATION.md), [security review](SECURITY_REVIEW.md), [requirements](spec/requirements.json) contain evidence and historical contracts.

---

<a id="ja"></a>

## v1.32 — メモ登録・タイトル・作業領域

公式会話の［作業メモへ登録］で独立した編集画面を開きます。メイン画面を閉じても登録できます。タイトルと検証済みリンクは `chrome.storage.session`（ブラウザのメモリー内、ディスク保存なし）の2分で失効する一度限りハンドルで受け渡します。拡張機能の処理が休止しても情報を失いません。ブラウザ再起動・拡張機能の再読込／更新では破棄されます。既存公式タブは入力を保存してから再読込し、再度登録してください。自動保存・送信・本文／入力の読取はしません。

Claude Codeは選択中のスレッドの見出し属性を使い、プロジェクト名をスレッド名として扱いません。曖昧／未取得なら「スレッド（名称未取得）」とし、編集画面の［メモのタイトル］で指定できます。既存メモもリンク・識別子・チェックリストを保ったまま改名できます。

［メモの作業領域（任意）］は利用者自身の区分名で、各社のアカウント名を自動取得したものではありません。空欄は「共通（未指定）」で、従来の `default` メモを引き続き表示します。メモを移動／削除しません。最後に選んだ名前をサービスごと・ブラウザ／サイト内で保持します。複数アカウントはご自身で名前を分けてください。保存済みタイトルから元リンクを開き、右端［編集］で修正でき、件数は選択領域に対応します。



# 日本語 — タスク詳細と作業メモ

[🌍 EN](#en) · [🇯🇵 JP](#ja)

## 残量と作業の続きを一緒に確認

［タスク詳細］は縦長420×780の独立小窓を開き、ブロック時は安全な別タブへ戻ります。タイトルは `LLMs Monitor -Task- Gemini` など。起動時の日英・テーマを引き継ぎ、以後の切替は窓内だけです。

タイトル直下に対象LLMの保存済み残量バーと公式障害を表示。現在／前回／未取得／ログアウト／期限切れを区別し、期限切れは—として再取得待ちにします。勝手に100%へリセットしません。`TASKS_MONITOR` は選択したサービスの既存 `data`／`providerStatus` だけを検証して返す読取専用処理。約10秒ごとに保存値を読み、公式側の取得は従来の約1分周期のまま。残量の再取得・保存・履歴・通知音・設定変更を行わず、主画面の待ち行列も使いません。旧「タスクから残量RPCを使わない」制約に対するv1.31の限定例外です。

## 一覧・ピン・状態

同じURLで拡張v1.32.0を接続。表示中かつ自動ONなら起動時と約1分ごとに、新しい非アクティブ公式ホームのサイドバー／名前／ピンを取得します。展開・スクロールは自分で作ったタブだけで行い必ず終了。利用中の会話・入力タブを再読込しません。事業者ごとの重複要求を統合し、最短55秒・取得20秒・返信2.5秒の制限。未取得・失敗・描画途中では前回一覧を保持し、空応答を全件0と断定しません。

確認済みプロジェクト／グループ名でまとめ、不明な所属は未確認とし、内部IDを見出しに出しません。ピンは優先表示しますが、プロジェクトのピンと子会話のピンは別です。取得数・未対応・上限・走査終了を表示し、**ブラウザー各社の全アカウント全件は保証しません**。ChatGPTブラウザーとデスクトップ／Codexのピンは別経路です。

全項目の先頭に状態マークと文字を表示し、📌とは別にします。通常会話の停止操作を観測した［応答生成中］、送信操作を観測した［応答待機］は応答状態で、作業完了ではありません。Code／Coworkの入力可否だけから待機を推測しません。開いた会話のボタン属性を約5秒ごとに観測し、15秒で失効。閉じた通常会話・アカウント／経路不一致・重複タブ不一致は未確認です。Claude Code公式一覧の明示アイコン属性は閉じたセッションにも使え、90秒で失効。未読・PRマージを完了としません。観測日時と最終更新日時は別です。

最大40タブ・4並列・返信900ms／全体3500ms。入力欄の存在と操作属性・可視性だけを確認し、本文・入力値は読みません。自動OFFで停止、消去／サンプル／JSON読込で停止して保留応答も無効化。手動更新は自動ONに戻しません。読込状態は過去の観測で、生の稼働証明ではありません。

## 作業メモの保存・引継ぎ

1. 公式会話の［作業メモへ登録］、またはタスクの［作業メモ・引継ぎ］を押す。検証済みタイトル・リンクが自動で入ります。
2. 作業領域／アカウント名を選び、目的・現在の状況・次の作業・確認待ち・再開時の注意・チェックリストを記入して［メモを保存］。
3. 保存済みタイトルは元会話へのリンク、右端は［編集］。見出しに対象サービス・作業領域の件数を表示。一覧から消えた会話のメモも保持します。
4. ［引継ぎ文をコピー］して共有先へ自分で貼り付けるか、JSONを書出し／読込み。自動共有・クラウド同期ではありません。

ピン／メモ／タスク一覧全体は初期展開で、更新・言語変更でも開閉状態を保持。手動の作業状態と観測状態は別です。メモは `llms-task-notes-v1` にサービス／作業領域／URL別で保存し、別URL・別ブラウザーでは別保存。データ消去・ドメイン移行前に書出してください。保存失敗・同時更新・重複読込は黙って上書きしません。上限は全体1MiB・500メモ、1メモ50チェック項目、現在の状況4000字・他本文2000字・1項目300字です。

公式登録は独立・明示保存。厳密な公式会話経路・トップフレーム・サービス確認と、最大20件／2分／一度限りのメモリー内ハンドルを使います。起動URLへ会話名・URLを載せず、本文・入力・認証情報を読まず、別窓で保存を押すまで記録しません。

## 任意のCodex連携と保護範囲

macOSは **［Codexを接続］→ヘルパーZIP展開→Install.command（または `python3 install.py`）→拡張機能ID入力→［接続を有効にする］→［接続を確認］→［一覧を更新］**。Python 3.9以上が必要で、ヘルパーをChromeの拡張機能読込へ指定しません。Linuxはコマンド導入、Windowsは未対応。2026-10-12改訂の導入取説を参照してください。共有接続の待機不具合をWeb v1.33.1／ヘルパーv1.30.1で修正し、拡張機能ZIPは維持します。

[macOSの詳しい導入手順](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md#macos-ja)に従い、専用画面のクリックと別ヘルパー導入で有効化。初期無効。ヘルパー1.30.1はタイトル・ID・ローカルピン・更新日時・根拠のある状態だけを返し、preview／turn／認証を渡しません。端末内ピン形式は互換読取で、他ホスト・全アカウント保証ではありません。最大500件。独立メタ情報から稼働は推測せず、既存共有サーバーの観測のみ90秒有効。待機を完了とせず、サーバー起動／再起動・ポート公開・実行は行いません。停止／消去／読込でCodex保留応答も無効化します。

Web・拡張の専用モジュールへ分離し、主画面には起動導線だけ。許可HTTPS origin・タスク経路・サービス・トップフレームを検証し、残量概要は重複service指定も拒否。必須／任意権限はv1.30から変更なし。JSONは512KiB・500項目・12階層、重複／循環／不正親子を拒否。リンクは厳密な公式会話URLまたは検証済みCodexリンクのみ、描画はtextContent、接続禁止CSPで本文や秘密を画面・ログ・配布物へ混入させません。自動一覧はメモリー内、手動保存メモだけを明示された別保存とします。

CJS＋MJSテスト、フルビルド、ZIP・権限差分、240〜420px・日英・両テーマ、0／未取得／期限切れ／前回値、対象サービス障害、既存メモ、停止・保留応答を確認。メイン残量・履歴・音声の既存ソースを維持します。実Chrome/Edgeでの権限・本物の応答状態・ヘルパー・全件は別の手動受入確認で、模擬画面の成功を本番全件成功とは扱いません。

### 2026-10-12 helper connection fix / ヘルパー接続修正

Use [helper v1.30.1](https://llmsmonitor.ntus.info/LLMs-Monitor-Codex-Helper-v1.30.1.zip), reinstall once with the current browser extension ID, then Check connection. **Refresh list / ［一覧を更新］** is in **LLMs Monitor → ChatGPT card → Task details**, not the official ChatGPT site. The unchanged extension setup links to old helper 1.30.0; the independent task window and updated guide link to 1.30.1. Metadata-only states remain Unknown; installation is not required each refresh.

v1.30.1を一度導入し直して［接続を確認］。その後、**LLMs MonitorのChatGPTカード → ［タスク詳細］ → ［一覧を更新］**。公式ChatGPTにはこの更新ボタンはありません。ヘルパー更新リンクは新しいタスク画面／取説から使います。
