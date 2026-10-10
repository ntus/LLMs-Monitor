# Task details — Implementation contract

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Current release: **1.25.0 beta**. Each service’s Task details button opens an independent tall 420×780 window, or a safe new tab when popups are blocked. The task window inherits initial language/theme; subsequent choices stay local. Existing quota, history, audio and floating-window lifecycles remain separate.

## Automatic reading

Opening a task window starts a dedicated `TASKS_READ` request. While the window is visible and Auto is ON, it retries once a minute. The installed extension must be updated in place to 1.25.0 and paired in the main monitor on the same origin. The bridge reads only the existing `glance-extension-id` key; it does not read monitor settings, quota snapshots or history.

The extension accepts only the approved companion HTTPS origins, `/tasks` or `/tasks.html`, a top frame, and a `service` query matching the request. It opens a **fresh inactive official home** so a previously loaded sidebar cannot leak an old account’s list. It reads only visible sidebar anchors on ChatGPT, Claude or Gemini, then closes its own temporary tab in `finally`. Existing user tabs and input drafts are not navigated/reloaded. Parallel requests for one service share the same promise; attempts have a 55-second cooldown, a 20-second acquisition budget and 2.5-second reader reply bounds. A failure or empty/loading sidebar preserves the prior list in the task window. An empty account and signed-out account cannot yet be distinguished reliably; neither is reported as a verified empty inventory.

ChatGPT: normal `/c/…` and explicit `/g/g-p-…/c/…` conversation links. The project route identifies membership; an unavailable project name is shown as its ID, not guessed. Claude: `/chat/…`, `/code/session_…`, `/cowork/…`, grouped by kind. Project links alone are not tasks. Gemini: `/app/…` and account-prefixed `/u/N/app/…` links from that single current sidebar. All states are **unknown** unless an imported file explicitly supplies an observation; inactivity never implies completion. Desktop Codex tasks are not obtainable through this Web adapter. Coverage is limited to the rendered sidebar, not the complete account, chat contents or execution steps.

Clear, Demo and file import switch automatic reading OFF and invalidate pending results. The Auto button resumes reading. Manual Refresh fetches one list without enabling periodic updates. Reload/close discards window-local data. No private task snapshot is placed in storage, diagnostic logs, server assets or Git.

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

現行 **1.25.0 β**。各LLMのタスク詳細ボタンは独立した縦長420×780小窓を開き、ブロック時は安全な別タブへ戻る。起動時の言語／テーマを継承し、後の選択は窓内だけ。残量・履歴・音・既存外窓のライフサイクルは分離する。

## 自動取得

開いた時と、表示中かつ自動ONの間は1分ごと、専用TASKS_READで取得する。拡張機能をアンインストールせず1.25.0へ上書き更新し、同じoriginの主画面で接続する。専用橋渡しは既存glance-extension-idだけを読み、設定・残量・履歴を読まない。

許可HTTPS origin、/tasks または /tasks.html、トップフレーム、URLと依頼のservice一致に限定。毎回、新しい非アクティブ公式ホームを開き、古いサイドバーの別アカウント再利用を防ぐ。表示されたサイドバーのリンクだけを読み、finallyで自分の一時タブだけ閉じる。既存チャット・入力を開き直さない。同一事業者の同時依頼共有、55秒の再試行制限、20秒の取得予算、読取応答2.5秒制限。失敗・空・読込中は前回一覧を保持。空アカウントと未ログインは完全には区別できず、全件ゼロを確認済みとはしない。

ChatGPTは通常/c/と明示的/g/g-p-…/c/。プロジェクト名が不明ならIDでまとめ、名前や親子を推測しない。Claudeは/chat/・/code/session_・/cowork/を別種別に分け、プロジェクトリンクだけをタスクにしない。Geminiは単一の現在サイドバーの/app/・/u/N/app/。実行状態は未確認とし、待機から完了を推測しない。デスクトップCodexの一覧・会話本文・実行手順・全アカウント履歴はこのWeb取得の対象外。

消去・サンプル・ファイル読込は自動OFFと保留応答の無効化。自動ボタンで再開、手動更新は1回取得する。窓を閉じる／再読込でメモリーを破棄。一覧は永続保存・診断ログ・運営サーバー・公開資産・Gitへ入れない。

## モジュールと安全契約

上記7モジュールを独立実装し、Webの専用橋渡しから利用量GET／REFRESH／SETTINGS・音声・保存へ依存しない。拡張機能側は本文・入力欄・認証情報を読まず、非公開APIの推測をしない。

JSONは512KiB・500件・12階層以内、schemaVersion=1、対象service一致、ISO取得時刻が必須。IDは厳密な一意120文字以内、タイトル200、projectId/titleの整合、親は同じproject/kindの実在ID、summary500、任意更新時刻と公式リンク。循環・重複・親不在・別project/kind・別serviceは全体拒否し前回を保持。資格情報など未知フィールドは破棄。リンクは厳密HTTPS事業者host・許可チャット経路・認証/port/query/fragmentなし。sourceは形式ラベルであり取得元認証ではなく、読込ファイルは端末内観測値と表示する。

CSP connect-src none、script/style self、object/base/form-action禁止を維持。専用拡張メッセージはブラウザ内の経路でありWeb fetchをしない。textContentで描画し、コピーは利用者操作のみ、失敗時は選択可能テキストを提示。狭幅でもタスク名14px、補足13px、字下げ6pxを維持。

## 検証範囲

形式・親子・不正リンク・繰返しボタン描画・模擬公式サイドバー・同時依頼共有・間隔・一時タブ終了を回帰検証する。残量側は実背景処理の請求循環待ち、GET投影の保存／履歴非変更を別検証。2026-10-10に公式利用画面の数値差を確認。拡張更新後の本番自動取得・外窓リサイズ・音・全アカウント範囲は実確認前に成功と主張しない。旧JSON限定試作は履歴として上書きし、端末内JSON読込機能は残す。
