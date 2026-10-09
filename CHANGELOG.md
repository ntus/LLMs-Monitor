## 1.23.0

- Allow extension messaging from the custom monitor domain and retain the previous Site origin.
- Align Web links, privacy and package versions; preserve extension storage and usage history.
- Add actual external-message tests for approved and hostile origins.

## 1.22.0

- Add bounded local diagnostic logging and manual JSONL export, isolated from usage history.
- Move API setup into API credit sections, stabilize language selection and reopen pages in normal tabs.
- Remove custom floating headers and size controls; keep three compact service rows visible.

## 1.21.0

- Guard Claude primary weekly API 0% until the official usage page confirms exhaustion.
- Read the official weekly used percentage and weekday reset; protect history and sound from unverified zeros.
- Cover false and genuine weekly zero with regression tests.

# Revision history / 改訂履歴

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

## 1.24.0 beta — narrow task windows and focused floating alerts

- Keep task titles and controls readable at narrow widths with stacked controls, two-column actions and smaller tree indentation.
- While a floating provider alert is active, list only affected services. Keep normal usage cards, complete main status checks and green recovery behavior.
- Preserve quota acquisition, history, polling, audio and permissions. Update the existing extension in place; this is a minor package release.



## 1.20.0 beta — 2026-10-04

- One shared localized floating header, title fit and independent width/height controls; updates preserve user-selected size and expanded history.
- Optional per-provider API credit integration with official billing links and a separate balance row in all views. Existing required permissions and usage/history storage are unchanged.
- Missing, zero, negative, postpaid and ambiguous billing balances are distinguished. No password, API key or payment data is collected.
- OpenAI billing label verified directly; signed-in Claude/Gemini billing verification remains pending.


## 1.19.0 beta

- Verify Claude API zero against the official usage page; suppress unverified zero history and alerts. Collapse floating history by default and remove its CSS height cap.

## 1.14.0 beta

- Preserved a verified ChatGPT reset-entitlement expiry across partial DOM/API snapshots while clearing it on an explicit zero count.
- Restored the ticket icon only for available reset entitlements and matched the reset-row font size to other details.
- Linked credit-related details for ChatGPT, Claude, and Gemini to each provider’s official usage settings.

## 1.13.0 beta

- Linked ChatGPT credit labels and balances to the official usage settings.
- Shortened the full-reset row to `Full reset (week+5h)`, linked both reset actions, and added an explicit linked no-entitlement state.
- Removed the decorative ticket emoji and redundant per-card capture timestamp.

## 1.12.0 beta

- Stopped ChatGPT DOM usage values from overwriting the background API values and oscillating between two percentages.
- Kept DOM retrieval for reset-entitlement type and expiry while treating the API as the authoritative usage source.

## 1.11.0 beta

- Fixed ChatGPT/Codex complete-reset expiry retrieval when the official page exposes “Valid until” only as visible text.
- Added API expiry aliases such as `valid_through`, `use_by`, `redeem_by`, and `deadline`.
- Kept an available reset explicit as “expiry unavailable” when no reliable deadline is present.

## 1.10.0 beta

- Added a server-relayed, one-minute intelligence feed for Tibo, selected official provider X accounts, and BridgeMind/BridgeBench.
- Added silent first-run baselining, post-ID deduplication, source links, and defensive escaping.
- Kept X credentials out of the extension and marked live activation as requiring an approved X API secret, cache binding, cron, and worker deployment.
- Kept NerfBench explicitly labelled as an independent benchmark and treated published power below 90% as critical.

## 1.9.0 beta

- Kept official provider-status checks at one-minute intervals.
- Added session-scale separators to Claude weekly and cloud-session-credit bars.
- Rounded Claude cloud-session remaining balances to two decimal places.
- Changed update ordering so the notification sound starts before the red numeric highlight is published.

## 1.8.0 beta

