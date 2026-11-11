Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md

# Current review context — candidate1.100.0 (2026-11-05)

This document contains dated historical audits, not a claim that every provider/plan or first-public-release gate is accepted.1.96 passed independent review and685 tests before in-place installation/private Site deployment.1.97 changes the Grok header and release documentation/manual-link packaging; permissions/hosts and acquisition behavior are otherwise unchanged. Current automated test result is recorded with the candidate artifact. Public audience, GitHub source synchronization, store publication, distribution terms and unresolved provider/Bus/support features remain explicit gates in docs/RELEASE_READINESS.md. No new external endpoint or automatic upload is added.

日本語：以下の旧版の検証記録は当時の証跡です。現行候補の全社・全プラン受入を意味しません。初版公開前の確認は別表で管理し、版の違う検証を完了根拠として混ぜません。

## v1.86.0 — local reports and team collaboration
No new manifest permissions/origins or paid provider calls. Explicit CSV exports stay local, formula-like text is neutralized, and account histories are projected before reporting. Team schema remains strict/offline. Public GitHub docs contain no real usage histories/credentials. Signed credit amounts are retained separately from cap/spend; budget metadata is bounded and arithmetic-validated before DOM snapshot adoption. Existing scoped API/unscoped DOM protection remains a live acceptance limitation.

## v1.85.0 — semantic row alignment
Empty alignment slot contains no quota/interactive content; additional actual quotas are grouped rather than clipped or fabricated.576 automated tests and synthetic layout checks, no new permissions. Existing185 live-account acceptance is separate.

## v1.84.0 — weekly-first presentation
Horizontal bars are sorted only in render projections, with original-index bindings for color/percentage warnings. Canonical snapshots/history remain unchanged. No permission or acquisition boundary changes beyond the documented183 topology fix.575 full tests pass; actual installed-browser acceptance remains separate.

## v1.83.0 — quota topology
No new permissions/origins/receivers/paid APIs. Only complete official Claude API topology retires absent cross-source windows; existing scope and zero guards retained. Single-window labels are escaped, values never fabricated. Monthly extra-usage raw units stay unknown, purchased/API balances separate. Gemini embedded-payments design is not enabled.

## v1.82.0 candidate scope — 2026-11-01
Muse login probe reads only boolean authentication UI evidence in an exact, owned, inactive root page and never inputs. Promo expiry is validated official evidence; no date/unit inference. Gemini bounded deep/shadow DOM and relevant-loading changes retain origin/grant/topframe/ambiguity checks; typed182 upgrade prevents obsolete reader acceptance. Tibo exactpost SSR requires author, canonical, UTC timestamp and visible-body agreement; metadata-only/quote/otherauthor/hidden/duplicates reject. Latest relevant/fair-author tab selection stays capped3, with no navigation/reload/private page reads/new permissions. No external AI, paid X API or new server deployment. Continuous unseen X discovery remains unconfigured. Automated and live acceptance are recorded separately in RELEASE_READINESS.md.

## v1.81.0 review scope — 2026-10-31
554 automated tests pass. UI changes preserve quotas/history/capture times, grants, collection and audio. Text hints use bounded plain text, delegated listeners and removal cleanup; feed moves only via a dedicated handle/arrow/Home with no automatic windows or reloads. Cloud explanations retain separate balance and expiry semantics.
The optional team MVP has no network request, token, server, workflow or bus write. It imports only a strict32KiB schema into a separate browser-local key, rejects unknown fields/IDs/enums/duplicate IDs/invalid dates, and marks stale/future/missing reports unknown. The offline CLI verifies exact repository origin, pins one commit, bounds each fixed status blob to16KiB and outputs only safe fields, never body/envelope/subject/credentials; output is0600/no-clobber. A local read-only real-repo export was schema-validated; real generated data was not deployed or used in screenshots. Browser preview uses synthetic data only. It is capacity self-report, not runtime evidence; automatic authenticated sync remains unimplemented.
Synthetic browser evidence: hover-delay harness observed509ms; dedicated-handle arrows move/detach and Home restores dock; cloud-native explanation and local team import/display/JA/EN/clear work. File chooser required user confirmation and delayed verification; approval controls were not bypassed. Native pointer-drag/all-browser/long-term acceptance and prior Gemini API live acquisition remain incomplete.

## v1.80.0 review scope — 2026-10-30
547 automated tests pass. Gemini exact same-line credit label+currency parsing and versioned reader refresh use existing grants and existing tabs; no navigation or reload of user billing pages. Rejected amount ambiguity/budget/spend cases remain covered.
ChatGPT entitlement refresh reloads only an existing complete inactive strictly owned exact usage tab in the monitor window, with immediate revalidation and a one-minute throttle. Adopted/active/moved/loading/redirected tabs are protected. Routine known-expiry checks create no new tab and never redeem reset credits. Explicit API zero is protected from stale DOM positives for125 seconds using the actual observation time; failures and missing values are not zero.
Layout/shadow-panel changes add no permissions, sensitive telemetry, external AI, credentials or payment actions. Synthetic real-CSS before/after checks confirm343px containment, bilingual notes and centered100%. Authenticated installed Gemini/reset acceptance is recorded separately after deployment; no claim of exhaustive browser acceptance.

