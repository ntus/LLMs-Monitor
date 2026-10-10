# Task details — Implementation contract

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Current release: **1.26.0 beta**. Each service’s Task details button opens an independent tall 420×780 window, or a safe new tab when popups are blocked. The task window inherits initial language/theme; subsequent choices stay local. Existing quota, history, audio and floating-window lifecycles remain separate.

## Automatic reading

Opening a task window starts a dedicated `TASKS_READ` request. While the window is visible and Auto is ON, it retries once a minute. The installed extension must be updated in place to 1.26.0 and paired in the main monitor on the same origin. The bridge reads only the existing `glance-extension-id` key; it does not read monitor settings, quota snapshots or history.

The extension accepts only the approved companion HTTPS origins, `/tasks` or `/tasks.html`, a top frame, and a `service` query matching the request. It opens a **fresh inactive official home** so a previously loaded sidebar cannot leak an old account’s list. It reads only visible sidebar anchors on ChatGPT, Claude or Gemini, then closes its own temporary tab in `finally`. Existing user tabs and input drafts are not navigated/reloaded. Parallel requests for one service share the same promise; attempts have a 55-second cooldown, a 20-second acquisition budget and 2.5-second reader reply bounds. A failure or empty/loading sidebar preserves the prior list in the task window. An empty account and signed-out account cannot yet be distinguished reliably; neither is reported as a verified empty inventory.

ChatGPT: normal `/c/…` and explicit `/g/g-p-…/c/…` conversation links. The project route identifies membership; an unavailable project name is shown as its ID, not guessed. Claude: `/chat/…`, `/code/session_…`, `/cowork/…`, grouped by kind. Project links alone are not tasks. Gemini: `/app/…` and account-prefixed `/u/N/app/…` links from that single current sidebar. Sidebar-only states are **unknown**; the independent control observer described below adds verified response states; inactivity never implies completion. Desktop Codex tasks are not obtainable through this Web adapter. Coverage is limited to the rendered sidebar, not the complete account, chat contents or execution steps.

Clear, Demo and file import switch automatic reading OFF and invalidate pending results. The Auto button resumes reading. Manual Refresh fetches one list without enabling periodic updates. Reload/close discards window-local data. No private task snapshot is placed in storage, diagnostic logs, server assets or Git.


## v1.26.0 — Evidence-based task response states

TASK-STATE-001 supersedes the earlier unconditional unknown state only for verified controls. Independent `TASKS_STATE` polls already-open provider conversation tabs about every five seconds while the task window is visible and Auto ON; `TASKS_READ` lists remain at one minute. A visible enabled stop control scoped to the editable composer indicates generating a response. A normal-chat composer with a recognized send/voice control indicates response idle, never task completion. Claude Code/Cowork require explicit stop evidence; accepting another prompt does not prove idle. Closed chats, unreadable controls, stale responses and conflicting duplicate tabs remain unknown with reasons. Desktop Codex is excluded.

Read only composer presence/editability, button aria-label/data-testid/disabled and visibility; never message text, editable values or credentials. Match current route identity and Gemini account path, limit 40 existing tabs with four workers, 900ms per reply and 3500ms total. States expire after 15 seconds, including when Auto is paused. Sender checks retain exact origins, task path, service and top frame. No quota queue, history, storage, audio, external fetch or tab navigation is used. Each state carries its observation time separately from task updatedAt. Clear/Demo/import invalidate both pending paths. Existing extension installations must update in place; users may need to reload official chat tabs after saving drafts, never automatically.

Modules: `extension/task-status.js` observes scoped controls; `task-state-background.js` bounds existing-tab reads; `task-reader.js` accepts self-extension/top-frame requests; task Web bridge/model/page validate, expire and render. Mock controls and real background message gates are regression-tested. Provider control shapes were inspected read-only; live generation through the installed v1.26.0 extension remains a separate acceptance check.
## Modules and contract

