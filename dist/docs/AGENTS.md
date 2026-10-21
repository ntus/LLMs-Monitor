Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/AGENTS.md

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
- A numeric-change alert must dispatch its sound before the changed snapshot becomes visible to renderers; sound/history comparisons use the rounded integer percentage shown in the UI and exclude credits/extras. Preserve low/critical sound only on downward threshold crossings. Keep provider-status polling at one minute and cover both rules with regression tests.
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

TASK-CODEX-HANDOFF-001: A successful CODEX_CHECK must be available to an authorized task window during the shared cooldown. Keep only validated metadata in worker memory, preserve checkedAt/90-second expiry, test distinct callers and no extra native process, clear on configure and check permissions before reuse. Never persist automatic task snapshots or add host launches to bypass the throttle.

TASK-FAVORITES-001: Legacy work-note identities/content remain, favorite defaults true. Unstar never deletes notes; keep absent unfavorited notes editable. Star is explicit title/link saving only; favorites are not official pins, and favorite-only records must not invent working state. Preserve per-service/workspace order through export/import and reject stale revisions when reordering. Drag payloads must not contain private titles/URLs. Web-only builds preserve all extension/native sources and ZIP bytes.

PRODUCT-GUIDE-001: Product-page guides remain static and bilingual with stable anchors. Do not load monitor state, notes or credentials in marketing pages. Match actual package/helper versions and source manuals, preserve unconfigured Tibo/partial pins/Unknown runtime/platform limits, and distinguish browser app from native installer. Product-only builds preserve ZIPs and bundled manuals.

TIBO-PUBLIC-001: Optional fixed-author public-page reads only; no navigation/reload/private fields. Keep first baseline silent, post-ID deduplication and bounded acquisition. Future Reset? marks require a parsed announced deadline, local timezone tooltip and exact source URL; remove at expiry. Never equate announcements with personal quota recovery. Do not rebuild manuals when the user excludes them.

Tibo tab and injected-page route validation must both accept only unique standard s/t share parameters and never persist their values. Show why acquisition or the future deadline is missing; do not silently treat every failure as an unconfigured server.

## v1.38.0 — 2026-10-13

Claude billing probe uses an owned inactive official billing tab only after existing opt-in permission; it is independent of the quota queue, coalesced, bounded and cleaned up. User-activated/navigated tabs are retained. API balances remain separate from quotas/history. Codex setup prepares an entirely local ZIP with a validated exact extension ID, executable macOS entrypoint and no network upload; native authorization remains exact. Existing enabled connections are checked on opening setup. Tibo public readers run bounded per-tab reads independently, report bounded counts/API availability, and support explicit diagnostics without quota-queue blocking. Advice must not obscure the feed/status content.

本体・拡張機能v1.38.0／ヘルパーv1.30.2をビルドし、取説は正本だけ更新。既存dist/docsを再生成しない。実端末のClaude自動取得と初回専用ZIP導入は利用者確認が必要。Tibo告知の取得は利用者が動作確認し、アドバイスON時の重なりを報告。予定期限は実際の個別残量回復時刻ではない。

## v1.39.0 — Tibo / expanded status layout (2026-10-13)

Measure the complete fixed status dock with ResizeObserver; expanded content flows inside the dock and is bounded/scrollable. Reserve measured height for main content and place the advice ribbon above it independently of ON/OFF. ChatGPT reset entitlement includes a separate Tibo public profile link below the row; a verified future reset announcement uses a warning, dated label, tooltip and exact post link. After expiry restore the plain profile link. Available count stays inside its official usage link. Preserve quotas/history/audio, optional permissions and native helper. Build app/extension only, retain helper/manual bytes.


## v1.40.0 — Provider notices and quiet, display-aligned alerts (2026-10-15)

Read only allowlisted short provider pacing/limit warnings from the visible official usage page and show them in the provider card and shared floating widget. Escape and cap at 280 characters. API snapshots preserve the latest DOM notice; a later DOM read with no notice clears it. No page body, credentials, or hidden data is collected or transmitted.

Usage-change sounds and new history rows compare rounded integer remaining percentages, matching the displayed gauge. Ignore credit/extra changes and fractional changes that render identically. Distinct low/critical sounds occur only when remaining drops across 5%/1%. Preserve all old history and update the raw comparison baseline on every read.

