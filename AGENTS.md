# LLMs Monitor — Agent Instructions

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

This file is the starting point for every future Codex or LLM edit. Follow the user's current instructions while preserving existing features and browser-stored data.

## Read before every change

1. Read this entire `AGENTS.md`.
2. Read all of `SPECIFICATION.md`, including acceptance criteria and known limitations.
3. Read every requirement ID, data contract, and evidence item in `spec/requirements.json`.
4. Review `README.md`, `STORE_SUBMISSION.md`, `extension/manifest.json`, relevant source code, and existing tests.
5. Check `git status` and recent diffs; never overwrite user or parallel changes.

## Regression-prevention workflow

- Map the request to existing requirement IDs. Add IDs for missing requirements; never silently delete or weaken an old requirement.
- Update `SPECIFICATION.md` and `spec/requirements.json` with the implementation. Disclose limits and unverified behavior.
- Treat `extension/` as the source of truth for store-package UI. Web-only enhancements belong in `web/` and are composed into `dist/` by `build.py`; never edit generated `dist/` alone. A normal `python3 build.py` preserves the existing store ZIP. Use `python3 build.py --package` only for an intentional extension-package release.
- Preserve storage keys, history, limit labels, acquisition sources, account boundaries, and compatibility with older settings. New settings need optional defaults.
- Apply settings to the main page, public web app, normal popup, always-on-top view, and in-page panels. Hidden services must keep fetching and recording history so they can be restored.
- Check the existing acquisition paths, 60-second refresh, one-minute official service-status monitoring and status-log throttle, history, numeric-only change indicator, three sounds, localization, themes, opacity, fullscreen, explicit-only popup launch, unrestricted popup CSS sizing, and privacy before release. Read `SECURITY_REVIEW.md` and keep its permissions and manual-test limits current.
- Never replace an official provider value with an estimate. Tips and news require dates and primary-source links; never send private usage data or history to an external news source.
- Run meaningful tests, `node --test tests/*.test.cjs tests/*.test.mjs`, `python3 build.py`, ZIP inspection, version checks, and diff checks. Record any necessary manual verification in `SPECIFICATION.md`.
- Decide the version before building. If the store package changes, increment the minor component `y` in `x.y.z` and reset `z` to zero. If only lightweight non-package content changes, increment `z`; an explicitly version-neutral content update keeps the current version. Keep all changed release surfaces consistent and preserve the existing Site audience when deploying.
- Treat `https://aimon.ntus.info/` as the canonical hostname for the future public production release. Any extension allowlist, CSP, redirects, documentation, and hosting configuration introduced for that release must use this exact HTTPS origin. Publishing the product page on GitHub Pages may precede that migration.
- Any interim Site slug or origin change must update `manifest.externally_connectable`, the background `ALLOWED` set, Web links, privacy and release documents, and regression tests in one package release before the renamed URL is reported usable.
- X intelligence must remain isolated from private usage state. Never add an X token to client code or repository; preserve silent first baseline, post-ID deduplication, source-role labels, and one-minute polling tests.
- Claude weekly API zero follows the same official-page confirmation rule as the five-hour window. Parse the visible weekly used percentage and weekday reset separately; never record an unverified zero in history or alerts.
- A numeric-change alert must dispatch its sound before the changed snapshot becomes visible to renderers; keep provider-status polling at one minute and cover both rules with regression tests.
- Preserve the exact official ChatGPT reset entitlement wording when it contains a verified expiry. A partial API refresh must not replace that wording with an unavailable deadline. When Claude API reports 0% but the currently open official usage page reports a positive balance for the same active session, suppress the contradictory 0% and its history/sound event.

- Keep Nerf Bench link-only unless the user explicitly restores monitoring; older v1.10 requirements are superseded in v1.17.0. Test flashing primary digits in both floating layouts at their inherited full font size. On package updates, recheck already-open ChatGPT usage tabs for rendered reset expiry without inventing dates.

- The AI tool directory uses the LLM card layout and is hidden in fullscreen. Preserve its ten links and bilingual descriptions; keep usage cards and history visible in fullscreen.

