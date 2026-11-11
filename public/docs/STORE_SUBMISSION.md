Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/STORE_SUBMISSION.md

# Browser-store submission — candidate v1.100.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

## English

Prepared5 November2026. Building `dist/LLMs-Monitor-v1.100.0.zip` does not submit it to Chrome Web Store or Microsoft Edge Add-ons. Store approval and developer-mode-free installation have not been verified. The current hosted beta remains access-restricted; it is not yet an acceptable proof of a public privacy/support page.

### Owner decisions and submission assets

1. Confirm intended audience, distribution/license terms, developer account ownership and required store account verification. Do not create accounts, accept terms or pay fees implicitly.
2. Complete independent review and the [release checklist](https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md). Record exact tested package SHA and release commit, supported browsers/OS and known limitations.
3. Make approved product/privacy/support/manual/download URLs reachable to intended users and reviewers; verify in a separate signed-out session. Do not silently change the current Site audience.
4. Prepare Japanese/English descriptions,128px icon and synthetic/redacted screenshots. Show actual implemented features; do not imply all service plans, Gemini API embedded balances, automatic Muse/Bus or automatic support uploads are complete.
5. Submit the approved flat ZIP (not the fixed-folder first-install ZIP or optional helper). Complete each store's current requirements and review process. Only replace download guidance with store links after approval.
6. Synchronize public GitHub source/docs/downloads deliberately; the public main was v1.64.0 when checked3 November2026. Building locally does not update it.

### Permission purpose

| Permission / host group | Purpose and boundary |
| --- | --- |
| storage | Local normalized snapshots/history/settings and bounded optional data; no operator telemetry |
| alarms | Approximately one-minute usage, status and public-post checks; provider/browser delays possible |
| offscreen | Local audio; not a hidden collection or inference tool |
| notifications | Supported public incident/update notifications; not personal reset proof |
| chatgpt.com, claude.ai, gemini.google.com | Supported signed-in plan/usage metadata and scoped task/work-note metadata; no prompt submission or automatic purchase |
| one.google.com | Current Google AI membership metadata when available |
| Official status hosts | Public incident summaries without private usage payloads |
| Companion origins | Existing custom origin and retained Site origin only; no wildcard subdomains/localhost external pairing |
| Optional scripting + API/additional official hosts | Explicit user grant for supported account/billing/usage fields. Includes OpenAI/Claude Platform, AI Studio, Grok, Muse, DeepSeek, Perplexity, Genspark and supported Microsoft account/work hosts; inspect manifest for exact list |
| Optional x.com | Displayed public author posts/replies only; no DM/draft reader or automatic crawl/reload |
| Optional nativeMessaging | Explicitly enabled Codex metadata helper; separate installation/ID registration, no generic command-execution bridge |

No Google payments host was added in v1.96.0; the unresolved iframe reader is not covered by AI Studio host access alone. A future grant is a separate review and user action. Manifest identity, optional permissions and exact hosts must match the submitted package, not a description of a planned release.

### Reviewer acceptance flow