Claude prepaid-credit parsing accepts finite scalar or recognized nested amount fields, formats USD to two decimals, and omits malformed objects. Expiry timestamps before 2000 are invalid; never render epoch-like 1970 dates from small numeric fields.


TIBO-PUBLIC-001 v1.41: Match explicit Day N/Reset within prefixed posts and fullwidth Japanese translation. Relative timing requires same visible status-conversation ID, a separately classified parent reset post by Tibo, same author and 0–10 minute publication gap. Accept only 1–24 hour landing phrases. Never infer conversation context from profile adjacency or claim individual reset completion. Preserve exact source reply link, deadline expiry, old EOD behavior, opt-in boundary and deduplication.


QUIET-ACQUISITION-001 / GAUGE-142: Automatic quota/API/task tabs must use GlanceQuietTabs, a serialized session-owned minimized/unfocused/muted host. Never add automatic pages to the work window or reload user pages. Release only owned tabs; preserve opened/navigated host content. Manual main-service heading links and usage-setting buttons remain distinct. Gauge caption precedes number, number is red strictly below 30%, countdown has no parentheses and correctly carries rounded minutes. Keep changed-number spans inline and full-size. App/package-only publishing preserves existing manual/helper bytes.

## 2026-10-16 emergency correction — automatic window proliferation

Supersedes the v1.42 minimized-host requirement: acquisition must never call windows.create/update/remove or create about:blank. Use an explicit existing non-incognito normal window ID and active:false; with no normal window, skip acquisition. Keep serialized session ownership and the 12-tab cap. Close only inactive owned tabs still on their acquisition route (or the exact allowed Claude usage redirect). Never close existing windows or user-adopted/navigated tabs. Older minimized-host records must not trigger window replacement. This intentionally allows temporary inactive acquisition tabs in an existing normal window to prevent automatic window creation.

Release validation: 313 full regression tests pass, including 60 repeated/concurrent acquisition attempts with zero window mutations, popup-only skip, old record migration and adopted-tab protection. App/extension v1.43.0 built with unchanged manuals/helper ZIPs. Hosted v1.42 source was reconciled without dropping its changes. Installed-browser upgrade and a sustained real-user no-popup check remain user acceptance gates.

## v1.44.0 — compact information and acquisition (2026-10-16)

Main provider warning and Tibo feed move into the existing fixed-height connection row, rotating every five seconds plus manual next; plain-text tooltip/source and Tibo setup remain available. Remove main-card notice/footer feed only; retain floating warning and independent official incidents. Claude optional billing acquisition starts before quotas finish, coalesces, waits up to 35 seconds with 45-second ownership cleanup, and never creates a window. Gemini plan discovery is bounded to three seconds after valid quota rows, validates utilization as an explicit number within 0..1, and accepts account-qualified official usage routes. On API failure read up to three existing official usage tabs only; no new Gemini page/window. User confirms the official Gemini usage page also lacks values: no individual quota recovery is claimed. Unavailable task count is unknown, not zero. No new permissions, paid API, helper or standalone manual regeneration.

Gemini field evidence 2026-10-16: user reported Google /sorry reCAPTCHA at official usage URL, then confirmed values returned after their own manual verification. Do not automate or bypass CAPTCHA. Detect explicit Google /sorry, 429 and bounded unusual-traffic text; abort account exploration on the first challenge. Persist a 15-minute retry-after for challenge or five minutes for other acquisition failure. Explicit trusted Refresh permits one retry; successful fetch clears cooldown. Never store challenge page text, IP, challenge tokens or network identifiers.


## v1.45.0 — Setup / 追加連携

Single own top-level setup.html groups required sign-in guidance, optional API/Codex/Tibo and up-to-three service selection. Additional Grok/DeepSeek/Perplexity/Genspark account readers are experimental, disabled by default, exact-route/top-frame validated and separately permissioned. Never read chats, auto-navigate/reload, use paid APIs or convert credit balances to quota percentages. Preserve native exact-ID installation and existing no-window acquisition safeguards. Task helper action opens personalized installation/check, not a generic ZIP. Existing helper and standalone manual files remain unchanged. Live additional-provider layouts and installed automatic Claude billing remain acceptance limits.

日本語：セットアップ画面に任意設定を集約。追加4社は公式残高・契約画面の試験読取りで初期無効、実アカウントの形式は未検証。最大3サービスを選択。Codexは同画面からID入力不要のZIP保存・接続確認。ヘルパーと既存取説配布物は再生成しません。


