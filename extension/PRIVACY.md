# LLMs Monitor — Privacy Policy

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Last updated: 2026-10-10

The extension reads plan names, usage limits, remaining percentages, reset times, and related credit balances from the official ChatGPT, Claude, Gemini, and Google One services for accounts already signed in within the browser profile. Google One is queried only to identify the current Google AI membership name when Gemini does not expose it directly.

For ChatGPT usage retrieval, the extension temporarily uses the access token exposed to the signed-in official ChatGPT page. The token is kept only in memory for the duration of the request. It is never stored, logged, displayed, or sent to the developer or any third party. Passwords are never read.

Usage snapshots, change history (up to 10,000 changed values per usage window), the selected Claude organization identifier, and display preferences are stored locally through the browser extension storage API. Historical logs remain available after logout and extension updates; the comparison baseline is reset before the next signed-in snapshot. This information is not uploaded to NT MicroSystems,Inc. or sold, shared, or used for advertising, profiling, credit decisions, or unrelated purposes.

The extension communicates only with the official service domains listed in its manifest and its companion monitor pages at `https://llmsmonitor.ntus.info` and the previous `https://llmsmonitor.ntusnog.chatgpt.site`. When the user connects that page with the extension ID, the extension returns the plan, usage, credit, history, and display-setting fields required to render the monitor locally in the browser. The companion has no application code that uploads these values to NT MicroSystems,Inc. The extension does not submit prompts, purchase credits, exercise reset entitlements, or change account settings.

The extension also requests public incident feeds from OpenAI Status, Claude Status, and Google Workspace Status once per minute. These requests omit browser credentials and do not include usage history, plans, account identifiers, or prompts. The last service-status summary is stored locally.

The optional intelligence feed requests only a normalized cache at the companion origin. A server-side worker may read public posts from selected X accounts using an operator-managed X API secret. The secret is never sent to or stored by the extension. The relay receives no provider account data, prompts, usage snapshots, or local history. It stores only bounded public-post summaries and identifiers needed to avoid duplicate alerts.

Users can remove all stored data by uninstalling the extension or clearing its extension storage.

API credit connections are optional and disabled by default. A user click in the extension requests access to the selected official API billing host (OpenAI Platform, Claude Platform or Google AI Studio) and optional scripting. On billing routes only, the local reader extracts explicitly labelled currency balances. It stores amount, currency, acquisition status, an account-scope fingerprint and observation time under a separate local key. It does not read input fields, API keys, passwords or payment details, and does not send page text or account names. Keep the billing page open; the reader checks displayed values about once a minute. Disconnect removes the host permission. API balances remain separate from subscription limits and existing history.

Contact: NT MicroSystems,Inc.

---

## Diagnostic logs (v1.22.0)

The extension stores bounded numeric acquisition diagnostics locally in IndexedDB: provider, window type, source, raw numeric utilization where available, normalized and displayed percentages, reset timestamp, decision code, elapsed time and fixed error category. It does not store credentials, account identifiers, full API responses or page text in diagnostics. Ordinary samples expire after 72 hours; incidents after 30 days, with a 6,000-event / approximately 3 MB cap. Users may export JSONL or clear this log from an extension page. Diagnostics are not uploaded automatically and are separate from usage change history.


## Independent task details (v1.25.0)

When a user opens Task details, automatic acquisition reads only visible sidebar conversation titles and approved links from fresh inactive official provider home tabs in the same browser profile. It checks once on opening and about once a minute while the task window is visible and automatic mode is enabled. Temporary tabs are closed after acquisition; user chats and drafts are not reloaded. The list is partial, execution state is unknown, and no chat bodies, input fields or credentials are read. Task titles are neither persisted nor logged, and are returned only to the separate task page on an approved companion origin. Imported JSON may contain bounded titles, project labels, reported states, timestamps and summaries; it stays in that window's memory. Import, Demo or Clear pauses automatic acquisition. Reloading or closing discards the list. No task list is uploaded to our server. Existing usage history and required extension permissions remain unchanged.


## v1.26.0 task-state boundary

The optional independent task window checks already-open provider conversation tabs approximately every five seconds while visible and Auto ON. It reads only editable-composer presence and scoped button accessibility/test attributes and visibility, not messages, draft values, credentials or account data. States remain in memory and expire after 15 seconds. No tabs are navigated, no new permissions are requested, and no titles or states are stored or uploaded. Tests reject route/account mismatches, stale or conflicting observations and unauthorized RPC senders. Actual installed-extension generation checks remain required after the update; mock fixtures are not account-level proof.

<a id="ja"></a>

# 日本語 — LLMs モニター プライバシーポリシー

