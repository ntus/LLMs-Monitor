# LLMs Monitor — Privacy Policy

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Last updated: 2026-09-30

The extension reads plan names, usage limits, remaining percentages, reset times, and related credit balances from the official ChatGPT, Claude, Gemini, and Google One services for accounts already signed in within the browser profile. Google One is queried only to identify the current Google AI membership name when Gemini does not expose it directly.

For ChatGPT usage retrieval, the extension temporarily uses the access token exposed to the signed-in official ChatGPT page. The token is kept only in memory for the duration of the request. It is never stored, logged, displayed, or sent to the developer or any third party. Passwords are never read.

Usage snapshots, change history (up to 10,000 changed values per usage window), the selected Claude organization identifier, and display preferences are stored locally through the browser extension storage API. Historical logs remain available after logout and extension updates; the comparison baseline is reset before the next signed-in snapshot. This information is not uploaded to NT MicroSystems,Inc. or sold, shared, or used for advertising, profiling, credit decisions, or unrelated purposes.

The extension communicates only with the official service domains listed in its manifest and its companion monitor page at `https://llmsmonitor.ntusnog.chatgpt.site`. When the user connects that page with the extension ID, the extension returns the plan, usage, credit, history, and display-setting fields required to render the monitor locally in the browser. The companion has no application code that uploads these values to NT MicroSystems,Inc. The extension does not submit prompts, purchase credits, exercise reset entitlements, or change account settings.

The extension also requests public incident feeds from OpenAI Status, Claude Status, and Google Workspace Status approximately every ten minutes. These requests omit browser credentials and do not include usage history, plans, account identifiers, or prompts. The last service-status summary is stored locally.

Users can remove all stored data by uninstalling the extension or clearing its extension storage.

Contact: NT MicroSystems,Inc.

---

<a id="ja"></a>

# 日本語 — LLMs モニター プライバシーポリシー

[🌍 EN](#en) · [🇯🇵 JP](#ja)

最終更新: 2026-09-29

本拡張機能は、同じブラウザープロファイルでログイン済みのChatGPT、Claude、Gemini、Google Oneの公式サービスから、契約プラン名、利用枠、残量、リセット日時、関連クレジットを取得します。Gemini側で現在の契約名を取得できない場合に限り、Google Oneで現在のGoogle AIメンバーシップ名を確認します。

ChatGPTの使用量取得では、公式ページがログイン中のアカウントに提供するアクセストークンを要求中だけメモリー内で利用します。保存、ログ出力、画面表示、開発者や第三者への送信はしません。パスワードは読み取りません。

使用量スナップショット、利用枠ごとに最大10,000件の変化履歴、選択したClaude組織ID、表示設定をブラウザーの拡張機能ストレージに保存します。ログアウトや拡張機能の更新後も履歴を維持し、再ログイン後の比較基準だけをリセットします。これらをNT MicroSystems,Inc.へアップロードしたり、販売、共有、広告、プロファイリング、信用判断、無関係な目的に利用したりしません。

拡張機能はManifestに記載した公式ドメインとコンパニオン画面 `https://llmsmonitor.ntusnog.chatgpt.site` だけと通信します。利用者が拡張機能IDでその画面を接続した場合、表示に必要なプラン、使用量、クレジット、履歴、設定が同じブラウザー内の画面へ返されます。その値を運営者のサーバーへアップロードする処理はありません。プロンプト送信、クレジット購入、リセット権行使、アカウント設定変更を自動実行しません。

保存データは拡張機能のアンインストール、または拡張機能ストレージの消去で削除できます。

お問い合わせ: NT MicroSystems,Inc.

公開障害情報の要求には個人の使用データを含めません。
