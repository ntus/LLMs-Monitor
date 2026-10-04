# Store submission checklist — v1.22.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

`dist/LLMs-Monitor-v1.22.0.zip` is the Chrome Web Store and Microsoft Edge Add-ons submission package. Its manifest and complete runtime UI are localized as “LLMs モニター” in Japanese and “LLMs Monitor” in English.

Developer-mode-free installation requires the owner to complete both stores' account, review, and publication process. Building or hosting the ZIP does not publish an installable store extension.

## Required owner actions

1. Register the owner developer accounts and enable two-step verification where required.
2. Upload `LLMs-Monitor-v1.22.0.zip`, the 128px icon, screenshots, Japanese and English descriptions, and reviewer test instructions.
3. Use the deployed privacy policy at `https://llmsmonitor.ntusnog.chatgpt.site/privacy.html` and verify that it is reachable without sign-in.
4. Submit for manual review in each store. After approval, replace the website package-only guidance with the approved store URLs.

## Permission declarations

- `storage`: keeps normalized usage snapshots, changed-value history, the selected Claude organization ID, and display preferences locally.
- `alarms`: starts the approximately 60-second usage refresh, one-minute public service-status checks, and one-minute cached intelligence-feed checks.
- `offscreen`: plays local tones for changed usage values and official service incidents; it is not used for hidden network access or tracking.
- `notifications`: shows a browser alert for a newly reported provider incident or a newly detected usage/reset/Nerf intelligence item.
- `https://chatgpt.com/*`: reads the signed-in account's official usage, plan, reset entitlement, and related credit fields. The first-party access token is held only in memory for the usage request and is never stored, logged, displayed, or shared.
- When an available reset has no expiry in the API, the extension checks an existing ChatGPT usage tab for its reader. A missing reader triggers one reload; if no usage tab exists, a temporary inactive official tab closes after the deadline is read or after 45 seconds. Existing `chatgpt.com` host access covers this; the package does not request broad `tabs` access.
- `https://claude.ai/*`: reads the active signed-in organization's official usage, plan, cloud-session credit, project-setup credit, and prepaid/extra credit fields.
- `https://gemini.google.com/*`: reads the currently signed-in Google account's official usage and Google AI plan fields, including account-prefixed `/u/N` pages.
- `https://one.google.com/*`: reads the currently signed-in Google account's current Google AI membership name when Gemini does not expose it directly.
- `https://llmsmonitor.ntusnog.chatgpt.site/*`: reads only the bounded, normalized public intelligence feed from `/api/intelligence`; no X credential or private usage value is sent.
- Official status hosts (`status.openai.com`, `status.claude.com`, `www.google.com/appsstatus/dashboard`): fetch public incident summaries without credentials or user usage data.
- `externally_connectable`: limited to `https://llmsmonitor.ntusnog.chatgpt.site/*`; localhost is excluded from the production package.

- Optional `scripting` plus a separately requested official billing host (`platform.openai.com`, `platform.claude.com` or `aistudio.google.com`): reads only labelled API credit balance fields on billing routes after the user clicks Connect on the extension's API setup page. No broad `tabs` permission is added. No API keys, payment fields or full page text are transmitted or stored. Disconnect revokes that host.

## Reviewer test flow

1. Sign in to one or more of ChatGPT, Claude, and Gemini in the same browser profile.
2. Install the submitted package and open the extension action. Confirm that no password or API-key form appears.
3. Close the provider tabs and use “Refresh now”. Confirm that supported usage remains available from the signed-in sessions and signed-out providers show a login action.
4. Confirm 60-second refresh, saved-value fallback, plan labels, reset times, credit extras, changed-value history, and the three-tone notification.
5. Compare dark and standard themes and opacity 15/55/100% in the embedded panel and floating views.
6. Confirm that startup does not open a popup, the popup button opens one freely resizable normal popup, and “Always on top” opens Document Picture-in-Picture after a user click.
7. Confirm that the production companion page connects only after a valid 32-character extension ID is entered.

8. Use API connections to enable one billing provider; approve the optional host access, keep its signed-in billing page open, and verify the balance in both main and floating cards. Test missing/zero/postpaid and revoke access. Claude/Gemini live balance parsing is not yet verified.

Before uploading, run `node --test tests/*.test.cjs`, `python3 build.py --package`, inspect the ZIP contents, and perform the manual acceptance checklist in `SPECIFICATION.md`.

