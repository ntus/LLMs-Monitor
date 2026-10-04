# LLMs Monitor — Privacy Policy

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Last updated: 2026-10-04

The extension reads plan names, usage limits, remaining percentages, reset times, and related credit balances from the official ChatGPT, Claude, Gemini, and Google One services for accounts already signed in within the browser profile. Google One is queried only to identify the current Google AI membership name when Gemini does not expose it directly.

For ChatGPT usage retrieval, the extension temporarily uses the access token exposed to the signed-in official ChatGPT page. The token is kept only in memory for the duration of the request. It is never stored, logged, displayed, or sent to the developer or any third party. Passwords are never read.

Usage snapshots, change history (up to 10,000 changed values per usage window), the selected Claude organization identifier, and display preferences are stored locally through the browser extension storage API. Historical logs remain available after logout and extension updates; the comparison baseline is reset before the next signed-in snapshot. This information is not uploaded to NT MicroSystems,Inc. or sold, shared, or used for advertising, profiling, credit decisions, or unrelated purposes.

The extension communicates only with the official service domains listed in its manifest and its companion monitor page at `https://llmsmonitor.ntusnog.chatgpt.site`. When the user connects that page with the extension ID, the extension returns the plan, usage, credit, history, and display-setting fields required to render the monitor locally in the browser. The companion has no application code that uploads these values to NT MicroSystems,Inc. The extension does not submit prompts, purchase credits, exercise reset entitlements, or change account settings.

The extension also requests public incident feeds from OpenAI Status, Claude Status, and Google Workspace Status once per minute. These requests omit browser credentials and do not include usage history, plans, account identifiers, or prompts. The last service-status summary is stored locally.

The optional intelligence feed requests only a normalized cache at the companion origin. A server-side worker may read public posts from selected X accounts using an operator-managed X API secret. The secret is never sent to or stored by the extension. The relay receives no provider account data, prompts, usage snapshots, or local history. It stores only bounded public-post summaries and identifiers needed to avoid duplicate alerts.

Users can remove all stored data by uninstalling the extension or clearing its extension storage.

API credit connections are optional and disabled by default. A user click in the extension requests access to the selected official API billing host (OpenAI Platform, Claude Platform or Google AI Studio) and optional scripting. On billing routes only, the local reader extracts explicitly labelled currency balances. It stores amount, currency, acquisition status, an account-scope fingerprint and observation time under a separate local key. It does not read input fields, API keys, passwords or payment details, and does not send page text or account names. Keep the billing page open; the reader checks displayed values about once a minute. Disconnect removes the host permission. API balances remain separate from subscription limits and existing history.

Contact: NT MicroSystems,Inc.

---

<a id="ja"></a>

# 日本語 — LLMs モニター プライバシーポリシー

[🌍 EN](#en) · [🇯🇵 JP](#ja)

最終更新: 2026-10-04

本拡張機能は、同じブラウザープロファイルでログイン済みのChatGPT、Claude、Gemini、Google Oneの公式サービスから、契約プラン名、利用枠、残量、リセット日時、関連クレジットを取得します。Gemini側で現在の契約名を取得できない場合に限り、Google Oneで現在のGoogle AIメンバーシップ名を確認します。

ChatGPTの使用量取得では、公式ページがログイン中のアカウントに提供するアクセストークンを要求中だけメモリー内で利用します。保存、ログ出力、画面表示、開発者や第三者への送信はしません。パスワードは読み取りません。

使用量スナップショット、利用枠ごとに最大10,000件の変化履歴、選択したClaude組織ID、表示設定をブラウザーの拡張機能ストレージに保存します。ログアウトや拡張機能の更新後も履歴を維持し、再ログイン後の比較基準だけをリセットします。これらをNT MicroSystems,Inc.へアップロードしたり、販売、共有、広告、プロファイリング、信用判断、無関係な目的に利用したりしません。

拡張機能はManifestに記載した公式ドメインとコンパニオン画面 `https://llmsmonitor.ntusnog.chatgpt.site` だけと通信します。利用者が拡張機能IDでその画面を接続した場合、表示に必要なプラン、使用量、クレジット、履歴、設定が同じブラウザー内の画面へ返されます。その値を運営者のサーバーへアップロードする処理はありません。プロンプト送信、クレジット購入、リセット権行使、アカウント設定変更を自動実行しません。

任意のAI速報機能はコンパニオンoriginの正規化済みcacheだけを取得します。サーバー側workerは運営者がSecretとして管理するX API認証情報で、選定した公開X投稿を取得できます。このSecretは拡張機能へ送信・保存しません。中継には各社アカウント情報、プロンプト、利用量、端末内履歴を送らず、重複通知防止に必要な公開投稿の要約とIDだけを制限付きで保存します。

保存データは拡張機能のアンインストール、または拡張機能ストレージの消去で削除できます。

APIクレジット連携は任意で初期状態は無効です。拡張機能内のボタンを押したときだけ、選択した公式API請求ホスト（OpenAI Platform／Claude Platform／Google AI Studio）とscriptingの任意権限を要求します。請求パスで明示された通貨残高を読み取り、金額・通貨・取得状態・請求範囲の指紋・観測時刻のみを別のローカルキーへ保存します。入力欄、APIキー、パスワード、決済情報は読み取らず、ページ全文やアカウント名を送信しません。請求画面を開いておくと約1分ごとに表示値を確認します。解除時にホスト権限を削除します。API残高を月額プラン枠や既存履歴へ混入させません。

お問い合わせ: NT MicroSystems,Inc.

公開障害情報の要求には個人の使用データを含めません。