## v1.78.0 review scope — 2026-10-30
533 automated tests pass, including negative retry ownership/permission/adoption cases and JA/EN rendering of stale values. Long-term authenticated Muse timeout behavior remains live acceptance; no provider account setting was changed for tests.
Muse timeout retries preserve exact URL, opt-in, host permission, inactive ownership, monitor-window and 90-second generation checks. Backoff survives worker restarts in existing session storage. No new tabs/windows or focus for timed retries. Prior quotas/history/capture times are unchanged on failure. Existing user adoption/closure pauses remain. Retry UI exposes only a bounded time and fixed reason. Tibo a/s/t routing still rejects unknown/duplicate query keys, foreign routes/authors/credentials. Japanese usage terms produce info/usage with no reset timestamp, never individual recovery. No new host permissions, X API, external inference or server deployment.

## v1.77.0 review scope — 2026-10-29
528 automated tests pass. Synthetic browser checks verify unique accessible explanation targets, JA/EN content, 340px containment, Enter/Escape, and aligned weekly histories in normal/fullscreen. No real account or user Chrome settings were used.
UI-only expiry explanations and single-history sizing; no new host permissions, messaging, storage, provider requests, training-setting collection or external inference. Explanations are localized fixed text escaped before HTML, with generated numeric IDs and native popovers. Existing quota/history/audio/account protections remain. Signed-in provider auto-detection is not implemented by this release.

# Security review — v1.76.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

This review includes the v1.72.0 whole-code audit and historical release evidence. Superseded version-specific controls below are historical, not current operating instructions. It is not a guarantee that no vulnerabilities exist. A release owner should also test the packaged extension in current Chrome and Edge with real accounts and submit it to store review.

## v1.72.0 whole-code audit — 2026-10-24

Reviewed the extension message/permission boundaries, quota and billing acquisition, local task notes, native helper, Mac updater, static distribution and optional intelligence Worker. Three independent review tracks and integration review found seven reproducible defects. The following fixes are included in this release; no additional browser permissions, paid inference calls, new server deployment or credential export were introduced.

| Priority | Reproduced problem | Fix and regression evidence |
|---|---|---|
| P1 | Separate task windows could overwrite unrelated notes because both read the same localStorage array before writing. | Every production save/remove/reorder/import takes the same origin-wide Web Lock and validates the revision inside it. Interleaved writers preserve both notes; conflicting revisions/imports fail atomically. |
| P2 | Cleanup could delete an inactive acquisition tab after the user moved it to another window or its ownership changed. | Cleanup/reuse require the recorded window, opener and extension mute marker. Moving, activating or adopting a tab relinquishes it; tests cover changed window/opener/mute ownership. No browser window is deleted. |
| P2 | Claude organization changes could compare against another organization's quota and mix histories. | The API organization becomes an opaque SHA-256 scope. New Claude histories and baselines are partitioned by scope; initial identification/switches cannot trigger a numeric-change/recovery sound. Unscoped DOM observations cannot overwrite an identified organization. |
| P2 | A core refresh timeout did not stop later network requests in its asynchronous chain. | One in-flight refresh per provider and AbortController propagation through requests and body reads. A timed-out ChatGPT page cannot start the next usage request. |
| P2 | Repeated task-list rendering retained detached favorite controls in a Set. | Refresh only connected DOM controls. A real-GC/WeakRef regression checks collection after repeated redraws. |
| P2 | Public Worker reads could multiply paid upstream X requests during a stale-cache burst. | Public GET is read-only. Only scheduled events refresh upstream data; twenty parallel mocked GETs start zero upstream requests or writes. This Worker remains unconfigured, not production-deployed. |
| P3 | Refreshing the feed cache could retain old articles indefinitely. | Read/merge/commit enforce seven days from original publishedAt, or original detectedAt when publication time is absent. Reject unknown/future dates; test the inclusive retention boundary. |

Verification: the complete automated suite passes **518 tests**, including the native-helper and updater Python suites. Synthetic regressions reproduce the reported races and failures without private chats, production account switching, paid X calls or actual audio playback. Changed source/manifest/package alignment and package inventory are release checks; installed Chrome/Edge acceptance is separate.

Compatibility and remaining limits:

- Reload already-open task-detail windows after updating so all writers participate in the Web Lock. If Web Locks are unavailable, reading/export remain available and writes fail rather than silently losing notes. The synchronous store API remains for compatibility/testing, not production writes.
- Existing Claude legacy history is retained without deletion or automatic assignment to an organization. The current organization view uses newly scoped history; a legacy-history browser is not added. Only Claude has this new quota-history partition. ChatGPT, Gemini, Grok and Muse account isolation is not established by this release.
- The official Claude DOM has no proven organization identity. It therefore cannot confirm an API zero for a known scope. Keep the previous verified positive quota or show unavailable, retain the original observation time, and do not record/sound an unverified zero. An unusable automatic DOM probe is skipped. This deliberately leaves genuine-zero confirmation unavailable until same-organization evidence can be obtained safely.
- Authenticated account switches, tab movement/permission-revocation races in installed browsers, native OS integration and Muse paid-plan layouts remain live acceptance items. An automated pass does not prove every provider layout or browser behavior.
- The Mac updater's fixed GitHub main feed was independently read as **1.64.0** during this audit, while the Site used a separate release route. Publishing this Site does not update that GitHub feed. GitHub release synchronization is unresolved; do not claim the updater can fetch this Site-only release. Its SHA-256 validates integrity, not an independent publisher signature.
- Native helper **1.30.2** and Mac updater **1.0.1** are unchanged. No arbitrary code execution or credential exfiltration was reproduced in the inspected paths; this is a bounded result, not an assurance of absence.

