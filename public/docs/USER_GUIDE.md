Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/USER_GUIDE.md

# LLMs Monitor User Guide / LLMsモニター取扱説明書

[English](#en) · [日本語](#ja) · [Web版](https://llmsmonitor.ntus.org/manual#ja)

App/extension package v1.132.0 · Guide revised 2026-11-11. Beta / β版。


<a id="en"></a>

## English

Read the first three chapters for the overall picture, then use the detailed chapters as needed.

### 1. Start here: the complete picture

LLMs Monitor brings supported AI usage pools, reset times, credits, history and work notes into one browser dashboard. It helps you decide when and where to continue work, without repeatedly comparing provider pages.

| Question | Feature |
| --- | --- |
| Which AI has headroom? | Provider cards, rings, bars and plan labels |
| When will a limit reset? | Reset date and countdown, with estimates labelled |
| What funds remain? | Separate credit lanes |
| How has usage changed? | History and visual usage reports |
| How do I resume work? | Task details, favorites and work notes |
| How can a team coordinate? | Optional team status; automatic allocation is future work |

Flow: official service → extension in the same browser → monitor. Basic operation needs no external AI API key and works independently of LLMs Gateway and LLMs PMO.

> This guide covers the v1.132.0 beta. The production site is https://llmsmonitor.ntus.org/. Fields depend on sign-in, plan and provider layout. — means unavailable, not zero or unlimited.

Version 1.132.0 updates: OpenAI API credits show the next observed expiry date and affected amount separately. Credit grants can have different dates. The usage report includes daily and hourly views in JST; gaps mean no observation. Claude Fable reset entitlements show their official expiry and availability. Gateway connection can remain approved until disconnected; use Open Gateway to open the installed local workbench. Official public-news collection depends on permissions and rendered posts; server-wide automatic collection is awaiting configuration.

### 2. Start here: first connection

1. Use desktop Chrome or Edge. Sign in to the official AI sites in the same browser profile.
2. Download the designated release ZIP, extract it and keep the LLMs-Monitor folder in a permanent location.
3. Before store publication, enable Developer mode in the browser extensions page and Load unpacked from the folder containing manifest.json, not the ZIP.
4. Open the monitor. Pair the current 32-letter extension ID in Web Setup. This ID is not a secret API key.
5. Choose service visibility/order and enable only the optional readers you want; review their access prompts.
6. Check observation time, plan and values. Initial sign-in and rendering can take time.

The Codex helper is unnecessary for ordinary quota monitoring. It is a separate optional installer for local desktop task metadata.

> Collection requires the browser to be running; sleep and browser shutdown interrupt operation.

> Use desktop Chrome/Edge. This browser extension cannot be installed on iOS/Android.

[拡張機能ZIP / Extension ZIP](https://llmsmonitor.ntus.org/LLMs-Monitor.zip)

### 3. Start here: a daily workflow

1. Check whether the display is Used or Remaining: 90% means opposite things in those modes.
2. Compare weekly and session pools separately, then check observation age.
3. When a limit is near, review reset timing and alternatives. The app does not purchase credits or change plans automatically.
4. Before pausing, save the purpose, current situation and next action in a work note.
5. Open Usage report for daily, weekly or monthly review.

### 4. Details: cards, controls and alerts

| Display or action | Meaning |
| --- | --- |
| Rings and bars | Only actual acquired pools; weekly first. No invented inner ring for a missing session pool. |
| Used / Remaining | Used is the default. This changes presentation, not stored history or alert thresholds. |
| Acquired, waiting, sign-in | Acquisition state, including retained previous observations. |
| Observation age | Older acquisition-time displays turn red at five minutes. |
| Red alternation | Highlights the corresponding ring, bar and number at remaining≤5%, equivalent to used≥95%. |
| Green countdown | A verified reset is approaching; it is not a danger or outage alert. |
| Warning and info symbols | Explain balance/expiry and evidence. Hover or use the available explanation action. |
| Long notes | One-line scrolling with full-text tooltips. |
| Task details / API / Usage | Open the supported view; disabled actions are unavailable or unsupported. |

Sound has ON/OFF and volume controls. Supported whole-percent changes, low thresholds and recovery use distinct events. Remaining1% uses three short tones;0% uses three longer tones. A browser gesture may be needed to unlock audio. OFF cancels pending tones. API-balance changes are not subscription recovery.

Advice uses observed history and abstains when evidence is insufficient. It does not guarantee the optimum plan across prices, quality and task requirements.

### 5. Details: provider coverage

| Provider | Supported evidence | Important limits |
| --- | --- | --- |
| ChatGPT / dots | Available Work/Codex pools, observed detailed plans such as Pro 200, reset entitlements, separate OpenAI API balance | Not all ordinary Chat or independent dots usage. A monthly benefit banner is not proof of a credited balance. |
| Claude | Actual weekly/session pools, plans including Ultra, monthly cap and purchased balance, API purchased/promotional lanes | Weekly-only plans use one ring. Legacy session history is separate from monthly extra allowance. |
| Gemini | Supported session/weekly windows and Google AI plan | App percentages and API money are separate. Embedded payments balance reading is incomplete. |
| Grok / Cursor | Supported official weekly usage/plan, independent API balance | The label does not establish shared accounts/pools or independent Bot collection. |
| Muse | General Usage, observed Free Plan/Power/Maximum names, extra tokens and history | Sign-in required; exact reset time may be unavailable. |
| Copilot | Supported contract/plan labels and explicit counters | Keep personal/work identities separate. M365 Copilot (Basic) plan was live-checked; absent counters stay unavailable. |
| DeepSeek / Perplexity / Genspark | Optional bounded experimental account readers | Full formal coverage and history reports are incomplete. |

Usage and official incident checks are approximately minute-based. Provider accounting, sign-in, rendering and browser suspension can delay them. Owned acquisition tabs are reused; automatic window proliferation is avoided.

### 6. Details: credits, funds and spending limits

| Lane | Meaning |
| --- | --- |
| Subscription pool | Weekly/session allowance in percent, not money. |
| Reset entitlement | Observed availability and expiry; never redeemed automatically. |
| Monthly extra allowance (USD) | Current monthly spend, configured cap and cap headroom, separate from funds. |
| Purchased usage credits | Actually observed available balance; never inferred from the monthly budget. |
| Cloud-session credits | A separate evidenced allowance; a zero warning does not mean every Claude feature is unavailable. |
| API balance | API money, separate from subscription capacity. |
| Promotional credits | Separate conditional grants, with per-grant amounts/expiry when multiple exist. |
| Money bar | An observed total ratio or an explicitly labelled display axis, not an invented grant total. |

Example only: a$100 purchase, current funds$69.79, monthly cap$90 and monthly spend$35.66 leave$54.34 of cap headroom. The$69.79 funds and$54.34 headroom describe different constraints.

Verified zero/negative money preserves its sign; missing expiry remains unknown. Funds or extra-usage enablement do not prove the next debit source. No automatic purchase, auto-top-up configuration or plan change is performed.

### 7. Details: graph reports, CSV and printing

1. Open Usage report from the top header. It uses a separate reusable tab.
2. Choose one service and pool; weekly and session allowances are not additive.
3. Hover or focus trend points for time/value; switch used or remaining display.
4. Choose daily, Monday-weekly or monthly grouping in Japan time.
5. Use Refresh observations to explicitly rebuild the report; it does not continuously reaggregate.
6. Expand the table or save summary/log CSV and print/PDF. Review private history before sharing.

Observed decrease in pp is the net percentage-point drop between eligible consecutive observations. Remaining80%→70% is10pp, not tokens, requests, cost or total period consumption. Long intervals, calendar boundaries, different units and increases are not interpolated; — means unknown.

Trend: latest600 samples; bars: latest60 periods; table/print: up to300 summary rows. CSV includes all eligible model rows. Model caps are10,000 observations/window and50,000 total, with explicit exclusions/truncation. Closing releases report state and chart DOM.

> Logs mainly record changed values. Missing time does not prove inactivity or downtime. An unsupported history report is separate from live-card acquisition status.

Prototype: Preview quota JSON for Gateway in this report, then explicitly save it locally. Covers source-checked ChatGPT/Claude/Gemini subscription observations only; partial inventory, unverified accounts and unknown reset evidence. Old/unverified observations are not current capacity. The JSON is advisory, not automatic transfer or execution/spending permission.

### 8. Details: tasks, favorites and work notes

Separate ChatGPT, Claude and Gemini task views include search/status filters, expand/collapse, tree copy, Auto ON/OFF, refresh, JSON import, demo and clear. Rendered metadata lists are partial, not account-wide completeness. Imported/demo lists are not live execution evidence.

| Feature | Use |
| --- | --- |
| ☆ / ★ favorites | Save links locally. Unfavoriting does not delete note text or change official pins. |
| Reorder handle | Drag or use up/down keys. |
| Edit / work notes | Save purpose, situation, next work, waiting items, resume notes and checklists. |
| Workspace | A user-chosen label, not verified provider identity. |
| Handoff copy / JSON | Explicit export/import without automatic cloud sharing. |
| Status marks | Observed response/explicit states; idle, unread or merged does not prove completion. |
| Other work notes | Find notes removed from favorites or current lists. |

Register work note is available on supported ChatGPT/dots, Claude, Gemini and Muse routes. It transfers a validated link/short title; save explicitly in the editor. Conversation bodies and drafts are not automatically captured. Note support is separate from automatic task-list support.

Optional local Codex tasks use a separate helper. Obtain the current extension-ID-specific installer from Setup → Codex, follow the guide and check connection. Do not load it as an extension. macOS instructions and a Linux implementation exist; the Windows helper is unsupported. Unknown metadata is not inferred running/completed.

[Detailed task guide](https://llmsmonitor.ntus.org/docs/TASK_DETAILS.md)

[Codex helper guide](https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md)

⋮⋮ is a drag handle; ☆/★ toggles favorites. The Codex helper targets macOS/Linux and needs Python 3.9+ and a discoverable Codex binary. Windows installation is unsupported.

[ヘルパー導入ガイド / Helper guide](https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md)

[汎用ヘルパーZIP（初回ID入力） / Generic helper ZIP (ID required)](https://llmsmonitor.ntus.org/LLMs-Monitor-Codex-Helper-v1.30.2.zip)

### 9. Details: incidents and public updates

Click the compact incident label for details. Supported official incident feeds are separate from low quota and sign-out. Grok/Muse provide official status/support links; this does not claim a live incident feed for every service.

Tibo public checks are standard alongside ChatGPT, after the initial optional X permission. An owned public-profile tab is reused about every15 minutes for eligible rendered posts. Login restrictions and unrendered items prevent guaranteed newest-post coverage. Check publication/read times and source. ClaudeDevs reading is independently optional.

New/read/hide/restore are browser-local presentation. Reading never deletes or reacts to X posts. The first acquisition baseline is silent.

Move the information bar by its handle or arrow keys; Home restores its dock. Source opens the original, > advances, and Setup opens reader settings. It is independent of the advice toggle.

The AI tool directory links to comparison/evaluation/development sites. Ranking is editorial; the directory is hidden in fullscreen. External services retain their own account, price and terms.

[Tiboの公開プロフィール / Tibo public profile](https://x.com/thsottiaux)

### 10. Details: settings, connections and windows

| Location | Controls |
| --- | --- |
| Header | Team, Support, Usage report, About, Setup, local-storage explanation and language. |
| Display toolbar | Service task windows, PiP, popup, theme, fullscreen, advice, used/remaining, sound, volume and refresh. |
| Setup display | Show/hide services and move order. Hidden enabled readers/history continue. |
| In-page panels | Supported provider panels, position and opacity subject to browser constraints. |
| API / additional services | Grant/revoke optional readers in extension-owned settings when a permission prompt is needed. |
| Connection/sign-in | Official login, retry, the relevant reader settings and help. |

Always-on-top uses supported Document Picture-in-Picture, otherwise a normal popup. A normal popup is not OS-wide always-on-top; browser-owned window chrome cannot be replaced.

Language/theme propagate across supported monitor, floating and task views. Reports deliberately retain a stable snapshot; Refresh observations also reads the current language/theme. New permissions require a user action.

### 11. Details: team, Gateway and PMO

**Local Gateway connection MVP:** open Gateway connection in the header, select the services to share (none by default), then start linking. Enter the Monitor code in the separate Gateway confirmation screen and approve the selected services there. Approval remains until you disconnect; short communication sessions renew automatically without an hourly prompt. The older one-hour mode needs one new approval to switch to this duration. Return to Monitor and confirm. Only selected subscription quotas, original observation times and availability are shared on this computer. Disconnect stops local sending, including a pending attempt, without deleting Monitor history. Claude continuity compares the initial subscription organization; it does not verify the API billing account. ChatGPT/Gemini account matching remains unsupported. Conversations, credentials, monetary balances and history are excluded. API execution and spending stay disabled. Local Gateway installation and explicit permission/approval are separate prerequisites; live acceptance is recorded separately.


Team: disconnected is not a monitor failure. This optional view imports a locally produced status JSON from an existing ai-bus and shows self-reported capacity/freshness. Missing/stale reports are unconfirmed, not live execution, completion or official quota proof. Import/update/clear are explicit local actions.

Muse Bus/answer reset times are reference-only. Copying a question does not send it. They do not overwrite official quota, history, recovery audio or spending decisions.

| Product | Responsibility and stage |
| --- | --- |
| LLMs Monitor | Resource observations, trends and evidence quality; graph reports implemented. |
| LLMs Gateway | Separate project designing candidate comparison using capabilities, routes, cost and headroom. |
| LLMs PMO | Separate project organizing company/project/ticket objectives, priorities and next actions. |
| API / LLMs Bus | Read-only contract and offline adapter proposals; authenticated automatic delivery/allocation is not provided. |

A percentage point is not a universal work unit. Observation count is not request frequency. Future analysis must match plan/model/task class and execution evidence. Credit transfer, shared API keys and automatic spending permission are not offered.

[Team instructions](https://llmsmonitor.ntus.org/docs/TEAM_STATUS.md)

### 12. Details: memory saving and operating conditions

Report aggregation/charts load only after explicitly opening the separate tab. The main page does not load the report engine or an external chart library. Detail tables are lazy; no continuous reaggregation is added. History is not deleted to save memory.

Chrome Maximum Memory Saver can quickly deactivate background tabs. DOM-based readers such as Muse and billing pages may be delayed. Energy Saver can also affect eligible background tabs; uninterrupted updating is not guaranteed.

If updates stall, check age, reason and official login. You may choose to exempt only the monitor/required acquisition sites in Always keep these sites active, trading memory for continuity. Global memory saving need not be disabled, and the app does not change this setting for you.

For IME/slow-input symptoms, compare identical conditions and tab counts with/without the monitor. Other extensions, network and sleep also matter. No whole-Chrome savings percentage or causal attribution is claimed.

[Chrome performance help](https://support.google.com/chrome/answer/12929150?hl=en)

### 13. Details: troubleshooting and support

| Symptom | Check in this order |
| --- | --- |
| Unavailable / paused / sign-in | Same browser profile and correct account → enabled reader and permission → official sign-in → Refresh now. |
| Old or temporarily missing values | Observation age/reason → official page fully rendered → browser suspension/sleep. Retained observations are labelled previous. |
| Unclear button response | Read nearby busy/waiting/completed/failure feedback; avoid repeated clicks during a long action. |
| Billing opened, no API amount | Distinguish subscription/API billing, account, optional access and adapter coverage; do not buy funds to troubleshoot. |
| Version mismatch | Same loaded folder → reload extension → reload monitor. Updated files and loaded runtime differ. |
| Work-note registration failed | Save drafts, safely reload the supported conversation, then register again. Old pages may retain an outdated reader. |
| Missing notes/favorites | Service, workspace, site origin, browser profile and Other work notes. |
| Old Tibo posts | X access, login, last read and rendered-post limits; a successful read is not newest-post coverage. |

1. Open Support; select only the optional fixed diagnostic fields, unchecked by default.
2. Preview and save the local draft; it is not sent.
3. Add expected/actual behavior, minimal reproduction and frequency.
4. Crop/redact any screenshot yourself and choose a suitable destination only after reviewing its audience.

> GitHub Issues is public. Do not post keys, cookies, auth URLs, account/org IDs, balances, bills, conversations, private Bus contents or raw usage CSV. Automatic redaction, attachments and submission are not provided.

[Support instructions](https://llmsmonitor.ntus.org/docs/SUPPORT.md)

### 14. Details: storage and privacy

| Data | Storage/transfer |
| --- | --- |
| Usage/history/settings | Current extension storage; no automatic operator-server upload. |
| Notes/favorites/read-state/imports | May be site-origin/profile local; not automatic cross-device or cross-origin sync. |
| Automatic task lists | In-memory metadata, separate from explicitly saved work notes. |
| CSV/JSON/support draft | Local download only on an explicit click; review before sharing. |
| Official-service communication | Network is used for provider/status reads; local storage does not mean offline-only communication. |

No provider password or API key is entered into this monitor for analysis. Gateway API-key setup is a separate product concern. Sign in on official services. Export important notes before clearing storage, uninstalling, or changing device, origin or profile.

[Privacy policy](https://github.com/ntus/LLMs-Monitor/blob/main/privacy.html)

### 15. Details: updates, backup and rollback

1. Check the current UI/runtime versions and loaded folder; export important work notes.
2. Update the same LLMs-Monitor folder. Avoid uninstalling or creating a new sibling folder every time.
3. The Mac updater registers the existing folder once, then validates and backs up updates. Unchanged helpers/updaters need no reinstall.
4. Reload the extension and monitor, then check versions and acquisition. Do not reload working conversations just to update the dashboard.
5. Use the updater rollback procedure if needed. Code backups are separate from migrating browser-stored user data.

ZIP, loaded runtime, Web UI, GitHub and browser stores update independently. A build is not store approval or general availability. Follow OS instructions for the unsigned/unnotarized updater; do not globally disable security protections.

[Mac updater and rollback](https://llmsmonitor.ntus.org/docs/MAC_UPDATER.md)

### 16. A five-minute customer demonstration

1. 30 seconds: explain the unified view of headroom, resets and separate credit constraints.
2. 1 minute: switch used/remaining; distinguish weekly/session pools and unavailable/zero.
3. 1 minute: distinguish subscription quota/API funds and monthly cap/purchased balance.
4. 1 minute: switch report service/period, show trends, observed decreases and CSV. Review the scope before showing personal usage to others.
5. 1 minute: use a demo or shareable task to show favorites, a next-action note and a small window.
6. 30 seconds: state the beta coverage and staged Gateway/PMO integration.

The present value is resource visibility and continuity of work. Do not present universal monitoring, automatic optimal routing, quota transfer or automatic API-spending approval as completed features.

### 17. Feature index and further guides

This guide covers the main dashboard, plans, used/remaining, weekly/session pools, resets, credit lanes, history, charts, CSV/print, sound, advice, incidents, public updates, popup/PiP/fullscreen, languages/themes, panels, visibility/order, connection, task lists/states/search, favorites, notes/handoff/JSON, Codex helper, team, Muse reference times, Gateway reference export, support, privacy and updates/rollback.

API setup also provides an explicit Claude API reference-JSON export prototype for Gateway. It preserves observation/expiry/unknown information; it is not automatic delivery or spending permission.

[Download the complete guide (Markdown)](https://github.com/ntus/LLMs-Monitor/blob/main/docs/USER_GUIDE.md)

[Changes](https://github.com/ntus/LLMs-Monitor/blob/main/docs/CHANGELOG.md)

[Team instructions](https://github.com/ntus/LLMs-Monitor/blob/main/docs/TEAM_STATUS.md)

[Support](https://github.com/ntus/LLMs-Monitor/blob/main/docs/SUPPORT.md)

[Open the monitor](https://github.com/ntus/LLMs-Monitor/blob/main/.)


<a id="ja"></a>

## 日本語

最初の3章で全体像と基本操作をつかみ、後半は必要な機能の詳細を調べるときに使ってください。

### 1. はじめに：3分でつかむ全体像

LLMsモニターは、複数のAIの利用枠・リセット予定・クレジットをまとめ、作業を続けるための判断を助けるブラウザー用ツールです。各社の公式画面を毎回見比べる手間を減らし、変化履歴や作業メモも一緒に確認できます。

| 知りたいこと | 使う機能 |
| --- | --- |
| 今どのAIに余力がある？ | メイン画面の円・横バー・プラン名 |
| いつ枠が戻る？ | リセット日時と残り時間。想定と確定を区別 |
| お金の残高は？ | サブスク枠とは別のクレジット欄 |
| どう使ってきた？ | 変化履歴とグラフの利用状況レポート |
| 作業の続きを忘れたくない | タスク詳細・お気に入り・作業メモ |
| チームでどう役割を分ける？ | 任意のチーム状況。自動割当は今後の連携構想 |

仕組みは「公式サービス → 同じブラウザーの拡張機能 → モニター画面」です。基本機能に外部AIのAPIキーは不要です。LLMs GatewayやLLMs PMOを導入しなくても利用できます。

> v1.132.0のβ機能を説明します。本番サイトは https://llmsmonitor.ntus.org/ です。各社のログイン状態・契約・画面形式によって取得できる項目が異なります。「—」は未取得で、0や無制限という意味ではありません。

v1.132.0の追加機能：OpenAI APIクレジットは、取得できた次回失効日と対象金額を分けて表示します。複数の付与枠にはそれぞれ異なる期限があります。利用状況レポートは日本時間の日別・時間帯別表示に対応し、空白は観測がない区間です。ClaudeのFableリセット権は公式の有効期限と利用可能状態を表示します。Gateway連携は解除まで承認を維持でき、「Gatewayを開く」で導入済みのローカル画面を開きます。公式ニュースは許可と表示済み公開投稿に依存し、サーバーでの一括自動収集は設定準備中です。

### 2. はじめに：最初の接続

1. デスクトップ版ChromeまたはEdgeを使い、利用するAIの公式サイトに同じプロファイルでログインします。
2. 案内された配布ZIPを保存・展開し、LLMs-Monitorフォルダーを今後も使う場所へ置きます。
3. ストア公開前は拡張機能管理画面でデベロッパーモードをONにし、「パッケージ化されていない拡張機能を読み込む」でmanifest.jsonのあるフォルダーを選びます。ZIP自体は指定しません。
4. モニターを開きます。Web版はセットアップで現在の拡張機能ID（英小文字32文字）を登録します。IDは秘密のAPIキーとは別です。
5. セットアップで表示サービス・順序と必要な任意読取りを設定します。アクセス許可は対象を確認して許可します。
6. 表示された取得日時とプラン・値を確認します。初回のログイン・描画には時間がかかることがあります。

通常の残量確認だけならCodexヘルパーは不要です。ヘルパーは端末内のCodexタスクを表示する追加機能で、拡張機能とは別に導入します。

> ブラウザーを起動している間の監視です。パソコンのスリープ中・ブラウザー終了中の連続取得は保証しません。

> Chrome／Edgeのデスクトップ版が対象です。iOS／Androidではこの拡張機能を導入できません。

[拡張機能ZIP / Extension ZIP](https://llmsmonitor.ntus.org/LLMs-Monitor.zip)

### 3. はじめに：毎日の使い方

1. 最初に「表示：使用量」か「表示：残量」かを確認します。使用量90%と残量90%は意味が逆です。
2. 週間枠と現在のセッション枠を別々に見て、取得日時が古くないか確認します。
3. 上限が近い場合はリセット予定や別のサービスを確認します。追加クレジットの購入や契約変更をアプリが自動で行うことはありません。
4. 作業を中断する前に、タスク詳細から目的・状況・次の一手をメモします。
5. 振り返りには上部の「利用状況レポート」を開き、日別・週別・月別で推移を確認します。

### 4. 詳細：画面・表示・通知の見方

| 表示・操作 | 意味 |
| --- | --- |
| 円・横バー | 実際に取得した枠を表示。週間を先に並べます。セッション枠がなければ内側の円は作りません。 |
| 使用量／残量 | 初期表示は使用量。切替は見た目だけで、保存履歴や警告の基準は変えません。 |
| 取得済み・更新待ち・ログイン案内 | 取得状態を表します。前回値と現在の確認済み値を区別します。 |
| 取得からの経過時間 | 最後の観測からの時間。5分以上経過した取得時刻表示は赤で注意を促します。 |
| 赤色の交互表示 | 残量5%以下で対応する円・横バー・％を強調。使用量表示なら95%以上に相当します。 |
| 緑の残り時間 | 確認できたリセットが近いことの案内。危険・障害を意味しません。 |
| ⚠︎・ⓘ・？ | 残高不足や期限、情報の意味を説明します。マウスを置く、または対応する説明操作で確認します。 |
| 長い補足文 | 1行でスクロールし、ツールチップで全文を確認できます。 |
| タスク詳細／API連携／利用状況 | 各サービスの該当画面へ。灰色のボタンは未対応や利用できない状態です。 |

通知音はON/OFFと音量を調整できます。取得した整数％の変化、対応する低残量・回復を知らせます。残量1%は短い3音、0%は長めの3音で区別します。ブラウザーが音を許可するため、初回に操作が必要なことがあります。OFFでは保留中の音も停止します。API残高の増減をサブスク枠の回復と扱いません。

「アドバイス」は履歴に基づく目安です。十分な観測がなければ判定を控えます。価格・品質・用途を含む絶対的な最適プランを保証する機能ではありません。

### 5. 詳細：サービスごとの対応範囲

| サービス | 確認する項目 | 注意点 |
| --- | --- | --- |
| ChatGPT / dots | 取得可能なWork/Codex枠、確認できたPro 200等のプラン詳細、リセット権、別のOpenAI API残高 | 通常Chatの全残量やdots独立の利用枠は取得しません。$200の特典案内だけで付与済み残高とはしません。 |
| Claude | 実在する週間・セッション枠、Ultra等のプラン、月間追加使用枠と購入済み残高、API残高・プロモーション | 週のみのプランは円1本。過去セッション履歴と月間追加使用枠は別です。 |
| Gemini | 対応する使用量・週間枠・Google AIプラン | アプリ使用率とGemini API残高は別。決済埋め込み画面の残高取得は未完了です。 |
| Grok / Cursor | 対応する公式週間使用率・プラン、独立したAPI残高 | 名称併記だけで全製品・アカウントの枠共通を保証しません。Botの独立取得ではありません。 |
| Muse | 一般設定の利用状況、Free Plan／Power／Maximum等の確認済みプラン、追加トークン、履歴 | ログインが必要。正確なリセット時刻は未取得の場合があります。 |
| Copilot | 対応画面の契約・プラン名と明示されたカウンター | 個人用と職場用を混ぜません。M365 Copilot (Basic)プランの実機確認あり。存在しない数値を0とはしません。 |
| DeepSeek / Perplexity / Genspark | 任意の限定読取りによる契約・残高等 | 試験対応です。全プラン・全残高の正式対応や履歴レポートは未完了です。 |

取得頻度は公式使用量・障害情報がおおむね1分周期です。各社の集計遅延、認証、Chromeの休止、画面の読み込みによって遅れることがあります。取得用タブは再利用し、不要なウィンドウを自動で増やす設計にはしません。

### 6. 詳細：クレジットと支出上限を混同しない

| 項目 | 何を表すか |
| --- | --- |
| サブスク利用枠 | 週間・セッション等の使用率／残量。金額ではありません。 |
| リセット権 | 公式に確認できた利用権・期限。自動行使はしません。 |
| 月間追加使用枠（USD） | 今月の使用額・設定上限・上限までの残り。購入済み残高とは別です。 |
| 購入済み使用クレジット残高 | 実際に確認できた利用可能残高。月間予算から逆算しません。 |
| クラウドセッションクレジット | 表示根拠のある別枠。残り0の警告はその残高に対するもので、すべてのClaude利用停止を意味しません。 |
| APIクレジット残高 | API専用の金額。ChatGPT・Claude等のサブスク利用枠とは別です。 |
| プロモーションクレジット | 対象条件・期限付きの別残高。複数付与時は合計と各付与の金額・期限を区別します。 |
| 横バー | 確認済み総額に対する比率、または明記された金額の表示目盛です。「表示目盛」を付与総額と読み替えません。 |

例：購入時$100、現在の購入残高$69.79、今月の上限$90、今月の使用額$35.66なら、上限までの残りは$54.34です。購入残高$69.79と$54.34は別の意味なので両方を見ます。数値は説明用です。実際の画面値を優先してください。

公式に取得した0や負の残高は、その符号を保って表示します。期限が取得できなければ未確認です。残高があること、追加使用がONであることだけで、次の処理にどのクレジットが充当されるかは保証しません。アプリから自動購入・自動チャージ設定・契約変更は行いません。

### 7. 詳細：グラフレポート・CSV・印刷

1. 上部の「利用状況レポート」を押すと別タブが開きます。開いているレポートは再利用します。
2. 「サービスと利用枠」で比較対象を選びます。週間とセッションなど、別枠を合算しません。
3. 推移グラフの点にマウスを置くかTabキーで、観測日時と数値を確認します。使用率／残量を切り替えられます。
4. 日別・週別（月曜始まり）・月別を選んで、期間ごとの観測減少を見ます。日本時間で集計します。
5. 「最新の履歴を反映」は明示的に集計を更新します。開いているだけで常時再集計はしません。
6. 必要に応じて「数値を表で確認」、集計CSV、ログCSV、印刷／PDFを使います。共有前に内容を確認してください。

「観測減少pp」は、比較できる連続観測間で減った割合のポイント差です。例えば残量80%→70%は10ppです。総トークン数・利用回数・料金・期間の全消費量ではありません。長い観測間隔・日付境界・異なる単位・枠の増加を勝手に補間しません。「—」は不明です。

折れ線は直近600観測、棒グラフは直近60期間、詳細表・印刷は最大300集計行です。CSVは集計対象の全行を出します。集計自体には1枠10,000件・全体50,000観測の上限があり、除外・上限に達した場合は案内します。レポートを閉じると、その集計・描画のための状態を解放します。

> 履歴は主に数値が変化したときの記録です。記録がない時間を「未使用」「停止」と扱いません。「履歴レポート未対応」はメインの取得失敗とは別の対応状況です。

試作：レポート内の「Gateway向け利用枠JSONを確認」から、ChatGPT・Claude・Geminiの購読枠をプレビューし、確認後に端末へ保存できます。一覧は部分的、アカウントは未照合、リセット根拠は未確認です。古い値や取得元を確認できない値は現在値として渡しません。保存したJSONは参考情報で、自動送信や実行・支出許可ではありません。

### 8. 詳細：タスク・お気に入り・作業メモ

タスク詳細はChatGPT・Claude・Geminiのサービス別画面です。検索・状態での絞込み、全展開／折畳み、ツリーコピー、自動ON/OFF、一覧更新、JSON読込み、サンプル、消去があります。自動取得は表示されたメタ情報の部分一覧で、全アカウントの全件を保証しません。サンプル・JSON読込みは実稼働の証明ではありません。

| 操作・表示 | 使い方 |
| --- | --- |
| ☆／★のお気に入り | ローカルにリンクを保存。解除してもメモ本文は削除しません。公式のピン留めとは別です。 |
| 並び替えハンドル | ドラッグまたは上下キーでお気に入りの順序を調整します。 |
| 編集／作業メモ | 目的、現在の状況、次の作業、確認待ち、再開時の注意、チェックリストを保存します。 |
| 作業領域 | 自分で付ける整理ラベルです。公式アカウントの確認済み識別ではありません。 |
| 引継ぎ文コピー／JSON | 利用者の操作で書出し・読込み。自動クラウド共有はしません。 |
| 状態マーク | 観測した応答状態・明示状態を表示。待機・未読・PRマージだけで作業完了とはしません。 |
| その他の作業メモ | お気に入りを解除したメモや一覧から外れたメモも確認できます。 |

対応する公式会話ページの「作業メモへ登録」も使えます。ChatGPT/dots・Claude・Gemini・Museの対応経路では、検証した会話リンクと短いタイトルを渡し、編集画面で保存を押して記録します。本文や入力中の文章を自動で取り込む機能ではありません。Muse等のメモ対応と自動タスク一覧対応は別です。

端末内のCodexタスクには任意の専用ヘルパーを使います。セットアップのCodexから現在の拡張機能ID用の導入ZIPを保存し、手順に従って接続を確認します。ヘルパーをChrome拡張として読み込みません。macOSの導入手順とLinuxの実装があり、Windowsヘルパーは未対応です。状態未確認を稼働・完了と推測しません。

[タスクの詳しい手順](https://llmsmonitor.ntus.org/docs/TASK_DETAILS.md)

[Codexヘルパー導入手順](https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md)

⋮⋮は移動用のハンドル、☆／★はお気に入りです。CodexヘルパーはmacOS／Linux向けでPython 3.9以上とCodex実行環境が必要です。Windows導入は未対応です。

[ヘルパー導入ガイド / Helper guide](https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md)

[汎用ヘルパーZIP（初回ID入力） / Generic helper ZIP (ID required)](https://llmsmonitor.ntus.org/LLMs-Monitor-Codex-Helper-v1.30.2.zip)

### 9. 詳細：障害情報・Tibo・公開更新

サービス名の近くの障害表示を押すと詳細を確認できます。公式フィードに対応するサービスの障害と、残量不足・ログイン切れは別です。Grok・Museには公式ステータス／問い合わせへのリンクがあり、全社共通の自動障害監視が実装済みという意味ではありません。

ChatGPT接続時はTiboの公開情報も標準で確認する設計です。初回にXの読取り許可が必要です。公開プロフィールの取得用タブを再利用し、約15分間隔で表示済みの対象投稿を確認します。ログイン制限や未描画の投稿があるため、Xの全新着を保証しません。投稿日・確認日時・出典を確認してください。ClaudeDevsの公開読取りは独立した任意設定です。

取得できた投稿の新着表示・既読／非表示・再表示はブラウザー内の整理です。投稿を読むだけで他者の投稿を削除したり、Xへ反応を送ったりしません。初回の基準取得は無音です。

下部の公開情報バーはハンドルで移動でき、矢印キーで調整、Homeキーで元の位置へ戻せます。「出典」から原文、「>」から次の記事、設定から読取り設定を確認できます。アドバイスのON/OFFとは別に扱います。

「各種AIツール」は比較・評価・開発サイトへのリンク集です。順位は編集上の目安です。全画面表示では非表示になります。リンク先サービスのアカウント・料金・条件はそれぞれに従います。

[Tiboの公開プロフィール / Tibo public profile](https://x.com/thsottiaux)

### 10. 詳細：表示設定・接続・小窓

| 場所 | 設定・操作 |
| --- | --- |
| ヘッダー | チーム、サポート、利用状況レポート、製品紹介、セットアップ、保存範囲の説明、日英切替。 |
| 表示ツールバー | サービス別タスク、最前面の小窓、通常の小窓、標準／ダーク、フルスクリーン、アドバイス、使用量／残量、通知音、音量、今すぐ更新。 |
| セットアップの表示 | サービスの表示／非表示、上下移動による順序。非表示でも有効な読取り・履歴は続きます。 |
| パネル設定 | 対応するAIサイト内のパネル、位置・不透明度等。画面やブラウザーによる制約があります。 |
| API・追加サービス | 対象サービスの任意読取りを許可・解除。許可確認が必要な操作は拡張機能の設定画面で行います。 |
| 接続・ログイン確認 | カードの案内から公式ログイン、再取得、対象の読取り設定、接続方法へ進みます。 |

最前面の小窓は対応ブラウザーのDocument Picture-in-Pictureを使います。未対応時は通常小窓になります。通常小窓はOS全体で常に最前面になる機能ではありません。ブラウザー固有のタイトル・枠はアプリでは置き換えられません。

表示言語・テーマ等は対応するメイン・小窓・タスク画面で反映します。レポートは安定した集計のため開いた時点のスナップショットを使い、「最新の履歴を反映」で現在の言語・テーマも取り込みます。新しいアクセス許可は利用者の操作が必要です。

### 11. 詳細：チーム・Gateway・PMOとの関係

**この端末のGateway連携（MVP）**

一度承認すれば、解除するまで自動接続を維持します。短期セッションは自動更新するため、毎時の再入力は不要です。旧1時間方式からの移行時だけ、継続期間を明記した別画面で一度承認してください。ブラウザー停止・休止中は取得が止まり、再開後も元の取得日時で鮮度を判断します。

1. メイン画面の「Gateway連携」を押します。専用の拡張設定が開きます。
2. Gatewayのローカル連携を導入した同じ端末・ブラウザープロファイルで、共有するサービスを選びます。初期状態は共有なしです。
3. 「この端末で連携を開始」を押し、必要なブラウザー権限を確認します。別に開くGateway確認画面へMonitorの6桁を入力し、対象サービスと「解除するまで維持」を確認して承認します。
4. Monitor側で「確認して連携」を押します。取得結果が変わると、選択したサービスの購読枠・観測日時・状態だけを自動共有します。
5. 「連携を解除・共有を停止」で止められます。解除通知が届かない場合もローカル送信は停止します。Monitorの履歴や設定は削除しません。

Claudeの「初回確認の利用枠と一致」は、初回に確認した購読組織から変わっていないことです。APIの請求組織との一致ではありません。変更を検知したら再確認して連携し直します。ChatGPT・Geminiで照合根拠が取れない場合は未対応／未確認のまま表示します。会話・認証情報・金銭残高・履歴は共有しません。API実行・課金・余った枠の譲渡は許可されません。

「Gatewayに接続できません」はブラウザー権限だけで解決するとは限りません。Gatewayのローカル連携の導入と起動、同じ端末利用者・プロファイルかを確認してください。通常のMonitor単体利用は連携なしでも動きます。初期MVPの導入・実機受入状況はリリース記録で区別します。

「チーム：未接続」は基本モニターの故障ではありません。既存のai-busから別途ローカル出力した状態JSONを読み込み、自己申告の余力と鮮度を確認する任意機能です。欠けた情報や古い申告は未確認とし、作業の完了・実稼働・残量の公式証明には使いません。読込み・更新・ローカル消去の操作があります。

Museの「Bus参考日時」や回答日時の反映は参考情報です。質問文をコピーしてもMuseへ自動送信しません。公式残量・履歴・回復音・課金判断を上書きしません。

| 製品 | 役割と現在の段階 |
| --- | --- |
| LLMs Monitor | 各社の観測値・残量推移・情報の確かさを提供。グラフレポートは実装済み。 |
| LLMs Gateway | 依頼に必要な能力・利用可能経路・費用・余力を合わせて候補を比較する連携を設計中。 |
| LLMs PMO | 会社・プロジェクト・チケットの目的と優先順位、次の行動を整理する別製品。 |
| 連携API／LLMs Bus | この端末のGatewayへの購読枠参考共有はMVP。全サービス・遠隔の自動配達・自動割当は未提供。 |

各社の1%は同じ処理容量ではありません。観測回数を利用回数と読み替えず、プラン・モデル・用途・実行結果が照合できる範囲で今後の分析に使います。余ったクレジットの譲渡、APIキー共有、課金許可の自動化は提供しません。

[チームの操作手順](https://llmsmonitor.ntus.org/docs/TEAM_STATUS.md)

### 12. 詳細：省メモリ設定と動作条件

グラフの集計・描画は別タブを明示的に開いたときだけ行い、メイン画面には集計エンジンや外部グラフライブラリーを読み込みません。詳細表は開いたときに作り、レポートは常時再集計しません。保存履歴を削って軽くする方式ではありません。

Chromeのメモリセーバー「最大」は裏タブを短時間で休止させます。公式画面の描画が必要なMuseや請求画面等は更新が遅れることがあります。省エネモードも対象の背景タブ処理に影響します。現行設定で常に連続更新できるとは保証しません。

更新が止まる場合は取得時刻・理由と公式ログインを確認します。必要なら、利用者の判断でモニターや取得に必要な対象サイトだけを「常にアクティブにするサイト」へ追加できます。全サイトの省メモリをOFFにする必要はありません。ただし例外分のメモリ消費は増えます。アプリから勝手に設定を変えません。

日本語入力が重いなどの症状は、同じ条件・タブ数でモニターを閉じた場合と比較します。ブラウザー全体の負荷、他の拡張機能、通信、スリープも切り分けます。Chrome全体のメモリ削減率や入力停止の原因は本ガイドでは断定しません。

[Chrome公式：パフォーマンス設定](https://support.google.com/chrome/answer/12929150?hl=ja)

### 13. 詳細：困ったとき・サポート

| 症状 | 順に確認すること |
| --- | --- |
| —・取得停止・ログイン案内 | 同じブラウザープロファイルと正しいアカウント → 対象読取りの有効・許可 → 公式ログイン → 今すぐ更新。 |
| 数値が古い／勝手に未取得へ | 取得日時・理由 → 公式ページの読込完了 → Chrome休止やスリープ。前回値は現在値と区別します。 |
| ボタンを押しても分からない | ボタン付近の処理中・応答待ち・完了／失敗を確認。長い処理を連打せず待ちます。 |
| 請求画面を見ても残高がない | サブスク画面とAPI請求画面の違い、対象アカウント、任意権限、読取対応状況を確認。購入して解決を試みません。 |
| 画面と拡張の版が違う | 更新先が同じフォルダーか確認 → 拡張機能を再読み込み → モニターを再読み込み。ファイル更新と実行時反映は別です。 |
| メモ登録が失敗 | 作業中の入力を保存してから対応会話を安全に再読み込みし、再度登録。拡張機能更新後の古いページを確認します。 |
| お気に入り・メモが見つからない | サービス・作業領域・サイトURL・プロファイルと「その他の作業メモ」を確認します。 |
| Tiboの投稿が古い | X読取り許可・ログイン・取得時刻・表示済み投稿の制約を確認。最新取得の保証とは別です。 |

1. 上部の「サポート」で必要な定型診断項目だけ選びます。初期選択はOFFです。
2. プレビューで内容を確かめ、端末へ下書きを保存します。この段階では送信されません。
3. 期待した動作・実際の動作・最小の再現手順・頻度を追記します。
4. 必要なスクリーンショットは手動で切取り・伏字し、公開可能か確認してから投稿先を選びます。

> GitHub Issuesは公開の場です。APIキー、Cookie、認証URL、アカウント／組織ID、残高・請求、会話本文、非公開Bus内容やそのままのCSVを貼らないでください。画像の自動伏字・自動添付・自動起票は未提供です。

[サポートの詳しい案内](https://llmsmonitor.ntus.org/docs/SUPPORT.md)

### 14. 詳細：保存範囲とプライバシー

| 情報 | 保存・受け渡し |
| --- | --- |
| 残量・変化履歴・設定 | 現在のブラウザー拡張機能の保存領域。通常の運営サーバー自動送信はしません。 |
| 作業メモ・お気に入り・既読・任意の読込み | 現在のサイトURL／プロファイルの保存領域にも依存。別端末・別URLへの自動同期ではありません。 |
| 自動タスク一覧 | 画面のメモリー上のメタ情報。明示保存する作業メモと別です。 |
| CSV・JSON・サポート下書き | 利用者が押したときだけ端末へ保存。共有は利用者が内容を確かめます。 |
| 公式サイトとの通信 | 公式セッションや公式障害情報の取得でネットワークを使います。「ローカル保存」は通信ゼロを意味しません。 |

本アプリの解析に各社のパスワード・APIキーを入力する必要はありません。APIキーを使うGateway等の別製品の設定と混同しないでください。公式ログイン画面の認証は公式サービスで行います。ブラウザーの保存領域を消去する、拡張機能を削除する、端末・URL・プロファイルを変える前に重要なメモをJSONで書き出してください。

[プライバシーポリシー](https://github.com/ntus/LLMs-Monitor/blob/main/privacy.html)

### 15. 詳細：更新・バックアップ・復元

1. 更新前に、現在の画面と拡張機能の版、読み込んでいるフォルダーを確認します。重要な作業メモは書き出します。
2. 更新は同じLLMs-Monitorフォルダーへ行います。アンインストールや毎回別名のフォルダーを増やす方法は避けます。
3. Mac更新アプリは初回に既存フォルダーを登録し、以後は検証とバックアップ付きで更新します。未変更のヘルパー・更新アプリを毎回入れ直す必要はありません。
4. 拡張機能とモニターの再読み込み後に版と取得状態を確認します。作業中の会話を更新のためだけに再読込しません。
5. 問題があれば更新アプリの復元手順で前のファイルへ戻します。コードのバックアップと、ブラウザーに保存した利用データの移行は別です。

配布ZIP、読み込み済み拡張機能、Web画面、GitHub、ブラウザーストアは別々に版が反映されます。ストア審査済み、一般公開済みという意味にはなりません。更新アプリの署名・公証やOSの案内は導入手順に従い、セキュリティ保護を一括で無効にしないでください。

[Mac更新・復元の詳細](https://llmsmonitor.ntus.org/docs/MAC_UPDATER.md)

### 16. お客様へ説明する5分の流れ

1. 30秒：複数AIの余力・リセット・費用枠を一画面で見る目的を説明します。
2. 1分：使用量と残量を切り替え、週間とセッション、未取得と0の違いを見せます。
3. 1分：サブスク枠とAPI残高、月間上限と購入残高が別であることを説明します。
4. 1分：利用状況レポートでサービスと期間を切り替え、推移・観測減少・CSVを紹介します。実データを他者へ見せるときは事前に範囲を確認します。
5. 1分：サンプルまたは公開可能な作業で、お気に入り・次の一手のメモ・小窓を見せます。
6. 30秒：現在のβ対応範囲と、Gateway／PMO連携は段階的な構想であることを説明します。

説明の要点：「残量の見える化」と「作業の続きの整理」をまず体験できます。すべてのLLMの完全監視、自動最適振分け、利用枠の譲渡、API課金の自動承認が完成したと説明しないでください。

### 17. 機能一覧と関連する詳しい資料

メイン表示／プラン／使用量・残量／週間・セッション／リセット／各種クレジット／変化履歴／グラフ／CSV・印刷／通知音／アドバイス／障害／公開更新／小窓・最前面・全画面／日英・テーマ／パネル／サービス選択・順序／接続／タスク一覧・状態・検索／お気に入り／メモ・引継ぎ・JSON／Codexヘルパー／チーム／Muse参考日時／Gateway参考書出し／サポート／プライバシー／更新・復元を、このガイドで扱っています。

API設定には、対応するClaude API参考情報を利用者の操作でJSON保存するGateway向け試作もあります。観測・期限・未確認を保持した参考値で、自動送信や支出許可ではありません。

[ダウンロードできる取扱説明書（Markdown）](https://github.com/ntus/LLMs-Monitor/blob/main/docs/USER_GUIDE.md)

[更新内容](https://github.com/ntus/LLMs-Monitor/blob/main/docs/CHANGELOG.md)

[チーム操作](https://github.com/ntus/LLMs-Monitor/blob/main/docs/TEAM_STATUS.md)

[サポート](https://github.com/ntus/LLMs-Monitor/blob/main/docs/SUPPORT.md)

[モニターを開く](https://github.com/ntus/LLMs-Monitor/blob/main/.)


## 日別・時間帯別に利用を確認する
［利用状況レポート］でサービスと利用枠を選ぶと、日付×0〜23時のヒートマップを確認できます。濃いマスは、その時間内に連続して観測できた減少が大きいことを示します。マスまたは［表示する日］を選ぶと、その日の0〜24時の推移を拡大します。灰色・空白は未観測や比較不能を含み、使用ゼロとは限りません。CSVには従来どおり全対象記録を保存できます。

## ClaudeのFableリセットと公式情報通知
FableリセットはFableが消費した週間枠だけを戻す権利で、週間枠全体のリセットやAPIクレジットではありません。公式使用量画面が既存タブで開かれていると、利用可否と有効期限を取得します。［対象使用量なし］は現時点で戻す対象がない状態です。Monitorがリセットを実行することはありません。新しい期限・権利や利用可能への変化は端末内で判定してポップアップ通知します。同一イベントは繰り返しません。OS側の通知許可・集中モードにより表示されない場合があります。未知の公式画面形式や未表示の情報すべての検知を保証するものではありません。