---

<a id="ja"></a>

# 日本語 — ストア提出チェックリスト v1.22.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

提出物は `dist/LLMs-Monitor-v1.22.0.zip` です。拡張機能名と画面は日本語「LLMs モニター」、英語「LLMs MONITOR」に対応します。デベロッパーモード不要の導入には、所有者がChrome Web StoreとMicrosoft Edge Add-onsでアカウント、審査、公開を完了する必要があります。ZIPの作成やWeb配布だけではストア公開になりません。

## 所有者が行う提出作業

1. 両ストアの開発者アカウントを登録し、必要な本人確認と二段階認証を完了する。
2. ZIP、128pxアイコン、スクリーンショット、日英の説明、審査担当者向けテスト手順を提出する。
3. `https://llmsmonitor.ntusnog.chatgpt.site/privacy.html` にサインインなしでアクセスできるか確認する。
4. 審査へ提出し、承認後にサイトのストア案内を正式な掲載URLへ置き換える。

## 権限の説明

- `storage`: 正規化した使用量、変化履歴、選択したClaude組織ID、表示設定を端末内に保存する。
- `alarms`: 残量、公開障害情報、cache済みAI速報をそれぞれ約1分ごとに更新する。
- `offscreen`: 数値変化時の音と公式障害情報の警告音をローカルで鳴らす。
- `notifications`: 新たな障害情報または利用枠・リセット・Nerf速報を検知したときにブラウザー通知を表示する。
- ChatGPT、Claude、Gemini、Google Oneの公式host権限: ログイン済みアカウントの使用量、契約プラン、リセット権、クレジットを取得する。ChatGPTのアクセストークンは要求中のメモリー内だけで扱う。
- `https://llmsmonitor.ntusnog.chatgpt.site/*`: reads only the bounded, normalized public intelligence feed from `/api/intelligence`; no X credential or private usage value is sent.
- Official status hosts (`status.openai.com`, `status.claude.com`, `www.google.com/appsstatus/dashboard`): fetch public incident summaries without credentials or user usage data.
- OpenAI Status、Claude Status、Google Workspace Statusの公式host権限: 公開障害情報のみを認証情報なしで取得する。
- `externally_connectable`: 本番コンパニオン画面 `https://llmsmonitor.ntusnog.chatgpt.site/*` に限定し、localhostは含めない。

## 審査時の確認手順

1. 同じブラウザープロファイルで任意の公式サービスにログインし、提出ZIPをインストールする。製品がパスワードやAPIキーを求めないことを確認する。
2. 公式サービスのタブを閉じて手動更新し、残量の取得と未ログイン時の公式ログイン導線を確認する。
3. 約60秒更新、前回値の保持、契約名、リセット時刻、クレジット、変化履歴、3音を確認する。
4. 標準／ダーク、透明度15/55/100%、メイン、小窓、最前面表示、サイト内パネルを確認する。
5. 起動時に小窓が開かず、ボタン操作で自由にリサイズできる通常小窓が開き、ユーザークリック後にDocument PiPへ切り替わることを確認する。
6. 本番Web画面との接続が有効な32文字の拡張機能IDに限られることを確認する。

提出前に `node --test tests/*.test.cjs`、`python3 build.py --package`、ZIP内容の点検、および `SPECIFICATION.md` の手動受入確認を行ってください。


v1.17.0: Existing ChatGPT usage tabs are reloaded once after an extension update so the current parser can observe an official entitlement expiry. The utility directory contains static external HTTPS links only. Nerf Bench monitoring is disabled.


v1.17.1: The AI tool directory uses static HTTPS links in the existing card layout and is hidden in fullscreen. No permissions, data collection, storage, or network polling changed.

API連携は初期状態で無効です。拡張機能画面で事業者を選択したときだけ、scriptingと該当の公式API請求ホストへの任意権限を要求します。請求画面の残高表示だけを取得し、APIキーや決済情報を保存しません。解除時に該当ホストの権限を削除します。

Before v1.22.0 submission, manually confirm diagnostic export/clear and storage-limit fallback, language switching after repeated refresh, opening usage/API pages after closing them, and all three floating cards at a narrow width.

v1.22.0提出前に、診断ログの書出し・消去・容量上限時の継続動作、繰返し更新後の言語維持、画面を閉じた後の使用量/API連携再表示、狭幅小窓の3社表示を実機確認する。