## v1.46.0 — display mode, sound-on preview and dated author sources (2026-10-17)

USAGE-DISPLAY-001: usageDisplay defaults to remaining; an explicit button immediately after Advice switches to used. Only rendered quota windows, previous percentages and history rows are complemented (100 minus the rounded displayed remainder). Unknown/expired values remain unknown. Credits, reset entitlements, persisted data/history, forecasts and worker sound thresholds remain canonical remaining values. Display changes use a separate numeric tracker; switching modes does not create alerts or history. Persist and synchronize the mode across main, floating, PiP, in-page panels and the isolated task overview. Preserve pending user mode over stale GET responses.

SOUND-ON-PREVIEW-001: remove the separate Test button. A direct OFF-to-ON click plays one preview after enable; OFF, startup and background synchronization do not preview. Revision and notifier cancellation prevent a late preview after OFF. Existing numerical-change and incident audio remain independent.

POST-DETAILS-001: show publication time and direct source link, separate observed/read time from announced reset deadline, and always offer the Tibo profile link. Public metadata includes up to three dated, bounded same-author replies only when the verified parent and reply occur in the same rendered public conversation; unrelated author/conversation, quoted content and malformed links are rejected. Replies not seen are explicitly unverified; no full-thread guarantee. The Tibo seven-day reset/date rules remain; explicit Codex/ChatGPT usage-improvement posts can be usage information without inventing a reset. ClaudeDevs reading is independently disabled by default and must be explicitly enabled in own top-level setup with the existing optional X/scripting permission. It uses the same rendered-only boundary and a 45-day news window, with no automatic page opening, reload, paid API, credentials, DMs or inputs. First observation of each newly enabled author is silent; later matching posts notify once. Existing generic public-feed and static Claude/Google/OpenAI news carry dates/source links; static material never claims that author replies have been checked.

HEADER-PRIVACY-001: header order is Product, Setup, browser-local disclosure. The disclosure supports native keyboard/click details and hover title explaining browser/profile/site storage, no automatic operator upload/cross-device sync, removal risk and explicit note export. No sharing/audience changes.

日本語：残量／使用量ボタンをアドバイスの右に置き、表示だけ反転。履歴保存・通知判定は残量基準で保持。試聴ボタンを廃止し通知音OFF→ONで一度だけ確認音。投稿日時・確認日時・予定期限を区別し、本人の表示済み補足に日時とリンクを追加。Tiboプロフィールリンクは常設。ClaudeDevsは独立した任意設定、表示済み投稿と同一著者の返信だけを読み取り、未表示の返信は未確認。セットアップは製品紹介の右へ移動し、ブラウザ内保存の説明をクリック／キーボード／hoverで提供。配布済み取説・ヘルパーの再生成なし。

## v1.47.0 — compact controls and movable advice

COMPACT-UI-147: Header language control follows browser-local disclosure. Tibo and ClaudeDevs labels link to profiles; message bodies and source actions link to the exact validated article. Main weekly reset renders verified local date/time plus countdown in one bold line, fitting available width without changing stored reset metadata. Suppress the session-estimate pending note; retain actual supported estimates. Display the legacy first-message state as メッセージ待ち / Waiting for message without changing acquisition values. Advice supports pointer drag (excluding links/buttons), pointer cancellation and keyboard arrows/Home; clamp after movement and viewport/size changes, never open windows or persist private content. Gauge caption moves down five pixels in both display modes. Existing helper/manual packages are preserved.

## v1.48.0 — weekly overview
WEEKLY-GAUGE-148: Outer ring remains current session, inner ring and labeled percentage show weekly quota. Both follow remaining/used mode; unknown stays unknown. Weekly horizontal bars are twice primary thickness. Independent amber forecast warnings require ready/fresh quota, future known reset, three current-cycle observations, at least 15 minutes for session / six hours for weekly and positive consumption. Reset increases split history; prior cycles, stale data and absent deadlines cannot generate forecasts. These are estimates, not provider facts; canonical quota/history/audio are unchanged. Keep previous low-quota red indicator. Existing helper/manual packages stay unchanged.