### 日本語 — v1.72.0

全体レビューで再現した7件を修正しました。メモの同時保存消失、取得タブの誤削除、Claude組織間の残量比較・履歴混在、timeout後の後続通信、タスク再描画のメモリ保持、未稼働Workerの公開GETによる有料API起動、記事期限の延命が対象です。全518件の自動テストに合格。新しい権限・有料API呼出し・サーバー配備はありません。

更新前のタスク別画面は再読込みが必要です。Claude旧履歴は削除せず、新組織へ推測で帰属しません。組織を照合できないDOMでAPIの0％を確定せず、以前の正値を保持するか未取得にする制約があります。他LLMのアカウント分離、実機の権限変更競合、Muse有料プランなどは未確認です。GitHubのMac更新feedが1.64.0のままという別の配信課題も残っています。サイト反映だけでその更新経路まで直ったとは扱いません。


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


## v1.36 — Free Tibo public-page reading

In the monitor, choose **Tibo connections**, allow optional `https://x.com/*` access, then keep a signed-in Tibo profile/post open in Chrome. Only rendered public posts by `@thsottiaux` are inspected once per minute; there is no automatic reload, hidden crawl, paid API, credential extraction or DM/input reading. Undisplayed new posts are not discovered. Missing page/access restrictions show unavailable, preserving prior public alerts; first read is silent and later post IDs notify once. No private usage or notes are sent to X.

ChatGPT main and all shared subviews show **Tibo 𝕏 Reset? (YYYYMMDD HH:MM)** only when an announced future deadline can be parsed. Currently explicit “by EOD PST time” is converted from the posting day's fixed UTC−08:00 end (23:59) to the device timezone. It is an approximate deadline, not an exact execution time. Tooltip shows the announcement/timezone; click opens the exact source post. The mark disappears at the deadline. Short announcements without a deadline still enter the feed, but do not receive a dated mark. Personal quota recovery remains unverified until official usage changes.

The server feed remains unconfigured; this optional browser reader does not deploy or use it. Installed-package permission/notification acceptance is pending.
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

## v1.36 — 無料のTibo公開ページ読取り

メインの［Tibo連携］から任意の `https://x.com/*` アクセスを許可し、Chromeでログイン済みのTiboプロフィールまたは投稿を開いてください。1分ごとに、画面に表示済みの `@thsottiaux` 本人の公開投稿だけを確認します。自動リロード・裏の巡回・有料API・認証取得・DM／入力欄読取りは行いません。未表示の新着は検知できず、ページなし・アクセス制限は取得不能になります。初回は無音、以後の新しい投稿IDを一度だけ通知します。利用残量・メモをXへ送りません。

予定期限を読み取れる場合だけ、ChatGPTのメインと共通サブ画面に **Tibo 𝕏 Reset? (YYYYMMDD HH:MM)** を表示します。現在は明示的な「by EOD PST time」を、投稿日のPST（固定UTC−08:00）の当日末23:59という目安に解釈し、端末の現地時間へ換算します。正確な実施時刻ではありません。ツールチップで内容・タイムゾーンを確認でき、クリックで当該投稿へ移動、期限後は非表示です。日時のない短文告知は速報に表示しますが日時付きマークを出しません。個人の残量回復は公式使用量の変化で別途確認します。

サーバー配信は引き続き未設定です。この任意ブラウザ経路はサーバー配置・有料API利用をしません。更新済み拡張機能の権限・通知の実機確認は未完了です。

## v1.38.0 — 2026-10-13

Claude billing probe uses an owned inactive official billing tab only after existing opt-in permission; it is independent of the quota queue, coalesced, bounded and cleaned up. User-activated/navigated tabs are retained. API balances remain separate from quotas/history. Codex setup prepares an entirely local ZIP with a validated exact extension ID, executable macOS entrypoint and no network upload; native authorization remains exact. Existing enabled connections are checked on opening setup. Tibo public readers run bounded per-tab reads independently, report bounded counts/API availability, and support explicit diagnostics without quota-queue blocking. Advice must not obscure the feed/status content.

本体・拡張機能v1.38.0／ヘルパーv1.30.2をビルドし、取説は正本だけ更新。既存dist/docsを再生成しない。実端末のClaude自動取得と初回専用ZIP導入は利用者確認が必要。Tibo告知の取得は利用者が動作確認し、アドバイスON時の重なりを報告。予定期限は実際の個別残量回復時刻ではない。

Verification for v1.38: 297 regression tests passed before the additional one-click sequence check. Synthetic local layout shows expanded Tibo feed and status above Advice ON. All 10 standalone manual checksums are unchanged. Generic/personalized ZIP integrity and exact-origin installer tests pass; no real user native installation was changed.

## v1.39.0 — Tibo / expanded status layout (2026-10-13)

Measure the complete fixed status dock with ResizeObserver; expanded content flows inside the dock and is bounded/scrollable. Reserve measured height for main content and place the advice ribbon above it independently of ON/OFF. ChatGPT reset entitlement includes a separate Tibo public profile link below the row; a verified future reset announcement uses a warning, dated label, tooltip and exact post link. After expiry restore the plain profile link. Available count stays inside its official usage link. Preserve quotas/history/audio, optional permissions and native helper. Build app/extension only, retain helper/manual bytes.