- `web/task-launcher.js`: adds one link per quota card, preserves existing actions, severs opener, supports tab fallback.
- `web/tasks-model.js`: normalizes and validates independent schemaVersion 1; project/kind grouping, ancestry-preserving filters, safe URLs and synthetic demo.
- `web/tasks-page.js` / `tasks.css`: textContent renderer, narrow responsive layout, filters, disclosure, copy, local import and Auto controls.
- `web/tasks-bridge.js`: dedicated TASKS_READ only, exact origins, existing pairing ID, 26-second response deadline. No usage GET/REFRESH/SETTINGS, audio or persistence.
- `extension/task-list.js`: pure sidebar metadata extraction; no body/input/textarea reads or provider endpoint guesses.
- `extension/task-reader.js`: isolated content-script reply to this extension’s TASK_LIST_READ.
- `extension/task-background.js`: independent acquisition/coalescing/cooldown/cleanup; no quota queue, state, history, sound or persistence.

Inputs: UTF-8 JSON ≤512 KiB, ≤500 nodes, ≤12 levels. Required `schemaVersion:1`, matching service, ISO capture timestamp and tasks array. Each node has an exact unique ID ≤120 characters, title ≤200, optional verified parent ID, consistent project ID/title, kind, observation status, optional ISO update time, summary ≤500 and safe provider URL. Cycles, missing/cross-project/cross-kind parents, duplicate IDs and mismatched services reject the whole input and retain the prior list. Unknown fields such as credentials/body are discarded. Safe links require exact provider HTTPS host, supported conversation route, no credentials, nondefault port, query or fragment. The source label (`codex-app`, `local-export`, `demo`, `official-sidebar`) is a format label, not authenticated provenance; imported files display as local observations.

The task page keeps CSP `connect-src 'none'`, self-only scripts/styles and denied object/base/form actions. Extension messaging is the dedicated local browser transport, not a network fetch. Rendering never inserts provider text as HTML. Copy is user-triggered and clipboard failure offers a selectable readonly tree. Narrow windows retain 14px task names, 13px supporting controls and 6px nesting indentation.

## Verification and limits

Regression coverage exercises normalization, ancestry, hostile links, launcher rerenders, real adapter collection against mock sidebars, pending-request coalescing, cooldown and cleanup. Quota tests separately reproduce the real background billing circular wait and verify GET projection does not alter history/storage. Live official usage screens were compared during diagnosis on 2026-10-10. Installed-extension automatic acquisition, native popup resizing, audio and complete account coverage must not be claimed without the package update and live verification. Older import-only trial behavior is historical and superseded by this adapter; the local import option remains supported.

---

<a id="ja"></a>

# 日本語 — タスク詳細の実装仕様

