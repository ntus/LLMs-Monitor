# Store submission checklist — v1.6.1

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

`dist/LLMs-Token-Usage-Monitor-v1.6.1.zip` is the Chrome Web Store and Microsoft Edge Add-ons submission package. Its manifest and complete runtime UI are localized as “LLMs トークン残量モニタ” in Japanese and “LLMs TOKEN USAGE MONITOR” in English.

Developer-mode-free installation requires the owner to complete both stores' account, review, and publication process. Building or hosting the ZIP does not publish an installable store extension.

## Required owner actions

1. Register the owner developer accounts and enable two-step verification where required.
2. Upload `LLMs-Token-Usage-Monitor-v1.6.1.zip`, the 128px icon, screenshots, Japanese and English descriptions, and reviewer test instructions.
3. Use the deployed privacy policy at `https://ai-usage-glance.ntusnog.chatgpt.site/privacy.html` and verify that it is reachable without sign-in.
4. Submit for manual review in each store. After approval, replace the website package-only guidance with the approved store URLs.

## Permission declarations

- `storage`: keeps normalized usage snapshots, changed-value history, the selected Claude organization ID, and display preferences locally.
- `alarms`: starts the approximately 60-second usage refresh and 10-minute public service-status checks.
- `offscreen`: plays local tones for changed usage values and official service incidents; it is not used for hidden network access or tracking.
- `notifications`: shows a browser alert when a newly reported provider incident is detected.
- `https://chatgpt.com/*`: reads the signed-in account's official usage, plan, reset entitlement, and related credit fields. The first-party access token is held only in memory for the usage request and is never stored, logged, displayed, or shared.
- `https://claude.ai/*`: reads the active signed-in organization's official usage, plan, cloud-session credit, project-setup credit, and prepaid/extra credit fields.
- `https://gemini.google.com/*`: reads the currently signed-in Google account's official usage and Google AI plan fields, including account-prefixed `/u/N` pages.
- `https://one.google.com/*`: reads the currently signed-in Google account's current Google AI membership name when Gemini does not expose it directly.
- Official status hosts (`status.openai.com`, `status.claude.com`, `www.google.com/appsstatus/dashboard`): fetch public incident summaries without credentials or user usage data.
- `externally_connectable`: limited to `https://ai-usage-glance.ntusnog.chatgpt.site/*`; localhost is excluded from the production package.

## Reviewer test flow

1. Sign in to one or more of ChatGPT, Claude, and Gemini in the same browser profile.
2. Install the submitted package and open the extension action. Confirm that no password or API-key form appears.
3. Close the provider tabs and use “Refresh now”. Confirm that supported usage remains available from the signed-in sessions and signed-out providers show a login action.
4. Confirm 60-second refresh, saved-value fallback, plan labels, reset times, credit extras, changed-value history, and the three-tone notification.
5. Compare dark and standard themes and opacity 15/55/100% in the embedded panel and floating views.
6. Confirm that startup opens one normal popup, “Always on top” opens Document Picture-in-Picture after a user click, and the normal popup closes.
7. Confirm that the production companion page connects only after a valid 32-character extension ID is entered.

Before uploading, run `node --test tests/*.test.cjs`, `python3 build.py`, inspect the ZIP contents, and perform the manual acceptance checklist in `SPECIFICATION.md`.

---

<a id="ja"></a>

# 日本語 — ストア提出チェックリスト v1.6.1

[🌍 EN](#en) · [🇯🇵 JP](#ja)

提出物は `dist/LLMs-Token-Usage-Monitor-v1.6.1.zip` です。拡張機能名と画面は日本語「LLMs トークン残量モニタ」、英語「LLMs TOKEN USAGE MONITOR」に対応します。デベロッパーモード不要の導入には、所有者がChrome Web StoreとMicrosoft Edge Add-onsでアカウント、審査、公開を完了する必要があります。ZIPの作成やWeb配布だけではストア公開になりません。

## 所有者が行う提出作業

1. 両ストアの開発者アカウントを登録し、必要な本人確認と二段階認証を完了する。
2. ZIP、128pxアイコン、スクリーンショット、日英の説明、審査担当者向けテスト手順を提出する。
3. `https://ai-usage-glance.ntusnog.chatgpt.site/privacy.html` にサインインなしでアクセスできるか確認する。
4. 審査へ提出し、承認後にサイトのストア案内を正式な掲載URLへ置き換える。

## 権限の説明

- `storage`: 正規化した使用量、変化履歴、選択したClaude組織ID、表示設定を端末内に保存する。
- `alarms`: 残量の約60秒更新と公開障害情報の約10分更新を起動する。
- `offscreen`: 数値変化時の音と公式障害情報の警告音をローカルで鳴らす。
- `notifications`: 新たな障害情報を検知したときにブラウザー通知を表示する。
- ChatGPT、Claude、Gemini、Google Oneの公式host権限: ログイン済みアカウントの使用量、契約プラン、リセット権、クレジットを取得する。ChatGPTのアクセストークンは要求中のメモリー内だけで扱う。
- Official status hosts (`status.openai.com`, `status.claude.com`, `www.google.com/appsstatus/dashboard`): fetch public incident summaries without credentials or user usage data.
- OpenAI Status、Claude Status、Google Workspace Statusの公式host権限: 公開障害情報のみを認証情報なしで取得する。
- `externally_connectable`: 本番コンパニオン画面 `https://ai-usage-glance.ntusnog.chatgpt.site/*` に限定し、localhostは含めない。

## 審査時の確認手順

1. 同じブラウザープロファイルで任意の公式サービスにログインし、提出ZIPをインストールする。製品がパスワードやAPIキーを求めないことを確認する。
2. 公式サービスのタブを閉じて手動更新し、残量の取得と未ログイン時の公式ログイン導線を確認する。
3. 約60秒更新、前回値の保持、契約名、リセット時刻、クレジット、変化履歴、3音を確認する。
4. 標準／ダーク、透明度15/55/100%、メイン、小窓、最前面表示、サイト内パネルを確認する。
5. 起動時の通常小窓、ユーザークリック後のDocument PiP、両者の切替を確認する。
6. 本番Web画面との接続が有効な32文字の拡張機能IDに限られることを確認する。

提出前に `node --test tests/*.test.cjs`、`python3 build.py`、ZIP内容の点検、および `SPECIFICATION.md` の手動受入確認を行ってください。
