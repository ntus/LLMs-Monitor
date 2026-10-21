# LLMs Monitor Mac updater v1.0.1

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Guide revised 21 October 2026 for app/extension v1.63.0. The updater binary remains v1.0.1. macOS 11+ and Python 3.9+ are required. This user-launched tool updates unpacked extensions only; it is separate from the optional Codex helper and does not update a browser-store installation.

[Download Mac updater v1.0.1](https://github.com/ntus/LLMs-Monitor/raw/refs/heads/main/dist/LLMs-Monitor-Mac-Updater-v1.0.1.zip).

1. Extract the updater ZIP and place **LLMs Monitor 更新.app** and **LLMs Monitor 前の版に戻す.app** somewhere permanent, such as Applications.
2. Open the update app. On first use only, select the folder **currently loaded by Chrome/Edge**, not a new destination. Check the extension details for its loaded path; the updater never inspects browser profiles.
3. It retrieves the fixed public GitHub update feed/package, validates version and SHA-256, stages a backup and replaces the same directory. Keeping the path preserves its ID; settings/history stay in browser extension storage. SHA-256 detects corruption; it is not an independent signature. TLS validation remains enabled.
4. The first update from v1.57 or earlier needs one manual extension reload. Update-aware versions reload during a later approximately one-minute cycle; a closed browser reads the files at its next start. Reload the monitor page after an update. Updates can briefly interrupt its connection.

First installation uses **LLMs-Monitor.zip**, containing a fixed **LLMs-Monitor** directory. Put it in a permanent place and load that directory once. Existing installations, including version-named directories, should keep their currently loaded path. Do not rename/move it, repeatedly extract updates as “LLMs-Monitor 2”, or uninstall to update. Explicit migration to another path may change the ID and require pairing, optional permissions and Codex registration again; settings/history are not automatically migrated. The updater never migrates a folder or changes native-host registration.

Permission expansion asks for confirmation. Changed extension keys, malformed/wrong-product archives and downgrade packages are rejected. Only the fixed [public update feed](https://raw.githubusercontent.com/ntus/LLMs-Monitor/main/dist/update.json) and sibling extension ZIPs are used; no GitHub sign-in or API key is needed.

Use the restore app to return to the retained backup, then reload the extension manually. The displaced version is retained as well; backups are not automatically deleted. The chosen target is stored at `~/Library/Application Support/LLMs Monitor/Updater/settings.json`; do not edit it casually.

This distribution is unsigned/not notarized. If macOS blocks the first launch, verify the source and use its normal per-app **System Settings → Privacy & Security → Open Anyway** review flow. Do not disable protections. See [Apple’s guidance](https://support.apple.com/en-us/102445). Gatekeeper/browser acceptance still depends on the actual environment.

---

<a id="ja"></a>

# LLMs Monitor Mac 更新ツール v1.0.1

[Mac更新ツール v1.0.1 を保存](https://github.com/ntus/LLMs-Monitor/raw/refs/heads/main/dist/LLMs-Monitor-Mac-Updater-v1.0.1.zip)。

macOS 11以降、Python 3.9以降向けです。Codexヘルパーとは別の、手動で起動する更新アプリです。ストア版の更新には使いません。

1. ZIPを展開し、「LLMs Monitor 更新.app」と「LLMs Monitor 前の版に戻す.app」をアプリケーションフォルダーなど、今後も使う場所へ移します。
2. 「LLMs Monitor 更新.app」を開きます。初回だけ、Chrome／Edgeが**現在読み込んでいるLLMs Monitor拡張機能のフォルダー**を選びます。新しい保存先を選ぶ操作ではありません。Chromeの拡張機能の詳細に表示される読込元を確認してください。Chromeのプロフィール内をツールが探索することはありません。
3. 最新版を公開GitHubから取得・SHA-256照合し、同じ場所へ更新します。フォルダーを移動・改名しないため、既存IDを維持します。設定・履歴はChrome側に残ります。
4. v1.57以前からの初回更新だけ、Chrome／Edgeの拡張機能画面で「再読み込み」を押してください。v1.58以降は、更新対応版が次の約1分周期で再読み込みします。ブラウザーを閉じていれば次回起動時に読み込まれます。

更新元は https://raw.githubusercontent.com/ntus/LLMs-Monitor/main/dist/update.json と、同じ場所の拡張機能ZIPだけです。GitHubへのログインやAPIキーは不要です。照合値は通信破損の検出用で、独立した電子署名ではありません。TLS証明書の検証は無効化しません。

必要なアクセス権が増える場合は、更新前に確認を出します。拡張機能IDを変えるkeyの変更、不正なZIP、別製品、旧版への上書きは自動適用しません。拡張機能の権限許可やCodexヘルパーの登録は変更しません。更新中はモニターの接続が一時的に切れる場合があります。

戻したい場合は「LLMs Monitor 前の版に戻す.app」を開き、その後ブラウザーの拡張機能を手動で再読み込みします。更新前のフォルダーは更新先の隣に隠しフォルダーとして保存します。自動削除はしません。

更新先の記録は `~/Library/Application Support/LLMs Monitor/Updater/settings.json` です。更新先フォルダーを変更するとIDが変わるため、この設定を安易に書き換えないでください。

この配布物は署名・公証していません。macOSによる初回の開く許可が必要になる場合があります。保護機能を無効化する処理はありません。実機でのGatekeeper・Chrome／Edgeの再読み込み確認は利用環境で必要です。

初回の拡張機能導入は本体の `LLMs-Monitor.zip` を展開し、中の **LLMs-Monitor** フォルダーを今後も使う場所へ置いてから、Chrome／Edgeの「パッケージ化されていない拡張機能を読み込む」で指定します。既存の拡張機能を削除・改名する手順ではありません。導入済みの場合は現在のフォルダーを選び、ID・設定を維持してください。以降はZIPを再展開せず更新アプリを使います。

バージョン付きフォルダーから固定名へ移す場合は、読込元と拡張機能IDが変わる可能性があります。新しい拡張機能としての読込み、任意権限の再許可、必要ならCodex専用ZIPでの再登録が必要です。旧版の設定・履歴が自動移行するとは限りません。更新アプリは勝手にフォルダーを移動しません。

macOSが初回起動を止めた場合は「完了」→システム設定→プライバシーとセキュリティ→対象アプリの「このまま開く」で個別に許可します。Apple公式: https://support.apple.com/ja-jp/102445

取説改訂：2026年10月21日。本体v1.63.0に対応し、更新ツール本体v1.0.1は再発行していません。更新後はモニター画面も再読み込みしてください。
