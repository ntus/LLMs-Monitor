# Store submission checklist — v1.44.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

`dist/LLMs-Monitor-v1.44.0.zip` is the Chrome Web Store and Microsoft Edge Add-ons submission package. Its manifest and complete runtime UI are localized as “LLMs モニター” in Japanese and “LLMs Monitor” in English.

Developer-mode-free installation requires the owner to complete both stores' account, review, and publication process. Building or hosting the ZIP does not publish an installable store extension.

## Required owner actions

1. Register the owner developer accounts and enable two-step verification where required.
2. Upload `LLMs-Monitor-v1.44.0.zip`, the 128px icon, screenshots, Japanese and English descriptions, and reviewer test instructions.
3. Use the deployed privacy policy at `https://llmsmonitor.ntus.info/privacy.html` and verify that it is reachable without sign-in.
4. Submit for manual review in each store. After approval, replace the website package-only guidance with the approved store URLs.

## Permission declarations

- `storage`: keeps normalized usage snapshots, changed-value history, the selected Claude organization ID, and display preferences locally.
- `alarms`: starts the approximately 60-second usage refresh, one-minute public service-status checks, and one-minute cached intelligence-feed checks.
- `offscreen`: plays local tones for changed usage values and official service incidents; it is not used for hidden network access or tracking.
- `notifications`: shows a browser alert for a newly reported provider incident or a newly detected usage/reset intelligence item.
- `https://chatgpt.com/*`: reads the signed-in account's official usage, plan, reset entitlement, and related credit fields. The first-party access token is held only in memory for the usage request and is never stored, logged, displayed, or shared.
- When an available reset has no expiry in the API, the extension checks an existing ChatGPT usage tab for its reader. A missing reader triggers one reload; if no usage tab exists, a temporary inactive official tab closes after the deadline is read or after 45 seconds. Existing `chatgpt.com` host access covers this; the package does not request broad `tabs` access.
- `https://claude.ai/*`: reads the active signed-in organization's official usage, plan, cloud-session credit, project-setup credit, and prepaid/extra credit fields.
- `https://gemini.google.com/*`: reads the currently signed-in Google account's official usage and Google AI plan fields, including account-prefixed `/u/N` pages.
- `https://one.google.com/*`: reads the currently signed-in Google account's current Google AI membership name when Gemini does not expose it directly.
- `https://llmsmonitor.ntus.info/*`: reads only the bounded, normalized public intelligence feed from `/api/intelligence`; no X credential or private usage value is sent.
- Official status hosts (`status.openai.com`, `status.claude.com`, `www.google.com/appsstatus/dashboard`): fetch public incident summaries without credentials or user usage data.
- `externally_connectable`: limited to `https://llmsmonitor.ntus.info/*` and the previous `https://llmsmonitor.ntusnog.chatgpt.site/*` for compatibility. Localhost and wildcard subdomains are excluded.

- Optional `scripting` plus a separately requested official billing host (`platform.openai.com`, `platform.claude.com` or `aistudio.google.com`): reads only labelled API credit balance fields on billing routes after the user clicks Connect on the extension's API setup page. No broad `tabs` permission is added. No API keys, payment fields or full page text are transmitted or stored. Disconnect revokes that host.

## Independent task metadata

Task details reads only rendered official sidebar titles and conversation links, not message bodies or drafts. Acquisition is independent of quota queues and storage, uses inactive temporary home tabs and closes them, and returns partial lists only to the approved task page. Required permissions are unchanged. Manually verify all three live adapters, cleanup on failure, pause/clear/import and preservation of usage history before submission.

## Reviewer test flow

1. Sign in to one or more of ChatGPT, Claude, and Gemini in the same browser profile.
2. Install the submitted package and open the extension action. Confirm that no password or API-key form appears.
3. Close the provider tabs and use “Refresh now”. Confirm that supported usage remains available from the signed-in sessions and signed-out providers show a login action.
4. Confirm 60-second refresh, saved-value fallback, plan labels, reset times, credit extras, changed-value history, and the three-tone notification.
5. Compare dark and standard themes and opacity 15/55/100% in the embedded panel and floating views.
6. Confirm that startup does not open a popup, the popup button opens one freely resizable normal popup, and “Always on top” opens Document Picture-in-Picture after a user click.
7. Verify GET and settings on both the custom domain and previous Site URL after entering the same valid 32-character extension ID. Reject unrelated origins; preserve history during an in-place update.

8. Use API connections to enable one billing provider; approve the optional host access, keep its signed-in billing page open, and verify the balance in both main and floating cards. Test missing/zero/postpaid and revoke access. Claude/Gemini live balance parsing is not yet verified.

Before uploading, run `node --test tests/*.test.cjs tests/*.test.mjs`, `python3 build.py --package --codex-helper`, inspect the ZIP contents, and perform the manual acceptance checklist in `SPECIFICATION.md`.

---


