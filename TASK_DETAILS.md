# LLMs Monitor — Task Details Trial

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

Web UI **1.23.1** · Extension/package **1.23.0**, unchanged.

## Scope and architecture

Each visible service card links to a separate task window. The launcher requests a normal 420×780 popup after a click; if blocked, the anchor opens a separate tab. Resizing is left to the browser/OS; rendering never resets dimensions. This is not an always-on-top PiP window and does not share the existing floating window’s lifecycle. Closing/reloading the main monitor does not close/reload task windows.

- `web/task-launcher.js`: only mounts the localized links in existing card action rows, updates URL language/theme, and opens the independent window. No quota state, extension RPC or storage access. Rerendered cards get one launcher each; official-usage buttons retain their original action.
- `web/tasks.html` / `tasks.css`: independent route, responsive single-column layout, sticky header and scrollable page, EN/JP and dark/standard controls. No fixed minimum/maximum CSS window dimensions. It does not import monitor styles or scripts.
- `web/tasks-model.js`: pure normalization, hierarchy validation, project/kind grouping, filtering and clearly synthetic demo. Used directly by Node tests.
- `web/tasks-page.js`: DOM-only renderer and user-driven file read, filter, disclosure and clipboard controls. No HTML injection, network, RPC, audio or persistent storage.
- `build.py`: copies these Web-only files and adds the launcher script to generated index.html. The existing extension source and ZIP remain unchanged. Shared APP_VERSION stays 1.23.0 to avoid a false compatibility warning; only the Web footer/added asset queries become 1.23.1.

URLs select `service=chatgpt|claude|gemini`, optional `lang=ja|en` and `theme=dark|standard`. Invalid service defaults to ChatGPT; invalid language uses the environment (`ja*` → Japanese, otherwise English). Main-page language/theme are inherited when opening. Subsequent task-window choices affect only that window and are not saved or sent back.

## Data connection boundary

**Automatic provider or Codex task acquisition is not implemented in this trial.** Codex desktop tools returned ordinary ChatGPT and Codex chat metadata in the user’s workspace. This connector is available to the agent, not to arbitrary static Web JavaScript. Retrieved project membership is verified structure; titles alone never imply task parentage. Sidebar idle does not establish goal completion. A recent response’s completed turn does not establish that the overall task is done.

A real private snapshot was exported separately from the repository for this user, covering pinned chats plus up to 50 recent unpinned chats. It is not an all-account inventory. It contains titles, project labels, observations, last-update times and listed summaries, not complete messages, credentials or account emails. It must never be added to Git or the deployed directory. Claude/Gemini have the same independent view and JSON contract, but their live task sources remain unverified. The demo is opt-in and clearly labelled synthetic.

## JSON contract

A file is selected with **Open task list (JSON)**. UTF-8 encoded size ≤524,288 bytes, ≤500 nodes, ≤12 levels. The schema is versioned separately from app/extension releases:

```json
{
  "schemaVersion": 1,
  "service": "chatgpt",
  "source": "local-export",
  "capturedAt": "2026-10-09T14:00:00Z",
  "coverage": "Example only; not the complete account",
  "tasks": [
    {
      "id": "example-1",
      "title": "Example task",
      "projectId": "example-project",
      "projectTitle": "Example project",
      "kind": "chat",
      "status": "unknown",
      "updatedAt": "2026-10-09T13:59:00Z"
    }
  ]
}
```

These are fictitious examples. `source` is a format label (`codex-app`, `local-export`, `demo`), not proof of provenance. Imported files always display as local snapshots without a live connection. `capturedAt` is a required parseable ISO timestamp. `coverage` is optional and capped at 250 characters.

| Node field | Contract |
|---|---|
| `id` | Required unique nonempty string, ≤120 characters; no silent shortening of IDs. |
| `title` | Required nonempty text, capped at 200 characters. |
| `parentId` | Optional existing node ID. Same project and kind; cycles and depth >12 are rejected. No inferred parent links. |
| `projectId` / `projectTitle` | Optional project ID (≤120); nonempty title (≤100) required when ID is present. The same ID cannot carry conflicting titles. Missing ID groups under No project. |
| `kind` | `codex` only for ChatGPT; otherwise `chat`. Group by project **and** kind. |
| `status` | `running`, `idle`, `waiting`, `completed`, `failed`, `unknown`. Unrecognized states become unknown; idle is never converted to completed. |
| `updatedAt` | Optional ISO timestamp; missing/invalid shows —. |
| `summary` | Optional bounded text, ≤500 characters. Not required or inferred. |
| `url` | Optional exact provider HTTPS conversation route (`chatgpt.com/c/…`, `claude.ai/chat/…`, `gemini.google.com/app/…`). Reject credentials, nondefault ports, query, fragment, other hosts/routes. Unsupported links are omitted. |

