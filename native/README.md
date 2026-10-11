# LLMs Monitor — Codex helper v1.30.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

Guide updated for app v1.31.0; helper runtime unchanged.

<a id="en"></a>

## English

Optional, local-only Codex task metadata for the independent ChatGPT task window. Requires Python 3 and Codex CLI on macOS/Linux Chrome or Edge. Windows installation is not implemented.

Open **Connect Codex**, extract this ZIP, run `Install.command` on macOS or `python3 install.py --extension-id <ID>` on Linux, then enable the optional native-messaging permission in the extension connection page. Only the chosen extension ID can access the helper. No administrator access, exposed port or login-startup service.

Titles, IDs, explicit local pins, update times and evidenced states only. No message previews, turns, drafts, credentials or execution commands are forwarded. Automatic lists remain memory-only. Desktop pins use a version-sensitive local compatibility adapter; completeness applies to that local pin-ID list. Browser account matching and remote-host/account coverage are not verified. Maximum 500 tasks. A shared existing App Server can provide runtime states; independent metadata reading stays Unknown. Idle never implies completed.

Disable access in the connection page. Remove only the helper directory and its specific browser host manifests to uninstall; leave other native integrations intact.

Sources: [Codex App Server](https://learn.chatgpt.com/docs/app-server), [Chrome native messaging](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging).

See the [current task/work-note guide](../TASK_DETAILS.md). Install the helper only if you want local Codex metadata; it is not required for browser chat lists. Saved notes can be exported before changing browser/site.

<a id="ja"></a>

## 日本語

ChatGPTブラウザ版に含まれない、同じ端末のCodexタスクを独立した欄に表示する任意の連携です。macOS／LinuxのChrome／Edgeに対応。Python 3とCodex CLIが必要です。Windows用の導入は未対応です。

1. 拡張機能v1.31.0（連携互換性はv1.30.0以降）を導入し、ChatGPTタスク詳細の［Codexを接続］を開きます。
2. このZIPを展開。macOSでは `Install.command` を開き、連携画面の拡張機能IDを入力します。Linuxでは `python3 install.py --extension-id <ID>` を実行します。
3. 連携画面の［接続を有効にする］を押し、ブラウザの任意権限を許可します。タスク詳細で［一覧を更新］します。

ユーザー自身のフォルダーに小さなヘルパーとChrome／Edgeのネイティブ連携設定を置きます。管理者権限・ポート公開・自動起動は不要。アクセスできる拡張機能は指定IDだけです。別のIDで再導入すると旧IDの許可は置き換わります。

取得はタイトル・タスクID・ピン留め・更新日時・根拠のある状態のみ。会話本文・プレビュー・入力中の内容・認証情報は画面へ渡さず、送信・タスク実行・設定変更をしません。一覧はタスク小窓のメモリー内だけ。作業メモは利用者が保存した場合だけ、従来の端末内保存を使います。

ピン留めはデスクトップのローカル設定内のID一覧を互換読取し、Codex App Serverのメタ情報と照合します。内部形式の変更で読めない場合は「全件確認未完了」となります。取得対象は端末内の保存一覧。ブラウザとのアカウント一致や別ホスト／アカウント全体は確認できません。最大500件。新しいAPI形式に変わったときはヘルパーの更新が必要です。

既存の共有App Serverへ接続できる場合だけ現在の状態を表示します。独立したメタ情報読取では、実行中かどうかを観測できないため「状態未確認」です。共有サーバーやアプリを勝手に起動／再起動しません。通常チャットの状態をこの経路で推測しません。

停止は連携画面の［無効にする］。完全削除は、導入した `~/Library/Application Support/LLMs Monitor/Codex` と各ブラウザの `NativeMessagingHosts/info.ntus.llmsmonitor.codex.json`（Linuxは `~/.local/share/llms-monitor/codex` と `~/.config/<browser>/NativeMessagingHosts/...`）だけ削除してください。他の連携ファイルは削除しないでください。


本体v1.31.0向けに説明を更新。ヘルパーコード・版は1.30.0のままです。[タスク・作業メモ取説](../TASK_DETAILS.md#ja)も参照。ブラウザー通常チャット一覧にはヘルパー不要です。