Task-state acceptance: update in place, save drafts before manually refreshing existing official chat tabs, then verify generating→response-idle, closed-tab unknown, conflicting tabs, Auto OFF, Clear/Demo/import races, and quota/history independence. The browser adapter cannot establish closed-chat completion. Optional Codex nativeMessaging was added in v1.30.0, enabled only by a setup-page click plus per-user helper installation. Independent metadata cannot establish desktop runtime state.

<a id="ja"></a>

# 日本語 — ストア提出チェックリスト v1.44.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

提出物は `dist/LLMs-Monitor-v1.44.0.zip` です。拡張機能名と画面は日本語「LLMs モニター」、英語「LLMs MONITOR」に対応します。デベロッパーモード不要の導入には、所有者がChrome Web StoreとMicrosoft Edge Add-onsでアカウント、審査、公開を完了する必要があります。ZIPの作成やWeb配布だけではストア公開になりません。

## 所有者が行う提出作業

1. 両ストアの開発者アカウントを登録し、必要な本人確認と二段階認証を完了する。
2. ZIP、128pxアイコン、スクリーンショット、日英の説明、審査担当者向けテスト手順を提出する。
3. `https://llmsmonitor.ntus.info/privacy.html` にサインインなしでアクセスできるか確認する。
4. 審査へ提出し、承認後にサイトのストア案内を正式な掲載URLへ置き換える。

## 権限の説明

- `storage`: 正規化した使用量、変化履歴、選択したClaude組織ID、表示設定を端末内に保存する。
- `alarms`: 残量、公開障害情報、cache済みAI速報をそれぞれ約1分ごとに更新する。
- `offscreen`: 数値変化時の音と公式障害情報の警告音をローカルで鳴らす。
- `notifications`: 新たな障害情報または利用枠・リセット速報を検知したときにブラウザー通知を表示する。
- ChatGPT、Claude、Gemini、Google Oneの公式host権限: ログイン済みアカウントの使用量、契約プラン、リセット権、クレジットを取得する。ChatGPTのアクセストークンは要求中のメモリー内だけで扱う。
- `https://llmsmonitor.ntus.info/*`: reads only the bounded, normalized public intelligence feed from `/api/intelligence`; no X credential or private usage value is sent.
- Official status hosts (`status.openai.com`, `status.claude.com`, `www.google.com/appsstatus/dashboard`): fetch public incident summaries without credentials or user usage data.
- OpenAI Status、Claude Status、Google Workspace Statusの公式host権限: 公開障害情報のみを認証情報なしで取得する。
- `externally_connectable`: 本番 `https://llmsmonitor.ntus.info/*` と互換性用の旧URL `https://llmsmonitor.ntusnog.chatgpt.site/*` の2件に限定し、localhostやサブドメインのワイルドカードは含めない。

## タスク一覧の取得

表示済み公式サイドバーの会話名・リンクだけを取得し、本文・入力途中の内容は読み取りません。残量と独立し、非アクティブな一時ホームタブを取得後に閉じます。部分一覧は許可済みタスク窓だけへ返し、保存しません。必須権限は変更しません。提出前に3社の実機取得、失敗時の一時タブ消去、自動停止・消去・JSON読込、使用量履歴の維持を確認してください。

## 審査時の確認手順

1. 同じブラウザープロファイルで任意の公式サービスにログインし、提出ZIPをインストールする。製品がパスワードやAPIキーを求めないことを確認する。
2. 公式サービスのタブを閉じて手動更新し、残量の取得と未ログイン時の公式ログイン導線を確認する。
3. 約60秒更新、前回値の保持、契約名、リセット時刻、クレジット、変化履歴、3音を確認する。
4. 標準／ダーク、透明度15/55/100%、メイン、小窓、最前面表示、サイト内パネルを確認する。
5. 起動時に小窓が開かず、ボタン操作で自由にリサイズできる通常小窓が開き、ユーザークリック後にDocument PiPへ切り替わることを確認する。
6. 独自ドメインと旧URLで同じ32文字の拡張機能IDによる接続と設定変更を確認する。他originを拒否し、同じ読込元での更新時に履歴を維持することを確認する。

提出前に `node --test tests/*.test.cjs tests/*.test.mjs`、`python3 build.py --package --codex-helper`、ZIP内容の点検、および `SPECIFICATION.md` の手動受入確認を行ってください。


v1.17.0: Existing ChatGPT usage tabs are reloaded once after an extension update so the current parser can observe an official entitlement expiry. The utility directory contains static external HTTPS links only. Nerf Bench monitoring is disabled.


v1.17.1: The AI tool directory uses static HTTPS links in the existing card layout and is hidden in fullscreen. No permissions, data collection, storage, or network polling changed.

API連携は初期状態で無効です。拡張機能画面で事業者を選択したときだけ、scriptingと該当の公式API請求ホストへの任意権限を要求します。請求画面の残高表示だけを取得し、APIキーや決済情報を保存しません。解除時に該当ホストの権限を削除します。

Before v1.44.0 submission, manually confirm diagnostic export/clear and storage-limit fallback, language switching after repeated refresh, opening usage/API pages after closing them, and all three floating cards at a narrow width.