## v1.49.0 — ring hierarchy and reset grouping
WEEKLY-GAUGE-149 supersedes v1.48 ring order: weekly is outer radius51/stroke7, current session inner radius42/stroke3.5. Explicit 5-hour/current and weekly labels map to distinct colors shared by their text and rings. Show each percentage followed immediately by its own reset datetime/countdown on a translucent background; unknown deadlines remain unknown. Keep remaining/used mode, low-quota red and current-cycle forecast rules unchanged. Existing helper and standalone manuals remain byte-identical.

## v1.50.0 — dashboard redesign
DASHBOARD-150 supersedes prior gauge typography, warning colors and fullscreen fixed-height layout. Ring center has six ordered rows: caption, current-session label, current %, parenthesized countdown, weekly %, parenthesized countdown. Outer weekly ring remains thick but becomes a pale same-hue tint of the inner session ring. Dates live only beside left-aligned horizontal quota bars, matching task overview hierarchy. Low remaining (<=15%) or qualified depletion forecast blinks percentage only; no warning hue change. Reduced-motion uses a static dotted emphasis. Data, history and sound decision contracts are untouched.
Connection/feed messages, optional advice, incidents and collapsed diagnostics share a bottom dock; independently expanded incident/advice state and explicit drag controls persist. Fullscreen uses responsive document flow and scrolling instead of clipped fixed rows; at narrow/zoomed widths all selected cards remain reachable without overlap. This explicitly supersedes the earlier no-scroll narrow fullscreen layout.
Main setup explains ZIP extraction, browser extensions page, Developer mode, Load unpacked, pairing and official sign-in. Service selection/floating controls and optional-provider explanations are inline. Only permission-sensitive grants/native installation continue through the unchanged exact own-extension setup boundary; no Web origin gains configure privileges. Existing standalone helper/manual packages are not regenerated.

## v1.51.0 — readable quotas, inline setup, monitor-window acquisition and render reuse

DASHBOARD-151 supersedes v1.50 color/timing: outer weekly ring and weekly number use provider hue mixed with 28% black; current label shares current percentage color, caption is bold. Both horizontal reset lines include local date/time and parenthesized remaining time. Percentage-only low-quota pulse is five seconds, versus ordinary one-second value-change pulse; nested change animation is suppressed while warning pulse applies. Reduced motion stays static. Options are initially expanded by explicit user choice.

Own top-level extension index mounts the existing setup controls directly, without frames. Exact own index is added to the permission/native setup allowlist; external origins and subframes still cannot configure optional readers. From the Web monitor an explicit settings button replaces that same tab with the extension monitor rather than opening another tab. Personalized native installer remains unchanged. This supersedes v1.50 separate own setup requirement without granting Web configure privileges.

QUIET-MONITOR-151: automatic temporary quota/billing/task tabs are inactive/muted and restricted to a normal, non-incognito window with an exact main monitor URL. Prefer the monitor registered by MONITOR_READY; otherwise discover an exact allowlisted root/index route, preferring a focused qualifying window. Revalidate before creating. With no qualifying monitor, skip; never fall back to an unrelated window, create/mutate windows, or reload/close user tabs. Popup-only monitor and closed/moved monitor scenarios must fail safely. Existing owned-tab capacity and release protections remain.

UI-PERF-151: reuse unchanged main/widget DOM; invalidate on quota/data/credit/extra-service changes, settings/language, incident/feed state, minute countdown transitions and numeric-highlight expiry. Update acquisition ages separately. Generate only selected cards, while retaining all hidden-provider acquisition/history. Forecasts, sound decision thresholds, raw quota persistence and 60-second acquisition are unchanged. Detached draggable advice is above the status dock and disclosures within the app (not OS-level always-on-top).

VOLUME-PREVIEW-151: changing the volume by direct input and committing it plays exactly one preview at the new level, including when notifications are OFF; it does not enable notification sounds. Dragging does not create repeated previews, unchanged/blur-after-change/programmatic sync are silent. Existing alert events/history are unaffected.

Regular ChatGPT Chat quota remains unimplemented: the verified reader returns Work/Codex primary/secondary windows. No separately verified regular-chat percentage is present in the existing source. Do not fabricate it from message counts or Codex balances. Official Enterprise/Edu Admin usage-limit examples concern separate workspace budgets and do not establish a Plus ordinary-chat remaining-percentage source. Live signed-in verification remains required before claiming support.