[🌍 EN](#en) · [🇯🇵 JP](#ja)

現行 **1.26.0 β**。各LLMのタスク詳細ボタンは独立した縦長420×780小窓を開き、ブロック時は安全な別タブへ戻る。起動時の言語／テーマを継承し、後の選択は窓内だけ。残量・履歴・音・既存外窓のライフサイクルは分離する。

## 自動取得

開いた時と、表示中かつ自動ONの間は1分ごと、専用TASKS_READで取得する。拡張機能をアンインストールせず1.26.0へ上書き更新し、同じoriginの主画面で接続する。専用橋渡しは既存glance-extension-idだけを読み、設定・残量・履歴を読まない。

許可HTTPS origin、/tasks または /tasks.html、トップフレーム、URLと依頼のservice一致に限定。毎回、新しい非アクティブ公式ホームを開き、古いサイドバーの別アカウント再利用を防ぐ。表示されたサイドバーのリンクだけを読み、finallyで自分の一時タブだけ閉じる。既存チャット・入力を開き直さない。同一事業者の同時依頼共有、55秒の再試行制限、20秒の取得予算、読取応答2.5秒制限。失敗・空・読込中は前回一覧を保持。空アカウントと未ログインは完全には区別できず、全件ゼロを確認済みとはしない。

ChatGPTは通常/c/と明示的/g/g-p-…/c/。プロジェクト名が不明ならIDでまとめ、名前や親子を推測しない。Claudeは/chat/・/code/session_・/cowork/を別種別に分け、プロジェクトリンクだけをタスクにしない。Geminiは単一の現在サイドバーの/app/・/u/N/app/。サイドバーだけの実行状態は未確認とし、下記の操作ボタン観測だけで応答状態を補足する。待機から完了を推測しない。デスクトップCodexの一覧・会話本文・実行手順・全アカウント履歴はこのWeb取得の対象外。

消去・サンプル・ファイル読込は自動OFFと保留応答の無効化。自動ボタンで再開、手動更新は1回取得する。窓を閉じる／再読込でメモリーを破棄。一覧は永続保存・診断ログ・運営サーバー・公開資産・Gitへ入れない。

## モジュールと安全契約

上記7モジュールを独立実装し、Webの専用橋渡しから利用量GET／REFRESH／SETTINGS・音声・保存へ依存しない。拡張機能側は本文・入力欄・認証情報を読まず、非公開APIの推測をしない。

JSONは512KiB・500件・12階層以内、schemaVersion=1、対象service一致、ISO取得時刻が必須。IDは厳密な一意120文字以内、タイトル200、projectId/titleの整合、親は同じproject/kindの実在ID、summary500、任意更新時刻と公式リンク。循環・重複・親不在・別project/kind・別serviceは全体拒否し前回を保持。資格情報など未知フィールドは破棄。リンクは厳密HTTPS事業者host・許可チャット経路・認証/port/query/fragmentなし。sourceは形式ラベルであり取得元認証ではなく、読込ファイルは端末内観測値と表示する。

CSP connect-src none、script/style self、object/base/form-action禁止を維持。専用拡張メッセージはブラウザ内の経路でありWeb fetchをしない。textContentで描画し、コピーは利用者操作のみ、失敗時は選択可能テキストを提示。狭幅でもタスク名14px、補足13px、字下げ6pxを維持。

## 検証範囲

形式・親子・不正リンク・繰返しボタン描画・模擬公式サイドバー・同時依頼共有・間隔・一時タブ終了を回帰検証する。残量側は実背景処理の請求循環待ち、GET投影の保存／履歴非変更を別検証。2026-10-10に公式利用画面の数値差を確認。拡張更新後の本番自動取得・外窓リサイズ・音・全アカウント範囲は実確認前に成功と主張しない。旧JSON限定試作は履歴として上書きし、端末内JSON読込機能は残す。

## v1.26.0 — 根拠のあるタスク応答状態の取得

TASK-STATE-001は、旧版の一律「状態未確認」を明示的な操作ボタンがある場合だけ上書きする。一覧は引き続き1分ごと、状態はタスク小窓が表示中かつ自動ONの間、専用TASKS_STATEで約5秒ごとに既存の公式会話タブから取得する。入力欄周辺の有効な停止ボタンは「応答生成中」、通常チャットの編集可能な入力欄と既知の送信／音声ボタンは「応答待機」。待機からタスク完了を推測しない。Claude Code/Coworkは次の入力を受け付けても処理が続くため、停止根拠がない場合は未確認を維持する。閉じた会話・読取不能・古い観測・複数タブの不一致は理由付き未確認。デスクトップCodexは対象外。

入力欄の存在・編集可否、ボタンのaria-label/data-testid/disabledと可視性だけを読み、本文・入力値・認証情報は読まない。現在経路のID・種別、Geminiのアカウント経路を照合。最大40タブ、同時4件、応答900ms、全体3500ms。15秒を超える観測は自動OFF中も失効させる。送信元origin・タスク経路・service・トップフレームの検証を維持。残量待ち行列・履歴・保存・音・外部fetch・タブ遷移に依存しない。観測日時はタスク最終更新日時とは別。消去／サンプル／JSON読込は両方の保留応答を無効化。拡張は上書き更新し、公式会話タブは必要なら入力を保存後に利用者が再読込する。自動リロードは禁止。

独立モジュールtask-status.jsが入力欄周辺の操作を観測、task-state-background.jsが時間制限付きタブ読取、task-reader.jsが自拡張・トップフレーム受付、Web専用橋渡し／モデル／画面が検証・失効・表示を担当する。模擬操作ボタンと実backgroundの送信元検証を回帰テスト。公式操作ボタン構造は読み取り確認し、実インストールv1.26.0での生成中取得は別途実機確認する。
