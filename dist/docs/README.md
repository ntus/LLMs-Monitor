Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/README.md

# LLMs Monitor

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Current guide: **21 October 2026 · app/extension v1.63.0 · Codex helper v1.30.2 · Mac updater v1.0.1**.

Monitor AI capacity, reset times, official incidents and local work notes in one browser. Usage updates approximately once a minute; provider reporting, browser sleep and network delays can postpone them.

[Open monitor](https://llmsmonitor.ntus.info/) · [Product introduction](https://llmsmonitor.ntus.info/product.html) · [First-install ZIP](https://github.com/ntus/LLMs-Monitor/raw/refs/heads/main/dist/LLMs-Monitor.zip) · [Release history](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md)

## First installation and updates

1. In the same desktop Chrome/Edge profile, sign in to the official services you use.
2. Download and extract **LLMs-Monitor.zip**. Put its **LLMs-Monitor** folder in a permanent location. Before browser-store approval, open `chrome://extensions` or `edge://extensions`, enable Developer mode and choose **Load unpacked**, selecting that folder containing `manifest.json`. The ZIP itself is not a store installation.
3. Open the monitor. If using the Web page, enter the current extension’s 32-letter ID once. Pairing is separate for each site origin; extension history/settings remain in the browser profile.
4. Keep the browser running. Select services and order in Setup. Hidden services continue acquiring data and recording quota changes.
5. **On Mac, use the separate update app** after registering the currently loaded folder once. It downloads, verifies, backs up and replaces that same folder. See the [Mac updater guide](https://github.com/ntus/LLMs-Monitor/blob/main/tools/mac-updater/README.md). For manual updates, overwrite the same loaded folder and reload the extension, then reload the monitor. Do not uninstall, rename/move the loaded folder or repeatedly extract updates into new sibling folders.

The first update from v1.57 or earlier needs a manual extension reload. Update-aware versions reload at a later approximately one-minute cycle; browser sleep can delay this. A different installation path can change the extension ID and require pairing, optional permissions and Codex registration again. Moving to the fixed folder is an explicit new installation, not an automatic settings migration. The updater is unsigned/not notarized; follow macOS’s normal per-app approval process, without disabling security protections.

## Reading the dashboard

- The outer ring shows the weekly window; the inner ring shows the current session. Corresponding percentages and reset countdowns appear inside, and reset date/time below each horizontal bar. Obtained windows vary by service and plan; unknown values stay **—**.
- **Remaining / Used** changes the display only. History, warnings and sound comparisons continue using remaining quota. ChatGPT Work/Codex limits do not represent ordinary ChatGPT chat limits; ordinary Chat remaining is not currently available from the verified source.
- Low remaining or a qualified depletion forecast slowly pulses the percentage only. The weekly even-budget fallback is a guideline, not a provider fact. Grok date-only resets use the explicitly labelled device-local midnight assumption; it is not an official reset clock.
- Current/weekly quota, cloud-session credit, reset entitlement, purchased API credit and promotional API credit are separate. No purchase, plan change or reset entitlement is exercised automatically.
- Only displayed whole-percent quota changes produce change tones; fractional changes with the same displayed integer and credit-only changes are silent. Sound defaults ON. Turning it ON previews once. Committing a changed volume enables sound and previews the new level once. OFF cancels pending tones. History retains up to 10,000 changed observations per window locally.
- Use the toolbar’s **Task windows**, **Always-on-top small window**, **Normal small window** and fullscreen controls. The supported service cards also have a **Task** link beside the acquisition badge. Document PiP needs a user gesture and browser support; normal small windows are not OS-wide always-on-top. The window size you choose is retained. Selected additional services also appear in floating views.
- Options initially expand. Service selection/order is separate from floating-display settings. Dragged advice is above other content within the app; it is not an OS window.

## Optional API balances and additional services

Setup requests each optional official host only through your click in an extension-owned page. Opening Web setup may open/reuse the dedicated extension settings tab; it does not silently grant permissions.

| Data | Current acquisition and limits |
| --- | --- |
| Claude API purchased/promotional credit | v1.63.0 reads Console session data directly about once a minute. **No billing tab needs to be opened, kept visible or brought forward.** No API key input, cookie extraction or paid inference call. One API-capable organization must be identifiable; multiple organizations or multiple unexpired grants in a lane remain unavailable rather than being chosen or summed. Undocumented provider endpoints can change. |
| OpenAI, Gemini and Grok API balances | Read explicit values on supported, signed-in official billing/account pages. These adapters may require the page to remain open. They are separate from plan quotas; unsupported/ambiguous values stay unavailable. |
| Grok weekly quota | Separate optional connection from Grok API balance. Reuses one owned inactive dashboard tab in the monitor’s normal browser window. Closing it, redirects or repeated missing quota can pause automatic reading. Explicit retry is available; user-owned tabs are never reloaded/closed automatically. |
| DeepSeek, Perplexity and Genspark | Experimental official-account-page readers, disabled until granted. They do not establish complete plan/quota coverage. No paid API or chat-body reading. |

Values show their observation time; stale values are not made fresh by a failed retry. Signed-out or ambiguous accounts do not retain current balances under a different account. On 20 October the user reported the v1.63.0 Claude path appeared stable; this is user-reported evidence, not exhaustive Chrome/Edge or multi-account acceptance.

## Tasks, work notes and Codex

Task windows support **ChatGPT, Claude and Gemini**. Grok and other extra services do not yet have task-list adapters. Browser lists are partial/rendered observations; all account pins are not guaranteed. Generating/response-idle requires observed controls; idle, unread or merged never means completed. Open-tab evidence expires after 15 seconds; supported Claude Code/shared Codex evidence after 90 seconds.

Use **Register work note** on a supported conversation, or **Work notes / handoff** in a task item. Choose an optional workspace label, edit purpose/current situation/next actions/waiting/cautions/checklist, then Save. Blank workspace means Shared and preserves older default notes. Saved notes persist separately from automatic lists, which remain in memory. Favorites, ordering, search/filter and disclosure controls are described in the [task guide](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md). Copy handoff or export/import JSON requires your action; there is no automatic cross-chat/cloud sharing. Export notes before clearing site data or changing origins/profiles.

The **Codex helper is optional** and separate from the main extension and Mac updater. In Setup → Codex, save the personalized installer ZIP, extract it and run `Install.command` on macOS or `python3 ./install.py` in that folder on supported macOS/Linux. Then select **Connect (enable and check)** and allow the optional permission. The personalized ZIP supplies the current extension ID; the generic helper ZIP still asks for it. Never select the helper folder in Chrome’s Load unpacked. A successful connection to unchanged helper v1.30.2 needs no reinstall; a different extension ID needs new registration. Missing permission or an unavailable API alone is not proof that the installer is missing. See the [helper guide](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md).

## Public updates and privacy

Tibo/ClaudeDevs public-page reading is independently optional and checks only displayed public posts and bounded same-author replies. Publication/read dates and source links are distinct; unseen posts/replies remain unverified. It does not reload or crawl X automatically, read DMs/drafts, or send private usage/notes to X. The separate server feed remains **unconfigured**; a static build does not deploy it. Nerf Bench is link-only. Official incident feeds are independent of X announcements and personal quota reset confirmation.

Usage, settings and quota history stay in extension storage. Work notes are separate and local to their browser/site origin. No automatic operator upload, advertising SDK or cross-device synchronization is present. Diagnostics are bounded and local, with explicit export/clear. See [Privacy](https://github.com/ntus/LLMs-Monitor/blob/main/PRIVACY.md).

## Manuals and build scope

| Guide | Purpose |
| --- | --- |
| [Task details](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md) | Lists, states, pins, favorites, notes and handoff |
| [Codex helper](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md) | Personalized installer, connection checks, troubleshooting and removal |
| [Mac updater](https://github.com/ntus/LLMs-Monitor/blob/main/tools/mac-updater/README.md) | Fixed folder, update/restore and macOS approval |
| [Specification](https://github.com/ntus/LLMs-Monitor/blob/main/SPECIFICATION.md) | Current acceptance rules and historical contracts |
| [Privacy](https://github.com/ntus/LLMs-Monitor/blob/main/PRIVACY.md) | Collection, local storage, optional readers and deletion |
| [Security review](https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md) | Boundaries, verification and remaining acceptance |
| [Store submission](https://github.com/ntus/LLMs-Monitor/blob/main/STORE_SUBMISSION.md) | Browser-store release checklist |
| [Public feed server](https://github.com/ntus/LLMs-Monitor/blob/main/server/README.md) | Separate unconfigured server and acceptance |
| [Agent instructions](https://github.com/ntus/LLMs-Monitor/blob/main/AGENTS.md) | Regression and release workflow |
| [Changelog](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md) | Release history |

The hosted Markdown copies are in `dist/docs/`; no PDF manual is generated. Documentation-only builds use `python3 build.py --manuals-only` followed by the selected manual filenames; they do not rebuild app, extension/helper/updater ZIPs or change versions. App-only package builds use `python3 build.py --package --skip-manuals`. Rebuild the native helper only when its runtime/installer actually changes and that scope is authorized. Store approval, general public access, complete live plan coverage and the future `aimon.ntus.info` migration remain separate release tasks.

---

<a id="ja"></a>

# 日本語 — LLMs モニター

[🌍 EN](#en) · [🇯🇵 JP](#ja)

現行取説：**2026年10月21日 · 本体／拡張 v1.63.0 · Codexヘルパー v1.30.2 · Mac更新ツール v1.0.1**。

AIの利用残量、リセット予定、公式障害、作業メモをブラウザーでまとめて確認します。更新はおおむね1分ごとです。公式側の集計・ブラウザーの休止・通信状況で遅れる場合があります。

[モニターを開く](https://llmsmonitor.ntus.info/) · [製品紹介](https://llmsmonitor.ntus.info/product.html) · [初回導入ZIP](https://github.com/ntus/LLMs-Monitor/raw/refs/heads/main/dist/LLMs-Monitor.zip) · [変更履歴](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md)

## 初回導入と更新

1. 同じChrome／Edgeのプロファイルで、使うLLMの公式サイトへログインします。
2. **LLMs-Monitor.zip**を展開し、中の **LLMs-Monitor** フォルダーを今後も使う場所へ置きます。ストア公開前は `chrome://extensions` または `edge://extensions` のデベロッパーモードをONにし、［パッケージ化されていない拡張機能を読み込む］で、`manifest.json`が入ったそのフォルダーを指定します。ZIP配布だけではストア導入にはなりません。
3. モニターを開きます。Web版は現在の拡張機能ID（英小文字32文字）を一度登録します。接続登録はサイトURLごとですが、拡張機能の履歴・設定はブラウザー側に保存されます。
4. ブラウザーを起動したまま利用します。セットアップで表示するサービス・並び順を選びます。非表示のサービスも残量取得・履歴保存を継続します。
5. **Macは更新アプリを使います。** 初回だけ「現在読み込んでいるフォルダー」を登録し、以後は同じ場所へ検証・バックアップ付きで更新します。[Mac更新ツール取説](https://github.com/ntus/LLMs-Monitor/blob/main/tools/mac-updater/README.md)を参照。手動更新も同じフォルダーに上書きし、拡張機能とモニターを再読み込みします。更新のためにアンインストール・移動・改名したり、毎回ZIPを別フォルダーへ展開したりしません。

v1.57以前からの初回更新だけ、拡張機能画面で手動の再読み込みが必要です。更新対応版は次の約1分周期で読み直しますが、ブラウザー休止中は遅れます。別の場所から読み込むとIDが変わり、接続登録・任意権限・Codex登録が再度必要になることがあります。既存フォルダーを固定名へ移すことは自動移行ではありません。更新アプリは署名・公証前のため、初回はmacOSの通常の個別許可手順で開き、保護機能は無効化しません。

## メイン画面の見方・操作

- 外側の円が週間、内側が現在セッションです。対応する％と残り時間を円内へ、リセット日時を各横バーの下へ表示します。取得できる枠はサービス・プランで異なり、未取得は **—** です。
- ［残量／使用量］は表示だけを反転します。履歴・警告・通知音は残量基準です。ChatGPTのWork／Codex枠は通常Chatとは別で、通常Chatの残量は現在の検証済み取得元では未対応です。
- 残量不足や根拠のある消費予測は％だけがゆっくり点滅します。週間の均等配分による警告は目安です。Grokの日付だけのリセットは「端末の現地時間0:00想定」と明記し、公式の確定時刻として扱いません。
- 利用枠、クラウドセッションクレジット、リセット権、購入済みAPI残高、プロモーションクレジットを区別します。購入・契約変更・リセット権行使は自動実行しません。
- 通知音は表示される整数％の変化だけが対象です。表示が同じ小数変化やクレジット変化では鳴りません。初期ON、OFF→ONで確認音が1回鳴ります。音量変更を確定すると通知音ONになり、新音量で1回鳴ります。OFFは予約済み音も取り消します。変化履歴は枠ごと最大10,000件を端末内に保持します。
- 上部の［タスク別画面］［最前面の小窓］［通常の小窓］［フルスクリーン］から各表示を開きます。対応カードの［取得済み］付近にも［タスク］があります。最前面は対応ブラウザーのDocument PiPを明示操作で開きます。通常小窓はOS全体の最前面ではありません。選んだ追加サービスも小窓へ表示し、利用者が変えた窓サイズは維持します。
- オプションは初期展開です。サービス選択・並び順と小窓設定は別項目です。ドラッグしたTipはアプリ内の最前面で、OSの独立最前面窓ではありません。

## 任意のAPI残高・追加サービス

セットアップの拡張機能画面で、利用者が押した事業者の公式ホストだけを許可します。Webから設定すると専用の拡張機能タブを開く／再利用することがあります。Webページから勝手に権限を許可しません。

| 対象 | 現在の取得方法・制約 |
| --- | --- |
| Claude API購入残高・プロモーションクレジット | v1.63.0からConsoleの残高データを直接取得。**残高画面を開く・表示し続ける・前面にする操作は不要**です。APIキー入力・Cookie取り出し・有料推論呼出しはありません。API用組織が1つに特定できない場合や、同じ区分に複数の未失効残高がある場合は、勝手に選択・合算せず未取得にします。非公開の取得経路は公式側の変更を受ける可能性があります。 |
| OpenAI／Gemini／GrokのAPI残高 | 対応する公式請求・アカウント画面の表示値を読み取ります。画面を開いておく必要がある場合があります。月額プランの枠とは別で、未対応・曖昧な値は未取得です。 |
| Grok週間枠 | Grok API残高とは別の任意連携です。モニターがある通常ブラウザー窓内の取得用裏タブを1つ再利用します。手動で閉じる・ログインへ移動する・繰り返し未取得の場合は停止し、明示的に再試行できます。利用者自身のタブを自動で再読み込み・削除しません。 |
| DeepSeek／Perplexity／Genspark | 公式アカウント画面の試験読取りで、許可前は無効です。全プランの利用枠対応は保証せず、有料API・会話本文は読みません。 |

読取日時を表示し、失敗時に古い値を新しく取得したようには扱いません。ログアウト・組織が曖昧な場合に他アカウントの現在残高を表示しません。10月20日に利用者から「今のところ安定してそう」との報告がありましたが、全Chrome／Edge・全アカウントの受入完了を意味しません。

## タスク・作業メモ・Codex

タスク別画面は **ChatGPT・Claude・Gemini** に対応します。Grok等の追加サービスのタスク一覧は未対応です。ブラウザー一覧は表示範囲の部分取得で、全アカウントのピン全件を保証しません。停止ボタン等の根拠で応答生成中・待機を判定し、待機・未読・マージを完了と推測しません。開いた会話の根拠は15秒、対応するClaude Code一覧・共有Codexの根拠は90秒で失効します。

公式会話の［作業メモへ登録］または一覧の［作業メモ・引継ぎ］から、任意の作業領域を選び、目的・状況・次の作業・待ち・注意点・チェックリストを保存します。空欄は「共通」で旧defaultメモも保持。自動一覧はメモリー内だけ、明示保存したメモは別に残ります。お気に入り・並び順・検索・絞込み・折りたたみは[タスク取説](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md#ja)を参照。引継ぎコピー・JSON書出し／読込みは手動で、自動クラウド共有はありません。サイトデータ消去・URL／プロファイル変更前はメモをバックアップしてください。

**Codexヘルパーは任意**で、本体拡張機能・Mac更新ツールとは別物です。セットアップ→Codexから専用ZIPを保存・展開し、macOSは `Install.command`、対応macOS／Linuxはそのフォルダーで `python3 ./install.py` を実行。その後［接続する（有効化・確認）］で任意権限を許可します。専用ZIPは現在の拡張機能IDを含むため手入力不要で、汎用ZIPだけがIDを尋ねます。ヘルパーフォルダーをChromeの拡張機能読込へ指定しません。ヘルパーv1.30.2で接続成功なら再導入不要です。別IDの場合は再登録が必要。権限不足・API利用不能だけを理由に「ZIP未導入」とは扱いません。[Codex導入・接続取説](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md#macos-ja)を参照してください。

## 公開情報・保存範囲

Tibo／ClaudeDevsの公開ページ読取りは独立した任意連携です。表示済み公開投稿と限定された本人の返信だけを対象とし、投稿日時・確認日時・出典を区別します。未表示の投稿・返信は未確認で、Xの自動巡回・再読み込み・DM／入力読取りはしません。個人の利用量・メモをXへ送りません。別サーバー配信は引き続き **未設定** で、静的ファイルの公開では稼働しません。Nerf Benchはリンクのみ。公式障害・X告知・個人の残量リセットは別です。

残量・設定・履歴は拡張機能の保存領域に置きます。作業メモは別で、ブラウザー／サイトURLごとの端末内保存です。運営者への自動アップロード・広告SDK・端末間自動同期はありません。診断ログも端末内で上限付き、書出し・消去は明示操作です。[プライバシー](https://github.com/ntus/LLMs-Monitor/blob/main/PRIVACY.md#ja)を参照。

## 取説一覧・ビルド

[タスク・作業メモ](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md#ja) · [Codexヘルパー](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md#ja) · [Mac更新ツール](https://github.com/ntus/LLMs-Monitor/blob/main/tools/mac-updater/README.md#ja) · [詳細仕様](https://github.com/ntus/LLMs-Monitor/blob/main/SPECIFICATION.md#ja) · [プライバシー](https://github.com/ntus/LLMs-Monitor/blob/main/PRIVACY.md#ja) · [セキュリティ](https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md#ja) · [ストア提出](https://github.com/ntus/LLMs-Monitor/blob/main/STORE_SUBMISSION.md#ja) · [公開情報サーバー](https://github.com/ntus/LLMs-Monitor/blob/main/server/README.md#ja) · [開発基準](https://github.com/ntus/LLMs-Monitor/blob/main/AGENTS.md) · [変更履歴](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md)

配布用Markdown取説は `dist/docs/` です。PDF取説は生成しません。取説だけなら `python3 build.py --manuals-only` の後に対象文書名を指定し、本体・拡張／ヘルパー／更新ツールZIP・版番号を変えません。本体パッケージのみは `python3 build.py --package --skip-manuals`。ネイティブヘルパーは実装・導入処理が変わり、対象範囲が承認された場合だけ再ビルドします。ストア承認・一般公開・全プラン実機検証・将来のaimon.ntus.info移行は別の公開作業です。