[🌍 EN](#en) · [🇯🇵 JP](#ja)

最終更新: 2026-10-10

本拡張機能は、同じブラウザープロファイルでログイン済みのChatGPT、Claude、Gemini、Google Oneの公式サービスから、契約プラン名、利用枠、残量、リセット日時、関連クレジットを取得します。Gemini側で現在の契約名を取得できない場合に限り、Google Oneで現在のGoogle AIメンバーシップ名を確認します。

ChatGPTの使用量取得では、公式ページがログイン中のアカウントに提供するアクセストークンを要求中だけメモリー内で利用します。保存、ログ出力、画面表示、開発者や第三者への送信はしません。パスワードは読み取りません。

使用量スナップショット、利用枠ごとに最大10,000件の変化履歴、選択したClaude組織ID、表示設定をブラウザーの拡張機能ストレージに保存します。ログアウトや拡張機能の更新後も履歴を維持し、再ログイン後の比較基準だけをリセットします。これらをNT MicroSystems,Inc.へアップロードしたり、販売、共有、広告、プロファイリング、信用判断、無関係な目的に利用したりしません。

拡張機能はManifestに記載した公式ドメインとコンパニオン画面 `https://llmsmonitor.ntus.info` および互換性用の旧URL `https://llmsmonitor.ntusnog.chatgpt.site` だけと通信します。利用者が拡張機能IDでその画面を接続した場合、表示に必要なプラン、使用量、クレジット、履歴、設定が同じブラウザー内の画面へ返されます。その値を運営者のサーバーへアップロードする処理はありません。プロンプト送信、クレジット購入、リセット権行使、アカウント設定変更を自動実行しません。

任意のAI速報機能はコンパニオンoriginの正規化済みcacheだけを取得します。サーバー側workerは運営者がSecretとして管理するX API認証情報で、選定した公開X投稿を取得できます。このSecretは拡張機能へ送信・保存しません。中継には各社アカウント情報、プロンプト、利用量、端末内履歴を送らず、重複通知防止に必要な公開投稿の要約とIDだけを制限付きで保存します。

保存データは拡張機能のアンインストール、または拡張機能ストレージの消去で削除できます。

APIクレジット連携は任意で初期状態は無効です。拡張機能内のボタンを押したときだけ、選択した公式API請求ホスト（OpenAI Platform／Claude Platform／Google AI Studio）とscriptingの任意権限を要求します。請求パスで明示された通貨残高を読み取り、金額・通貨・取得状態・請求範囲の指紋・観測時刻のみを別のローカルキーへ保存します。入力欄、APIキー、パスワード、決済情報は読み取らず、ページ全文やアカウント名を送信しません。請求画面を開いておくと約1分ごとに表示値を確認します。解除時にホスト権限を削除します。API残高を月額プラン枠や既存履歴へ混入させません。

お問い合わせ: NT MicroSystems,Inc.

公開障害情報の要求には個人の使用データを含めません。

## 診断ログ（v1.22.0）

拡張機能は、取得元・枠・数値の換算・表示判断・所要時間・固定エラー種別だけをIndexedDBへ保存します。認証情報、アカウント識別子、生API応答、ページ全文は保存しません。通常記録は72時間、異常記録は30日、最大6,000件・概算3MBです。拡張機能画面から手動でJSONLを書き出し、または消去できます。自動アップロードせず、変化履歴とは分離します。

## 独立したタスク詳細（v1.25.0）

［タスク詳細］を開くと、同じブラウザープロファイルの公式ホームを新しい非アクティブなタブで開き、表示済みサイドバーの会話名と許可されたリンクだけを取得します。起動時と、自動取得が有効で窓が表示されている間の約1分ごとに確認し、一時タブは取得後に閉じます。利用中のチャットや入力途中のタブを再読込しません。一覧は部分的で、実行状態は不明です。チャット本文、入力欄、認証情報は読み取りません。会話名は永続保存・ログ記録せず、許可済みコンパニオンoriginの独立タスク画面だけへ返します。手動JSONの名称・プロジェクト・報告状態・日時・要約も、その窓のメモリー内のみで扱います。読込・サンプル・消去は自動取得を停止し、再読込・終了で一覧を破棄します。運営サーバーへの送信はなく、既存の使用量履歴と必須権限は維持します。

## v1.26.0 タスク状態の保護範囲

独立タスク小窓は表示中かつ自動ONの間、開いている公式会話の入力欄存在と周辺ボタンのアクセシビリティ／テスト属性・可視性だけを約5秒ごとに確認する。本文・入力値・認証情報・アカウント情報は取得しない。状態はメモリー内で15秒後に失効。タブ遷移・追加権限・タイトルや状態の保存／送信を行わない。経路／アカウント不一致、古い観測、複数タブ不一致、不正送信元をテスト。実インストール後の生成中取得は別途確認し、模擬画面を本番成功と扱わない。