Unknown fields are discarded; no token/password/body field is retained. Control characters are sanitized. Invalid schema, missing IDs/titles, duplicate IDs, missing parents, cross-project/cross-kind parents or cycles reject the whole file and leave the prior snapshot intact. Service must match the window; a Claude file cannot populate ChatGPT.

## Rendering and interaction

Native `details`/`summary` provide keyboard-accessible project and task disclosure. Projects are open initially, node details collapsed. Node details contain last-update time, optional summary, original-chat link and verified children. Search matches title/project/summary; status filters include matching nodes plus their ancestors to keep valid hierarchy. Active search/filter expands the matching paths. Expand/collapse affects the task view only. Repainting for language/theme preserves open states when not filtering.

All imported states are explicitly observations. Running and idle badges say “at capture”; completed/failed are reported states, not inferred. After five minutes the capture area warns that it is a historical snapshot. Count is shown as displayed nodes / total nodes, including ancestors required for the filtered tree. Copy includes provider, capture time, local/demo label and the filtered tree. If clipboard access is unavailable, a selectable readonly text dialog appears. Clear discards the snapshot, not any usage history.

Each window holds one snapshot in memory. No automatic file read, auto-refresh, polling, persistence, export to a server or screenshot capture occurs. Reload, close or Clear discards its data; reopening requires an explicit import. Windows have no opener after launch. Popup fallback anchors use `target=_blank` and `rel=noopener noreferrer`. Ctrl/Command-click follows the normal safe anchor.

## Security and next adapters

The task route uses `default-src 'none'`, self-only script/style and `connect-src 'none'`, with objects/base/form action denied. Text is inserted through textContent, not innerHTML. No cookies, API credentials, OS files, usage GET response, diagnostic database or shared localStorage are read by these modules. Ordinary navigation to validated original-chat links occurs only on user click.

Future live adapters must be separately authorized and tested. They must supply this normalized contract through an authenticated local/account-scoped bridge, minimize fields, prevent cross-account reuse, expose source and observation time, distinguish unavailable/stale from running/completed, and fail without touching quota modules. Adding extension integration requires the normal package minor release, a separate message boundary and explicit task collection controls. Do not hide task fetching inside the existing usage refresh or include task bodies in its GET response. No provider endpoint should be guessed from this prototype.

## Verification

Automated model tests cover provider/kind separation, idle semantics, valid ancestry, matching-child ancestor retention, missing parents, duplicate IDs, cycles, depth/count/byte limits, hostile links/text, credential-field stripping and explicit demos. A VM executes the real launcher against repeated card renders and checks provider URL, preserved usage buttons, language/theme, tall popup dimensions, opener severing and blocked-popup tab fallback. Run `node --test tests/*.test.cjs`, `python3 build.py`, `git diff --check` and compare ZIP SHA-256 and every extension source against the baseline.

Verified on 2026-10-09: all 178 regression tests passed, the Web build and diff checks passed, and the private 57-node ChatGPT snapshot passed the actual model parser. All 68 tracked extension files are byte-identical to the baseline; package SHA-256 remains `81c664f12a0b0899127a688c75516700b6d0b75da2229a0c3d53b4f4964570bb`. Browser/OS visual checks have not run: the isolated headless browser could not launch in the sandbox, and screen-operation permission remains pending. No native resize/fullscreen/visual result is claimed.

Browser checks should cover 420×780, 280×700 and 800×600, both languages/themes, import/demo, filtering, disclosure, copy fallback, invalid-import retention and Clear. Check the main monitor at normal/fullscreen viewport sizes after adding launchers. Native window-manager behavior and signed-in provider task adapters remain manual/unimplemented gates; passing unit tests does not establish live task acquisition.

---

<a id="ja"></a>

# 日本語 — タスク詳細の試作仕様

