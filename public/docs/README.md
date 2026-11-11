Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/README.md

# LLMs Monitor / LLMs モニター

[🌍 English](#en) · [🇯🇵 日本語](#ja) · [Quick start](#quick-start)

<a id="en"></a>

## English

**Guide updated 8 November 2026.** Guide for app/extension package **v1.119.0**. Check the loaded extension and site versions separately; updated files do not establish a reloaded Chrome runtime. Helper **v1.30.2** and updater **v1.0.1** are unchanged.

[Complete Web user guide](https://llmsmonitor.ntus.info/manual#en) · [Complete bilingual manual](https://github.com/ntus/LLMs-Monitor/blob/main/USER_GUIDE.md)

LLMs Monitor brings supported AI usage windows, reset times, separate API balances, change history and work notes into one browser dashboard. It works without LLMs Gateway or an ai-bus connection. Provider pages, plans and reporting delays determine which fields can be obtained; missing data stays **—**, never zero or unlimited.

[Monitor](https://llmsmonitor.ntus.info/) · [Product introduction](https://llmsmonitor.ntus.info/product.html) · [Changelog](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md) · [Roadmap](https://github.com/ntus/LLMs-Monitor/blob/main/docs/ROADMAP.md) · [Release checklist](https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md)

**Access and downloads:** the hosted beta currently has restricted access. The public GitHub main/package was last checked at v1.64.0 on 3 November; do not assume it matches the deployed beta. Public access, repository synchronization and browser-store publication are separate release gates. Do not announce general availability until those checks pass. Source visibility alone does not grant an open-source license; no license was established in this release preparation.

<a id="quick-start"></a>

## Quick start: first installation

1. Use desktop Chrome or Edge and sign in to the official AI services in the same browser profile. Mobile browsers are not supported by this installation flow.
2. Obtain the **verified release package** from the distribution specified in its release note. Extract `LLMs-Monitor.zip` once and keep the enclosed **LLMs-Monitor** folder in a permanent location.
3. Before store publication, open `chrome://extensions` or `edge://extensions`, enable Developer mode, choose **Load unpacked**, then select the folder containing `manifest.json`. Do not select the ZIP, the Codex helper or the Mac updater.
4. Open the extension's monitor. For the hosted companion, pair the current 32-letter extension ID in Setup. Pairing is origin-specific; avoid switching origins/profiles without exporting important work notes.
5. In Setup, choose visible services/order. Grant optional readers only for services you want, from the extension-owned controls. Hidden enabled services continue collecting history.
6. Keep the browser running. Normal usage/status refresh is approximately once per minute; provider delays, sleep, authentication and page rendering can postpone it.

## Updates and rollback

- **Keep the same loaded folder.** Do not uninstall, rename/move it or extract every update into a new sibling folder. Changing the path can change the ID and lose the connection to prior browser storage.
- On Mac, register the existing folder with the separate updater once. It verifies the package, retains a backup and updates in place. Use the restore app for rollback. See [Mac updater](https://github.com/ntus/LLMs-Monitor/blob/main/tools/mac-updater/README.md).
- For an approved manual update, replace that same folder, reload the extension on the browser extensions page, then reload the monitor. Do not reload unsaved conversations merely to update the dashboard.
- Settings/history live outside the code folder in browser storage. Work notes need their own export before clearing storage, changing profiles or removing the extension. Backups are not a cross-profile data migration.
- The Mac updater is unsigned/not notarized. Use normal per-app OS approval; never disable security protections. The helper/updater need not be reinstalled when their versions are unchanged.

## Reading and using the dashboard

| Area | Meaning / operation |
| --- | --- |
| Rings and bars | Weekly information first; an inner session ring exists only when that window was actually obtained. A single real window has one ring/bar. |
| Used / Remaining | Default is Used. Switching changes presentation, not stored observations, alerts or history. |
| Reset countdown | Confirmed times and explicitly labelled estimates are distinct. A scheduled time passing does not prove recovery. Date-only Muse resets have no invented exact time; imported Muse answers remain reference-only. |
| Low remaining | At remaining5% or less, corresponding ring/bar/percentage fade between the normal color and red. Forecasts are estimates, not provider facts. |
| Reset soon | Confirmed, fresh reset times within one hour use green emphasis; this is not a danger warning. |
| Sound | Optional local tones for displayed whole-percent changes and supported threshold/recovery events. Remaining1% and0% have distinct patterns. Credit-only changes do not become quota recovery. OFF cancels pending tones. |
| Credit lanes | Subscription quota, reset entitlement, monthly spending limit/headroom, purchased credits, cloud-session credits and API promotional balances are separate. An unknown expiry remains unknown. |
| Task details / API / Usage | Bottom actions open the relevant supported view. A disabled action is not implemented for that service. |
| Small windows / fullscreen | Explicit toolbar actions open normal or supported Document PiP views. Normal popups are not OS-wide always-on-top. Fullscreen keeps usage and history available. |
| History / reports | Changed observations are retained locally, up to10,000 per quota window. Reports offer daily/weekly/monthly grouping, summary/log CSV and print/PDF. Observed percentage-point decline is not total tokens, elapsed compute or billed money. Gaps and increases are not confirmed downtime/resets. |
| Public information | Incident badges open details. Public update bars can be moved; Home returns them. Overflow notes scroll and show full text. New/read/hide/restore applies to captured public posts, not unseen posts on X. |

## Service coverage and limits

| Service | Available in this beta | Limits / status |
| --- | --- | --- |
| ChatGPT / dots | Verified Work/Codex windows, supported plan details, reset entitlement, separate OpenAI API balance connection | Ordinary ChatGPT chat quota and a separate dots quota are not collected. Do not equate all products' allowances. |
| Claude | Available actual windows including weekly-only topology, observed Ultra plan, separate monthly cap/headroom and purchased balances; API purchased/promotional lanes | API organization and ambiguous/zero evidence are checked. Extra usage enabled does not by itself prove payable funds or the current debit source. |
| Gemini | Supported app usage windows and Google AI plan | Gemini API balance is separate. Embedded payments-frame collection remains incomplete;0% app usage does not mean an API balance of zero. |
| Grok / Cursor | Optional supported official weekly usage and plan, separate API-balance reader | Display naming does not merge accounts or prove Cursor/Grok/Bot share one allowance. Date-only reset times are labelled estimates. v1.97 corrects main/small-window headings. |
| Muse | Optional bounded General/Usage reader, native tokens when shown, local history and reference-time import | Requires sign-in. Exact reset may be unavailable. No automatic question sending or authenticated Bus connection. |
| Copilot | Optional supported subscription/plan metadata, validated explicitly displayed counters | M365 Copilot (Basic) plan was verified; full personal/work numeric coverage is not established. No counter means unavailable. |
| DeepSeek / Perplexity / Genspark | Experimental optional readers for bounded labelled official-account cards | Complete plan/quota/credit/API coverage and live account acceptance remain pending. No automatic account-page navigation. |

Optional host permissions are requested through your click. No new host permission was added in v1.96; do not grant broader payment access by implication of the Gemini row. Provider interfaces and undocumented session endpoints can change. Existing OpenAI/Grok/Muse acquisition reuses owned background tabs; closing or adopting them may pause collection. Try **Refresh now**, check login and read the displayed reason rather than repeatedly opening new windows.

## Tasks, work notes and optional Codex helper

Task lists support ChatGPT, Claude and Gemini. They are partial rendered metadata observations; idle, unread or merged never proves completion. Open-tab evidence and sidebar/helper evidence have separate expiry rules. Additional-service task lists are not generally implemented.

Use **Register work note** on a supported official conversation or **Task details → Work notes**. Edit purpose, situation, next actions, waiting items and checklist explicitly; account/workspace labels are yours, not an automatically verified identity. Export important notes before changing site origin/profile or clearing data. No conversation body is automatically saved into the note. See [Task guide](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md).

The optional [Codex helper](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md) is separate from the extension. Setup → Codex can generate a personalized installer for the current extension ID. Follow its OS instructions, then enable/check the connection. Do not load that helper folder as a browser extension. A working helper v1.30.2 needs no reinstall for this build.

## Reports, team use, Bus and support

- **Usage report:** explicit CSV/print export only. Keep personal usage logs private; review before sharing. Raw/native units and money are not summed into quota percentages.
- **Team:** import an optional locally generated status JSON. It shows self-reported capacity/freshness, not live execution/completion. No automated assignment, paid call or quota transfer. See [Team guide](https://github.com/ntus/LLMs-Monitor/blob/main/docs/TEAM_STATUS.md).
- **Bus reference time:** import a closed `usage-timing.v1` Muse payload, at most4KB, or clear it. Sender/account are unverified. It does not change official quota, history, alerts or spending permissions. Copying the question does not send it to Muse.
- **Gateway credit export:** the extension-owned API setup can explicitly save an Anthropic API reference JSON. It is not spending authorization. There is no automatic delivery or complete OpenAI/quota export contract.
- **Support:** choose optional fixed diagnostic fields, preview the exact local draft and save Markdown. Nothing is automatically posted/uploaded. Add reproduction details manually; crop/redact screenshots before attaching. See [Support guide](https://github.com/ntus/LLMs-Monitor/blob/main/docs/SUPPORT.md).

## Privacy and troubleshooting

Usage/history/settings are local to the browser extension; notes, read-state and optional imports may be site-origin-local. Companion access allows the chosen monitor to display required fields in your browser; it is not cross-device synchronization. Official provider/status requests still use the network. Optional helper metadata and exported files have their documented scope. No paid inference, automatic purchase, reset redemption, plan change or operator telemetry is introduced by these tools. See [Privacy](https://github.com/ntus/LLMs-Monitor/blob/main/PRIVACY.md).

| Symptom | First check |
| --- | --- |
| — / login warning | Correct profile/account, enabled reader and explicit permission; then Refresh now. Do not interpret it as0. |
| Stale or paused values | Observation time/reason and the existing acquisition tab. Do not overwrite a draft or purchase credits just to troubleshoot. |
| Page and extension versions differ | Verify loaded folder, reload that extension and the monitor. Avoid loading a second copy. |
| Work-note registration fails after update | Save drafts, refresh the supported source page when safe, then retry. A reset handoff may require another explicit click. |
| Slow input / high CPU | Record version, tab count and reproduction; compare with/without the monitor under the same conditions. A busy Chrome process alone is not proof of cause. |
| Permission/terms screen | Review it yourself. An update does not authorize new terms or wider access automatically. |

## Documentation and release

[Changelog](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md) · [Roadmap](https://github.com/ntus/LLMs-Monitor/blob/main/docs/ROADMAP.md) · [Release readiness](https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md) · [Support](https://github.com/ntus/LLMs-Monitor/blob/main/docs/SUPPORT.md) · [Task guide](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md) · [Team](https://github.com/ntus/LLMs-Monitor/blob/main/docs/TEAM_STATUS.md) · [Privacy](https://github.com/ntus/LLMs-Monitor/blob/main/PRIVACY.md) · [Specification](https://github.com/ntus/LLMs-Monitor/blob/main/SPECIFICATION.md) · [Security review](https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md) · [Store checklist](https://github.com/ntus/LLMs-Monitor/blob/main/STORE_SUBMISSION.md) · [Agent rules](https://github.com/ntus/LLMs-Monitor/blob/main/AGENTS.md)

Only changed guides are regenerated. Hosted copies are Markdown, not a generated PDF manual; report Print/PDF is a separate browser action. General public access, synchronized GitHub downloads, store approval and a future `https://aimon.ntus.info/` migration are not implied by this candidate build.

---

<a id="ja"></a>

## 日本語

**取説改訂：2026年11月8日。** 本体・配布パッケージ・限定サイトは **v1.110.0**。設置ファイルは更新済みで、Chrome実行時には再読み込みが必要な場合があります。ヘルパー **v1.30.2**、更新ツール **v1.0.1** は変更しません。

[読みやすいWeb取扱説明書](https://llmsmonitor.ntus.info/manual#ja) · [全機能の取扱説明書](https://github.com/ntus/LLMs-Monitor/blob/main/USER_GUIDE.md)

LLMsモニターは、対応するAIの利用状況・リセット予定・API残高・変化履歴・作業メモをまとめて見るブラウザー用ツールです。LLMs Gatewayやai-busなしでも動作します。取得できる情報は公式画面・プラン・ログイン状態によって異なり、未取得は **—** のまま扱います。

[モニター](https://llmsmonitor.ntus.info/) · [製品紹介](https://llmsmonitor.ntus.info/product.html) · [変更履歴](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md) · [今後の計画](https://github.com/ntus/LLMs-Monitor/blob/main/docs/ROADMAP.md) · [公開前確認](https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md)

**配布先について：** 現在のサイトはアクセス制限付きです。11月3日の確認時点でGitHub公開main／配布物はv1.64.0で、サイト版とは一致していません。初版告知前に一般公開範囲・GitHub最新版同期・配布ZIP・ストアの状況を確認します。ソース公開だけでは利用許諾を意味せず、今回ライセンスを新設していません。

### 初回導入・更新

1. デスクトップ版Chrome／Edgeの同じプロファイルで、利用するAIの公式サイトへログインします。この導入方法はモバイル向けではありません。
2. リリース案内で指定された**版・検証済み配布元**から `LLMs-Monitor.zip` を保存し、中の **LLMs-Monitor** フォルダーを今後も使う場所へ置きます。
3. ストア公開前は `chrome://extensions`／`edge://extensions` でデベロッパーモードをONにし、［パッケージ化されていない拡張機能を読み込む］から `manifest.json` のあるフォルダーを選びます。ZIPやCodexヘルパーのフォルダーを指定しません。
4. モニターを開き、Web版では現在の拡張機能ID（英小文字32文字）をセットアップで登録。表示サービス・並び順・必要な任意読取りを設定します。
5. 更新は**同じフォルダーへ上書き**し、拡張機能とモニターを再読み込みします。別名フォルダーを増やしたり、更新のためにアンインストールしたりしません。
6. Mac更新アプリは既存フォルダーを初回登録すると、以後バックアップ付きで更新できます。[更新・復元手順](https://github.com/ntus/LLMs-Monitor/blob/main/tools/mac-updater/README.md)を参照してください。署名・公証前のためOSの通常の個別許可を使い、保護機能を無効化しません。

ブラウザーを起動中、おおむね1分ごとに更新します。スリープ・通信・公式側の集計遅延で遅れることがあります。設定・履歴はChrome側、作業メモ等はサイトの保存領域にも依存します。削除・プロファイル変更・URL変更前に必要なメモをエクスポートしてください。

### 画面の見方

- **使用量／残量：** 初期表示は使用量。切替は見た目だけで、履歴・警告判定の正本は残量です。
- **週間／現在セッション：** 週間を先に表示。実際に取得した枠だけ円・横バーを描き、存在しない5時間枠を作りません。
- **残量5%以下：** 対応する円・横バー・％を元の色と赤でゆっくり交互表示。公式の確定リセットが1時間以内なら残り時間を緑で強調します。
- **通知音：** 任意でON/OFF。表示される整数％の変化や対応する閾値・回復を区別し、1%と0%は別パターンです。API残高の変化を利用枠の回復音にはしません。
- **期限・リセット：** 公式日時、想定、未確認を区別。予定時刻を過ぎただけで回復済みとしません。クレジットの⚠︎は説明を開いて理由を確認してください。
- **補足残高：** サブスク枠、月間支出上限までの残り、購入済み残高、クラウドセッション、APIプロモーションは別です。期限が取れなければ未確認とします。
- **小窓／全画面：** 明示操作で開きます。通常小窓はOS全体の最前面ではありません。最前面表示はブラウザー対応が必要です。
- **変化履歴／レポート：** 枠ごと最大10,000件の変化観測。日・週・月の集計、ログ／集計CSV、印刷／PDFに対応。観測した％差を総トークン数・料金と読み替えません。欠測や残量増加だけで停止時間・リセットを断定しません。

### 対応範囲

| サービス | 現行βの対象 | 制約 |
| --- | --- | --- |
| ChatGPT / dots | 確認できるWork/Codex枠・プラン詳細・リセット権、任意のOpenAI API残高 | 通常Chatとdots独自の残量は未取得。各製品の枠を合算しません。 |
| Claude | 実在する枠・週間のみの表示、Ultra、月間支出上限と購入残高、API残高・プロモーション | 追加使用ONだけで、支払い可能残高や現在の消費元を断定しません。 |
| Gemini | 対応する利用枠・Google AIプラン | API決済の埋め込み画面読取りは未完了。アプリの0%とAPI残高は別です。 |
| Grok / Cursor | 任意の公式週間枠・プラン、別のAPI残高 | 名称併記は契約・利用枠共通の証明ではありません。Botを独立取得していません。v1.97でメイン／小窓の見出しを修正。 |
| Muse | 任意の一般設定／利用状況、表示された追加トークン・履歴・参考日時 | ログインが必要。正確な時刻は未取得の場合あり。自動質問は未実装です。 |
| Copilot | 対応画面のプラン・明示カウンター | M365 Copilot (Basic)のプランは確認。個人／企業の数値全般は受入未完了。 |
| DeepSeek／Perplexity／Genspark | 許可済み公式アカウント画面のラベル付きカードの試験読取り | 全プラン・残量・APIの正式対応は未完了。取得できない数値を推測しません。 |

任意のアクセス許可は利用者が押したときだけ確認します。OpenAI／Grok／Muse等は所有する取得用裏タブを再利用しますが、閉じる・操作する・ログインが切れると停止する場合があります。［今すぐ更新］と理由表示を確認してください。ウィンドウを繰り返し開く対処は不要です。公式画面や取得経路の変更で取得できなくなる場合があります。

### タスク・作業メモ

ChatGPT・Claude・Geminiのタスク一覧は、表示済みメタ情報の部分取得です。待機・未読・マージを完了と扱いません。追加サービスのタスク一覧は一般には未対応です。

対応する会話の［作業メモへ登録］や［タスク詳細］から、目的・状況・次の作業・待ち・注意点・チェックリストを明示的に保存できます。作業領域名は自分のラベルで、公式アカウントの自動識別ではありません。会話本文は自動保存しません。[タスク取説](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md)を参照してください。

Codex端末内タスクを見る[任意ヘルパー](https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md)は別導入です。セットアップから現在のID用の導入ZIPを保存し、説明に従って接続します。ヘルパーをChrome拡張として読み込まず、現行v1.30.2で接続済みなら再導入しません。

### チーム・Bus・サポート

- **チーム：** 任意のローカルJSONで自己申告の余力・鮮度を確認します。リアルタイム稼働・自動割当ではありません。通常のモニターはai-busなしで使えます。[手順](https://github.com/ntus/LLMs-Monitor/blob/main/docs/TEAM_STATUS.md)
- **Bus参考日時：** 最大4KBのMuse日時payloadを読込み・消去できます。送信元／アカウント未検証の参考値で、公式残量・履歴・通知音・課金許可に使いません。質問文コピーはMuseへの送信ではありません。
- **Gateway：** ヘッダーのGateway連携で、選んだChatGPT Work/Codex・Claude・Geminiの購読枠を同じ端末へ自動共有できます。一度の独立承認後は解除まで維持し、短期セッションは自動更新します。金銭残高・会話・認証情報は共有せず、API実行・課金の許可は含みません。API設定からのClaude API参考JSON保存は別機能です。
- **サポート：** 選んだ定型診断項目だけをプレビューし、Markdown下書きを端末へ保存。GitHubへ自動送信しません。再現手順は保存後に追記し、スクショは自分で切取り・伏字を確認してください。[詳しい案内](https://github.com/ntus/LLMs-Monitor/blob/main/docs/SUPPORT.md)

余力のある担当へ仕事を分担する案を検討していますが、利用枠・クレジットの譲渡、APIキー共有、課金許可の自動化は提供しません。[ロードマップ](https://github.com/ntus/LLMs-Monitor/blob/main/docs/ROADMAP.md)に実装済みと計画を分けています。

### 困ったとき

| 症状 | 確認すること |
| --- | --- |
| —／ログイン案内 | 同じプロファイル・正しいアカウント・読取り許可を確認し［今すぐ更新］。0とは別です。 |
| 古い値・取得停止 | 読取日時と理由、既存の取得タブを確認。確認のために購入・設定変更はしません。 |
| 画面と拡張の版が違う | 読込元フォルダーを確認し、拡張機能とモニターだけ再読み込み。二重導入しません。 |
| 更新後にメモ登録できない | 下書きを保護してから対象ページを安全に再読込し、もう一度明示登録。 |
| 入力が重い | 版・タブ数・再現手順を控え、同条件で比較。Chrome全体の高負荷だけで原因を断定しません。 |

[プライバシー](https://github.com/ntus/LLMs-Monitor/blob/main/PRIVACY.md) · [変更履歴](https://github.com/ntus/LLMs-Monitor/blob/main/CHANGELOG.md) · [公開前確認](https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md) · [ストア提出](https://github.com/ntus/LLMs-Monitor/blob/main/STORE_SUBMISSION.md) · [仕様](https://github.com/ntus/LLMs-Monitor/blob/main/SPECIFICATION.md) · [セキュリティ検証](https://github.com/ntus/LLMs-Monitor/blob/main/SECURITY_REVIEW.md) · [作業基準](https://github.com/ntus/LLMs-Monitor/blob/main/AGENTS.md)

本ビルドは一般公開・GitHub最新版同期・ストア審査通過を意味しません。将来の `https://aimon.ntus.info/` 移行も別工程です。取説配布はMarkdownで、利用状況レポートの印刷／PDFとは別です。