## v1.52.0 — horizontal services, aligned history, direct options and Grok usage
DASHBOARD-152 supersedes the three-visible-service limit. All selected catalog services retain readable card widths in one horizontally scrollable row. The grid has no count cap and can lay out ten or more cards; only seven service adapters are currently registered. Use shared measured grid rows to align corresponding quota, extras, history and footer sections. Tighten gauge margins to two pixels. Preserve all provider acquisition, raw quotas, history and sound decisions.
Main Web options show complete API balance panels immediately, with existing connection state and billing links. Permission-changing actions still move the same tab to the exact own-extension main; no Web origin gains configure rights. Own main retains full inline controls. Product links open a new tab. Product guide and synthetic dashboard image are updated; never publish user account screenshots as promotional data.
Explicit restart first navigates the same tab to the Web monitor. Reload the extension only after that exact Web route has fully committed; timeout or unexpected navigation cancels restart. This intentionally replaces the prior direct reload that could close extension pages. No automatic restart or window creation.
GROK-152: optional exact-route dashboard reader extracts only bounded explicit weekly usage-card percentages, labelled used or remaining, plus a separately verified plan and ISO reset timestamp. Ambiguous/missing values remain unknown. Never turn credits or plan names into quota percentages. Existing signed-in usage pages only; no paid API, account scanning, chat reading, automatic navigation/reload or invented reset. Canonical Grok quota snapshots use existing state/history/sound mechanisms. Real signed-in dashboard layouts remain acceptance pending until observed. Source: https://docs.x.ai/x-subscription/usage-limits and https://docs.x.ai/x-subscription/manage (2026-10-18).
Correct the additionalServices state response to read the actual additional-services storage key rather than the comma-expression-selected Claude public-post flag. Retain separate enable permissions and top-frame checks.

## v1.53.0 — verified Grok dashboard and Google access recovery
GROK-153: read the bounded Current plan / Weekly included usage card observed on the signed-in official dashboard (including non-heading labels); percentage and Credits available are independent. API balances offer a separate Grok opt-in; shared host permission remains until both optional features are disconnected. Date-only reset labels are retained without fabricating a reset clock.
GOOGLE-153: Gemini task acquisition reads exactly one already-open official app home, never creates a new tab. Google challenge detection pauses automatic quota network retries until an explicit retry or a verified rendered quota. Existing usage-only recovery remains read-only; no CAPTCHA solving. Current Gemini task auto-fetch was temporarily paused via user-visible Web control during diagnosis.
LAYOUT-153: main uses available viewport width, dividing it by selected card count with 16px gaps and a minimum readable width of 340px. Fit without scrolling where possible; otherwise scroll from the first card. Retain aligned history and quota/notification semantics.

## v1.54.0 — stable Grok sources and discoverable windows
GROK-154: API panel enumeration is OpenAI, Claude, Gemini, Grok. Restrict weekly collection to the bounded plan card and reject mixed monthly-credit ancestors. Select one official Grok source tab (active, recent, stable ID tie-break); reject snapshots from other tabs and older reader versions. A changed rendered quota must remain identical for a second observation after at least 1.5 seconds before publication. Preserve unknown/reset semantics, history and notification rules.
NAV-154: service selection/order has its own section outside floating display. Main toolbar exposes explicit task-window links for the three supported task adapters and existing always-on-top / normal popup actions. Never launch automatically or claim task adapters for other services. Selection remains persisted in existing settings keys and pending local choices survive stale GET replies.

## v1.55.0 — card task links, helper requirement and estimated Grok countdown
NAV-155: supported ChatGPT/Claude/Gemini cards expose task links beside acquisition badges, using the existing explicit popup path. Unsupported services show a disabled explanatory task control. Main toolbar launchers remain.
CODEX-INSTALL-155: report installer required in red only when native host is absent or rejects the current extension registration. Ready means no additional ZIP installation; Codex-not-found means helper responded but desktop is missing. Disabled/API/unknown failures must not assert missing installation. Never enable permissions automatically.
GROK-DATE-155: user explicitly requests treating a date-only “Resets Oct 25” as device-local 00:00. Derive this only in the rendered window clone, anchored to its capture year (December-to-January rollover allowed); mark datetime/countdown estimated, validate calendar dates, and do not mutate or expire stored quota, change history, forecasts or sounds based on that estimate.