Verification v1.39: 300 regression tests passed. Local synthetic expanded-status screens with Advice OFF and ON retain readable Tibo feed. ZIP integrity verified; helper ZIPs and 10 standalone manuals unchanged. Live installed-browser upgrade remains user acceptance.

## 2026-10-16 emergency correction — automatic window proliferation

Supersedes the v1.42 minimized-host requirement: acquisition must never call windows.create/update/remove or create about:blank. Use an explicit existing non-incognito normal window ID and active:false; with no normal window, skip acquisition. Keep serialized session ownership and the 12-tab cap. Close only inactive owned tabs still on their acquisition route (or the exact allowed Claude usage redirect). Never close existing windows or user-adopted/navigated tabs. Older minimized-host records must not trigger window replacement. This intentionally allows temporary inactive acquisition tabs in an existing normal window to prevent automatic window creation.

Release validation: 313 full regression tests pass, including 60 repeated/concurrent acquisition attempts with zero window mutations, popup-only skip, old record migration and adopted-tab protection. App/extension v1.43.0 built with unchanged manuals/helper ZIPs. Hosted v1.42 source was reconciled without dropping its changes. Installed-browser upgrade and a sustained real-user no-popup check remain user acceptance gates.

## v1.44.0 — compact information and acquisition (2026-10-16)

Main provider warning and Tibo feed move into the existing fixed-height connection row, rotating every five seconds plus manual next; plain-text tooltip/source and Tibo setup remain available. Remove main-card notice/footer feed only; retain floating warning and independent official incidents. Claude optional billing acquisition starts before quotas finish, coalesces, waits up to 35 seconds with 45-second ownership cleanup, and never creates a window. Gemini plan discovery is bounded to three seconds after valid quota rows, validates utilization as an explicit number within 0..1, and accepts account-qualified official usage routes. On API failure read up to three existing official usage tabs only; no new Gemini page/window. User confirms the official Gemini usage page also lacks values: no individual quota recovery is claimed. Unavailable task count is unknown, not zero. No new permissions, paid API, helper or standalone manual regeneration.

Gemini field evidence 2026-10-16: user reported Google /sorry reCAPTCHA at official usage URL, then confirmed values returned after their own manual verification. Do not automate or bypass CAPTCHA. Detect explicit Google /sorry, 429 and bounded unusual-traffic text; abort account exploration on the first challenge. Persist a 15-minute retry-after for challenge or five minutes for other acquisition failure. Explicit trusted Refresh permits one retry; successful fetch clears cooldown. Never store challenge page text, IP, challenge tokens or network identifiers.

Validation v1.44: 321 regression tests passed, including a delayed Claude balance after the former nine-second cutoff, invalid Gemini utilization, CAPTCHA early abort and persisted cooldown/manual retry. Synthetic browser confirmed a single 34px connection row with warnings/Tibo and validated source link. Actual signed-in Claude balance refresh still needs installed-extension acceptance. Gemini challenge recovery was confirmed by the user manually, not by an automated CAPTCHA action.


## v1.45.0 — Setup / 追加連携

Single own top-level setup.html groups required sign-in guidance, optional API/Codex/Tibo and up-to-three service selection. Additional Grok/DeepSeek/Perplexity/Genspark account readers are experimental, disabled by default, exact-route/top-frame validated and separately permissioned. Never read chats, auto-navigate/reload, use paid APIs or convert credit balances to quota percentages. Preserve native exact-ID installation and existing no-window acquisition safeguards. Task helper action opens personalized installation/check, not a generic ZIP. Existing helper and standalone manual files remain unchanged. Live additional-provider layouts and installed automatic Claude billing remain acceptance limits.

日本語：セットアップ画面に任意設定を集約。追加4社は公式残高・契約画面の試験読取りで初期無効、実アカウントの形式は未検証。最大3サービスを選択。Codexは同画面からID入力不要のZIP保存・接続確認。ヘルパーと既存取説配布物は再生成しません。

Additional v1.45 regression hardening: Claude completion now requires a validated snapshot from the exact owned probe tab; a concurrent response from an existing billing tab cannot satisfy it. Cleanup drops quiet-tab ownership even when the user adopts/navigates the tab, without deleting that content. Additional-service readers check enabled/permission/route before reading DOM, through a boolean-only independent RPC; revoked/disabled readers do not inspect page text. No response is put behind the global acquisition queue.

Validation v1.45: 334 regression tests passed. Synthetic browser verification confirms three-card mixed core/additional rendering, existing 29% red gauge, Japanese/English controls, three-service selection rejection and successful replacement, unique setup IDs, hidden recovery controls and no horizontal overflow at normal and 390px widths. ZIP CRC/source equality and helper/standalone-manual hashes verified. No real installed-extension replacement or additional-provider account login was performed; those remain live acceptance limits.


## v1.46.0 — display mode, sound-on preview and dated author sources (2026-10-17)

USAGE-DISPLAY-001: usageDisplay defaults to remaining; an explicit button immediately after Advice switches to used. Only rendered quota windows, previous percentages and history rows are complemented (100 minus the rounded displayed remainder). Unknown/expired values remain unknown. Credits, reset entitlements, persisted data/history, forecasts and worker sound thresholds remain canonical remaining values. Display changes use a separate numeric tracker; switching modes does not create alerts or history. Persist and synchronize the mode across main, floating, PiP, in-page panels and the isolated task overview. Preserve pending user mode over stale GET responses.