[🌍 EN](#en) · [🇯🇵 JP](#ja)

Web **1.23.1**。拡張機能・配布ZIPは **1.23.0のまま**。

## 分離と起動

各表示カードに［タスク詳細］を加え、クリック時に初期420×780の縦長通常小窓を要求する。ブロック時は安全な別タブへ戻す。OS/ブラウザーが許す範囲でサイズ変更でき、描画で寸法を戻さない。最前面PiPではなく、既存フローティングの起動・終了処理も流用しない。主画面の終了・再読込から独立する。

`task-launcher.js` は起動リンクだけを加え、既存の利用状況確認ボタンを残す。残量RPC・保存・通知を使わない。`tasks.html` / `tasks.css` は独立画面と配色、`tasks-model.js` は正規化・入力検証・分類・検索、`tasks-page.js` は読込と描画だけを担当する。通常のビルドでWeb配布物へコピーし、拡張機能ソース・ZIP・互換性版は変更しない。

`service` はchatgpt/claude/gemini、`lang` はja/en、`theme` はdark/standard。不正なサービスはChatGPTへ、不正言語は環境がja始まりなら日本語、それ以外は英語へ戻す。起動時の主画面設定を引き継ぐが、別窓内の切替はその窓だけに適用し、保存・主画面へ送信しない。

## 取得の範囲

**各社・Codexからのタスク自動取得は未接続。** Codex専用ツールから通常ChatGPT・Codexのメタ情報は取得できたが、この機能を静的Webから直接呼べるわけではない。プロジェクト所属は取得結果を使い、名称から作業の親子を推測しない。待機は作業完了ではなく、直近応答の処理完了も全体の目標達成を意味しない。

実一覧はリポジトリ外の非公開ローカルJSONに書き出し、［タスク一覧を開く（JSON）］で読み込む。範囲はピン留め＋直近最大50件であり、全アカウント履歴ではない。名称・所属・状態・更新日時・一覧の要約に限定し、応答全文や認証情報は含めない。個人のJSONをGit/公開配布物へ入れない。Claude/Geminiは同じ読込契約と表示を用意するが、実取得は未検証。サンプルは任意操作で架空と明示する。

## 入力契約

上のJSON例は架空の形式例。UTF-8で524,288bytes、500件、12階層以内。`schemaVersion=1`、画面と同じ`service`、ISOの`capturedAt`、`tasks`配列を必須とする。`source` は形式区分だけで真正性の証明ではない。読込データは常に端末内一覧・自動接続なしと表示する。

IDは一意・非空・120文字以内で勝手に短縮しない。名称は非空200文字以内。親IDは同じプロジェクト・同じ種別の存在する要素に限り、循環・12階層超を拒否する。プロジェクトID120文字以内、名称100文字以内とし、同じIDに異なる名称を許可しない。種別は通常chat、ChatGPTだけcodexを許可する。状態はrunning/idle/waiting/completed/failed/unknownで、未知の状態は未確認に戻す。更新日時は任意で、不正/欠落なら—。要約500文字、取得範囲250文字まで。不要フィールドを破棄し、token/password/bodyを保持しない。

リンクは対象事業者の厳密HTTPSチャットパスだけ。ChatGPT `/c/…`、Claude `/chat/…`、Gemini `/app/…` とし、別ホスト・認証情報・別port・query・fragment・未対応パスを除外する。型不正、重複ID、不明な親、別サービス/別プロジェクト/別種別の親、循環はファイル全体を拒否し、前回一覧を保つ。

## 表示・破棄・安全性

ツリーはキーボード操作可能なdetails/summaryで表示し、初期状態はプロジェクトを開き、各タスクを閉じる。名称/所属/要約を検索し、状態絞り込みの一致要素と親を残す。検索中は該当経路を展開する。日英・テーマ切替時は通常の開閉状態を保持する。タスク詳細には更新日時、任意要約、元チャットリンク、明示された子を表示する。

実行中/待機は取得時点と明示し、完了/失敗も報告値として扱う。5分以上前は過去一覧と表示する。件数は表示要素/全件で、親保持分を含む。コピーは取得時刻、ローカル/サンプル区分、絞り込み後のツリーを含める。コピー不可なら選択可能なreadonlyテキストを別ダイアログに出す。

一覧は窓内メモリーだけ。自動読取・更新・ポーリング・永続保存・サーバー書出し・画面撮影をしない。消去・再読込・窓終了で破棄し、再表示は明示読込とする。主画面/履歴には影響しない。openerを切り、別タブリンクはnoopener/noreferrerを使う。

CSPはdefault-src none、script/style self、connect-src none、object/base/form-action none。textContent描画とする。Cookie・API認証情報・OSファイル・利用量GET・診断DB・共通localStorageを読まない。将来の自動取得は別途検証した認証付きローカル/アカウント別アダプターに限定し、観測時刻・取得不能・古い値・実行状態を区別する。拡張機能へ追加するなら中間版番号を増やし、独立メッセージ境界と明示的収集操作を設ける。既存の使用量更新/GETへ混ぜず、事業者APIを推測しない。

## 検証

入力・親子・件数/容量・悪意あるリンク/文字・認証情報破棄・架空表示と、実際の起動スクリプトを再描画/言語/テーマ/ブロック時でテストする。既存全テスト、Webビルド、差分検査、ZIPハッシュ・拡張全ソースの一致を確認する。画面は420×780、280×700、800×600、日英/両テーマ、読込/検索/開閉/コピー/不正入力時保持/消去を確認し、通常/全画面モニターの表示も点検する。ネイティブ小窓の操作性、各社の実取得は別の未確認/未実装事項であり、単体テスト成功を実取得成功と報告しない。

検証記録（2026-10-09）：全178件の回帰テスト、Webビルド、差分検査に合格。取得済み57件の非公開一覧は実際のモデルで解析できた。拡張機能の全68ファイルは変更前と同一で、ZIPのSHA-256は `81c664f12a0b0899127a688c75516700b6d0b75da2229a0c3d53b4f4964570bb` のまま。独立ブラウザーはサンドボックス内で起動に失敗し、画面操作の許可は回答待ちのため、実画面・ネイティブリサイズ・全画面レイアウトは未確認。