v1.44.0提出前に、診断ログの書出し・消去・容量上限時の継続動作、繰返し更新後の言語維持、画面を閉じた後の使用量/API連携再表示、狭幅小窓の3社表示を実機確認する。

タスク状態の受入確認: 上書き更新し、入力保存後に必要な公式会話タブを手動再読込。応答生成中→応答待機、閉じたタブ未確認、複数タブ不一致、自動OFF、消去／サンプル／読込の保留応答無効化、残量／履歴の独立性を確認。ブラウザ経路では閉じた会話の完了を推測しない。v1.30.0で任意nativeMessagingを追加し、専用画面のクリックと端末内ヘルパー導入後だけCodexメタ情報を取得。共有接続がなければ状態未確認。


Codex acceptance / Codex受入: first-use disabled, deny/grant/revoke optional nativeMessaging, exact-ID host manifest, read counts/pins and metadata-only Unknown states, paused/clear/import races and 90-second expiry. Test installed Chrome/Edge manually before store submission. Native helper is a separate optional ZIP and is not installed by the extension.

## v1.31 release gates / 正式公開前の確認

The task window reads only the selected provider’s saved usage windows and incident through TASKS_MONITOR; it never refreshes quotas, writes history or plays sounds. Confirm expired/missing/previous/actual-zero states and readable bars at 240–420px in both languages/themes. Required and optional permissions are unchanged from v1.30.0. The unchanged helper runtime remains v1.30.0; its guide is regenerated in this full build.

The static Site feed is **unconfigured**. Do not advertise live Tibo alerts before deploying the separate X Worker, secret, KV and cron and verifying a real post. Current Sites audience remains owner-only; store reviewers need a publicly reachable privacy policy before submission. Pin completeness is not an account-wide guarantee. Store approval, live Chrome/Edge acceptance and future aimon.ntus.info migration remain owner release steps.

タスク別窓は選択した事業者の保存済み残量・障害だけを読取専用で表示。期限切れ／未取得／前回値／実際の0%を区別し、240〜420px・日英・両テーマで確認する。残量再取得・履歴保存・音声は行わない。必須・任意権限はv1.30.0から変更なし。ヘルパー本体は1.30.0を維持し、説明書だけフルビルドで更新する。

現在の静的サイトのX配信は**未設定**。別サーバー・X Secret・KV・1分cronと実投稿の検証前にTibo通知を稼働済みと宣伝しない。Sitesは所有者限定のまま維持し、ストア提出前にプライバシーの一般閲覧を整える。全アカウントのピン全件は保証しない。ストア承認、Chrome/Edge実機受入、将来のaimon.ntus.info移行は正式公開前の作業。

## v1.32 review acceptance / 更新受入

Test OFF during blocked quota refresh and delayed audio resume, then repeat with multiple main/related windows; no repeated or second threshold tone may play after mute. OS notifications are explicitly silent. Preview must not change mute. Confirm the extension’s intentional background monitoring after the main closes. Verify note registration after worker suspension with main closed, exact service/top-frame/opaque handle/expiry, no title/link in query, selected Claude Code thread heading and editable title, default-note retention and per-provider workspace choice. No new permission or host. The helper installer is not loaded via Chrome Load unpacked. Run full regression and package checks; installed Chrome/Edge and native helper acceptance remain separate.

残量取得待ち・遅延音声再開中・複数の本体／関連窓でOFFを確認し、予約済み音・警告の2音目が停止すること。OS通知は明示的に無音とし、試聴で設定を変更しない。メイン終了後の拡張監視は仕様。メイン終了＋worker休止後の登録、2分失効・一度限り・送信元／service／frame・queryへの名称非混入、Claude Codeの選択スレッド見出し・タイトル編集・旧defaultメモ保持・サービス別領域選択を確認。権限／host追加なし。Codexは端末内インストーラーで導入。全回帰・ZIP照合に加え、更新済み実Chrome/Edge・ヘルパーの受入は別途必要。


## v1.44.0 acceptance addendum / v1.44.0追加受入

EN: Confirm official Claude pacing warning text appears only in its provider card and floating widget, disappears after a later clean usage-page read, and survives API-only refresh. Verify at least three updates with no tone for same displayed integer quota or credit-only changes; verify tone on a displayed whole-percent change and separate downward threshold tones at 5% and 1%. Compare nested USD prepaid balance with the official page; malformed/unknown values must remain unavailable and never show object text or a 1970 expiry.

JP: Claude公式利用状況のペース警告が対象カードと小窓だけに表示され、次回の公式画面読取で消え、APIだけの更新では保持されることを確認。画面表示の整数％が同じ場合とクレジットだけが変わった場合に音が鳴らないことを3回以上の更新で確認し、整数表示の変化および5％／1％を下回る時の各警告音を確認。USD前払い残高を公式画面と照合し、不明形式を未取得のまま扱い、オブジェクト文字列や1970年の期限を表示しないこと。