## v1.56.0 — setup navigation and selected floating services
SETUP-156: Web permission setup opens a separate normal tab and never replaces the requesting monitor. Own-extension inline controls remain. Preserve sender, origin, route and top-frame validation; never grant permissions through Web RPC.
GROK-156: label weekly plan reading separately from API balances; preserve both independent opt-ins and shared-host lifetime.
FLOAT-156: selected additional services render in normal/PiP windows using existing settings; readable minimum rows scroll vertically when needed. No automatic window launches or user-size changes.
HELPER-156: native helper remains v1.30.2. Connection success means no reinstall; a changed extension ID needs its personalized registration. No helper/manual regeneration.

GROK-AUTO-156: User explicitly requests automatic acquisition without opening Usage manually. When Grok quota opt-in is enabled, reuse one owned inactive dashboard tab in the monitor normal window, at most one reload/minute; never reload user-owned/active/navigated tabs. Persist tab identity in session storage and coalesce concurrent work. Closing the tab, login redirects or repeated missing quota pauses acquisition until explicit retry or verified recovery; no window creation or CAPTCHA automation. Disable releases only owned unactivated tabs. Existing non-Grok acquisition restrictions remain.

## v1.57.0 — persistent choices, registration status and popup/audio controls
SELECTION-157: scoped settings writes must preserve unrelated selected providers; timestamped Web backup can restore choices to a newly paired default extension, without granting optional reader permissions. Preserve newer explicit deselection and existing settings keys.
CODEX-157: distinguish native access forbidden from missing host. Same helper version does not prove current extension ID registration. Personalized ZIP filename includes its target ID; no native installation or allowlist is changed automatically.
FLOAT-157: newly created normal popup requests width190, matching PiP. Preserve existing window dimensions and explicit-only launch. Browser chrome may affect visible content width.
AUDIO-157: changed slider commit turns sound On and previews new volume once; unchanged values/blur do not replay, and a later explicit Off cancels pending preview/enabling. This supersedes v1.51 volume-does-not-enable requirement.

## v1.58.0 — user-launched Mac updater
UPDATER-158: keep updater separate from the metadata-only Codex host. User chooses and confirms the currently loaded extension folder once; never inspect Chrome profiles or change native host registrations. Use only fixed public GitHub HTTPS feed/package paths, validated versions, bounded downloads and SHA256. SHA256 is corruption detection, not an independent signature. Stage and validate before same-path replacement, preserve backup, roll back a failed swap; explicit restore retains displaced version. Reject traversal, symlinks, duplicates, oversized/wrong-product packages, changed key and downgrade. Required permission expansion needs confirmation. Keep single-process locking. Tool is unsigned/not notarized, macOS11+/Python3.9+; actual Gatekeeper/browser round-trip remains manual verification.
RELOAD-158: only a newer local updater marker plus matching on-disk manifest may trigger reload after quota refresh and settings queues complete. No new permissions or Web restart routes. First update from v1.57 or earlier requires one manual reload. Keep existing explicit restart guard unchanged.

CLAUDE-HYDRATION-158: Buffer owned billing snapshots until promotional balance is stable across observations for two seconds and the page has had at least five seconds; missing promo waits up to the existing 35-second bound. Do not publish loading snapshots. Publish one final observation and reject other billing tabs during acquisition and for 60 seconds afterward. A loading timeout retains the previous observation with its original timestamp; do not invent amounts or bypass billing scope validation. Signed-in provider hydration remains manual acceptance.

INSTALL-FOLDER-159: Initial-install download LLMs-Monitor.zip contains exactly one top-level LLMs-Monitor directory, with manifest.json directly inside. Keep versioned store/updater package flat and update.json pointed at it. Subsequent Mac updates replace the registered folder in place, never create a version-specific sibling, rename or migrate an installed extension. Existing versioned targets remain supported to preserve IDs/settings. Moving an existing installation to the fixed folder is explicit new installation, with possible changed ID and permissions/native registration; do not promise automatic history migration. Do not use Finder repeated extraction for updates.