SOUND-ON-PREVIEW-001: remove the separate Test button. A direct OFF-to-ON click plays one preview after enable; OFF, startup and background synchronization do not preview. Revision and notifier cancellation prevent a late preview after OFF. Existing numerical-change and incident audio remain independent.

POST-DETAILS-001: show publication time and direct source link, separate observed/read time from announced reset deadline, and always offer the Tibo profile link. Public metadata includes up to three dated, bounded same-author replies only when the verified parent and reply occur in the same rendered public conversation; unrelated author/conversation, quoted content and malformed links are rejected. Replies not seen are explicitly unverified; no full-thread guarantee. The Tibo seven-day reset/date rules remain; explicit Codex/ChatGPT usage-improvement posts can be usage information without inventing a reset. ClaudeDevs reading is independently disabled by default and must be explicitly enabled in own top-level setup with the existing optional X/scripting permission. It uses the same rendered-only boundary and a 45-day news window, with no automatic page opening, reload, paid API, credentials, DMs or inputs. First observation of each newly enabled author is silent; later matching posts notify once. Existing generic public-feed and static Claude/Google/OpenAI news carry dates/source links; static material never claims that author replies have been checked.

HEADER-PRIVACY-001: header order is Product, Setup, browser-local disclosure. The disclosure supports native keyboard/click details and hover title explaining browser/profile/site storage, no automatic operator upload/cross-device sync, removal risk and explicit note export. No sharing/audience changes.

日本語：残量／使用量ボタンをアドバイスの右に置き、表示だけ反転。履歴保存・通知判定は残量基準で保持。試聴ボタンを廃止し通知音OFF→ONで一度だけ確認音。投稿日時・確認日時・予定期限を区別し、本人の表示済み補足に日時とリンクを追加。Tiboプロフィールリンクは常設。ClaudeDevsは独立した任意設定、表示済み投稿と同一著者の返信だけを読み取り、未表示の返信は未確認。セットアップは製品紹介の右へ移動し、ブラウザ内保存の説明をクリック／キーボード／hoverで提供。配布済み取説・ヘルパーの再生成なし。

Validation v1.46: 344 regression tests passed. Synthetic browser verification confirms 8% remaining → 92% used, weekly 25% → 75%, unchanged $20 credit, reload persistence, Japanese/English control placement, Product/Setup header order and keyboard/click storage disclosure. Public rendered Tibo conversation 2111244596131111253 (2026-10-16T23:55:11Z) and own replies 2111244957851984181 / 2111245052513259606 were inspected; this usage-efficiency announcement is not treated as a reset. Unseen replies and live installed-extension replacement remain unverified.

Validation v1.47: all 347 regression tests pass. Synthetic browser checks confirm same-row local disclosure/language controls at narrow width with no horizontal overflow, a bold single-line weekly reset at fitted 14.5px, pointer movement from bottom to upper viewport, arrow-key movement and Home reset, abbreviated waiting state, no pending session note and no console errors. Existing helper and standalone guide bytes are unchanged. Installed-extension upgrade and real-account collection were not performed.

Validation v1.48: 351 tests passed. Synthetic browser checks show current 40% and weekly 25%, both amber with sufficient depletion history; used mode shows 60% and 75% without altering risk decisions. Weekly bars measure 8px versus primary 4px. Unknown weekly values remain —. Japanese/English and desktop/390px layouts have no horizontal overflow or console errors. Includes idle-time and reset-cycle forecast regression tests. Existing helper/manual hashes preserved; real installed-extension acceptance remains unverified.

Validation v1.49: 353 full regression tests pass, plus six targeted gauge/forecast tests after CSS refinement. Synthetic browser checks confirm outer weekly r51/stroke7 and inner current r42/stroke3.5; labeled 5-hour100% / weekly4% invert to 0% /96% in used mode. Each reset is grouped immediately under its quota, urgent icon stays inline, background alpha is .62. Japanese/English and 1280/390px layouts show no horizontal overflow or console errors. ZIP/source equality and unchanged helper/manual hashes verified. Live installed-extension update remains unverified.

## v1.50.0 — dashboard redesign
DASHBOARD-150 supersedes prior gauge typography, warning colors and fullscreen fixed-height layout. Ring center has six ordered rows: caption, current-session label, current %, parenthesized countdown, weekly %, parenthesized countdown. Outer weekly ring remains thick but becomes a pale same-hue tint of the inner session ring. Dates live only beside left-aligned horizontal quota bars, matching task overview hierarchy. Low remaining (<=15%) or qualified depletion forecast blinks percentage only; no warning hue change. Reduced-motion uses a static dotted emphasis. Data, history and sound decision contracts are untouched.
Connection/feed messages, optional advice, incidents and collapsed diagnostics share a bottom dock; independently expanded incident/advice state and explicit drag controls persist. Fullscreen uses responsive document flow and scrolling instead of clipped fixed rows; at narrow/zoomed widths all selected cards remain reachable without overlap. This explicitly supersedes the earlier no-scroll narrow fullscreen layout.
Main setup explains ZIP extraction, browser extensions page, Developer mode, Load unpacked, pairing and official sign-in. Service selection/floating controls and optional-provider explanations are inline. Only permission-sensitive grants/native installation continue through the unchanged exact own-extension setup boundary; no Web origin gains configure privileges. Existing standalone helper/manual packages are not regenerated.

