Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md

# LLMs Monitor — Codex helper installation guide

[🌍 EN](#en) · [🇯🇵 JP](#ja) · [macOS](#macos-ja)

Guide revised **2026-10-12** for Web v1.33.1 / extension v1.33.0. Helper runtime / download: **v1.30.1**. This release rebuilds only the Web app, helper ZIP and changed guides; the extension ZIP remains unchanged. Helper 1.30.1 fixes an unresponsive shared-connection timeout that blocked metadata fallback.

<a id="en"></a>

## English

The optional helper displays this computer’s Codex tasks and local pins in **ChatGPT → Task details → Codex — Desktop**. Browser ChatGPT chats use a different acquisition path and do not require it.

**The helper ZIP is not a Chrome extension.** It contains `README.md`, `Install.command`, `install.py` and `codex_host.py`; it intentionally has no extension `manifest.json`. Chrome / Edge **Load unpacked** is for the separate main LLMs Monitor extension package, not this helper folder.

| Operating system | Current helper support | Installation |
| --- | --- | --- |
| macOS | Installer implemented for Google Chrome / Microsoft Edge | Detailed steps below; Python 3.9+ and a discoverable Codex binary |
| Linux | Installer implemented for standard Google Chrome / Microsoft Edge paths; live Linux acceptance not completed | Extract ZIP; run `python3 install.py`; paste extension ID; enable permission |
| Windows | Installer not implemented | Do not run this installer or load its folder as an extension; WSL installation does not register a Windows browser host |

These are **LLMs Monitor helper** limits, not claims about the operating systems supported by Codex itself. Safari / Firefox / Chromium and sandboxed Linux browser packages are not covered by this installer.

<a id="macos-en"></a>

## macOS: install and connect

1. Open LLMs Monitor in the Chrome or Edge profile that has the main extension installed and paired. Open **ChatGPT → Task details → Codex — Desktop → Connect Codex**. Keep this dedicated extension page open. Copy its **extension ID**: 32 letters a–p, not a ChatGPT account name or Site URL.
2. Check prerequisites in Terminal (Applications → Utilities → Terminal): `python3 --version`. Use **Python 3.9 or later**. If it is missing or older, install a supported Python release from [Python for macOS](https://www.python.org/downloads/macos/), following the [official Python macOS guide](https://docs.python.org/3/using/mac.html), then open a new Terminal window. Python installation can ask for administrator permission; **the helper itself does not need it**. No pip dependencies are required.
3. Use Codex on this Mac with the local tasks you want to display. The helper looks for `codex` in the browser host’s PATH, then specific bundled binaries inside `/Applications/ChatGPT.app` or `/Applications/Codex.app`. If a separate CLI is used, `codex --version` is a useful Terminal check; its absence does not by itself rule out a recognized app-bundled binary. For missing Codex, follow [official Codex CLI installation](https://learn.chatgpt.com/docs/codex/cli). Terminal PATH success alone does not prove that Chrome / Edge can discover the CLI.
4. In **LLMs Monitor → ChatGPT → Task details → Codex — Desktop**, use the new download link for [Codex helper v1.30.1](https://llmsmonitor.ntus.info/LLMs-Monitor-Codex-Helper-v1.30.1.zip), and double-click the ZIP in Finder to extract it. Use the extracted folder, not the ZIP or a preview of its contents.
5. Double-click **Install.command**. A Terminal window asks `LLMs Monitor extension ID / 拡張機能ID:`. Paste the ID from step 1 and press Return. Success contains **Installed.** and **導入完了。**. Press Return again to close. The success message confirms host registration, not yet a working browser connection.
6. If double-click does not execute, use the Terminal method below. Do not remove quarantine attributes or disable macOS security protections.
7. Return to **Connect Codex**, click **Enable connection**, and allow the optional native-messaging permission. **Connection enabled** confirms the setting and permission only. Click **Check connection** for the actual result: `N tasks · P/Q pins · runtime connected` or `metadata only`.
8. Return to the ChatGPT task window, turn **Auto ON** and click **Refresh list**. The local Codex list appears in its own **Codex — Desktop** section, separate from browser chats. If the check requests a cooldown, wait about one minute before trying again.

### Terminal method (same installer)

For the usual Downloads folder name:

```sh
cd "$HOME/Downloads/LLMs-Monitor-Codex-Helper-v1.30.1"
python3 ./install.py
```

If the extracted folder has another name or location, type `cd ` with a trailing space, drag that folder from Finder into Terminal, then press Return. Run `python3 ./install.py`; paste the extension ID at the prompt. Alternatively, type `python3 `, drag the extracted `install.py` file into Terminal and press Return. Do not use `sudo`, and do not substitute the main extension folder.

### Check a failure without displaying chat content

After installation, this diagnostic reports status / counts only:

```sh
"$HOME/Library/Application Support/LLMs Monitor/Codex/launch" --check
```

`status: ready` means metadata was read; `tasks: 0` is not proof of a failed installation. `runtime: metadata-only` means execution state could not be observed. `codex-not-found` means the helper could not discover a binary; `unavailable` means it could not read the local metadata. Terminal diagnostics and browser connection are separate checks because their environments can differ. Do not post authentication files or raw chat data when asking for help.

### Troubleshooting

| Symptom | What to check |
| --- | --- |
| “Manifest file is missing or unreadable” | The helper was selected in **Load unpacked**. Cancel; use the main extension folder there, and install this helper with the steps above. |
| `python3: command not found`, or Python below 3.9 | Install Python, open a new Terminal and check `python3 --version`; then rerun the installer. |
| Install.command does not open / execute | Confirm the ZIP was extracted; use the Terminal method. For a macOS security warning, verify the download source and follow the operating system’s normal review process; do not disable protections. |
| Extension ID rejected | Copy the current ID from **Connect Codex**. It must be exactly 32 letters a–p; omit spaces, URL prefixes and quotation marks. |
| **Connection enabled** but the list fails | Press **Check connection**; verify the helper, current ID and permission. The enabled label is not a successful host test. After saving drafts, fully quit and reopen that browser if it still cannot discover the newly registered host. |
| Works in Chrome but not Edge / another profile | Copy the ID in that browser’s connection page. This installer permits **one ID** and writes Chrome and Edge host entries with that same ID; installing a different ID replaces the previous allowance. Simultaneous different-ID connections are not supported by this installer. |
| CLI works in Terminal but browser cannot connect | GUI browser PATH can differ. Check the diagnostic and whether a recognized app-bundled binary exists. This release does not add a custom CLI-path setting. |
| List appears but state is **Unknown** | Installation may be correct. Only an existing shared App Server can supply live state; independent metadata reading cannot. Idle is not completed. |
| Pin audit is incomplete or expected tasks are absent | Coverage is local to the selected Codex data directory, up to 500 tasks. Different `CODEX_HOME`, remote hosts or version changes can produce a different list. Browser account matching is not verified. |

### Files, updates and removal

Installer writes only this user’s helper and the two specific native host manifests:

- `~/Library/Application Support/LLMs Monitor/Codex/`
- `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json`
- `~/Library/Application Support/Microsoft Edge/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json`

No network listener or login-startup service is installed. The installer fixes the Python executable path used at installation; after removing/moving that Python, reinstall with the desired Python and the current extension ID. A main extension version update does not require reinstalling an unchanged helper when its ID stays the same. A different extension ID requires rerunning the installer.

**Disable** in the connection page stops the integration and removes its optional permission. To uninstall, disable it first, then remove only the three paths above. Leave other native hosts and Codex data intact. Installation copies the runtime into Application Support, so the extracted Downloads folder is not needed afterward. Browser work notes are separate; export them before changing browser/site storage.

## Linux / Windows

Linux: extract the same ZIP; in its extracted directory run `python3 install.py`, paste the extension ID, then use **Enable connection → Check connection → Refresh list**. Python 3.9+ and discoverable Codex are needed. Helper location: `~/.local/share/llms-monitor/codex/`; host manifests: `~/.config/google-chrome/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json` and `~/.config/microsoft-edge/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json`. Nonstandard / sandboxed browser distributions are not live verified.

Windows: this installer rejects Windows. There is no Windows installer, registry registration or Windows executable in the current helper. Browser-only LLMs Monitor features remain available; no Windows helper procedure is claimed yet.

## Read-only scope and verification

Titles, IDs, explicit local pins, update times and evidenced states only. No previews, turns, drafts, credentials or execution commands are forwarded. Automatic lists remain in the task window’s memory. Desktop pins use a version-sensitive local compatibility adapter, audited against that local ID list, not all accounts/remote hosts. The helper can start an independent read-only stdio App Server for metadata; it does not start/restart the desktop app or its shared server. Live states require an existing shared server and expire after 90 seconds.

Installer paths and ID validation are checked by code / isolated tests. Completing the steps on installed macOS Chrome / Edge and Linux still requires live acceptance; this documentation update is not an installation on your computer. See [tasks and work notes](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md) and [Chrome native messaging](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging).

<a id="ja"></a>

## 日本語

このヘルパーは、同じ端末のCodexタスク・ピン留めを **［ChatGPT］→［タスク詳細］→［Codex — デスクトップ］** に表示する任意の連携です。ブラウザ版ChatGPTの会話一覧とは別経路で、通常のブラウザ会話を取得するだけなら不要です。

**ヘルパーZIPはChrome拡張機能ではありません。** 中身は `README.md`、`Install.command`、`install.py`、`codex_host.py` で、拡張機能用 `manifest.json` はありません。Chrome／Edgeの［パッケージ化されていない拡張機能を読み込む］には、別の本体拡張ZIPを展開したフォルダーを指定します。

| OS | 現行ヘルパーの対応状況 | 導入方法 |
| --- | --- | --- |
| macOS | Google Chrome／Microsoft Edge用インストーラーあり | 下記の手順。Python 3.9以上と検出可能なCodexが必要 |
| Linux | 標準のGoogle Chrome／Microsoft Edgeの配置に対応。Linux実機受入は未完了 | ZIP展開後に `python3 install.py`、ID入力、権限を有効化 |
| Windows | インストーラー未対応 | このインストーラーは使えません。WSLへの導入でもWindowsブラウザーへの登録にはなりません |

この表は **LLMs Monitorヘルパー** の対応状況です。Codex本体の対応OSとは別です。Safari／Firefox／ChromiumやLinuxのサンドボックス型ブラウザー配布は、このインストーラーの対応範囲に含めていません。

<a id="macos-ja"></a>

## macOS：インストールから表示まで

### 1．連携画面を開き、拡張機能IDをコピー

本体拡張機能が導入・接続されているChromeまたはEdgeのプロファイルで、LLMs Monitorを開きます。

**［ChatGPT］→［タスク詳細］→［Codex — デスクトップ］→［Codexを接続］** の順に進み、専用の連携画面を開いたままにします。ここに表示される **拡張機能ID（a〜pの英小文字32文字）** をコピーしてください。ChatGPTのアカウント名やサイトURLではありません。

### 2．Pythonを確認

Finderの［アプリケーション］→［ユーティリティ］→［ターミナル］を開き、次を入力してReturnを押します。

```sh
python3 --version
```

**Python 3.9以上** が必要です。見つからない／古い場合は [PythonのmacOS向けダウンロード](https://www.python.org/downloads/macos/) と [公式導入説明](https://docs.python.org/3/using/mac.html) に従って、サポート中のPythonを導入し、新しいターミナルを開いて確認します。Python本体の導入で管理者権限を求められる場合はありますが、**ヘルパーの導入に管理者権限は不要**です。pipによる追加ライブラリー導入も不要です。

### 3．同じMacにCodexがあることを確認

一覧に出したいタスクがあるCodexを、このMacで利用していることを確認します。ヘルパーはブラウザーから起動した環境のPATH上の `codex`、続いて `/Applications/ChatGPT.app` または `/Applications/Codex.app` 内の所定の同梱実行ファイルを探します。

別途CLIを入れている場合は `codex --version` で確認できます。このコマンドが見つからなくても、認識できる同梱実行ファイルがある場合は連携できます。Codexがない場合は [OpenAI公式のCodex CLI導入説明](https://learn.chatgpt.com/docs/codex/cli) を参照してください。ターミナルでCLIが動くことと、ブラウザーから検出できることは別の確認です。

### 4．ヘルパーをダウンロードし、ZIPを展開

［Codexを接続］画面のリンク、または [Codexヘルパー v1.30.1](https://llmsmonitor.ntus.info/LLMs-Monitor-Codex-Helper-v1.30.1.zip) からダウンロードします。

Finderの［ダウンロード］でZIPをダブルクリックして展開し、**展開後のフォルダー** を開きます。ZIPのプレビュー画面から実行せず、Chromeの拡張機能読込にも指定しません。

### 5．インストーラーを実行し、IDを入力

展開した中の **`Install.command` をダブルクリック** します。ターミナルが開き、次の入力を求められます。

```text
LLMs Monitor extension ID / 拡張機能ID:
```

手順1でコピーしたIDを貼り付け、Returnを押します。**`Installed.`／`導入完了。`** と表示されれば登録完了です。もう一度Returnでウィンドウを閉じられます。この表示はヘルパーの登録成功で、ブラウザーからの接続成功は次の手順で確認します。

ダブルクリックで実行できない場合は、次のターミナル方式を使ってください。隔離属性の削除やmacOSの保護機能の無効化は行いません。

### ターミナルから実行する方法

展開先が通常の［ダウンロード］なら、次を順に実行します。

```sh
cd "$HOME/Downloads/LLMs-Monitor-Codex-Helper-v1.30.1"
python3 ./install.py
```

フォルダー名・場所が違う場合は、ターミナルに `cd `（末尾に半角スペース）まで入力し、Finderから展開後のフォルダーをドラッグしてReturnを押します。その後 `python3 ./install.py` を実行してください。別の方法として `python3 ` と入力し、展開後の `install.py` をドラッグしてReturnを押しても実行できます。

表示された質問に拡張機能IDを貼り付けます。**`sudo` は使いません。** 本体拡張機能のフォルダーではなく、ヘルパーのフォルダーを指定してください。

### 6．接続を有効にし、実際に確認

［Codexを接続］画面へ戻り、**［接続を有効にする］** を押し、ネイティブ連携用の任意権限を許可します。

「接続は有効です」は設定と権限の状態を表すだけです。続いて **［接続を確認］** を押し、次のような取得結果が出ることを確認します。

```text
取得 N件 · ピン留め P/Q件 · 状態接続あり
```

または

```text
取得 N件 · ピン留め P/Q件 · 一覧のみ・状態未確認
```

後者も一覧取得には成功しています。現在の稼働状態だけが観測できていません。

### 7．タスク詳細へ戻り、一覧を更新

ChatGPTのタスク詳細で **［自動取得 ON］→［一覧を更新］** と進みます。ブラウザ会話とは別の **［Codex — デスクトップ］** 欄にCodexの一覧が表示されます。「1分ほど待って再確認」と出たら、連続して押さず約1分待ちます。

### うまくいかない場合

| 症状 | 確認・対処 |
| --- | --- |
| 「マニフェスト ファイルが見つからないか読み取れません」 | ヘルパーを拡張機能として読み込んでいます。キャンセルし、拡張の読込には本体フォルダーを使用。ヘルパーは上記手順で導入します。 |
| `python3: command not found`／Pythonが3.9未満 | Pythonを導入し、新しいターミナルで版を確認。そのPythonでインストーラーを再実行します。 |
| `Install.command` が開かない／実行されない | ZIPを展開済みか確認し、ターミナル方式を使用。macOSの警告が出た場合は配布元を確認し、OSの通常の確認手順に従います。保護機能は無効にしません。 |
| 拡張機能IDが不正と表示 | 現在の連携画面から、a〜pの32文字を再コピー。URL、空白、引用符を付けません。 |
| 「接続は有効です」なのに取得できない | ［接続を確認］で実際の取得結果を確認。導入済みヘルパー・現在のID・権限を照合。新しい登録を認識しない場合は、入力を保存してからブラウザーを完全終了し、開き直して再確認します。 |
| Chromeで動くがEdge／別プロファイルで動かない | そのブラウザーの連携画面にあるIDを確認。現在のインストーラーが許可するIDは1つで、Chrome／Edgeへ同じIDを登録します。別IDで導入すると前の許可を置換します。異なるIDでの同時連携は未対応です。 |
| ターミナルではCodexが動くがブラウザーで取得不可 | ブラウザーの起動環境ではPATHが異なる場合があります。下記の診断と同梱実行ファイルの配置を確認。現行ヘルパーには任意のCLIパスを指定する設定はありません。 |
| 一覧は出るが「状態未確認」 | 導入失敗とは限りません。既存の共有サーバーから状態を取得できないと、一覧のみになります。待機は作業完了を意味しません。 |
| ピン照合が未完了／タスクが足りない | 対象はその端末のCodex保存一覧（最大500件）。別のCODEX_HOME・別ホスト・形式変更は別問題です。ブラウザーとのアカウント一致は確認していません。 |

導入後、次の診断は状態と件数だけを表示します。会話本文やタイトルは出しません。

```sh
"$HOME/Library/Application Support/LLMs Monitor/Codex/launch" --check
```

`status: ready` はメタ情報取得成功、`tasks: 0` は0件であり、それだけで導入失敗とは判断しません。`runtime: metadata-only` は稼働状態未観測、`codex-not-found` は実行ファイル未検出、`unavailable` はメタ情報取得不能です。ターミナルの診断とブラウザー接続は環境が異なるため別々に確認します。相談時に認証ファイルや生のチャットデータを貼り付ける必要はありません。

### 保存先・更新・削除

導入先は現在のユーザーの次の3か所です。

- `~/Library/Application Support/LLMs Monitor/Codex/`
- `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json`
- `~/Library/Application Support/Microsoft Edge/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json`

ポート公開・ログイン時の自動起動は追加しません。導入時のPython実行ファイルの場所を記録するため、そのPythonを削除／移動した場合は使いたいPythonで再導入してください。**拡張機能IDが同じなら、本体の版更新だけで未変更ヘルパーを入れ直す必要はありません。** IDが変わった場合は再導入します。

停止は連携画面の **［無効にする］**。完全削除する場合は先に無効化し、上記3か所だけを削除します。他のネイティブ連携設定・Codexデータは削除しません。導入時に実行ファイルをApplication Supportへコピーするため、導入後は展開元のダウンロードフォルダーを残す必要はありません。作業メモは別保存なので、ブラウザー／サイトの保存領域を変える前に書き出してください。

## Linux／Windowsについて

Linux：同じZIPを展開し、そのフォルダーで `python3 install.py` を実行してIDを入力します。その後は［接続を有効にする］→［接続を確認］→［一覧を更新］。Python 3.9以上と検出可能なCodexが必要です。ヘルパーは `~/.local/share/llms-monitor/codex/`、設定は `~/.config/google-chrome/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json` と `~/.config/microsoft-edge/NativeMessagingHosts/info.ntus.llmsmonitor.codex.json`。標準配置以外・サンドボックス型ブラウザー配布では実機確認していません。

Windows：現行インストーラーはWindowsを受け付けません。Windows用実行ファイル・インストーラー・レジストリ登録処理は未実装です。ブラウザーだけで利用するモニター機能とは別の制約で、Windows向けヘルパー導入手順はまだ提供しません。

## 取得範囲と確認状況

タイトル・ID・ローカルピン・更新日時・根拠のある状態だけを渡し、会話本文・preview・入力・認証情報・実行コマンドは渡しません。自動一覧はタスク窓のメモリー内。端末内ピン形式は互換読取で、そのID一覧との照合までが対象です。他ホスト／全アカウント保証ではありません。

メタ情報を読むための独立したstdio App Serverを起動する場合はありますが、デスクトップアプリや共有サーバーを自動起動／再起動しません。稼働状態には既存共有サーバーの観測が必要で、有効期間は90秒です。

配置・ID判定はコード／隔離テストと照合済みですが、更新後のmacOS Chrome／Edge・Linux実機での導入受入は別途必要です。この取説更新では利用者の端末へインストールしていません。[タスク・作業メモ取説](https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md#ja)・[Chrome公式のネイティブ連携説明](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)も参照してください。

## Updating from helper 1.30.0 / v1.30.0からの更新

EN: Download the v1.30.1 ZIP linked above or in LLMs Monitor’s ChatGPT task window, extract it and run its installer with the ID from the same browser’s **Connect Codex** page. The unchanged extension v1.33.0 setup still offers helper v1.30.0; use the new task-window/guide link for this update. Save drafts before closing applications. No main extension reinstall is needed. Shared connection attempts are limited to four seconds so the independent metadata path can still read the list within the total 21-second acquisition budget. Ready metadata may still have Unknown runtime. Installation is one-time, not required each refresh.

JP: 上記リンクまたは **LLMs Monitor → ChatGPTカードの［タスク詳細］→［Codex — デスクトップ］** の新しいリンクからv1.30.1 ZIPを取得・展開し、同じブラウザーの［Codexを接続］画面にあるIDでインストーラーを実行します。変更していない拡張機能v1.33.0の接続設定画面は旧v1.30.0を案内するため、今回は新しいタスク画面／取説のリンクを使ってください。拡張機能の入れ直しは不要。共有接続の待機は最大4秒で切り上げ、取得全体21秒の中で代替一覧を読む時間を確保します。一覧を取得しても稼働状態は未確認の場合があります。導入は初回・更新時だけで、毎回の更新操作にインストールは不要です。