PACE-160: Visual percentage-only five-second warning uses existing current-cycle history forecast first; weekly windows may additionally warn when remaining is over five percentage points below the even seven-day budget, after at least one elapsed hour. Label this fallback a guideline, not a measured rate. Grok date-only assumption may drive this display-only warning at explicit user request; do not modify stored quota/reset/history, sound or alert decisions. Preserve reduced-motion static emphasis and used-mode calculations on original remaining values.
TABS-160: Explicit own main/setup opens reuse an exact existing normal-window page. Automatic acquisitions remain inactive in the monitor normal window and recover only tabs with that monitor as opener and this exact extension as last muter, at the exact approved route. Do not claim ownership of arbitrary matching tabs or other extensions. User activation/navigation clears the ownership marker; never reload or close adopted tabs. Legacy unmarked duplicates require user review; no automatic bulk deletion or management permission.
BILLING-160: Visible determinate progress bars must not mark billing permanently loading. Wait for document loading or explicit aria-busy only; upgrade the already-open reader by its acknowledgement version. Preserve v158 hydration stability bounds, account checks and stale-tab suppression. Real signed-in unattended acquisition still requires acceptance.
GROK-OPTIN-160: Same extension ID/path keeps its stored optional Grok opt-in. Re-enabling is idempotent and must not erase observed values or other choices. Refresh the setup display when focused or settings change, showing exact extension ID/version to distinguish old setup tabs. A new installation ID still requires the user to grant optional permissions; never migrate or grant access silently.

CLAUDE-SLOW-161: Retry transient tab transport errors within a 90-second hydration attempt, polling every 1.5 seconds with at most one pending DOM read; a per-call timeout must not abort the entire acquisition or multiply outstanding reads. Retain one strictly owned inactive Claude billing tab across cycles, do not restart unfinished client-side hydration merely because HTML is complete, and reload completed observations at most once a minute. Use a 180-second inactivity watchdog and release on disconnect; pause on closed/redirected tabs until explicit retry or an active verified billing observation. A visible manually opened valid billing page may publish immediately, without an unfinished owned read overwriting it. Suppress auto-discard only for the newly owned Claude billing tab, restore its original/default policy on adoption, never alter other tabs or focus/create windows. Old billing reader versions are upgraded and rejected. Preserve scope/auth, amount validity, quota/history/audio and no-sensitive-data boundaries. Real high-load background hydration remains live acceptance pending. During slow rendering, store only bounded acquisition status/stage/duration (no account/page content), without refreshing balance timestamps. A frozen/discarded owned page may be reloaded at most once per minute to resume work, never focused. The HTML-complete flag is not evidence that billing hydration has finished.


CLAUDE-NAV-162: An initial empty/about:blank document with an exact approved billing pendingUrl is navigation in progress, not a login redirect. Wait within the existing 90-second bound without reading the blank document or creating another tab. A foreign or login committed URL is never authorized by pendingUrl. Explicit user retry bypasses only the automatic attempt cooldown; in-flight coalescing, account/permission validation and all tab ownership constraints remain. Keep reader protocol 1.61.0 because its payload is unchanged. Signed-in unattended acquisition remains unverified until the installed package is confirmed.


CLAUDE-DIRECT-163: Claude API credit refresh uses read-only Console session GETs to platform.claude.com/api/organizations and exactly one API-capable organization’s prepaid/credits endpoint, without rendering, creating, activating or reloading tabs. This supersedes automatic Claude billing DOM probes in v158-v162. Use existing optional host access and credentials:include; never extract cookies, import browser credentials, accept API keys or call inference/payment APIs. Multiple API organizations fail closed without probing them. Validate response origin/content-type/body bounds, UUID, currency, minor-unit exponent and grant values; purchased and promotional lanes remain separate, and multiple unexpired grants in a lane stay unavailable rather than being summed or inferred from total. Store only sanitized amounts, opaque scope and bounded stage metadata. One in-flight request coalesces with automatic one-minute cadence, 20-second total timeout and five-minute rate-limit backoff; explicit retry is allowed. Disable/revoke invalidates publication. Auth/ambiguous account clears current values; transient failures preserve original capture times, while a changed identified scope cannot reuse old values. No manual foregrounding is required. Console endpoints are undocumented, referenced from upstream CodexBar source; authenticated installed-browser acquisition remains live acceptance pending.


DOCS-163: The user authorized rebuilding all standalone manuals on 2026-10-21 after reporting v1.63.0 stable. Build only the hosted Markdown copies (including MAC_UPDATER.md) and update their canonical sources/current instructions. Keep all app/runtime assets, manifest, extension/helper/updater ZIPs and update feed byte-identical, with no app version bump. Current user guides must distinguish personalized vs generic helper installation, fixed-folder updates, Claude rendering-independent acquisition, other readers’ limits and user-reported vs exhaustive acceptance. Do not turn historical release instructions into current procedures.