Validation v1.50: 355 regression tests passed. Synthetic browser checks confirm the six-row text order, independent 100%/4% quotas, no dates inside the circles, percent-only low-capacity animation, pale same-hue outer ring, and a unified bottom dock. Main setup expands inline; API details remain open across language changes and refreshes. Desktop 1280px and narrow/zoom-equivalent 576px/318px layouts have no horizontal overflow. Fullscreen control was exercised and its layout observed; after correcting viewport-based typography, a 240px circle uses 43.2px primary and 20.4px weekly type with content fitting the center. Browser connection became intermittent during final screenshot saving; no final image-capture success or installed-extension/real-account acceptance is claimed. ZIP CRC/source equality and 13 unchanged helper/manual hashes verified.

## v1.58.0 — user-launched Mac updater
UPDATER-158: keep updater separate from the metadata-only Codex host. User chooses and confirms the currently loaded extension folder once; never inspect Chrome profiles or change native host registrations. Use only fixed public GitHub HTTPS feed/package paths, validated versions, bounded downloads and SHA256. SHA256 is corruption detection, not an independent signature. Stage and validate before same-path replacement, preserve backup, roll back a failed swap; explicit restore retains displaced version. Reject traversal, symlinks, duplicates, oversized/wrong-product packages, changed key and downgrade. Required permission expansion needs confirmation. Keep single-process locking. Tool is unsigned/not notarized, macOS11+/Python3.9+; actual Gatekeeper/browser round-trip remains manual verification.
RELOAD-158: only a newer local updater marker plus matching on-disk manifest may trigger reload after quota refresh and settings queues complete. No new permissions or Web restart routes. First update from v1.57 or earlier requires one manual reload. Keep existing explicit restart guard unchanged.

INSTALL-FOLDER-159: Fixed-folder initial-install ZIP changes packaging only. Existing updater target validation, same-path replacement, rollback, permission checks and no-profile-access restrictions remain. No automatic migration or native registration changes.

TABS-160: recovery requires matching opener monitor, current extension mute attribution, normal window, inactive exact route. User activation/navigation relinquishes marker. No management permission or URL-only ownership. Legacy duplicates and multiple installed extensions require user review. PACE-160 estimated-date fallback is visual only; no history/audio change.

CLAUDE-SLOW-161: no new permission or foreground navigation. Resource retention is scoped to one app-owned exact billing tab; restore auto-discard when user adopts it. A 180-second inactivity watchdog and explicit disable release only verified owned tabs. No all-tab billing sweep, no private page text or payment details persisted. Reference: https://developer.chrome.com/docs/extensions/reference/api/tabs#property-UpdateProperties-autoDiscardable

Acquisition diagnostics contain only enumerated stages, timing and status. They do not change balance capture times or retain account names, URLs, DOM text or amounts in logs. Recovery reloads are restricted to an inactive verified owned tab and throttled; no auto-focus/unfreeze by activation.


CLAUDE-NAV-162: An initial empty/about:blank document with an exact approved billing pendingUrl is navigation in progress, not a login redirect. Wait within the existing 90-second bound without reading the blank document or creating another tab. A foreign or login committed URL is never authorized by pendingUrl. Explicit user retry bypasses only the automatic attempt cooldown; in-flight coalescing, account/permission validation and all tab ownership constraints remain. Keep reader protocol 1.61.0 because its payload is unchanged. Signed-in unattended acquisition remains unverified until the installed package is confirmed.


CLAUDE-DIRECT-163: Claude API credit refresh uses read-only Console session GETs to platform.claude.com/api/organizations and exactly one API-capable organization’s prepaid/credits endpoint, without rendering, creating, activating or reloading tabs. This supersedes automatic Claude billing DOM probes in v158-v162. Use existing optional host access and credentials:include; never extract cookies, import browser credentials, accept API keys or call inference/payment APIs. Multiple API organizations fail closed without probing them. Validate response origin/content-type/body bounds, UUID, currency, minor-unit exponent and grant values; purchased and promotional lanes remain separate, and multiple unexpired grants in a lane stay unavailable rather than being summed or inferred from total. Store only sanitized amounts, opaque scope and bounded stage metadata. One in-flight request coalesces with automatic one-minute cadence, 20-second total timeout and five-minute rate-limit backoff; explicit retry is allowed. Disable/revoke invalidates publication. Auth/ambiguous account clears current values; transient failures preserve original capture times, while a changed identified scope cannot reuse old values. No manual foregrounding is required. Console endpoints are undocumented, referenced from upstream CodexBar source; authenticated installed-browser acquisition remains live acceptance pending.


## v1.64.0 — Signed API balances and unattended OpenAI billing

API-SIGNED-164: The shared currency parser accepts the official `-$1.02` form (and Unicode minus), preserving signed numeric storage/rendering. It does not turn missing amounts into zero, accept budgets/spend, relax ambiguity or alter Claude direct grant validation. Grok’s inline labelled balance uses the same bounded parser.