- Version 1.17.1 is a one-time user-requested exception. After this release, resume the normal rule: any store-package change increments the middle number and resets the last number to zero. Do not infer a permanent rule change from this exception.
- A ChatGPT reset entitlement can expose its expiry only in the rendered official usage page. When a verified API entitlement lacks an expiry, check that an open usage tab actually has the extension reader; recover a missing reader and close any temporary acquisition tab. Never equate an open tab with an injected reader.
- The AI tool directory is nine editorial picks followed by Nerf Bench at position 10. Keep the separate BridgeBench leaderboard card removed.

- v1.22.0 supersedes the v1.20.0 floating header: no custom title or ± resize menu in popup/PiP. Keep three service rows visible at narrow width, with independent scrolling for details, and never reset a user-selected window size. Browser-owned origin text is not replaceable.
- Keep API billing balances in `apiCredits`, separate from plan quotas, reset rights and history. API host access and scripting are optional and granted only through a user click in an extension page. Reject non-billing routes, child frames, unapproved origins, disabled providers and ambiguous balances. Never infer balance from budget/spend or collect passwords, API keys or payment data. Document adapters that lack signed-in live verification.

- Keep bounded diagnostic events in a separate local IndexedDB database. Never log credentials, API payloads, full page text or account identifiers. Log failures must not block usage updates. Export requires a user click in an extension page; do not expose logs through the Web GET response.
- Keep the language selection stable against stale refreshes and open usage/API setup pages in a normal browser window even when a floating popup is focused.

- Keep Web release/cache versions separate from extension compatibility versions for Web-only patches. Installation links must wrap the localized child so language updates preserve the anchor; never rebuild the store ZIP for this Web-only change.

- The current companion is `https://llmsmonitor.ntus.info`; retain the previous Site origin for compatibility. Keep the exact origin set aligned in manifest, background validation, ledger and tests. A link alone never enables extension messaging on a new origin; verify both browser gating and runtime validation and document first-time extension-ID pairing.

- Keep task details in independent Web-only `tasks-*` modules. The main monitor receives only the launcher; never reuse its quota/RPC/audio/floating lifecycle in the task page. Treat imported states as historical observations, label demos, reject invalid ancestry/provider links, and never put private task snapshots in the repository or deployed assets. Automatic task acquisition requires a separately reviewed adapter.

- For floating provider alerts, show only `issue` rows while incidents exist; never hide normal usage cards. The main status view remains complete, and no-incident/recovery/unavailable behavior must stay accessible. Keep task narrow-width layout changes in `web/tasks.css`, with readable text and bounded tree indentation.

- Billing-reader snapshot replies must bypass the global refresh queue and retain their dedicated validated queue. Test the real nested READ→SNAPSHOT→acknowledgement path, not only parser outputs. Keep optional reader/audio work bounded.
- Never show an expired cached quota as current or as “reset soon.” Project stale windows without modifying stored baselines/history, and do not refresh quota capture time with metadata-only DOM supplements.
- Automatic tasks belong to independent metadata-only modules and TASKS_READ/TASKS_STATE. Restrict sender origin, task route, service and top frame. Use fresh inactive provider homes; never reload user chats/drafts. Do not persist or log titles. Keep explicit pause/clear/import behavior, bounded acquisition, unknown execution state and temporary-tab cleanup.
- Provider incident and AI feed disclosures have independent state on every surface. Do not claim an unconfigured X feed works or let incidents expand the feed panel.

- TASK-CODE-001: only exact Claude Code sidebar state-icon labels; keep 90-second list expiry independent from 15-second open-tab expiry. Unread/merged never means completed. Never read task status from its title.

## Every deliverable

Keep this `AGENTS.md` in the repository and update it when a new acceptance rule or failure-prevention step arises. In the final report, link this file, the detailed specification, and the distribution package; distinguish verified behavior from live-account checks that remain unverified.

At the start of work, if the planned build would regenerate unchanged manuals, documentation, or distribution artifacts, first ask whether the user wants an app-only build or those additional artifacts included. Explain which artifacts actually require regeneration. Preserve an explicitly approved scope unless it changes. Do not rebuild or reissue unchanged documents merely to satisfy the deliverable rule above; link existing relevant artifacts instead. Reading the requirements and regression rules remains mandatory and is separate from rebuilding documents. A workflow/documentation-only change does not require an app build, version bump, or package regeneration.