1. Start in a test profile with synthetic/redacted evidence where possible; log in to each claimed supported service separately.
2. Load the candidate, open the monitor, pair only an approved companion origin and compare displayed values with the same official account. Unknown/login/ambiguous fields must not become0 or unlimited.
3. Check approximately60-second refresh, missing/stale/reset-boundary behavior and independent provider/account lanes. Check supported plan topology, including an absent session window, without inventing a limit.
4. Test optional grant/revoke, signed-out state, adopted/closed acquisition tabs and no repeated windows. Never exercise a purchased reset, upgrade or top-up as part of a read-only test.
5. Test main/small/fullscreen layouts, weekly-first history, theme, keyboard/touch dialogs, reduced motion, integer quota sounds and OFF cancellation. API balances/monthly caps must not become quota recovery.
6. Test work-note registration/save/export/import after update; no draft/body collection or false completion inference. Test optional helper separately only if installed and enabled.
7. Export a synthetic usage CSV; verify direction/units, missing intervals and formula-safe text. Reports are not invoice/token totals.
8. Open Support: fixed fields default unchecked, preview/download stays local. Import only synthetic Bus data: malformed, duplicate, stale/future data rejected or unavailable/reference-only; no spending/execution authority.
9. Verify same-folder update/rollback preserves browser data and ID; record exact runtime version. Test a separate fresh installation too.
10. Complete [SPECIFICATION.md](https://github.com/ntus/LLMs-Monitor/blob/main/SPECIFICATION.md) manual acceptance and [SECURITY_REVIEW.md](https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md) limits. Do not call automated tests exhaustive live-account acceptance.

Build only required artifacts: `python3 build.py --package --skip-manuals`, then selected `--manuals-only` guides. Unchanged native helper/updater artifacts are preserved. A documentation or Site build does not grant permission to submit, merge or publish.

---

<a id="ja"></a>

## 日本語

2026年11月5日・提出候補v1.100.0。ZIPの作成だけではChrome Web Store／Edge Add-onsへ提出・公開されません。現在のサイトは制限付きで、一般公開のプライバシー／サポートページの確認は未完了です。

### 提出までの手順

1. 公開範囲、利用許諾・配布条件、所有者の開発者アカウントを確認。規約同意・費用は別途所有者が判断します。
2. [初版公開前確認](https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md)と独立レビューを完了し、SHA・commit・実機のブラウザー／OS・既知の制約を記録します。
3. 商品・プライバシー・サポート・取説・配布URLを意図した利用者と審査担当者が開けるか、ログアウトした別セッションで確認。現在の公開範囲は勝手に変更しません。
4. 日英説明、128pxアイコン、公開用デモ／伏字済み画像を用意。試験対応や未実装を提供済みとして告知しません。
5. 承認された平坦な `LLMs-Monitor-v1.100.0.zip` を提出します。初回用固定フォルダーZIP・Codexヘルパーは別物です。各ストアの現行要件に従い、承認後にだけストアURLを案内します。
6. GitHubの正本・取説・配布物もレビューして同期。11月3日に確認した公開mainはv1.64.0で、ローカルビルドだけでは更新されません。

### 権限と受入の要点

必須権限はstorage／alarms／offscreen／notificationsとmanifest記載の公式サイト・既存コンパニオンです。API請求、追加サービス、X、Codex端末内連携は任意の許可・設定が必要です。新しいGoogle決済ドメインのアクセスは現行版にありません。詳細は上の権限表と提出ZIPのmanifestを照合してください。

同一の公式アカウントと実表示を比較し、未取得・ログイン・古い値・複数候補を0や無制限として扱わないことを確認します。購入・契約変更・リセット権行使はテストしません。Main／小窓／全画面、日英、テーマ、キーボード、低モーション、音OFF、履歴・CSV、メモ保全、権限撤回、同じフォルダーへの更新・復元を確認します。

サポートは端末内下書き、Busは自己申告の参考JSONで、送信・課金・自動実行をしないことも確認します。自動テストの成功と全サービス・全プランでの実機受入は別です。[詳細仕様](https://github.com/ntus/LLMs-Monitor/blob/main/SPECIFICATION.md)と[検証記録](https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md)を審査資料と照合します。

変更したアプリ／取説だけをビルドし、変更のないヘルパー・更新アプリを再発行しません。提出・GitHub公開・サイト公開範囲の変更は、それぞれ承認された工程として行います。

Local fix candidate: 1.101.0; browser acceptance and store submission pending.


## 1.106.0
Fix current Grok dashboard reading, responsive targeted reconnect feedback, direct provider setup links, and explicit Muse acquisition recovery.

## 1.107.0
No permission additions. Standard Tibo profile polling reuses an owned inactive tab only after existing optional X access is granted; 15-minute refresh throttle. Muse previous values are explicitly historical. Memory profiling and real X new-post detection remain manual verification limits.


## v1.108.0 — 2026-11-07
Codex/Tibo/Claude-public setup actions display immediate action-local busy feedback and results. Slow responses are explicitly waiting rather than falsely failed; original permission gestures, settings and acquisition logic are preserved. Copilot distinguishes no connection, stale observation and no verified supported fields, with reconnect action available for empty observations. Signed-in Copilot field collection remains unverified because the user's Chrome is not available through the current browser connection. No permissions added.


## v1.109.0 — 2026-11-07
Bound ChatGPT billing reader ping (1.5s) and injection (3s) so a stalled existing billing tab cannot block later healthy billing tabs and verified Pro 100/200/500 metadata. No inferred Pro tier, no permission changes. Correct Web footer release metadata. Regression covers a hung first tab and healthy second reader. Live browser previously confirmed ChatGPT Pro 200 and work Copilot M365 Copilot (Basic); sustained Pro metadata refresh with this fix remains to verify.

## v1.110.0 — 2026-11-08
Local on-demand graph report tab; no permission/collector change. Chart limits do not change stored histories or CSV completeness. No external chart library or analytics.

## v1.111.0 — 2026-11-08

- Added an explicit current-quota JSON preview/save prototype in Usage report, limited to source-checked ChatGPT/Claude/Gemini subscription observations. No automatic transfer, credentials or execution permission.
- Added customer-facing explanation of partial/unverified observations and a synthetic integration fixture.


## v1.119.0 — 2026-11-09
Grok: reject a previous weekly reset cycle before accepting quota/history/audio or capture timestamps after a manual dashboard loses focus. Calendar labels are used only for ordering, never as an official reset clock. Same-cycle corrections and existing permission/ownership guards remain. Live-account acceptance is recorded separately.