OPENAI-BILLING-164: Existing optional OpenAI host/scripting access enables one marked inactive official billing tab in the monitor normal window. It is reused, never focused, and only completed owned reads are reloaded at most once per minute. A 90-second attempt waits for two seconds of stable amount/currency/scope after at least five seconds; a hung DOM read remains singular across attempts. Unfinished hydration is not restarted. Closing, redirects or adoption pause automatic recreation until explicit Refresh; moving the tab relinquishes ownership without closing it. A 180-second inactivity watchdog and disable cleanup affect only owned inactive tabs. Missing monitor or permission skips acquisition.

Snapshots retain the existing 1.61 envelope, adding `balanceReaderVersion=1.64.0` for the new OpenAI parser; old OpenAI messages are rejected and injected readers upgraded. Independent validated billing queue and account boundaries remain. A timeout retains the previous observation time, login clears current balance, and sibling pages cannot overwrite a current owned read. Acquisition notes distinguish waiting/ready/paused without claiming a direct OpenAI balance API. Quotas/history/audio and native helper/updater are unchanged.

日本語：公式の `-$1.02` 形式を負値のまま読取り・表示する。OpenAI APIは許可済みの公式請求画面を同じ通常窓の裏タブ1つで再利用し、前面切替・新規ウィンドウ・有料APIは使わない。90秒以内の安定確認、読込中再ロード防止、閉じた／操作したタブの保護、失敗時の取得日時保持を行う。これはDOM方式で、Claudeの直接取得とは異なる。実際のログイン済みChrome／Edgeで、裏タブのまま表示が完了するかは未検証。既存の利用枠・履歴・音・ヘルパーを保持し、本体／拡張のみビルド、取説配布コピーは再生成しない。

Validation v1.64.0 (2026-10-23): 445 CJS/MJS tests passed. Flat ZIP CRC, 149-entry source equality, stable-folder installer and update-feed SHA256 verified. All permission/origin/CSP fields are unchanged. Twenty-one hosted/bundled manuals and helper/updater archives retain SHA256. Tests cover delayed negative balances, unchanged timestamps, pending navigation, one hung read across attempts, source/version/scope guards, close/adoption/move protection, watchdog and permission/disable races. Authenticated installed Chrome/Edge background rendering remains unverified; no user installation or billing operation was performed.

## v1.65 Muse and evidence-bound parsing (2026-10-23)

Optional Muse host/scripting access is granted only through the existing own-extension setup click. The root route, extension ID, top frame and enabled flag are checked before inspection and again before publication. Only a bounded settings Usage card crosses local runtime messaging; stored state contains derived metrics, never the raw card, chat, draft, account credentials or wallet. The reader permits known read-only settings controls only when the worker has revalidated a single owned inactive acquisition tab in the monitor window. There are no windows/focus, chat, payment or credential actions. Stable-read and 90-second preparation bounds preserve previous observation time; ownership/disable checks preserve user-adopted pages.

Muse main-chat registration adds a further optional-access check, keeps the existing single-use two-minute session handoff and revision-protected note store, and does not widen core automatic/import task lists. Main-chat identity is the observed exact root, with a generic title.

Common interpretation rejects budgets, ambiguous directions/cycles, malformed numbers and mismatched candidate evidence. The candidate interface does not connect an external model or execute model-generated selectors/code. No new paid API, API key UI, remote upload, authentication-domain access or CSP relaxation. Signed-in free-plan unattended acquisition was verified 2026-10-24 across multiple cycles; paid layouts and long-term stability remain unverified.

The Muse-only MAIN-world rendering fallback operates only within the fresh owned inactive root-tab budget. It invokes the existing observed React stream flush on a bounded queue of connected matching TEMPLATE/DIV pairs; it does not read their text, eval source, extract credentials, fetch private endpoints, change visibility, focus a tab or affect user-owned pages. A changed renderer fails closed. The opener fallback requires a this-session creation record and exact extension mute marker; default provider checks are unchanged. On adoption the marker is cleared even after opener severance. 475 automated tests, signed-in background acquisition, installed-package equality and capture-time advancement with constant Muse tab count were verified.

## v1.73.0 localization and note UI recovery — 2026-10-25
521 tests pass. Muse stored reset/token evidence remains unchanged; bounded Japanese date/quantity forms are translated only for English rendering. Extra-token links use the existing explicit Muse usage action. Task pages consume same-origin language storage events and preserve task snapshots. Versioned note UI is rebound on extension update only when existing scripting/host access is granted and the exact conversation route is valid; Muse also requires its existing opt-in. No permission request, chat reload, message/draft reading or automatic note saving is added. A live registration failure was reported; stale update contexts are covered by the repair path and synthetic route/permission tests, but the user's exact failure and post-upgrade success are not yet independently reproduced.

## v1.74.0 retained acquisition pages and reset evidence
Normal task/usage/OpenAI billing completion parks only already-owned inactive exact-route tabs. Explicit disconnect releases them; active/moved/navigated pages retain adoption protections. Reused task homes reload under ownership validation to avoid old sidebar/account data. No sessions/history permission is added and existing Chrome recently-closed entries are not deleted. Thirty synthetic repeated park/acquire cycles create one tab and remove zero. Date-only Grok remains a display estimate, shown compactly in JST. Date-only Muse has no invented time/countdown; a single reset-labelled time[datetime] in the approved usage row can provide a bounded explicit ISO time. Reader protocol1.74 upgrades old optional readers. No chat contents/AI replies are used as reset evidence. Full523 automated tests pass. Actual Chrome Cmd+Shift+T history and an authenticated Muse exact reset time element remain acceptance items.