---


- Task-state polling must remain isolated: scoped button metadata only, no message/draft text; open tabs only, no navigation. Keep 15-second expiry, duplicate-route conflict checks, Gemini account matching, and independent pause/clear/import invalidation. Never infer completion from idle or Code/Cowork input readiness. Preserve all v1.25 quota/history/audio recovery tests.
<a id="ja"></a>

# 日本語 — LLMs Monitor 作業指示

[🌍 EN](#en) · [🇯🇵 JP](#ja)

このファイルは将来の Codex / LLM に向けた、毎回の作業開始点です。ユーザーの最新指示を優先しつつ、既存機能と保存データを守ってください。

## 毎回、編集前に読む

1. この `AGENTS.md` を読む。
2. `SPECIFICATION.md` を全体通読し、対象機能の受入基準と既知の制約を確認する。
3. `spec/requirements.json` の全要件ID、データ契約、証跡を確認する。
4. `README.md`、`STORE_SUBMISSION.md`、`extension/manifest.json`、関連コードと既存テストを確認する。
5. `git status` と直近の差分を確認し、利用者または別作業の変更を上書きしない。

## デグレ防止の変更手順

- 依頼内容を既存の要件IDに対応付け、足りない要件は新しいIDを追加する。旧要件を黙って削除・弱体化しない。
- `SPECIFICATION.md` と `spec/requirements.json` を実装と同じ変更で更新する。仕様上の制約と未確認事項を隠さない。
- `extension/` をストア配布機能の正本とする。Web限定の追加は `web/` に置き、`build.py` で `dist/` へ合成し、生成後の `dist/` だけを直接直さない。通常の `python3 build.py` は既存ZIPを維持し、意図して拡張機能を更新するときだけ `python3 build.py --package` を使う。
- 保存キー、履歴、利用枠ラベル、取得元、アカウント境界、設定の旧データとの互換性を保つ。新しい設定は省略可能な既定値を持たせる。
- 設定変更はメイン画面、公開Web、通常小窓、最前面表示、サイト内パネルに反映する。非表示のサービスもバックグラウンド取得・履歴保存を続け、再表示時に既存データを戻す。
- 既存の取得経路、60秒更新、1分周期の障害監視とステータスログ抑制、履歴、数値だけの通知、3音、日英、テーマ、透明度、フルスクリーン、小窓の明示起動と自由リサイズ、プライバシーを変更前後で確認する。
- 公式サービス由来の値を推測値で置き換えない。外部情報やニュースは日付と一次情報へのリンクを付け、使用量・履歴を外部へ送信しない。
- 適切な意味のあるテストと `node --test tests/*.test.cjs tests/*.test.mjs` を実行し、`python3 build.py`、ZIP一覧、版番号、差分を確認する。必要な手動確認を `SPECIFICATION.md` に記録する。
- ビルド前に版を判定する。ストア公開用パッケージが変わる場合は `x.y.z` の `y` を1増やして `z=0`、パッケージを変えない軽微な変更は `z` を1増やす。ただし利用者が版据え置きを明示したコンテンツ更新は現行版を維持する。変更対象の版表記をそろえ、既存の公開範囲を保ってサイトを更新する。
- 将来の正式公開URLは `https://aimon.ntus.info/` を正本とする。その公開時に追加する拡張機能の接続許可、CSP、リダイレクト、文書、ホスティング設定は、このHTTPSオリジンへ統一する。商品説明ページのGitHub Pages先行公開は可能とする。
- 正式公開前のSitesスラッグまたはoriginを変更する場合も、`manifest.externally_connectable`、backgroundの`ALLOWED`、Webリンク、プライバシー・リリース文書、回帰テストを同じパッケージリリースで同時更新し、新URLの利用可否を報告する前に接続整合を確認する。
- X速報は個人の利用量状態から分離する。X tokenをclient codeやリポジトリへ入れず、初回無音基準、投稿ID重複防止、出典区分、1分周期のテストを維持する。
- Claudeの週間枠にも5時間枠と同じAPI 0%の公式画面照合を適用する。公式画面の週間使用率と曜日付きリセット時刻を別途読み、未確認0%を履歴・通知に入れない。
- 数値変化の通知は、新しいスナップショットを描画側へ公開する前に通知音を送出する。公式障害情報の確認周期は1分を維持し、両方を回帰テストで固定する。
- ChatGPTの公式画面に出たリセット権の期限原文は確認できた時点で保持し、API部分更新による「期限未取得」への後退を防ぐ。Claude APIの0%は公式使用状況画面で裏付けられるまで確定せず、前回の正値を保つか未取得を表示する。未確認の0%を履歴・通知に含めず、公式画面を再読取する。公式で確認した0%だけ表示し、現在セッションと週間のリセット時刻を独立して保つ。
- 期限警告の枠は1つだけにする。カウントダウンまたは親要素のどちらか一方に警告装飾を付け、両方を囲まない。ゲージ内のリセット文は円の内側幅に収め、狭幅・全画面表示をテストする。ChatGPTリセット権の確認済み未来期限は部分更新で維持し、ロケール別表示文と期限属性を推測なしで解析する。

- Nerf Benchはリンクのみとし、利用者が明示的に再開を指示しない限り速報監視を戻さない。点滅する主残量は通常小窓・最前面小窓で同じ文字サイズを保つ回帰テストを行う。更新前から開いたChatGPT使用状況タブはパッケージ更新時に公式期限を再取得する。

- 「各種AIツール」は各種LLMと同じカード配置を用い、全画面では非表示にする。10件のリンクと日英説明を維持し、残量カードと履歴は全画面で表示する。

- 1.17.1は今回だけの利用者指定による例外。次回以降、ストア公開用パッケージを変更する際は従来どおり中間番号を上げ、末尾を0に戻す。今回の例外を恒久的な規則変更として扱わない。
- ChatGPTのリセット権期限は公式使用状況画面の描画後にしか存在しない場合がある。APIで権利を確認できても期限が欠けるときは、タブが存在するだけで安心せず、読み取りスクリプトの注入と受信まで確認する。一時取得タブは必ず閉じる。
- 各種AIツールはおすすめ9件と10番目のNerf Bench。BridgeBench単独のランキングカードを復活させない。

- 診断ログは変化履歴と分離した容量・期間上限付きIndexedDBに置き、認証情報・生API応答・ページ全文・アカウント識別子を残さない。ログ保存失敗で残量更新を妨げず、書出しは拡張機能内の利用者操作に限る。WebのGET応答にログを含めない。
- 言語切替を古い同期応答で戻さず、使用量・API連携画面はフローティング窓が前面でも通常窓に開く。

- Web限定パッチの表示・キャッシュ版は拡張機能の互換性判定版と分離する。導入リンクは翻訳対象の子要素を囲み、言語変更でアンカーを消さない。このWeb限定変更でストアZIPを再生成しない。

- 現行コンパニオンは `https://llmsmonitor.ntus.info` とし、旧Sites originも互換性のため維持する。manifest・background・台帳・テストの厳密origin集合を一致させる。リンク追加だけでは新URLから接続できないため、ブラウザー側の許可と実行時の検証を確認し、初回ID登録も案内する。

- タスク詳細は独立したWeb限定の `tasks-*` 群へ隔離し、主画面には起動導線だけを追加する。残量/RPC/通知音/既存小窓のライフサイクルを流用しない。読込状態は取得時点の観測値とし、サンプルを明示する。不正な親子関係・別事業者リンクを拒否し、個人の一覧をリポジトリ・公開配布物へ入れない。自動取得は別途検証するアダプターで実装する。

- フローティング障害詳細は障害中だけissueのサービスに絞り、正常な利用残量カードは消さない。主画面の全社確認と障害なし／復帰／取得不能の表示を維持する。タスク狭幅調整は `web/tasks.css` 内で、可読文字サイズと小さな字下げを使う。

- 請求読取のSNAPSHOT応答は全体の更新待ち行列へ戻さず、検証済み請求専用待ち行列へ渡す。解析だけでなく実READ→SNAPSHOT→受領応答の循環待ちをテストし、任意読取・音声を時間制限する。
- 過去リセット枠を現在残量／「まもなくリセット」にしない。保存履歴と基準値は変更せず表示投影する。補足DOMだけで残量取得時刻を更新しない。
- タスク自動取得は独立したメタ情報用モジュールとTASKS_READ/TASKS_STATEに限定し、送信元origin・タスク経路・service・トップフレームを検証する。新しい非アクティブ公式ホームを使い、既存チャット／入力をリロードしない。一覧タイトルを永続保存・ログへ入れず、停止・消去・読込、時間制限、状態未確認、一時タブ終了を維持する。
- 障害情報とAI速報の開閉状態を全画面で分離し、障害で速報欄を開かない。未設定X配信を稼働済みとしない。

## 毎回の成果物

`AGENTS.md` 自体をリポジトリに残し、新しい受入規則や失敗防止策が生じたら更新する。最終報告では、このファイル、詳細仕様書、配布物へリンクし、確認済み事項と実機で未確認の事項を区別する。

変更のないマニュアル・文書・配布物まで再生成する予定がある場合は、作業の最初に「本体のみのビルド／文書・配布物も含める」のどちらにするか利用者へ確認し、実際に再生成が必要な成果物を説明する。一度承認された範囲は、範囲が変わらない限り引き継ぐ。上記の成果物規則だけを理由に未変更の文書を再ビルド・再出力せず、必要な既存成果物へのリンクで対応する。デグレ防止のための要件仕様・回帰防止規則の参照は引き続き必須であり、文書の再ビルドとは区別する。作業方針や文書だけの変更では、本体ビルド・バージョン更新・配布パッケージ再生成は不要。

v1.22.0で旧外窓ヘッダー仕様を明示的に上書きしました。独自タイトルと±サイズ操作は表示せず、狭幅でも3社の欄を常時見せ、詳細は各欄内でスクロール可能にします。描画・更新で利用者の窓サイズを戻さず、ネイティブURL表示はブラウザ仕様として残します。

API請求残高は `apiCredits` に隔離し、月額プラン枠・リセット権・変化履歴へ混入させないでください。事業者ごとの任意権限は拡張機能画面の直接クリックで要求します。請求以外のパス、子フレーム、不許可origin、無効事業者、複数残高を拒否し、予算からの残高推測やパスワード／APIキー／決済情報の収集を禁止します。実請求アカウントで未検証の取得処理を明記してください。

- タスク状態取得は独立させ、入力欄周辺の操作属性だけを読む。本文・入力値・既存タブの遷移は禁止。15秒の失効、重複タブ不一致、Geminiアカウント一致、停止／消去／読込時の両経路無効化を維持する。応答待機やCode/Cowork入力可否から完了を推測しない。v1.25の残量・履歴・音声回帰テストを残す。

- TASK-CODE-001：Code一覧の状態アイコン属性だけを使い、90秒の一覧失効と15秒の会話失効を分離する。未読／PRマージを完了としない。タイトルから状態を推測しない。

### v1.28 task notes and promotional credits / 作業メモとプロモーションクレジット
EN: Automatic task titles remain memory-only. The user explicitly authorizes saving user-authored notes/checklists (including their chosen task title and link) in `llms-task-notes-v1`, separately from monitor state. Use separate workspace labels for accounts; no automatic cloud sharing. Export/clipboard requires a click. Verified sidebar names and explicit pins only; full coverage is not guaranteed. Promotional API credits remain separate from paid credits and all monthly quotas, with no inference from grants.
JP: 自動取得した一覧は従来どおりメモリ内のみ。利用者が明示保存する作業メモ・チェックリスト（選択したタイトル・リンクを含む）は `llms-task-notes-v1` に隔離保存。アカウントごと作業領域名を分け、クラウド同期しない。書出し／コピーはクリック時のみ。公式で確認した名前・ピンのみを使い全件保証はしない。APIプロモーションクレジットは購入残高・月額枠と別扱いで、付与額から推測しない。

TASK-REGISTER-001: Keep official registration isolated; metadata only, explicit save, 2-minute single-use memory handles and exact sender route/frame/service validation. Never place titles or conversation URLs in launch queries. TASK-PIN-002: scan only owned acquisition homes; report rejected/limited/missing pin evidence and never equate rendered end with full-account coverage. TASK-DISCLOSE-001: preserve default-open section disclosure state through refresh and language changes.

TASK-STATE-MARK-001: all task titles start with explicit status mark and retain textual state. Keep pin and state separate; unknown project/artifact states never infer running/completion.

TASK-CODEX-001 (v1.30.0): Native Codex acquisition is opt-in, local-only and independent from browser tasks/quotas/history/audio. Exact task route/service/top-frame and own extension setup validation; optional nativeMessaging by direct click only. The host accepts only fixed CODEX_TASKS_READ, with initialize/thread/list/thread/read(includeTurns:false). Never forward preview, turns, notifications or authentication fields. Pins use an explicitly labelled desktop compatibility adapter and local completeness audit; do not claim account/remote-host completeness. Independent stdio metadata cannot establish desktop runtime states. Existing shared proxy evidence expires after 90 seconds; idle never means completed. Preserve pause/clear/import invalidation. Build app, extension and helper only; unmodified manuals/PDFs stay unchanged.
JP: Codex取得は任意の端末内連携として独立。本文・preview・認証情報を渡さず、実行／設定変更のAPIは禁止。内部ピンID形式の互換読取と端末内照合を明示し、他ホスト全件保証をしない。独立メタ情報読取で稼働状態を推測せず、共有接続の観測だけ90秒有効。マニュアル・PDFは再生成しない。
Codex helper packaging is separately opt-in: `python3 build.py --package --codex-helper` for this release. Later `--package` preserves an unchanged helper ZIP; use product.codex_helper_version independently. ヘルパー再生成は明示した時だけ。未変更のヘルパーを毎回作り直さない。

TASK-WORK-001 Web v1.30.1: saved-note titles use validated noteURL (including exact Codex deep links), Edit is separate, heading counts follow selected provider/workspace. Remove the redundant storage paragraph only; preserve explicit-save, storage keys, revision conflicts, source isolation and minimum-width layout. Web-only note changes must preserve extension/helper ZIP bytes.

TASK-MONITOR-001 (v1.31): user-authorized task overview is the only read-only saved-quota RPC exception. Require exact task origin/route/top-frame and unique selected service, data/providerStatus-only read, field whitelist, expired/null/previous/login/actual-zero distinctions, no writes/fetch/audio/history/settings/core queue. Keep new task CSS isolated and test real listener with a stalled main queue.
JP: タスク概要は保存済み対象事業者の読取だけを許可し、主画面の取得・履歴・音・設定を変更しない。厳密な送信元・単一service検証、期限切れ／未取得／前回／ログアウト／真0を維持する。
INTELLIGENCE-AUDIT-001: always include *.test.mjs in regression runs. Static builds ship unconfigured X feed; full build never deploys the Worker or proves Tibo delivery. Require live server/eligible post acceptance before advertising live alerts. First client success is silent, complete bounded paging commits feed before public cursor, failures preserve prior alerts.
JP: MJSのサーバーテストも必須。静的ビルドとTibo実配信を混同しない。実投稿確認までは未設定を明記。初回成功は無音、完全取得だけカーソル更新、失敗は前回保持。

### v1.32 sound / note handoff narrow exception

SOUND-MUTE-001 must cancel queued tones/late resume and preserve explicit mute across old GET replies and concurrent general settings. Preview never enables notifications. TASK-REGISTER-001 now permits only the clicked, bounded two-minute single-use chrome.storage.session browser-memory handoff (not storage.local/disk), with expiry cleanup and the existing strict receiver validation. This supersedes the older process-memory-only handoff, not automatic task persistence. Manual workspace-choice preferences may use llms-task-note-workspaces-v1; preserve llms-task-notes-v1 and default identities. Exact Claude thread header metadata and editable note titles only; never body/draft text or inferred account names. Full build requires explicit user approval (obtained for v1.32); include all current manuals and the helper’s revised guide without changing helper runtime.

通知音OFFは保留音・遅延再開・古い応答・一般設定からの再ONを防ぐ。試聴で有効化しない。メモ登録のprocess内限定を、明示クリック分の2分／一度限りsessionメモリーだけへ変更可。自動一覧の永続化は不可。旧メモキー／defaultを保ち、手動領域選択を別キーへ保存。スレッド見出し属性だけを読み、本文・入力・アカウント推測は禁止。v1.32は全取説フルビルド承認済み。

SOUND-OFFSCREEN-001: Chrome offscreen documents expose only runtime extension APIs. Never access storage there, even if a permissive mock allows it. Execute the player with a runtime-only mock and the actual worker listener for nested AUDIO_SOUND_STATE. Worker reads only sound, validates exact own offscreen sender, bypasses quota queue, and sends STOP on mute; timeout/missing replies fail closed. For approved app/package-only updates use `python3 build.py --package --skip-manuals`; preserve hosted/bundled manuals and unchanged helper ZIP hashes.
JP: offscreenではruntime以外の拡張APIを使わず、模擬環境にも同じ制約を設ける。設定の真偽値だけを厳密な自身のoffscreenからWorkerへ問い合わせ、残量待ち行列を経由しない。OFFを停止メッセージで伝え、失敗／期限切れは無音。本体＋拡張のみ承認時は --skip-manuals で取説・ヘルパーのバイト列を維持する。

TASK-NOTE-UX-001: Claude display:contents tile hosts have no rectangle. Select the exact thread ID without a host-box requirement, then require a unique visible heading and no hidden ancestor. Test full thread URL/title across registration, session handoff and explicit note storage; sibling threads must stay distinct. Never infer thread title from project/document heading. TASK-DISCLOSE-001: Work notes precede Pinned items / ピン留め, preserving default-open and disclosure state.

DOC-CODEX-INSTALL-001: documentation-only builds use --manuals-only followed by exact changed guide filenames; exit before app inputs and reject mixed package/helper options. Preserve all runtime files, ZIPs and unnamed manuals. macOS guide must match actual installer paths/ID validation and distinguish enabled permission from successful host read; Windows remains unsupported, Linux implementation is not live acceptance. Do not install on the user's machine when only instructions were requested.
JP: 取説だけなら変更した文書名を --manuals-only に指定し、本体／ZIP／未変更取説を保持。拡張機能ID入力・Python3.9以上・接続確認までの手順を実コードに照合。Windows未対応を隠さず、取説依頼で実機導入を行わない。

TASK-CODEX-FALLBACK-001: Shared connection discovery is not proof of a responsive server. Bound the whole shared attempt (initialize, pins, paging) to four seconds within the 21-second host budget, then close it and retain time for metadata fallback. Tests must reproduce hangs in all three stages and preserve Unknown runtime on fallback. Keep helper version separate from Web/extension versions; approved Web/helper-only builds preserve extension sources/ZIP and old helper bytes. Never log private payloads during diagnosis.
JP: 共有socketがあるだけで接続成功としない。共有初期化・ピン・一覧すべてを4秒以内に区切り、失敗プロセスを終了して全体21秒の残りを一覧代替経路へ確保。代替の状態は未確認。Web／ヘルパーのみ更新時に拡張ZIPを再生成しない。

Future native-app scope: macOS, Windows, iOS and Android are user-required targets. Treat this as a future acceptance requirement, not current support. Cross-device Codex/tasks/notes need a separately reviewed explicit consent/pairing/retention design; no automatic private uploads or rewrite of the stable main monitor as part of helper repair.

TASK-CODEX-API-001: Permission=true does not prove runtime.connectNative exists. Detect native-api-unavailable before cooldown/launch, expose only availability booleans, and use explicit own-setup click for runtime.reload. Never auto-restart the extension/browser, move nativeMessaging into required permissions, or log private native errors/payloads. Restart interrupts monitoring and clears session note handoffs; saved storage is retained. Do not claim verified browser recovery from a mock or terminal host test.
