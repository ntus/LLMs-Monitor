/* Product guide uses static copy only; no provider, notes or monitor state access. */
(function(root){
 'use strict';
 const GUIDE={
  "en": {
    "eyebrow": "START HERE, COME BACK WHEN NEEDED",
    "title": "From first connection<br>to your next task.",
    "intro": "A practical guide to everyday use. Read in order, or jump to the feature you need.",
    "toc": "On this page",
    "revision": "Guide updated 12 October 2026 · Web 1.43.0 / extension 1.43.0 · helper 1.30.2",
    "chapters": [
      {
        "id": "setup",
        "title": "Connect your browser",
        "blocks": [
          {
            "type": "p",
            "text": "Use desktop Chrome or Edge on macOS, Windows or Linux. Ordinary usage monitoring does not require the Codex helper."
          },
          {
            "type": "steps",
            "items": [
              "Download and extract the main extension ZIP. Until store publication, open chrome://extensions or edge://extensions, enable Developer mode and use Load unpacked to select the main folder containing manifest.json.",
              "Sign in to the official ChatGPT, Claude and Gemini sites in that same browser profile. Enter login details only on their official sites.",
              "Open the monitor, copy the 32-letter ID from extension details and enter it in Extension ID, then Connect. The extension’s own monitor does not need Web pairing.",
              "Keep the browser running. Supported usage and official incidents update about once a minute. Allow time after first connection or sleep; use Refresh now if needed."
            ]
          },
          {
            "type": "link",
            "text": "Download main extension v1.43.0 ↓",
            "url": "LLMs-Monitor-v1.43.0.zip"
          },
          {
            "type": "note",
            "text": "Update the existing unpacked folder in place and reload the extension. Do not uninstall or clear storage. If the folder change creates a new ID, update Web pairing and the Codex helper’s allowed ID too."
          }
        ]
      },
      {
        "id": "usage",
        "title": "Read usage and reset times",
        "blocks": [
          {
            "type": "p",
            "text": "The large dial shows the main remaining allowance; bars show weekly or other windows. Compare reset dates and countdowns before choosing where to work."
          },
          {
            "type": "table",
            "columns": [
              "Display",
              "Meaning"
            ],
            "rows": [
              [
                "Percentage",
                "Remaining usage obtained from official information. Windows differ by provider."
              ],
              [
                "— / unavailable",
                "A value could not be confirmed. This is different from zero."
              ],
              [
                "Previous value",
                "An older result retained after acquisition failed; it is labelled separately."
              ],
              [
                "Expired",
                "A cached window passed its reset time. It is not replaced with an invented 100% before fresh acquisition."
              ]
            ]
          },
          {
            "type": "list",
            "items": [
              "ChatGPT’s five-hour and weekly windows cover Work / Codex, not ordinary chat allowance.",
              "Claude / Gemini show supported windows visible in official information. Availability depends on the account and provider UI.",
              "Credits, reset entitlements and API balances are separate from plan quotas. Check their deadlines. Purchases and reset actions are never automatic.",
              "Changed values are kept in local history per window. Sleep, throttling and provider delays mean this is not a second-by-second guarantee."
            ]
          }
        ]
      },
      {
        "id": "display",
        "title": "Choose a comfortable view",
        "blocks": [
          {
            "type": "list",
            "items": [
              "Fullscreen enlarges usage and history for planning or a dedicated display.",
              "Place a compact popup or floating panel beside your work. Always-on-top opens through a user action in supported browsers. Window size and transparency support depend on the browser and OS.",
              "Choose light / dark, English / Japanese and opacity. Reorder or hide services; hidden services still acquire usage and record history.",
              "Task details on each usage card opens that provider’s independent tall task window beside the main monitor."
            ]
          }
        ]
      },
      {
        "id": "alerts",
        "title": "Understand sounds and incidents",
        "blocks": [
          {
            "type": "p",
            "text": "Numeric usage changes and official service incidents are checked separately. Open Official status to read a provider’s incident details."
          },
          {
            "type": "list",
            "items": [
              "Sound OFF cancels queued tones too. Closing the main monitor does not stop the installed extension’s checks. Turn sound OFF to mute them.",
              "Preview is a single test playback and does not change ON / OFF. Adjust volume as needed; browser / OS rules may require an initial gesture.",
              "Numeric changes play at most three tones, one second apart. Downward crossings of 5% and 1% use distinct caution tones. Only changed numbers blink."
            ]
          },
          {
            "type": "note",
            "text": "Enable free Tibo connections in the monitor, then keep a signed-in public Tibo profile/post open. Rendered posts are checked each minute without reloading. A future announced EOD PST deadline gets a dated Tibo 𝕏 Reset? link; its tooltip explains the approximate deadline and the mark disappears at expiry. Undisplayed new posts cannot be detected. Server delivery remains unconfigured; personal quota recovery is separate."
          },
          {
            "type": "link",
            "text": "Open Tibo 𝕏 ↗",
            "url": "https://x.com/thsottiaux"
          }
        ]
      },
      {
        "id": "tasks",
        "title": "Browse tasks, pins and states",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "Open Task details for a provider. Compact bars also show its usage and incident.",
              "Auto ON reads the official list about once a minute. Refresh list refreshes LLMs Monitor’s acquired list; it does not send a chat message or execute a task.",
              "Search by task or project and filter by state. Work notes, Pinned and Task details can each collapse; they start expanded."
            ]
          },
          {
            "type": "table",
            "columns": [
              "State mark",
              "How to read it"
            ],
            "rows": [
              [
                "🟢 Generating / running",
                "An explicit control or runtime state was observed."
              ],
              [
                "🔵 Response idle / idle",
                "Waiting for the next input does not mean work is completed."
              ],
              [
                "🟠 Awaiting input / approval",
                "An evidenced waiting state, separate from manually written notes."
              ],
              [
                "⚪ Unknown",
                "State could not be observed; closed ordinary chats may remain Unknown."
              ]
            ]
          },
          {
            "type": "note",
            "text": "Pinned contains detected official pins, not a guaranteed complete account inventory. Pinning a project does not pin all its conversations. Browser ChatGPT and desktop Codex use separate acquisition paths."
          }
        ]
      },
      {
        "id": "notes",
        "title": "Keep favorites and work notes",
        "blocks": [
          {
            "type": "p",
            "text": "Use Favorites for conversations and threads you return to. Titles reopen the original link. This is a local monitor list, separate from official 📌 pins."
          },
          {
            "type": "steps",
            "items": [
              "Click ☆ on a conversation, thread or Codex task to save its title and link in Favorites. Existing saved work notes carry over.",
              "Use Edit to write purpose, current situation, next actions, waiting items, resume cautions and a checklist; Save notes. Register work note on a supported official chat also opens the editor.",
              "Drag ⋮⋮ to reorder, or focus the handle and press Up / Down. Order is saved per provider and workspace.",
              "Click ★ to remove a favorite. Its note remains editable under Other work notes, even if the conversation is absent from the latest list.",
              "For a new chat, Copy handoff and paste it yourself. Use JSON export / import for backups and deliberate transfers."
            ]
          },
          {
            "type": "note",
            "text": "Workspace is your own label; blank means Shared. It is not an automatically detected provider account. Different browsers, profiles and site origins have separate storage, with no automatic sync. Manual note state is distinct from observed execution state."
          }
        ]
      },
      {
        "id": "codex",
        "title": "Connect desktop Codex",
        "blocks": [
          {
            "type": "p",
            "text": "An optional helper shows this computer’s Codex tasks and local pins separately in ChatGPT Task details. It is installed once, independently from ordinary monitoring."
          },
          {
            "type": "table",
            "columns": [
              "Platform",
              "Codex helper"
            ],
            "rows": [
              [
                "macOS",
                "Installer for Chrome / Edge; follow the steps below."
              ],
              [
                "Linux",
                "Extract and run python3 install.py. Nonstandard paths and live Linux acceptance are unverified."
              ],
              [
                "Windows / iOS / Android",
                "Current helper unsupported. Dedicated applications and these OS targets are future requirements."
              ]
            ]
          },
          {
            "type": "steps",
            "items": [
              "Open ChatGPT Task details → Codex — Desktop → Connect Codex and choose Save installer ZIP for this extension. The ID is included automatically.",
              "In macOS Terminal, check python3 --version. Python 3.9+ and Codex on this Mac are required.",
              "Download and extract helper v1.30.2. It is a native installer, not a Chrome extension; it has no manifest.json.",
              "Run Install.command; the personalized ZIP needs no ID entry. If double-click fails, run python3 ./install.py in the extracted folder. No sudo is needed.",
              "Enable connection and grant the optional native permission. Check connection must report N tasks and P/Q pins.",
              "Return to the task window and Refresh list. You do not run the installer each refresh. Re-register the allowed ID if the extension ID changes."
            ]
          },
          {
            "type": "link",
            "text": "Download Codex helper v1.30.2 ↓",
            "url": "LLMs-Monitor-Codex-Helper-v1.30.2.zip"
          },
          {
            "type": "link",
            "text": "Detailed macOS install / uninstall guide ↗",
            "url": "https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md#macos-en"
          },
          {
            "type": "note",
            "text": "Connection enabled describes settings and permission only. A reported task count confirms acquisition. Metadata only / Unknown still means list acquisition succeeded. Local pin matching does not prove coverage of other hosts/accounts or live runtime state."
          }
        ]
      },
      {
        "id": "api",
        "title": "Optional API billing balances",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "Open API connection for a provider and enable only the billing sources you want.",
              "Grant optional billing-page access on the setup-page click, then keep the official billing page open. No API-key paste is required.",
              "Read the obtained balance. Claude promotional credit has a separate line from purchased credit. If an official page exposes no supported value, it stays unavailable."
            ]
          },
          {
            "type": "note",
            "text": "API balances are separate from subscription-plan quotas. The monitor does not infer remaining credit from budget or spend, and does not purchase or charge anything."
          }
        ]
      },
      {
        "id": "help",
        "title": "Troubleshooting and backup",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "Issue",
              "Try first"
            ],
            "rows": [
              [
                "Usage unavailable",
                "Sign in to official sites in the same profile, check pairing ID and Refresh now. Check provider incidents and delays too."
              ],
              [
                "Codex enabled but no list",
                "Check connection must show a count. Match the Web pairing ID, setup-page ID and helper’s allowed ID."
              ],
              [
                "Native API unavailable despite granted permission",
                "Use Restart extension, reopen Connect Codex and check again. If unresolved, save drafts and fully quit / reopen the browser."
              ],
              [
                "Work-note registration fails",
                "Handoff expires after two minutes. Open it again from the official chat button. After extension updates, save drafts and reload existing official tabs."
              ],
              [
                "Notes missing",
                "Check provider, workspace, site origin and browser profile, plus Other work notes."
              ],
              [
                "Old UI after an update",
                "Reload monitor / task windows and check that the extension was updated in the same folder."
              ]
            ]
          },
          {
            "type": "p",
            "text": "Export notes as JSON before clearing browser data, moving devices or changing origins. Automatic lists stay in window memory; usage history/settings and explicitly saved notes remain local. Conversation bodies, drafts and credentials are excluded."
          },
          {
            "type": "link",
            "text": "GitHub user guide ↗",
            "url": "https://github.com/ntus/LLMs-Monitor#quick-start"
          },
          {
            "type": "link",
            "text": "Detailed tasks, favorites and work-note guide ↗",
            "url": "https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md"
          },
          {
            "type": "link",
            "text": "Privacy policy →",
            "url": "privacy.html"
          }
        ]
      }
    ]
  },
  "ja": {
    "eyebrow": "はじめての方も、使い方を確認したい方も",
    "title": "導入から、<br>作業の続きまで。",
    "intro": "毎日の使い方を、このページで一通り。順に読むことも、必要な項目だけ確認することもできます。",
    "toc": "使い方の目次",
    "revision": "2026年10月12日更新 · Web 1.43.0／拡張機能1.43.0 · ヘルパー1.30.2",
    "chapters": [
      {
        "id": "setup",
        "title": "まずは接続する",
        "blocks": [
          {
            "type": "p",
            "text": "Chrome／Edgeのデスクトップ版で使います。本体モニターはmacOS・Windows・Linux向けです。利用残量の取得にCodexヘルパーは必要ありません。"
          },
          {
            "type": "steps",
            "items": [
              "本体拡張機能のZIPをダウンロードし、展開します。ストア公開前はChromeの chrome://extensions、Edgeの edge://extensions を開き、デベロッパーモードをON。「パッケージ化されていない拡張機能を読み込む」で manifest.json のある本体フォルダーを選びます。",
              "同じブラウザー・同じプロファイルでChatGPT／Claude／Geminiの公式サイトへログインします。ログイン情報は公式サイトで入力します。",
              "モニターを開き、拡張機能の詳細画面にある32文字のIDを「拡張機能ID」へ入力して［接続］。拡張機能内のモニターを使う場合、このWeb側のID入力は不要です。",
              "ブラウザーを起動したままにすると、対応する利用残量と公式障害情報が約1分ごとに更新されます。最初の取得やスリープ後は少し待ち、必要なら［今すぐ更新］を押します。"
            ]
          },
          {
            "type": "link",
            "text": "本体拡張機能 v1.43.0 をダウンロード ↓",
            "url": "LLMs-Monitor-v1.43.0.zip"
          },
          {
            "type": "note",
            "text": "更新は同じ読込フォルダーへ上書きし、拡張機能を再読み込みします。アンインストールや保存領域の消去は不要です。フォルダー変更でIDが変わったら、Webの接続IDとCodexヘルパーの許可IDも揃えます。"
          }
        ]
      },
      {
        "id": "usage",
        "title": "残量表示を読み取る",
        "blocks": [
          {
            "type": "p",
            "text": "大きな円が主な利用枠の残量、下のバーが週間枠などを示します。リセット日時と残り時間を一緒に確認し、次に使うLLMを選びます。"
          },
          {
            "type": "table",
            "columns": [
              "表示",
              "意味"
            ],
            "rows": [
              [
                "数値の％",
                "公式から取得した残量。各社で利用枠の種類が異なります。"
              ],
              [
                "—／未取得",
                "値を確認できていません。残量0とは異なります。"
              ],
              [
                "前回の値",
                "取得できなかったときに残した過去の値です。現在値とは区別します。"
              ],
              [
                "期限切れ",
                "リセット予定を過ぎた保存値。再取得するまで100%へ自動で置き換えません。"
              ]
            ]
          },
          {
            "type": "list",
            "items": [
              "ChatGPT：表示する5時間・週間枠はWork／Codexの共通枠です。通常チャットの残量を示すものではありません。",
              "Claude／Gemini：公式画面から取得できる現在枠・週間枠などを表示します。契約や公式側の表示により取得できる内容は変わります。",
              "クレジット・リセット権・API残高は利用率とは別項目です。期限も確認してください。リセット権の使用やクレジット購入は自動実行しません。",
              "変化履歴は利用枠ごとに端末内で保持します。ブラウザー休止や公式側の報告遅延があるため、表示は常に秒単位で即時とは限りません。"
            ]
          }
        ]
      },
      {
        "id": "display",
        "title": "作業環境に合わせて表示する",
        "blocks": [
          {
            "type": "list",
            "items": [
              "［フルスクリーン］で残量と履歴を大きく表示。計画や常時表示に向いています。",
              "小窓・フローティング表示で作業の横へ配置。［最前面固定］は対応ブラウザーの操作で開きます。窓の大きさや透明度の対応範囲はブラウザー・OSによります。",
              "標準／ダーク、日英切替、表示の透明度を調整できます。サービスの並べ替え・非表示も可能です。非表示のサービスも取得と履歴記録を続けます。",
              "残量カードの［タスク詳細］から、サービスごとの独立した縦長画面を開けます。メイン画面と並べて使えます。"
            ]
          }
        ]
      },
      {
        "id": "alerts",
        "title": "通知音・障害・Tibo 𝕏を確認する",
        "blocks": [
          {
            "type": "p",
            "text": "残量の数値変化と、各社の公式障害情報は別々に確認します。障害の詳細は各社の［公式ステータス］で確認できます。"
          },
          {
            "type": "list",
            "items": [
              "［通知音 OFF］で予約済みの音も停止します。メイン画面を閉じるだけでは、拡張機能の取得・監視は停止しません。音を止めたい場合はOFFにしてください。",
              "［試聴］は確認用の一度だけの再生です。通知音のON／OFFは変更しません。音量も調整できます。ブラウザー／OSの制限で、最初の操作が必要な場合があります。",
              "数値変化では最大3回、1秒間隔で鳴ります。残量が5%・1%を下回るときは別の注意音です。数値が変わった部分だけが点滅します。"
            ]
          },
          {
            "type": "note",
            "text": "メインの［Tibo連携］で無料の任意読取りを許可し、ログイン済みのTibo公開ページを開いてください。表示済みの本人投稿を1分ごとに確認し、自動リロードはしません。未来のEOD PST期限が読めれば日時付きTibo 𝕏 Reset?を表示し、ツールチップで目安期限を説明、期限後は非表示にします。未表示の新着は検知できません。サーバー配信は未設定で、個人の残量回復は別途確認します。"
          },
          {
            "type": "link",
            "text": "Tibo 𝕏を開く ↗",
            "url": "https://x.com/thsottiaux"
          }
        ]
      },
      {
        "id": "tasks",
        "title": "タスク・ピン留め・状態を確認する",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "各サービスの［タスク詳細］を開きます。上部のコンパクトなバーで、そのサービスの残量と障害も確認できます。",
              "［自動取得 ON］なら公式一覧を約1分ごとに更新します。［一覧を更新］はLLMs Monitor側の一覧取得で、公式チャットに送信したりタスクを実行したりする操作ではありません。",
              "名前やプロジェクトで検索し、状態で絞り込みます。作業メモ・ピン留め・タスク詳細は全体を折りたため、初期状態は展開されています。"
            ]
          },
          {
            "type": "table",
            "columns": [
              "状態マーク",
              "読み取り方"
            ],
            "rows": [
              [
                "🟢 応答生成中／稼働中",
                "停止ボタンなどの明示された状態を観測しました。"
              ],
              [
                "🔵 応答待機／待機中",
                "次の入力を待つ状態です。作業完了を意味しません。"
              ],
              [
                "🟠 確認・入力待ち",
                "根拠のある待機状態です。手動メモの「保留」とは別です。"
              ],
              [
                "⚪ 状態未確認",
                "状態を観測できていません。閉じた通常チャットはこの表示になる場合があります。"
              ]
            ]
          },
          {
            "type": "note",
            "text": "［ピン留め］は取得した公式ピンです。全アカウント全件は保証していません。プロジェクトのピン留めは、その中の会話すべてのピン留めを意味しません。ChatGPTブラウザー版とCodexデスクトップは別の取得経路です。"
          }
        ]
      },
      {
        "id": "notes",
        "title": "お気に入りと作業メモで続きを残す",
        "blocks": [
          {
            "type": "p",
            "text": "頻繁に使う会話や、続きを忘れたくないスレッドを［お気に入り］へ。タイトルから元の会話へ戻れます。公式の📌ピン留めとは別の、モニター内の一覧です。"
          },
          {
            "type": "steps",
            "items": [
              "会話・スレッド・Codexタスクの☆を押すと、お気に入りにタイトルとリンクが入ります。既存の保存済みメモも引き継がれます。",
              "右端の［編集］を押し、目的・現在の状況・次の作業・確認待ち・再開時の注意・チェックリストを記入して［メモを保存］。公式チャット側の［作業メモへ登録］からも編集画面を開けます。",
              "⋮⋮をドラッグして順番を変更します。ハンドルへフォーカスして上下キーでも移動でき、順番はサービス・作業領域ごとに保存されます。",
              "★を押すとお気に入りを解除します。本文は削除せず［その他の作業メモ］に残り、一覧から消えた会話も編集できます。",
              "別のチャットへ引き継ぐなら［引継ぎ文をコピー］してご自身で貼り付けます。バックアップや移動にはJSONの書出し／読込みを使います。"
            ]
          },
          {
            "type": "note",
            "text": "作業領域は、ご自身で付ける区分名です。空欄は「共通（未指定）」で、公式アカウント名を自動取得しません。別ブラウザー・プロファイル・サイトURLでは保存領域が異なり、自動同期はしません。メモの手動状態は、観測した実行状態とは別です。"
          }
        ]
      },
      {
        "id": "codex",
        "title": "Codexデスクトップを連携する",
        "blocks": [
          {
            "type": "p",
            "text": "Codexの端末内タスク・ピン留めを、ChatGPTのタスク詳細に別枠で表示する任意の機能です。通常のモニターとは別に、初回だけヘルパーを導入します。"
          },
          {
            "type": "table",
            "columns": [
              "環境",
              "Codexヘルパー"
            ],
            "rows": [
              [
                "macOS",
                "Chrome／Edge向けインストーラーあり。以下の手順で導入します。"
              ],
              [
                "Linux",
                "ZIP展開後に python3 install.py。標準配置以外や実機の受入は未検証です。"
              ],
              [
                "Windows／iOS／Android",
                "現行ヘルパーは未対応。専用アプリ化・各OS対応は今後の要件です。"
              ]
            ]
          },
          {
            "type": "steps",
            "items": [
              "ChatGPTの［タスク詳細］→［Codex — デスクトップ］→［Codexを接続］を開き、［この端末用の導入ZIPを保存］を押します。IDは自動設定されます。",
              "macOSのターミナルで python3 --version を確認します。Python 3.9以上と、このMacで利用するCodexが必要です。",
              "ヘルパー v1.30.2のZIPをダウンロードして展開します。これはChrome拡張機能ではなく、manifest.json はありません。",
              "Install.command を実行し、専用ZIPならID入力は不要です。ダブルクリックで動かない場合は、展開フォルダーで python3 ./install.py を実行します。sudo は不要です。",
              "接続画面で［接続を有効にする］を押し、任意の連携権限を許可。［接続を確認］で「取得 N件・ピン留め P/Q件」が出ることを確認します。",
              "タスク画面へ戻り［一覧を更新］。以降の更新で毎回インストーラーを実行する必要はありません。IDが変わった場合だけ許可IDも再登録します。"
            ]
          },
          {
            "type": "link",
            "text": "Codexヘルパー v1.30.2 をダウンロード ↓",
            "url": "LLMs-Monitor-Codex-Helper-v1.30.2.zip"
          },
          {
            "type": "link",
            "text": "macOSの詳しい導入・削除手順 ↗",
            "url": "https://github.com/ntus/LLMs-Monitor/blob/main/native/README.md#macos-ja"
          },
          {
            "type": "note",
            "text": "「接続は有効です」は設定と権限の表示です。取得件数まで出て初めて一覧取得成功です。「一覧のみ・状態未確認」でも一覧は取得できています。端末内の一覧とピン照合であり、他ホスト・全アカウントや現在の稼働状態まで保証しません。"
          }
        ]
      },
      {
        "id": "api",
        "title": "API残高は必要なものだけ連携",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "各サービスの［API連携］から専用設定を開き、利用したいサービスだけ有効にします。",
              "クリック時に求められる公式請求画面の任意権限を許可し、その請求画面を開いたまま取得します。APIキーの貼り付けは求めません。",
              "取得できた残高を確認します。Claudeのプロモーションクレジットは購入残高と別の1行です。公式画面に取得可能な表示がなければ未取得のままです。"
            ]
          },
          {
            "type": "note",
            "text": "API残高はChatGPT／Claude／Geminiの月額プラン枠とは別です。予算や使用額から残高を推測せず、課金・購入は行いません。"
          }
        ]
      },
      {
        "id": "help",
        "title": "困ったとき・バックアップ",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "症状",
              "まず試すこと"
            ],
            "rows": [
              [
                "残量が取得できない",
                "同じブラウザープロファイルで公式サイトへログインし、接続IDを確認して［今すぐ更新］。公式側の障害・遅延も確認します。"
              ],
              [
                "Codexは有効なのに出ない",
                "［接続を確認］で件数まで確認。Webの接続ID・接続画面のID・ヘルパーへ登録したIDを一致させます。"
              ],
              [
                "権限許可済みなのに接続APIが使えない",
                "専用画面の［拡張機能を再起動］を押し、［Codexを接続］から開き直します。直らなければ入力を保存し、ブラウザーを完全終了して再度開きます。"
              ],
              [
                "メモ登録が失敗する",
                "登録情報は2分で失効します。公式チャットのボタンから再度開きます。拡張更新後の公式タブは入力を保存して再読み込みします。"
              ],
              [
                "メモが見つからない",
                "サービス・作業領域・サイトURL・ブラウザープロファイルが同じか確認。「その他の作業メモ」も確認します。"
              ],
              [
                "更新後に古い表示が残る",
                "モニター・タスク画面を再読み込み。拡張機能も同じフォルダーで更新されているか確認します。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "ブラウザーのデータ消去・端末移行・URL変更の前に、作業メモをJSONで書き出してください。自動一覧は窓のメモリー内、利用履歴・設定と明示保存したメモは端末内に保持します。公式会話の本文・入力中の内容・認証情報は収集しません。"
          },
          {
            "type": "link",
            "text": "GitHubの取扱説明 ↗",
            "url": "https://github.com/ntus/LLMs-Monitor#ja"
          },
          {
            "type": "link",
            "text": "タスク・お気に入り・作業メモの詳しい説明 ↗",
            "url": "https://github.com/ntus/LLMs-Monitor/blob/main/TASK_DETAILS.md"
          },
          {
            "type": "link",
            "text": "プライバシーポリシー →",
            "url": "privacy.html"
          }
        ]
      }
    ]
  }
};
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
 function render(language){const c=GUIDE[language]||GUIDE.en,host=document.getElementById('usage-guide');if(!host)return;
  host.replaceChildren();
  const heading=el('div',undefined,'guide-heading'),eyebrow=el('p',c.eyebrow,'eyebrow'),title=el('h2');title.id='guide-title';title.textContent=c.title.replace('<br>','\n');heading.append(eyebrow,title,el('p',c.intro,'guide-intro'),el('small',c.revision));host.append(heading);
  const layout=el('div',undefined,'guide-layout'),nav=el('nav',undefined,'guide-toc');nav.setAttribute('aria-label',c.toc);nav.append(el('strong',c.toc));const links=el('ol');for(const chapter of c.chapters){const li=el('li'),a=el('a',chapter.title);a.href='#guide-'+chapter.id;li.append(a);links.append(li)}nav.append(links);const body=el('div',undefined,'guide-chapters');
  for(const [i,chapter] of c.chapters.entries()){const article=el('article',undefined,'guide-chapter');article.id='guide-'+chapter.id;const h=el('h3');h.append(el('span',String(i+1).padStart(2,'0')),el('span',chapter.title));article.append(h);
   for(const block of chapter.blocks){if(block.type==='steps'||block.type==='list'){const list=el(block.type==='steps'?'ol':'ul',undefined,block.type==='steps'?'guide-steps':'');for(const item of block.items)list.append(el('li',item));article.append(list)}else if(block.type==='table'){const box=el('div',undefined,'guide-table'),table=el('table'),head=el('thead'),tr=el('tr');for(const label of block.columns){const th=el('th',label);th.scope='col';tr.append(th)}head.append(tr);const tbody=el('tbody');for(const row of block.rows){const tr=el('tr');for(const [index,cell] of row.entries()){const td=el(index===0?'th':'td',cell);if(index===0)td.scope='row';tr.append(td)}tbody.append(tr)}table.append(head,tbody);box.append(table);article.append(box)}else if(block.type==='link'){const a=el('a',block.text,'guide-link');a.href=block.url;if(block.url.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer'}article.append(a)}else article.append(el('p',block.text,block.type==='note'?'guide-note':''))}
   body.append(article)}layout.append(nav,body);host.append(layout)
 }
 root.LLMProductGuide={render};
 if(typeof module==='object'&&module.exports)module.exports=GUIDE;
})(globalThis);