## v1.75.0 display review — 2026-10-26
Display-only changes: used-mode button is neutral; advice hidden state overrides dock layout; fullscreen cards wrap without hiding quota/history data; verified fresh resets within one hour pulse green; brand mark and text share centered alignment. No new permissions, requests, storage keys, acquisition changes, or audio changes. All 525 automated tests pass. Local IAB verified advice disappears on OFF, used-mode is unselected, and fullscreen layout/header render. Narrow-window and signed-in live countdown visual acceptance remain unverified.

## v1.76.0 release
Full rebuild synchronized documentation; extension runtime and permissions remain unchanged apart from version identifiers.


## v1.79.0 bounded display change
Only rendered text/layout changes. Public detail URLs still pass the existing safeUrl gate; all displayed text and attributes are escaped. The public popup stores one bounded row in page memory, independently of private quota/notes. Same-row DOM reuse and stable-container ResizeObservers prevent ticker restart or detached-card retention. No new grants, requests, storage, paid calls or ai-bus runtime access. Design-only dashboard requires separate authentication/audience/retention review before live connection. Native tooltip behavior and real touch/browser acceptance must be reported separately.

## v1.87 delta
No new host/optional permissions. Existing ChatGPT billing tab reader derives only short current subscription/renewal evidence and monthly API benefit amount; no payment rows, credentials, purchases, new tabs or external uploads. API balance acquisition unchanged. Raw Claude values retained separately from display-only observed USD conversion. Automated acceptance does not establish the actual Pro credit posting time.

CLAUDE-RENAME-187: Official Claude help17728952 confirms Max20x is now Ultra (automatic rename). Normalize only this exact legacy plan alias, including cached display, without changing org scope, stored history or quota topology. Keep real five-hour windows when supplied; the plan name alone is not proof of verification/unlimited usage. Source: https://support.claude.com/en/articles/17728952-what-is-the-ultra-plan .

## v1.88 delta
Permissions unchanged. ChatGPT billing quiet tab uses existing monitor-window/muted ownership manager; strict exact URL, bounded hydration, no purchase/link/payment action. User pages read only. dots title/link handoff uses exact observed notes-only URL validation; neither automatic task status nor account/usage payloads widen. Org percentage evidence markers originate from internal fetcher and are dropped by DOM snapshot sanitization. Actual Chrome reading confirmed Pro200 after billing opened, actual API balance posting and official Claude weekly100% used while old monitor retained1%; installed188 acceptance remains separate.

## v1.89.0 scope
No permissions, identities, CSP, origins or external inference changes. Read-only local history filtering does not rewrite stored observations. Extra-usage enabled flag is derived only from explicit official API boolean; do not infer prepaid balance/current billing mode. dots discovery keeps existing note-only boundaries and no independent quota adapter. Synthetic UI data only in local preview; excluded from deployment.

## v1.90 prepaid/Copilot
Copilot display only has no route adapter, collection, host grant or automatic task/note path. Typed Claude prepaid values use the same org-scoped endpoint, integer minor-unit/exponent validation and explicit USD; unknowns fail closed. Diagnostic output was bounded to schema/known balance fields with no credentials, organization identifiers or chat text, and temporary assets removed. Monthly spending limits never substitute for prepaid funds. No permission/CSP/origin/key change.

## v1.92 local candidate
New optional exact Microsoft origins are not required host grants. Copilot root reader only examines observed plan aria metadata; account-card labels are allowlisted, bounded and noneditable. No chat body, Graph credentials, admin consent or account IDs are collected. Multiple personal/work sources are not combined. New Muse answer operation is trusted main/top-frame only; text is bounded and discarded after scalar parsing. New connection dialog has no iframe and cannot request browser permissions on the Web origin. A user-click settings popup retains the trusted permission boundary. Manual signed-in permission/reader acceptance remains pending.

## v1.96.0 local beta delta
No permissions or host grants added. New support and Bus dialogs are local-only; no fetch/runtime RPC/upload/issue creation. Bus closed payload imports are size-limited and deny all quota/execution/spend authority. Additional account collection replaces whole-body scanning with bounded visible label cards and skips input/editable regions. Independent review and signed-in additional-provider acceptance remain separate from automated tests. AI Studio terms were not accepted during read-only investigation.


## Gateway Native MVP — 2026-11-09

Fixed Native host; existing optional nativeMessaging grant only. Mutations accepted only from own top-frame gateway-setup.html; Web may launch the fixed settings page but receives no pairing/session identifiers or account proofs. Initial service selection is empty. Independent Gateway approval is required. Strict bounded replies, request-id/op correlation, 6s timeout, per-call port close. No provider requests or new polling; one coalesced latest update. Local disable interrupts pending calls and queued operations, persists OFF, ignores late replies and respects shared Codex permission.

Current-quota body excludes account keys, balances, history and text; original observedAt is retained. Claude subscription scope SHA256 is a separate local continuity proof, not API billing identity. ChatGPT/Gemini account matching remains unsupported. All quota values are advisory with execution/spending false. Synthetic cross-process interoperability passed; native installer, key provider, independent approval UI and real browser acceptance are reviewed separately before activation. Same-OS-user compromise is outside an account-verification guarantee.