- Updated the extension's externally connectable allowlist and companion links for `https://llmsmonitor.ntusnog.chatgpt.site`.
- Added a regression check so a future URL rename cannot silently break extension connectivity.

## 1.7.0 beta

- Fixed inactive or expired Claude five-hour windows incorrectly appearing as 0% remaining.
- Missing/null current windows now show an unused 100% state; failed refreshes preserve only unexpired prior values.


## 1.6.4 beta

- Consolidated sound guidance and history-load results into one navigable status log, with the history summary refreshed at most once per minute.
- Stopped automatic popup creation and removed application-level popup size constraints.

## Earlier releases

Version 1.5.3 and earlier focused on plan retrieval, persistent change history, bilingual and floating displays, reset and credit details, and browser integration. The Japanese section below retains the original release-by-release details.

[Return to README](README.md#en)

---


## Web 1.23.1 — independent task-detail trial (2026-10-09)

- Added a per-provider Task details launcher and a separate tall window with bilingual tree navigation, search, state filtering and text copy.
- Read local JSON snapshots in memory; clearly label demo/historical states. Automatic provider task acquisition remains unconnected.
- Preserved all extension sources, its 1.23.0 ZIP, quota history/alerts and existing floating views. Added TASK_DETAILS.md and durable isolation requirements.
<a id="ja"></a>

## 1.24.0 β — 狭幅タスクとフローティング障害詳細

- 狭いタスク画面を縦配置・2列操作・小さな字下げで読みやすく調整。
- フローティング障害詳細は障害サービスだけ。通常の残量カード、主画面全社確認、緑の復帰表示は維持。
- 取得・履歴・監視・音・権限は変更せず、既存拡張機能は同じ読込元で更新。パッケージ変更のため中間版番号を増加。



## Web 1.23.1 — タスク詳細の独立試作（2026-10-09）

- 各社の［タスク詳細］から縦長の別窓を開き、日英ツリー、検索、状態絞り込み、コピーに対応。
- 端末内JSONをメモリーだけで読み込み、架空サンプル・過去の状態を明示。各社タスクの自動取得は未接続。
- 拡張機能ソース・1.23.0 ZIP・残量履歴/通知・既存小窓を維持。詳細契約と分離規則を追加。


## 1.23.0

- 独自ドメインから拡張機能へ接続可能にし、旧URLとの互換接続を維持。
- Webリンク・プライバシー・版番号を同期し、拡張機能内の履歴と設定を維持。
- 許可済みoriginと紛らわしい別originの外部メッセージテストを追加。

## 1.20.0 β — 2026-10-04

- 外窓のタイトルと言語更新を共通化。1行に調整し、↔メニューで縦横を個別調整。更新で寸法・履歴開閉状態を戻さない。
- 事業者ごとの任意権限によるAPI残高連携と公式請求リンクを追加。必須権限・既存の利用枠・履歴を維持。
- 未取得・0・負残高・後払い・複数残高を区別。パスワード・APIキー・決済情報を収集しない。
- OpenAI実画面を確認。Claude／Gemini請求アカウントでの実測は未完了。


## 1.19.0 β

- Claude APIの未確認0%を公式使用状況画面で確認し、誤った履歴・通知を抑止。フローティング履歴を初期状態で折りたたみ、CSSの高さ制限を解除。

## 1.14.0 β

- 確認済みのChatGPTリセット権期限をDOM／APIの部分更新後も保持し、公式の0件取得時だけ破棄します。
- 🎫を利用可能時だけ表示し、リセット行の文字サイズを他の補足情報と統一しました。
- ChatGPT／Claude／Geminiのクレジット関連情報を各社公式設定へリンクしました。

## 1.13.0 β

- ChatGPTのクレジット名・残高を公式使用量設定へリンクしました。
- 完全リセットを `完全リセット(週+5h)` の1行へ短縮し、リセット権なしもリンク付きで明示します。
- チケット絵文字と重複する取得日時を削除しました。

## 1.12.0 β

- ChatGPTのDOM残量がバックグラウンドAPI値を上書きし、2つの割合を往復する問題を修正しました。
- 残量はAPIを正本とし、DOMはリセット権の種別・期限など補足情報だけを統合します。

## 1.11.0 β

- 公式画面の「有効期限：10月30日」が通常テキストだけで表示される場合も、ChatGPT／Codex完全リセット権の期限を取得できるよう修正しました。
- API側の `valid_through`、`use_by`、`redeem_by`、`deadline` 形式にも対応しました。
- 信頼できる期限が見つからない場合は、0や推測日ではなく「期限未取得」を維持します。

## 1.10.0 β

- Tibo氏、選定した各社公式X、BridgeMind／BridgeBenchを1分ごとに確認するサーバー中継速報を追加しました。
- 初回無音基準、投稿ID重複防止、出典リンク、外部文面のエスケープを追加しました。
- X認証情報を拡張機能へ含めず、実運用には承認済みX API Secret、cache、cron、worker配置が必要です。
- NerfBenchを独立ベンチマークと明示し、公開されたlaunch powerが90%未満の場合を重大警戒とします。

## 1.9.0 β

- 各社の公式障害情報を1分ごとに確認する設定を維持しました。
- Claudeの週間枠とクラウドセッションクレジットのバーへ、現在セッション単位の区切りを追加しました。
- Claudeのクラウドセッション残額を小数点以下2桁に丸めました。
- 残量変化時は通知音を開始してから赤色点滅を公開する順序へ変更しました。

## 1.8.0 β

- 拡張機能の外部接続許可とコンパニオン画面へのリンクを `https://llmsmonitor.ntusnog.chatgpt.site` に統一しました。
- URL変更時の接続不良を再発させない自動検査を追加しました。

## 1.7.0 β

- Claudeの未開始または期限切れ5時間枠が残り0%と誤表示される問題を修正。
- 現在枠の欠落・nullは未使用100%とし、取得失敗では期限前の前回値だけを保持。


# 日本語 — 改訂履歴

## 1.22.0

- 容量制限付きの端末内診断ログと手動JSONL書出しを追加。変化履歴とは分離。
- API連携をAPIクレジット欄へ移し、言語切替と通常窓での画面再表示を安定化。
- 小窓の独自見出し・サイズ操作を廃止し、3社を同時表示。

## 1.6.4 の変更

- 通知音説明と履歴読込結果を左右ボタン付きのステータスログへ集約し、履歴読込結果の再計算を最大1分に1回へ抑制しました。
- 起動時などの通常小窓自動表示を廃止し、アプリ側の固定幅・固定高を撤廃しました。

[🌍 EN](#en) · [🇯🇵 JP](#ja)

## 1.5.3 の変更

- Google Oneの「現在のプラン」をアップグレード候補より優先し、Geminiと同じGoogleアカウント番号のメンバーシップ管理画面から契約プランを取得します。
- 英語モードで残っていた取得注記、リセット、補足値、期限、未取得プランの日本語を英訳します。
- フローティング画面の最上部から版番号を外し、日英どちらの製品名も横幅に合わせて1行表示します。

## 1.5.2 の変更

- 日本語／英語を切り替えられます。初回は環境言語が日本語なら日本語、それ以外は英語を選び、`🇯🇵JP`／`🌍EN`で現在のモードを表示します。
- 言語、テーマ、透明度、利用枠、リセット、クレジット、変化履歴をメイン画面、通常小窓、最前面表示、AIサイト内パネルで同期します。
- 通常小窓と最前面表示を約180〜190px幅へ縮小し、幅に応じて文字を調整しながらメイン画面と同じ情報を縦スクロールで表示します。
- メイン画面の再読み込み時は通常小窓も再読み込みし、メイン画面を閉じた場合は連動して通常小窓を閉じます。
- 通常小窓のタイトルを選択言語の製品名へ統一し、透明度変更が小窓の背景とカードへ即時反映されるようにしました。
- フルスクリーン時のサービス名、プラン、利用枠、履歴、操作部品の文字を拡大しました。

## 1.5.1 の変更

- Geminiの契約プランをGeminiの契約情報、アカウント状態RPC、Google Oneの現在契約画面から多段取得します。複数Googleアカウントの `/u/0`〜`/u/4` に対応し、広告だけのプラン名は採用しません。
- 変化履歴を利用枠ごとに最大10,000件保存し、起動時に保存済み履歴を復元します。画面には取得期間・件数・読込と分析の所要時間を表示します。
- 起動時は全履歴から直近10,000件を3秒以内で選び、同じ履歴を画面表示と利用ペース分析へ使用します。
- フルスクリーンでも各サービスの変化履歴テキストボックスを表示します。
- 公開画面とインストール済み拡張機能の版が異なる場合は、接続欄に更新警告と双方の版番号を表示します。
- 公開画面のJavaScriptとCSSには版番号を付け、ブラウザーキャッシュに旧ロジックが残らないようにします。
- v1.5.1へ更新しても既存の保存履歴は削除しません。旧版がすでに上限超過分を削除していた場合、その削除済みデータだけは復元できません。

## 1.5.0 の変更

- これまでの全要件を `spec/requirements.json` の単一要件台帳と [詳細仕様書](SPECIFICATION.md) に固定し、版番号、証跡、受入条件を自動検査するようにしました。
- ログアウト後も利用枠ごとの変化履歴を最大1,000件保持し、再ログイン後の初回値を新しい基準として追加します。
- APIと公式画面の補助データを取得元別に統合し、一方だけが取得できたプラン、枠、期限、クレジットを別の更新で消さないようにしました。
- Geminiは既定アカウントと `/u/0`〜`/u/4` の公式ページ、RPC、契約画面を探索し、アップグレード広告を契約中プランと誤認しない検証を追加しました。
- Claudeのクラウドセッションクレジット、追加使用クレジット、プロジェクトセットアップクレジットの残率・残額・総額・期限処理を補強しました。
- 通知音をバックグラウンドのOffscreen Documentで再生し、1回の更新で複数値が変化しても1秒間隔の3音だけに集約しました。
- 対応ブラウザではDocument Picture-in-Pictureによる最前面表示へ切り替えられます。起動時は通常小窓を1つだけ開き、PiP開始時に通常小窓を閉じます。
- 本番拡張機能の外部接続先を公開モニターのHTTPS originだけに限定し、公開プライバシーページを追加しました。

## 1.4.1 の変更

- アドバイスを画面下部の横幅ほぼ一杯に収まる1行ティッカーへ変更しました。
- ChatGPTのリセット権期限を更新間で保持し、7日以内の警告と利用先リンクを表示します。
- Geminiの公式ページ・埋め込みデータ・契約画面からプランを多段取得します。
- 2時間未満のリセット時間を赤色警告し、接続表示を1行へ圧縮しました。
- 変化履歴の保存上限を利用枠ごとに1000件へ拡張し、起動時にも既存履歴を維持します。

## 1.4.0 の変更

- 最大100件の変化履歴から消費速度とリセット時残量を予測し、現在のプランを活用できているかを助言します。
- 利用枠を早く使い切る傾向では上位プラン、継続して大きく余る傾向では下位プランを比較候補として表示します。履歴不足時はプラン変更を勧めません。
- ChatGPTの利用上限リセット権について、現在残量と有効期限から「行使候補」「期限優先」「温存」を提示します。
- 助言は画面を押し下げない半透明の吹き出しで9秒ごとに切り替わり、手動送りとON/OFFに対応します。

## 1.3.5 の変更

- 保存済みデータが旧表記でも、ChatGPTの週間枠をメイン画面・履歴・フローティング表示で「週間 (Work / Codex)」へ統一します。
- ChatGPTの「利用上限のリセット」カードとAPI応答から、利用可能件数・リセット種別・有効期限を取得します。期限が7日以内なら赤色で警告します。

## 1.3.4 の変更

- 標準／ダークテーマをサイト、プレビュー、フローティング小窓、各AIサイト上の半透明パネルで同期します。
- Geminiの契約名取得先にログイン中アカウントのサブスクリプション画面を追加しました。
- Claudeの未使用セッションは「最初のメッセージから開始します」と表示します。
- Claudeのクラウドセッションクレジット枠から残額・総額・期限・残率を取得し、横棒グラフを表示します。
- ChatGPTの週間枠を「週間 (Work / Codex)」へ変更しました。

## 1.3.3 の変更

- 標準モードを落ち着いたニュートラル配色へ刷新し、文字・境界・操作部品のコントラストを統一しました。
- Geminiの契約名を使用量API応答、旧称のGoogle One AI Premium、Gemini Advancedからも判定します。
- ChatGPTの利用枠リセットに加え、取得できる場合は利用権期限を表示します。7日以内は赤色で警告します。
- Claudeのクラウドセッションクレジットは残量・総額・期限を表示し、組織名の注記を削除しました。

## 1.3.2 の変更

- 現在セッションの残量を円形ゲージと横棒グラフの両方で表示し、全画面でもバーを常時表示します。
- 円内にリセット日時と「あと何時間・何分」を表示します。
- Claude／Geminiの契約プラン解析を補強し、一時的な未取得時も既知の契約名を保持します。
- 履歴には起動後の初回値を記録し、以後は数値が変化した場合だけ追加します。
- ChatGPTのサービスアイコンを枠の中央へ配置しました。

## 1.3.1 の変更

- 各サービスの円形ゲージを約2倍の直径に拡大し、残量数値も合わせて大きくしました。
- 全画面表示では画面高に応じて直径を調整し、ページ全体をスクロールせず確認できます。

## 1.3.0 の変更

- 円形ゲージの数値を大きくし、離れた位置からも読みやすくしました。
- 履歴は残量が変わった時だけ記録し、利用枠ごとに1000件保存します。
- ChatGPTは公式ページの `client-bootstrap` にある契約情報からPlus／Proなどを取得します。
- 3サービスをログイン中の公式セッションからバックグラウンド取得し、使用量タブの常駐を不要にしました。
- ブラウザ起動時に専用フローティング小窓を開きます。サイト内パネルのぼかしを抑え、15〜100%の透明度が見た目へ反映されます。
- 全画面表示では監視カードだけを画面内へ収め、ページ全体のスクロールをなくしました。
- 配布ファイル名を `LLMs-Token-Usage-Monitor-v1.3.0.zip` に変更しました。

## 1.2.0 の変更

- ChatGPT / Claude / Gemini の契約プランを公式画面から取得してサービス名の下に表示します。
- 各利用枠の取得履歴を日時と残り使用量の形式で最大1000件、端末内に保存します。
- フルスクリーンと標準・ダークテーマの切替を追加しました。
- 小型パネルの背景透明度を15〜100%で調整でき、背後の画面が自然に透けます。

## 1.1.0 の変更

- 残量が変化した利用枠に、変更直前の値と取得日時（秒まで・端末のタイムゾーン）を表示。同じ値の再取得では直近の変更履歴を保持します。
- 更新中は前回値を保持してゆっくり点滅。45秒を超えた場合は「更新待ち（前回値）」に切り替えます。端末でアニメーション抑制を指定している場合は薄色のみです。
- Claudeのクラウドセッションクレジット、プロジェクトセットアップクレジット、使用クレジットを下部に追加。取得可能な金額・残率・期限を表示。Web画面で金額を確認できない場合は「未取得」とします。
- 更新するには最新ZIPを展開し、既存の拡張機能フォルダのファイルを置き換えて、拡張機能管理画面の「再読み込み」を押してください。各AIサイトとモニターも再読み込みしてください。


[READMEに戻る](README.md#ja)
