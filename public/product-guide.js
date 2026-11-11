/* Static customer guide only; no monitor data, storage or network access. */
(function(root){
 const GUIDE={
  "en": {
    "eyebrow": "USER GUIDE / v1.132.0",
    "title": "LLMs Monitor user guide",
    "intro": "Read the first three chapters for the overall picture, then use the detailed chapters as needed.",
    "toc": "Contents",
    "revision": "Guide updated 11 November 2026 · app/extension package v1.132.0 · beta / 2026年11月11日改訂・β版",
    "chapters": [
      {
        "id": "overview",
        "title": "Start here: the complete picture",
        "blocks": [
          {
            "type": "p",
            "text": "LLMs Monitor brings supported AI usage pools, reset times, credits, history and work notes into one browser dashboard. It helps you decide when and where to continue work, without repeatedly comparing provider pages."
          },
          {
            "type": "table",
            "columns": [
              "Question",
              "Feature"
            ],
            "rows": [
              [
                "Which AI has headroom?",
                "Provider cards, rings, bars and plan labels"
              ],
              [
                "When will a limit reset?",
                "Reset date and countdown, with estimates labelled"
              ],
              [
                "What funds remain?",
                "Separate credit lanes"
              ],
              [
                "How has usage changed?",
                "History and visual usage reports"
              ],
              [
                "How do I resume work?",
                "Task details, favorites and work notes"
              ],
              [
                "How can a team coordinate?",
                "Optional team status; automatic allocation is future work"
              ]
            ]
          },
          {
            "type": "p",
            "text": "Flow: official service → extension in the same browser → monitor. Basic operation needs no external AI API key and works independently of LLMs Gateway and LLMs PMO."
          },
          {
            "type": "note",
            "text": "This guide covers the v1.132.0 beta. The production site is https://llmsmonitor.ntus.org/. Fields depend on sign-in, plan and provider layout. — means unavailable, not zero or unlimited."
          },
          {
            "type": "p",
            "text": "Version 1.132.0 updates: OpenAI API credits show the next observed expiry date and affected amount separately. Credit grants can have different dates. The usage report includes daily and hourly views in JST; gaps mean no observation. Claude Fable reset entitlements show their official expiry and availability. Gateway connection can remain approved until disconnected; use Open Gateway to open the installed local workbench. Official public-news collection depends on permissions and rendered posts; server-wide automatic collection is awaiting configuration."
          }
        ]
      },
      {
        "id": "first-steps",
        "title": "Start here: first connection",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "Use desktop Chrome or Edge. Sign in to the official AI sites in the same browser profile.",
              "Download the designated release ZIP, extract it and keep the LLMs-Monitor folder in a permanent location.",
              "Before store publication, enable Developer mode in the browser extensions page and Load unpacked from the folder containing manifest.json, not the ZIP.",
              "Open the monitor. Pair the current 32-letter extension ID in Web Setup. This ID is not a secret API key.",
              "Choose service visibility/order and enable only the optional readers you want; review their access prompts.",
              "Check observation time, plan and values. Initial sign-in and rendering can take time."
            ]
          },
          {
            "type": "p",
            "text": "The Codex helper is unnecessary for ordinary quota monitoring. It is a separate optional installer for local desktop task metadata."
          },
          {
            "type": "note",
            "text": "Collection requires the browser to be running; sleep and browser shutdown interrupt operation."
          },
          {
            "type": "note",
            "text": "Use desktop Chrome/Edge. This browser extension cannot be installed on iOS/Android."
          },
          {
            "type": "link",
            "text": "拡張機能ZIP / Extension ZIP",
            "url": "https://llmsmonitor.ntus.org/LLMs-Monitor.zip"
          }
        ]
      },
      {
        "id": "daily",
        "title": "Start here: a daily workflow",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "Check whether the display is Used or Remaining: 90% means opposite things in those modes.",
              "Compare weekly and session pools separately, then check observation age.",
              "When a limit is near, review reset timing and alternatives. The app does not purchase credits or change plans automatically.",
              "Before pausing, save the purpose, current situation and next action in a work note.",
              "Open Usage report for daily, weekly or monthly review."
            ]
          }
        ]
      },
      {
        "id": "screen",
        "title": "Details: cards, controls and alerts",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "Display or action",
              "Meaning"
            ],
            "rows": [
              [
                "Rings and bars",
                "Only actual acquired pools; weekly first. No invented inner ring for a missing session pool."
              ],
              [
                "Used / Remaining",
                "Used is the default. This changes presentation, not stored history or alert thresholds."
              ],
              [
                "Acquired, waiting, sign-in",
                "Acquisition state, including retained previous observations."
              ],
              [
                "Observation age",
                "Older acquisition-time displays turn red at five minutes."
              ],
              [
                "Red alternation",
                "Highlights the corresponding ring, bar and number at remaining≤5%, equivalent to used≥95%."
              ],
              [
                "Green countdown",
                "A verified reset is approaching; it is not a danger or outage alert."
              ],
              [
                "Warning and info symbols",
                "Explain balance/expiry and evidence. Hover or use the available explanation action."
              ],
              [
                "Long notes",
                "One-line scrolling with full-text tooltips."
              ],
              [
                "Task details / API / Usage",
                "Open the supported view; disabled actions are unavailable or unsupported."
              ]
            ]
          },
          {
            "type": "p",
            "text": "Sound has ON/OFF and volume controls. Supported whole-percent changes, low thresholds and recovery use distinct events. Remaining1% uses three short tones;0% uses three longer tones. A browser gesture may be needed to unlock audio. OFF cancels pending tones. API-balance changes are not subscription recovery."
          },
          {
            "type": "p",
            "text": "Advice uses observed history and abstains when evidence is insufficient. It does not guarantee the optimum plan across prices, quality and task requirements."
          }
        ]
      },
      {
        "id": "services",
        "title": "Details: provider coverage",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "Provider",
              "Supported evidence",
              "Important limits"
            ],
            "rows": [
              [
                "ChatGPT / dots",
                "Available Work/Codex pools, observed detailed plans such as Pro 200, reset entitlements, separate OpenAI API balance",
                "Not all ordinary Chat or independent dots usage. A monthly benefit banner is not proof of a credited balance."
              ],
              [
                "Claude",
                "Actual weekly/session pools, plans including Ultra, monthly cap and purchased balance, API purchased/promotional lanes",
                "Weekly-only plans use one ring. Legacy session history is separate from monthly extra allowance."
              ],
              [
                "Gemini",
                "Supported session/weekly windows and Google AI plan",
                "App percentages and API money are separate. Embedded payments balance reading is incomplete."
              ],
              [
                "Grok / Cursor",
                "Supported official weekly usage/plan, independent API balance",
                "The label does not establish shared accounts/pools or independent Bot collection."
              ],
              [
                "Muse",
                "General Usage, observed Free Plan/Power/Maximum names, extra tokens and history",
                "Sign-in required; exact reset time may be unavailable."
              ],
              [
                "Copilot",
                "Supported contract/plan labels and explicit counters",
                "Keep personal/work identities separate. M365 Copilot (Basic) plan was live-checked; absent counters stay unavailable."
              ],
              [
                "DeepSeek / Perplexity / Genspark",
                "Optional bounded experimental account readers",
                "Full formal coverage and history reports are incomplete."
              ]
            ]
          },
          {
            "type": "p",
            "text": "Usage and official incident checks are approximately minute-based. Provider accounting, sign-in, rendering and browser suspension can delay them. Owned acquisition tabs are reused; automatic window proliferation is avoided."
          }
        ]
      },
      {
        "id": "credits",
        "title": "Details: credits, funds and spending limits",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "Lane",
              "Meaning"
            ],
            "rows": [
              [
                "Subscription pool",
                "Weekly/session allowance in percent, not money."
              ],
              [
                "Reset entitlement",
                "Observed availability and expiry; never redeemed automatically."
              ],
              [
                "Monthly extra allowance (USD)",
                "Current monthly spend, configured cap and cap headroom, separate from funds."
              ],
              [
                "Purchased usage credits",
                "Actually observed available balance; never inferred from the monthly budget."
              ],
              [
                "Cloud-session credits",
                "A separate evidenced allowance; a zero warning does not mean every Claude feature is unavailable."
              ],
              [
                "API balance",
                "API money, separate from subscription capacity."
              ],
              [
                "Promotional credits",
                "Separate conditional grants, with per-grant amounts/expiry when multiple exist."
              ],
              [
                "Money bar",
                "An observed total ratio or an explicitly labelled display axis, not an invented grant total."
              ]
            ]
          },
          {
            "type": "p",
            "text": "Example only: a$100 purchase, current funds$69.79, monthly cap$90 and monthly spend$35.66 leave$54.34 of cap headroom. The$69.79 funds and$54.34 headroom describe different constraints."
          },
          {
            "type": "p",
            "text": "Verified zero/negative money preserves its sign; missing expiry remains unknown. Funds or extra-usage enablement do not prove the next debit source. No automatic purchase, auto-top-up configuration or plan change is performed."
          }
        ]
      },
      {
        "id": "reports",
        "title": "Details: graph reports, CSV and printing",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "Open Usage report from the top header. It uses a separate reusable tab.",
              "Choose one service and pool; weekly and session allowances are not additive.",
              "Hover or focus trend points for time/value; switch used or remaining display.",
              "Choose daily, Monday-weekly or monthly grouping in Japan time.",
              "Use Refresh observations to explicitly rebuild the report; it does not continuously reaggregate.",
              "Expand the table or save summary/log CSV and print/PDF. Review private history before sharing."
            ]
          },
          {
            "type": "p",
            "text": "Observed decrease in pp is the net percentage-point drop between eligible consecutive observations. Remaining80%→70% is10pp, not tokens, requests, cost or total period consumption. Long intervals, calendar boundaries, different units and increases are not interpolated; — means unknown."
          },
          {
            "type": "p",
            "text": "Trend: latest600 samples; bars: latest60 periods; table/print: up to300 summary rows. CSV includes all eligible model rows. Model caps are10,000 observations/window and50,000 total, with explicit exclusions/truncation. Closing releases report state and chart DOM."
          },
          {
            "type": "note",
            "text": "Logs mainly record changed values. Missing time does not prove inactivity or downtime. An unsupported history report is separate from live-card acquisition status."
          },
          {
            "type": "p",
            "text": "Prototype: Preview quota JSON for Gateway in this report, then explicitly save it locally. Covers source-checked ChatGPT/Claude/Gemini subscription observations only; partial inventory, unverified accounts and unknown reset evidence. Old/unverified observations are not current capacity. The JSON is advisory, not automatic transfer or execution/spending permission."
          }
        ]
      },
      {
        "id": "tasks",
        "title": "Details: tasks, favorites and work notes",
        "blocks": [
          {
            "type": "p",
            "text": "Separate ChatGPT, Claude and Gemini task views include search/status filters, expand/collapse, tree copy, Auto ON/OFF, refresh, JSON import, demo and clear. Rendered metadata lists are partial, not account-wide completeness. Imported/demo lists are not live execution evidence."
          },
          {
            "type": "table",
            "columns": [
              "Feature",
              "Use"
            ],
            "rows": [
              [
                "☆ / ★ favorites",
                "Save links locally. Unfavoriting does not delete note text or change official pins."
              ],
              [
                "Reorder handle",
                "Drag or use up/down keys."
              ],
              [
                "Edit / work notes",
                "Save purpose, situation, next work, waiting items, resume notes and checklists."
              ],
              [
                "Workspace",
                "A user-chosen label, not verified provider identity."
              ],
              [
                "Handoff copy / JSON",
                "Explicit export/import without automatic cloud sharing."
              ],
              [
                "Status marks",
                "Observed response/explicit states; idle, unread or merged does not prove completion."
              ],
              [
                "Other work notes",
                "Find notes removed from favorites or current lists."
              ]
            ]
          },
          {
            "type": "p",
            "text": "Register work note is available on supported ChatGPT/dots, Claude, Gemini and Muse routes. It transfers a validated link/short title; save explicitly in the editor. Conversation bodies and drafts are not automatically captured. Note support is separate from automatic task-list support."
          },
          {
            "type": "p",
            "text": "Optional local Codex tasks use a separate helper. Obtain the current extension-ID-specific installer from Setup → Codex, follow the guide and check connection. Do not load it as an extension. macOS instructions and a Linux implementation exist; the Windows helper is unsupported. Unknown metadata is not inferred running/completed."
          },
          {
            "type": "link",
            "text": "Detailed task guide",
            "url": "https://llmsmonitor.ntus.org/docs/TASK_DETAILS.md"
          },
          {
            "type": "link",
            "text": "Codex helper guide",
            "url": "https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md"
          },
          {
            "type": "p",
            "text": "⋮⋮ is a drag handle; ☆/★ toggles favorites. The Codex helper targets macOS/Linux and needs Python 3.9+ and a discoverable Codex binary. Windows installation is unsupported."
          },
          {
            "type": "link",
            "text": "ヘルパー導入ガイド / Helper guide",
            "url": "https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md"
          },
          {
            "type": "link",
            "text": "汎用ヘルパーZIP（初回ID入力） / Generic helper ZIP (ID required)",
            "url": "https://llmsmonitor.ntus.org/LLMs-Monitor-Codex-Helper-v1.30.2.zip"
          }
        ]
      },
      {
        "id": "news",
        "title": "Details: incidents and public updates",
        "blocks": [
          {
            "type": "p",
            "text": "Click the compact incident label for details. Supported official incident feeds are separate from low quota and sign-out. Grok/Muse provide official status/support links; this does not claim a live incident feed for every service."
          },
          {
            "type": "p",
            "text": "Tibo public checks are standard alongside ChatGPT, after the initial optional X permission. An owned public-profile tab is reused about every15 minutes for eligible rendered posts. Login restrictions and unrendered items prevent guaranteed newest-post coverage. Check publication/read times and source. ClaudeDevs reading is independently optional."
          },
          {
            "type": "p",
            "text": "New/read/hide/restore are browser-local presentation. Reading never deletes or reacts to X posts. The first acquisition baseline is silent."
          },
          {
            "type": "p",
            "text": "Move the information bar by its handle or arrow keys; Home restores its dock. Source opens the original, > advances, and Setup opens reader settings. It is independent of the advice toggle."
          },
          {
            "type": "p",
            "text": "The AI tool directory links to comparison/evaluation/development sites. Ranking is editorial; the directory is hidden in fullscreen. External services retain their own account, price and terms."
          },
          {
            "type": "link",
            "text": "Tiboの公開プロフィール / Tibo public profile",
            "url": "https://x.com/thsottiaux"
          }
        ]
      },
      {
        "id": "settings",
        "title": "Details: settings, connections and windows",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "Location",
              "Controls"
            ],
            "rows": [
              [
                "Header",
                "Team, Support, Usage report, About, Setup, local-storage explanation and language."
              ],
              [
                "Display toolbar",
                "Service task windows, PiP, popup, theme, fullscreen, advice, used/remaining, sound, volume and refresh."
              ],
              [
                "Setup display",
                "Show/hide services and move order. Hidden enabled readers/history continue."
              ],
              [
                "In-page panels",
                "Supported provider panels, position and opacity subject to browser constraints."
              ],
              [
                "API / additional services",
                "Grant/revoke optional readers in extension-owned settings when a permission prompt is needed."
              ],
              [
                "Connection/sign-in",
                "Official login, retry, the relevant reader settings and help."
              ]
            ]
          },
          {
            "type": "p",
            "text": "Always-on-top uses supported Document Picture-in-Picture, otherwise a normal popup. A normal popup is not OS-wide always-on-top; browser-owned window chrome cannot be replaced."
          },
          {
            "type": "p",
            "text": "Language/theme propagate across supported monitor, floating and task views. Reports deliberately retain a stable snapshot; Refresh observations also reads the current language/theme. New permissions require a user action."
          }
        ]
      },
      {
        "id": "team",
        "title": "Details: team, Gateway and PMO",
        "blocks": [
          {
            "type": "p",
            "text": "Team: disconnected is not a monitor failure. This optional view imports a locally produced status JSON from an existing ai-bus and shows self-reported capacity/freshness. Missing/stale reports are unconfirmed, not live execution, completion or official quota proof. Import/update/clear are explicit local actions."
          },
          {
            "type": "p",
            "text": "Muse Bus/answer reset times are reference-only. Copying a question does not send it. They do not overwrite official quota, history, recovery audio or spending decisions."
          },
          {
            "type": "table",
            "columns": [
              "Product",
              "Responsibility and stage"
            ],
            "rows": [
              [
                "LLMs Monitor",
                "Resource observations, trends and evidence quality; graph reports implemented."
              ],
              [
                "LLMs Gateway",
                "Separate project designing candidate comparison using capabilities, routes, cost and headroom."
              ],
              [
                "LLMs PMO",
                "Separate project organizing company/project/ticket objectives, priorities and next actions."
              ],
              [
                "API / LLMs Bus",
                "Read-only contract and offline adapter proposals; authenticated automatic delivery/allocation is not provided."
              ]
            ]
          },
          {
            "type": "p",
            "text": "A percentage point is not a universal work unit. Observation count is not request frequency. Future analysis must match plan/model/task class and execution evidence. Credit transfer, shared API keys and automatic spending permission are not offered."
          },
          {
            "type": "link",
            "text": "Team instructions",
            "url": "https://llmsmonitor.ntus.org/docs/TEAM_STATUS.md"
          }
        ]
      },
      {
        "id": "performance",
        "title": "Details: memory saving and operating conditions",
        "blocks": [
          {
            "type": "p",
            "text": "Report aggregation/charts load only after explicitly opening the separate tab. The main page does not load the report engine or an external chart library. Detail tables are lazy; no continuous reaggregation is added. History is not deleted to save memory."
          },
          {
            "type": "p",
            "text": "Chrome Maximum Memory Saver can quickly deactivate background tabs. DOM-based readers such as Muse and billing pages may be delayed. Energy Saver can also affect eligible background tabs; uninterrupted updating is not guaranteed."
          },
          {
            "type": "p",
            "text": "If updates stall, check age, reason and official login. You may choose to exempt only the monitor/required acquisition sites in Always keep these sites active, trading memory for continuity. Global memory saving need not be disabled, and the app does not change this setting for you."
          },
          {
            "type": "p",
            "text": "For IME/slow-input symptoms, compare identical conditions and tab counts with/without the monitor. Other extensions, network and sleep also matter. No whole-Chrome savings percentage or causal attribution is claimed."
          },
          {
            "type": "link",
            "text": "Chrome performance help",
            "url": "https://support.google.com/chrome/answer/12929150?hl=en"
          }
        ]
      },
      {
        "id": "troubleshooting",
        "title": "Details: troubleshooting and support",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "Symptom",
              "Check in this order"
            ],
            "rows": [
              [
                "Unavailable / paused / sign-in",
                "Same browser profile and correct account → enabled reader and permission → official sign-in → Refresh now."
              ],
              [
                "Old or temporarily missing values",
                "Observation age/reason → official page fully rendered → browser suspension/sleep. Retained observations are labelled previous."
              ],
              [
                "Unclear button response",
                "Read nearby busy/waiting/completed/failure feedback; avoid repeated clicks during a long action."
              ],
              [
                "Billing opened, no API amount",
                "Distinguish subscription/API billing, account, optional access and adapter coverage; do not buy funds to troubleshoot."
              ],
              [
                "Version mismatch",
                "Same loaded folder → reload extension → reload monitor. Updated files and loaded runtime differ."
              ],
              [
                "Work-note registration failed",
                "Save drafts, safely reload the supported conversation, then register again. Old pages may retain an outdated reader."
              ],
              [
                "Missing notes/favorites",
                "Service, workspace, site origin, browser profile and Other work notes."
              ],
              [
                "Old Tibo posts",
                "X access, login, last read and rendered-post limits; a successful read is not newest-post coverage."
              ]
            ]
          },
          {
            "type": "steps",
            "items": [
              "Open Support; select only the optional fixed diagnostic fields, unchecked by default.",
              "Preview and save the local draft; it is not sent.",
              "Add expected/actual behavior, minimal reproduction and frequency.",
              "Crop/redact any screenshot yourself and choose a suitable destination only after reviewing its audience."
            ]
          },
          {
            "type": "note",
            "text": "GitHub Issues is public. Do not post keys, cookies, auth URLs, account/org IDs, balances, bills, conversations, private Bus contents or raw usage CSV. Automatic redaction, attachments and submission are not provided."
          },
          {
            "type": "link",
            "text": "Support instructions",
            "url": "https://llmsmonitor.ntus.org/docs/SUPPORT.md"
          }
        ]
      },
      {
        "id": "privacy",
        "title": "Details: storage and privacy",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "Data",
              "Storage/transfer"
            ],
            "rows": [
              [
                "Usage/history/settings",
                "Current extension storage; no automatic operator-server upload."
              ],
              [
                "Notes/favorites/read-state/imports",
                "May be site-origin/profile local; not automatic cross-device or cross-origin sync."
              ],
              [
                "Automatic task lists",
                "In-memory metadata, separate from explicitly saved work notes."
              ],
              [
                "CSV/JSON/support draft",
                "Local download only on an explicit click; review before sharing."
              ],
              [
                "Official-service communication",
                "Network is used for provider/status reads; local storage does not mean offline-only communication."
              ]
            ]
          },
          {
            "type": "p",
            "text": "No provider password or API key is entered into this monitor for analysis. Gateway API-key setup is a separate product concern. Sign in on official services. Export important notes before clearing storage, uninstalling, or changing device, origin or profile."
          },
          {
            "type": "link",
            "text": "Privacy policy",
            "url": "privacy.html"
          }
        ]
      },
      {
        "id": "updates",
        "title": "Details: updates, backup and rollback",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "Check the current UI/runtime versions and loaded folder; export important work notes.",
              "Update the same LLMs-Monitor folder. Avoid uninstalling or creating a new sibling folder every time.",
              "The Mac updater registers the existing folder once, then validates and backs up updates. Unchanged helpers/updaters need no reinstall.",
              "Reload the extension and monitor, then check versions and acquisition. Do not reload working conversations just to update the dashboard.",
              "Use the updater rollback procedure if needed. Code backups are separate from migrating browser-stored user data."
            ]
          },
          {
            "type": "p",
            "text": "ZIP, loaded runtime, Web UI, GitHub and browser stores update independently. A build is not store approval or general availability. Follow OS instructions for the unsigned/unnotarized updater; do not globally disable security protections."
          },
          {
            "type": "link",
            "text": "Mac updater and rollback",
            "url": "https://llmsmonitor.ntus.org/docs/MAC_UPDATER.md"
          }
        ]
      },
      {
        "id": "presentation",
        "title": "A five-minute customer demonstration",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "30 seconds: explain the unified view of headroom, resets and separate credit constraints.",
              "1 minute: switch used/remaining; distinguish weekly/session pools and unavailable/zero.",
              "1 minute: distinguish subscription quota/API funds and monthly cap/purchased balance.",
              "1 minute: switch report service/period, show trends, observed decreases and CSV. Review the scope before showing personal usage to others.",
              "1 minute: use a demo or shareable task to show favorites, a next-action note and a small window.",
              "30 seconds: state the beta coverage and staged Gateway/PMO integration."
            ]
          },
          {
            "type": "p",
            "text": "The present value is resource visibility and continuity of work. Do not present universal monitoring, automatic optimal routing, quota transfer or automatic API-spending approval as completed features."
          }
        ]
      },
      {
        "id": "index",
        "title": "Feature index and further guides",
        "blocks": [
          {
            "type": "p",
            "text": "This guide covers the main dashboard, plans, used/remaining, weekly/session pools, resets, credit lanes, history, charts, CSV/print, sound, advice, incidents, public updates, popup/PiP/fullscreen, languages/themes, panels, visibility/order, connection, task lists/states/search, favorites, notes/handoff/JSON, Codex helper, team, Muse reference times, Gateway reference export, support, privacy and updates/rollback."
          },
          {
            "type": "p",
            "text": "API setup also provides an explicit Claude API reference-JSON export prototype for Gateway. It preserves observation/expiry/unknown information; it is not automatic delivery or spending permission."
          },
          {
            "type": "link",
            "text": "Download the complete guide (Markdown)",
            "url": "docs/USER_GUIDE.md"
          },
          {
            "type": "link",
            "text": "Changes",
            "url": "docs/CHANGELOG.md"
          },
          {
            "type": "link",
            "text": "Team instructions",
            "url": "docs/TEAM_STATUS.md"
          },
          {
            "type": "link",
            "text": "Support",
            "url": "docs/SUPPORT.md"
          },
          {
            "type": "link",
            "text": "Open the monitor",
            "url": "./"
          }
        ]
      }
    ]
  },
  "ja": {
    "eyebrow": "USER GUIDE / v1.132.0",
    "title": "LLMsモニター 取扱説明書",
    "intro": "最初の3章で全体像と基本操作をつかみ、後半は必要な機能の詳細を調べるときに使ってください。",
    "toc": "目次",
    "revision": "Guide updated 11 November 2026 · app/extension package v1.132.0 · beta / 2026年11月11日改訂・β版",
    "chapters": [
      {
        "id": "overview",
        "title": "はじめに：3分でつかむ全体像",
        "blocks": [
          {
            "type": "p",
            "text": "LLMsモニターは、複数のAIの利用枠・リセット予定・クレジットをまとめ、作業を続けるための判断を助けるブラウザー用ツールです。各社の公式画面を毎回見比べる手間を減らし、変化履歴や作業メモも一緒に確認できます。"
          },
          {
            "type": "table",
            "columns": [
              "知りたいこと",
              "使う機能"
            ],
            "rows": [
              [
                "今どのAIに余力がある？",
                "メイン画面の円・横バー・プラン名"
              ],
              [
                "いつ枠が戻る？",
                "リセット日時と残り時間。想定と確定を区別"
              ],
              [
                "お金の残高は？",
                "サブスク枠とは別のクレジット欄"
              ],
              [
                "どう使ってきた？",
                "変化履歴とグラフの利用状況レポート"
              ],
              [
                "作業の続きを忘れたくない",
                "タスク詳細・お気に入り・作業メモ"
              ],
              [
                "チームでどう役割を分ける？",
                "任意のチーム状況。自動割当は今後の連携構想"
              ]
            ]
          },
          {
            "type": "p",
            "text": "仕組みは「公式サービス → 同じブラウザーの拡張機能 → モニター画面」です。基本機能に外部AIのAPIキーは不要です。LLMs GatewayやLLMs PMOを導入しなくても利用できます。"
          },
          {
            "type": "note",
            "text": "v1.132.0のβ機能を説明します。本番サイトは https://llmsmonitor.ntus.org/ です。各社のログイン状態・契約・画面形式によって取得できる項目が異なります。「—」は未取得で、0や無制限という意味ではありません。"
          },
          {
            "type": "p",
            "text": "v1.132.0の追加機能：OpenAI APIクレジットは、取得できた次回失効日と対象金額を分けて表示します。複数の付与枠にはそれぞれ異なる期限があります。利用状況レポートは日本時間の日別・時間帯別表示に対応し、空白は観測がない区間です。ClaudeのFableリセット権は公式の有効期限と利用可能状態を表示します。Gateway連携は解除まで承認を維持でき、「Gatewayを開く」で導入済みのローカル画面を開きます。公式ニュースは許可と表示済み公開投稿に依存し、サーバーでの一括自動収集は設定準備中です。"
          }
        ]
      },
      {
        "id": "first-steps",
        "title": "はじめに：最初の接続",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "デスクトップ版ChromeまたはEdgeを使い、利用するAIの公式サイトに同じプロファイルでログインします。",
              "案内された配布ZIPを保存・展開し、LLMs-Monitorフォルダーを今後も使う場所へ置きます。",
              "ストア公開前は拡張機能管理画面でデベロッパーモードをONにし、「パッケージ化されていない拡張機能を読み込む」でmanifest.jsonのあるフォルダーを選びます。ZIP自体は指定しません。",
              "モニターを開きます。Web版はセットアップで現在の拡張機能ID（英小文字32文字）を登録します。IDは秘密のAPIキーとは別です。",
              "セットアップで表示サービス・順序と必要な任意読取りを設定します。アクセス許可は対象を確認して許可します。",
              "表示された取得日時とプラン・値を確認します。初回のログイン・描画には時間がかかることがあります。"
            ]
          },
          {
            "type": "p",
            "text": "通常の残量確認だけならCodexヘルパーは不要です。ヘルパーは端末内のCodexタスクを表示する追加機能で、拡張機能とは別に導入します。"
          },
          {
            "type": "note",
            "text": "ブラウザーを起動している間の監視です。パソコンのスリープ中・ブラウザー終了中の連続取得は保証しません。"
          },
          {
            "type": "note",
            "text": "Chrome／Edgeのデスクトップ版が対象です。iOS／Androidではこの拡張機能を導入できません。"
          },
          {
            "type": "link",
            "text": "拡張機能ZIP / Extension ZIP",
            "url": "https://llmsmonitor.ntus.org/LLMs-Monitor.zip"
          }
        ]
      },
      {
        "id": "daily",
        "title": "はじめに：毎日の使い方",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "最初に「表示：使用量」か「表示：残量」かを確認します。使用量90%と残量90%は意味が逆です。",
              "週間枠と現在のセッション枠を別々に見て、取得日時が古くないか確認します。",
              "上限が近い場合はリセット予定や別のサービスを確認します。追加クレジットの購入や契約変更をアプリが自動で行うことはありません。",
              "作業を中断する前に、タスク詳細から目的・状況・次の一手をメモします。",
              "振り返りには上部の「利用状況レポート」を開き、日別・週別・月別で推移を確認します。"
            ]
          }
        ]
      },
      {
        "id": "screen",
        "title": "詳細：画面・表示・通知の見方",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "表示・操作",
              "意味"
            ],
            "rows": [
              [
                "円・横バー",
                "実際に取得した枠を表示。週間を先に並べます。セッション枠がなければ内側の円は作りません。"
              ],
              [
                "使用量／残量",
                "初期表示は使用量。切替は見た目だけで、保存履歴や警告の基準は変えません。"
              ],
              [
                "取得済み・更新待ち・ログイン案内",
                "取得状態を表します。前回値と現在の確認済み値を区別します。"
              ],
              [
                "取得からの経過時間",
                "最後の観測からの時間。5分以上経過した取得時刻表示は赤で注意を促します。"
              ],
              [
                "赤色の交互表示",
                "残量5%以下で対応する円・横バー・％を強調。使用量表示なら95%以上に相当します。"
              ],
              [
                "緑の残り時間",
                "確認できたリセットが近いことの案内。危険・障害を意味しません。"
              ],
              [
                "⚠︎・ⓘ・？",
                "残高不足や期限、情報の意味を説明します。マウスを置く、または対応する説明操作で確認します。"
              ],
              [
                "長い補足文",
                "1行でスクロールし、ツールチップで全文を確認できます。"
              ],
              [
                "タスク詳細／API連携／利用状況",
                "各サービスの該当画面へ。灰色のボタンは未対応や利用できない状態です。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "通知音はON/OFFと音量を調整できます。取得した整数％の変化、対応する低残量・回復を知らせます。残量1%は短い3音、0%は長めの3音で区別します。ブラウザーが音を許可するため、初回に操作が必要なことがあります。OFFでは保留中の音も停止します。API残高の増減をサブスク枠の回復と扱いません。"
          },
          {
            "type": "p",
            "text": "「アドバイス」は履歴に基づく目安です。十分な観測がなければ判定を控えます。価格・品質・用途を含む絶対的な最適プランを保証する機能ではありません。"
          }
        ]
      },
      {
        "id": "services",
        "title": "詳細：サービスごとの対応範囲",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "サービス",
              "確認する項目",
              "注意点"
            ],
            "rows": [
              [
                "ChatGPT / dots",
                "取得可能なWork/Codex枠、確認できたPro 200等のプラン詳細、リセット権、別のOpenAI API残高",
                "通常Chatの全残量やdots独立の利用枠は取得しません。$200の特典案内だけで付与済み残高とはしません。"
              ],
              [
                "Claude",
                "実在する週間・セッション枠、Ultra等のプラン、月間追加使用枠と購入済み残高、API残高・プロモーション",
                "週のみのプランは円1本。過去セッション履歴と月間追加使用枠は別です。"
              ],
              [
                "Gemini",
                "対応する使用量・週間枠・Google AIプラン",
                "アプリ使用率とGemini API残高は別。決済埋め込み画面の残高取得は未完了です。"
              ],
              [
                "Grok / Cursor",
                "対応する公式週間使用率・プラン、独立したAPI残高",
                "名称併記だけで全製品・アカウントの枠共通を保証しません。Botの独立取得ではありません。"
              ],
              [
                "Muse",
                "一般設定の利用状況、Free Plan／Power／Maximum等の確認済みプラン、追加トークン、履歴",
                "ログインが必要。正確なリセット時刻は未取得の場合があります。"
              ],
              [
                "Copilot",
                "対応画面の契約・プラン名と明示されたカウンター",
                "個人用と職場用を混ぜません。M365 Copilot (Basic)プランの実機確認あり。存在しない数値を0とはしません。"
              ],
              [
                "DeepSeek / Perplexity / Genspark",
                "任意の限定読取りによる契約・残高等",
                "試験対応です。全プラン・全残高の正式対応や履歴レポートは未完了です。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "取得頻度は公式使用量・障害情報がおおむね1分周期です。各社の集計遅延、認証、Chromeの休止、画面の読み込みによって遅れることがあります。取得用タブは再利用し、不要なウィンドウを自動で増やす設計にはしません。"
          }
        ]
      },
      {
        "id": "credits",
        "title": "詳細：クレジットと支出上限を混同しない",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "項目",
              "何を表すか"
            ],
            "rows": [
              [
                "サブスク利用枠",
                "週間・セッション等の使用率／残量。金額ではありません。"
              ],
              [
                "リセット権",
                "公式に確認できた利用権・期限。自動行使はしません。"
              ],
              [
                "月間追加使用枠（USD）",
                "今月の使用額・設定上限・上限までの残り。購入済み残高とは別です。"
              ],
              [
                "購入済み使用クレジット残高",
                "実際に確認できた利用可能残高。月間予算から逆算しません。"
              ],
              [
                "クラウドセッションクレジット",
                "表示根拠のある別枠。残り0の警告はその残高に対するもので、すべてのClaude利用停止を意味しません。"
              ],
              [
                "APIクレジット残高",
                "API専用の金額。ChatGPT・Claude等のサブスク利用枠とは別です。"
              ],
              [
                "プロモーションクレジット",
                "対象条件・期限付きの別残高。複数付与時は合計と各付与の金額・期限を区別します。"
              ],
              [
                "横バー",
                "確認済み総額に対する比率、または明記された金額の表示目盛です。「表示目盛」を付与総額と読み替えません。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "例：購入時$100、現在の購入残高$69.79、今月の上限$90、今月の使用額$35.66なら、上限までの残りは$54.34です。購入残高$69.79と$54.34は別の意味なので両方を見ます。数値は説明用です。実際の画面値を優先してください。"
          },
          {
            "type": "p",
            "text": "公式に取得した0や負の残高は、その符号を保って表示します。期限が取得できなければ未確認です。残高があること、追加使用がONであることだけで、次の処理にどのクレジットが充当されるかは保証しません。アプリから自動購入・自動チャージ設定・契約変更は行いません。"
          }
        ]
      },
      {
        "id": "reports",
        "title": "詳細：グラフレポート・CSV・印刷",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "上部の「利用状況レポート」を押すと別タブが開きます。開いているレポートは再利用します。",
              "「サービスと利用枠」で比較対象を選びます。週間とセッションなど、別枠を合算しません。",
              "推移グラフの点にマウスを置くかTabキーで、観測日時と数値を確認します。使用率／残量を切り替えられます。",
              "日別・週別（月曜始まり）・月別を選んで、期間ごとの観測減少を見ます。日本時間で集計します。",
              "「最新の履歴を反映」は明示的に集計を更新します。開いているだけで常時再集計はしません。",
              "必要に応じて「数値を表で確認」、集計CSV、ログCSV、印刷／PDFを使います。共有前に内容を確認してください。"
            ]
          },
          {
            "type": "p",
            "text": "「観測減少pp」は、比較できる連続観測間で減った割合のポイント差です。例えば残量80%→70%は10ppです。総トークン数・利用回数・料金・期間の全消費量ではありません。長い観測間隔・日付境界・異なる単位・枠の増加を勝手に補間しません。「—」は不明です。"
          },
          {
            "type": "p",
            "text": "折れ線は直近600観測、棒グラフは直近60期間、詳細表・印刷は最大300集計行です。CSVは集計対象の全行を出します。集計自体には1枠10,000件・全体50,000観測の上限があり、除外・上限に達した場合は案内します。レポートを閉じると、その集計・描画のための状態を解放します。"
          },
          {
            "type": "note",
            "text": "履歴は主に数値が変化したときの記録です。記録がない時間を「未使用」「停止」と扱いません。「履歴レポート未対応」はメインの取得失敗とは別の対応状況です。"
          },
          {
            "type": "p",
            "text": "試作：レポート内の「Gateway向け利用枠JSONを確認」から、ChatGPT・Claude・Geminiの購読枠をプレビューし、確認後に端末へ保存できます。一覧は部分的、アカウントは未照合、リセット根拠は未確認です。古い値や取得元を確認できない値は現在値として渡しません。保存したJSONは参考情報で、自動送信や実行・支出許可ではありません。"
          }
        ]
      },
      {
        "id": "tasks",
        "title": "詳細：タスク・お気に入り・作業メモ",
        "blocks": [
          {
            "type": "p",
            "text": "タスク詳細はChatGPT・Claude・Geminiのサービス別画面です。検索・状態での絞込み、全展開／折畳み、ツリーコピー、自動ON/OFF、一覧更新、JSON読込み、サンプル、消去があります。自動取得は表示されたメタ情報の部分一覧で、全アカウントの全件を保証しません。サンプル・JSON読込みは実稼働の証明ではありません。"
          },
          {
            "type": "table",
            "columns": [
              "操作・表示",
              "使い方"
            ],
            "rows": [
              [
                "☆／★のお気に入り",
                "ローカルにリンクを保存。解除してもメモ本文は削除しません。公式のピン留めとは別です。"
              ],
              [
                "並び替えハンドル",
                "ドラッグまたは上下キーでお気に入りの順序を調整します。"
              ],
              [
                "編集／作業メモ",
                "目的、現在の状況、次の作業、確認待ち、再開時の注意、チェックリストを保存します。"
              ],
              [
                "作業領域",
                "自分で付ける整理ラベルです。公式アカウントの確認済み識別ではありません。"
              ],
              [
                "引継ぎ文コピー／JSON",
                "利用者の操作で書出し・読込み。自動クラウド共有はしません。"
              ],
              [
                "状態マーク",
                "観測した応答状態・明示状態を表示。待機・未読・PRマージだけで作業完了とはしません。"
              ],
              [
                "その他の作業メモ",
                "お気に入りを解除したメモや一覧から外れたメモも確認できます。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "対応する公式会話ページの「作業メモへ登録」も使えます。ChatGPT/dots・Claude・Gemini・Museの対応経路では、検証した会話リンクと短いタイトルを渡し、編集画面で保存を押して記録します。本文や入力中の文章を自動で取り込む機能ではありません。Muse等のメモ対応と自動タスク一覧対応は別です。"
          },
          {
            "type": "p",
            "text": "端末内のCodexタスクには任意の専用ヘルパーを使います。セットアップのCodexから現在の拡張機能ID用の導入ZIPを保存し、手順に従って接続を確認します。ヘルパーをChrome拡張として読み込みません。macOSの導入手順とLinuxの実装があり、Windowsヘルパーは未対応です。状態未確認を稼働・完了と推測しません。"
          },
          {
            "type": "link",
            "text": "タスクの詳しい手順",
            "url": "https://llmsmonitor.ntus.org/docs/TASK_DETAILS.md"
          },
          {
            "type": "link",
            "text": "Codexヘルパー導入手順",
            "url": "https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md"
          },
          {
            "type": "p",
            "text": "⋮⋮は移動用のハンドル、☆／★はお気に入りです。CodexヘルパーはmacOS／Linux向けでPython 3.9以上とCodex実行環境が必要です。Windows導入は未対応です。"
          },
          {
            "type": "link",
            "text": "ヘルパー導入ガイド / Helper guide",
            "url": "https://llmsmonitor.ntus.org/docs/CODEX_HELPER.md"
          },
          {
            "type": "link",
            "text": "汎用ヘルパーZIP（初回ID入力） / Generic helper ZIP (ID required)",
            "url": "https://llmsmonitor.ntus.org/LLMs-Monitor-Codex-Helper-v1.30.2.zip"
          }
        ]
      },
      {
        "id": "news",
        "title": "詳細：障害情報・Tibo・公開更新",
        "blocks": [
          {
            "type": "p",
            "text": "サービス名の近くの障害表示を押すと詳細を確認できます。公式フィードに対応するサービスの障害と、残量不足・ログイン切れは別です。Grok・Museには公式ステータス／問い合わせへのリンクがあり、全社共通の自動障害監視が実装済みという意味ではありません。"
          },
          {
            "type": "p",
            "text": "ChatGPT接続時はTiboの公開情報も標準で確認する設計です。初回にXの読取り許可が必要です。公開プロフィールの取得用タブを再利用し、約15分間隔で表示済みの対象投稿を確認します。ログイン制限や未描画の投稿があるため、Xの全新着を保証しません。投稿日・確認日時・出典を確認してください。ClaudeDevsの公開読取りは独立した任意設定です。"
          },
          {
            "type": "p",
            "text": "取得できた投稿の新着表示・既読／非表示・再表示はブラウザー内の整理です。投稿を読むだけで他者の投稿を削除したり、Xへ反応を送ったりしません。初回の基準取得は無音です。"
          },
          {
            "type": "p",
            "text": "下部の公開情報バーはハンドルで移動でき、矢印キーで調整、Homeキーで元の位置へ戻せます。「出典」から原文、「>」から次の記事、設定から読取り設定を確認できます。アドバイスのON/OFFとは別に扱います。"
          },
          {
            "type": "p",
            "text": "「各種AIツール」は比較・評価・開発サイトへのリンク集です。順位は編集上の目安です。全画面表示では非表示になります。リンク先サービスのアカウント・料金・条件はそれぞれに従います。"
          },
          {
            "type": "link",
            "text": "Tiboの公開プロフィール / Tibo public profile",
            "url": "https://x.com/thsottiaux"
          }
        ]
      },
      {
        "id": "settings",
        "title": "詳細：表示設定・接続・小窓",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "場所",
              "設定・操作"
            ],
            "rows": [
              [
                "ヘッダー",
                "チーム、サポート、利用状況レポート、製品紹介、セットアップ、保存範囲の説明、日英切替。"
              ],
              [
                "表示ツールバー",
                "サービス別タスク、最前面の小窓、通常の小窓、標準／ダーク、フルスクリーン、アドバイス、使用量／残量、通知音、音量、今すぐ更新。"
              ],
              [
                "セットアップの表示",
                "サービスの表示／非表示、上下移動による順序。非表示でも有効な読取り・履歴は続きます。"
              ],
              [
                "パネル設定",
                "対応するAIサイト内のパネル、位置・不透明度等。画面やブラウザーによる制約があります。"
              ],
              [
                "API・追加サービス",
                "対象サービスの任意読取りを許可・解除。許可確認が必要な操作は拡張機能の設定画面で行います。"
              ],
              [
                "接続・ログイン確認",
                "カードの案内から公式ログイン、再取得、対象の読取り設定、接続方法へ進みます。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "最前面の小窓は対応ブラウザーのDocument Picture-in-Pictureを使います。未対応時は通常小窓になります。通常小窓はOS全体で常に最前面になる機能ではありません。ブラウザー固有のタイトル・枠はアプリでは置き換えられません。"
          },
          {
            "type": "p",
            "text": "表示言語・テーマ等は対応するメイン・小窓・タスク画面で反映します。レポートは安定した集計のため開いた時点のスナップショットを使い、「最新の履歴を反映」で現在の言語・テーマも取り込みます。新しいアクセス許可は利用者の操作が必要です。"
          }
        ]
      },
      {
        "id": "team",
        "title": "詳細：チーム・Gateway・PMOとの関係",
        "blocks": [
          {
            "type": "p",
            "text": "「チーム：未接続」は基本モニターの故障ではありません。既存のai-busから別途ローカル出力した状態JSONを読み込み、自己申告の余力と鮮度を確認する任意機能です。欠けた情報や古い申告は未確認とし、作業の完了・実稼働・残量の公式証明には使いません。読込み・更新・ローカル消去の操作があります。"
          },
          {
            "type": "p",
            "text": "Museの「Bus参考日時」や回答日時の反映は参考情報です。質問文をコピーしてもMuseへ自動送信しません。公式残量・履歴・回復音・課金判断を上書きしません。"
          },
          {
            "type": "table",
            "columns": [
              "製品",
              "役割と現在の段階"
            ],
            "rows": [
              [
                "LLMs Monitor",
                "各社の観測値・残量推移・情報の確かさを提供。グラフレポートは実装済み。"
              ],
              [
                "LLMs Gateway",
                "依頼に必要な能力・利用可能経路・費用・余力を合わせて候補を比較する連携を設計中。"
              ],
              [
                "LLMs PMO",
                "会社・プロジェクト・チケットの目的と優先順位、次の行動を整理する別製品。"
              ],
              [
                "連携API／LLMs Bus",
                "読み取り専用のデータ契約とオフライン変換の設計・試作段階。認証済みの自動配達・自動割当は未提供。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "各社の1%は同じ処理容量ではありません。観測回数を利用回数と読み替えず、プラン・モデル・用途・実行結果が照合できる範囲で今後の分析に使います。余ったクレジットの譲渡、APIキー共有、課金許可の自動化は提供しません。"
          },
          {
            "type": "link",
            "text": "チームの操作手順",
            "url": "https://llmsmonitor.ntus.org/docs/TEAM_STATUS.md"
          }
        ]
      },
      {
        "id": "performance",
        "title": "詳細：省メモリ設定と動作条件",
        "blocks": [
          {
            "type": "p",
            "text": "グラフの集計・描画は別タブを明示的に開いたときだけ行い、メイン画面には集計エンジンや外部グラフライブラリーを読み込みません。詳細表は開いたときに作り、レポートは常時再集計しません。保存履歴を削って軽くする方式ではありません。"
          },
          {
            "type": "p",
            "text": "Chromeのメモリセーバー「最大」は裏タブを短時間で休止させます。公式画面の描画が必要なMuseや請求画面等は更新が遅れることがあります。省エネモードも対象の背景タブ処理に影響します。現行設定で常に連続更新できるとは保証しません。"
          },
          {
            "type": "p",
            "text": "更新が止まる場合は取得時刻・理由と公式ログインを確認します。必要なら、利用者の判断でモニターや取得に必要な対象サイトだけを「常にアクティブにするサイト」へ追加できます。全サイトの省メモリをOFFにする必要はありません。ただし例外分のメモリ消費は増えます。アプリから勝手に設定を変えません。"
          },
          {
            "type": "p",
            "text": "日本語入力が重いなどの症状は、同じ条件・タブ数でモニターを閉じた場合と比較します。ブラウザー全体の負荷、他の拡張機能、通信、スリープも切り分けます。Chrome全体のメモリ削減率や入力停止の原因は本ガイドでは断定しません。"
          },
          {
            "type": "link",
            "text": "Chrome公式：パフォーマンス設定",
            "url": "https://support.google.com/chrome/answer/12929150?hl=ja"
          }
        ]
      },
      {
        "id": "troubleshooting",
        "title": "詳細：困ったとき・サポート",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "症状",
              "順に確認すること"
            ],
            "rows": [
              [
                "—・取得停止・ログイン案内",
                "同じブラウザープロファイルと正しいアカウント → 対象読取りの有効・許可 → 公式ログイン → 今すぐ更新。"
              ],
              [
                "数値が古い／勝手に未取得へ",
                "取得日時・理由 → 公式ページの読込完了 → Chrome休止やスリープ。前回値は現在値と区別します。"
              ],
              [
                "ボタンを押しても分からない",
                "ボタン付近の処理中・応答待ち・完了／失敗を確認。長い処理を連打せず待ちます。"
              ],
              [
                "請求画面を見ても残高がない",
                "サブスク画面とAPI請求画面の違い、対象アカウント、任意権限、読取対応状況を確認。購入して解決を試みません。"
              ],
              [
                "画面と拡張の版が違う",
                "更新先が同じフォルダーか確認 → 拡張機能を再読み込み → モニターを再読み込み。ファイル更新と実行時反映は別です。"
              ],
              [
                "メモ登録が失敗",
                "作業中の入力を保存してから対応会話を安全に再読み込みし、再度登録。拡張機能更新後の古いページを確認します。"
              ],
              [
                "お気に入り・メモが見つからない",
                "サービス・作業領域・サイトURL・プロファイルと「その他の作業メモ」を確認します。"
              ],
              [
                "Tiboの投稿が古い",
                "X読取り許可・ログイン・取得時刻・表示済み投稿の制約を確認。最新取得の保証とは別です。"
              ]
            ]
          },
          {
            "type": "steps",
            "items": [
              "上部の「サポート」で必要な定型診断項目だけ選びます。初期選択はOFFです。",
              "プレビューで内容を確かめ、端末へ下書きを保存します。この段階では送信されません。",
              "期待した動作・実際の動作・最小の再現手順・頻度を追記します。",
              "必要なスクリーンショットは手動で切取り・伏字し、公開可能か確認してから投稿先を選びます。"
            ]
          },
          {
            "type": "note",
            "text": "GitHub Issuesは公開の場です。APIキー、Cookie、認証URL、アカウント／組織ID、残高・請求、会話本文、非公開Bus内容やそのままのCSVを貼らないでください。画像の自動伏字・自動添付・自動起票は未提供です。"
          },
          {
            "type": "link",
            "text": "サポートの詳しい案内",
            "url": "https://llmsmonitor.ntus.org/docs/SUPPORT.md"
          }
        ]
      },
      {
        "id": "privacy",
        "title": "詳細：保存範囲とプライバシー",
        "blocks": [
          {
            "type": "table",
            "columns": [
              "情報",
              "保存・受け渡し"
            ],
            "rows": [
              [
                "残量・変化履歴・設定",
                "現在のブラウザー拡張機能の保存領域。通常の運営サーバー自動送信はしません。"
              ],
              [
                "作業メモ・お気に入り・既読・任意の読込み",
                "現在のサイトURL／プロファイルの保存領域にも依存。別端末・別URLへの自動同期ではありません。"
              ],
              [
                "自動タスク一覧",
                "画面のメモリー上のメタ情報。明示保存する作業メモと別です。"
              ],
              [
                "CSV・JSON・サポート下書き",
                "利用者が押したときだけ端末へ保存。共有は利用者が内容を確かめます。"
              ],
              [
                "公式サイトとの通信",
                "公式セッションや公式障害情報の取得でネットワークを使います。「ローカル保存」は通信ゼロを意味しません。"
              ]
            ]
          },
          {
            "type": "p",
            "text": "本アプリの解析に各社のパスワード・APIキーを入力する必要はありません。APIキーを使うGateway等の別製品の設定と混同しないでください。公式ログイン画面の認証は公式サービスで行います。ブラウザーの保存領域を消去する、拡張機能を削除する、端末・URL・プロファイルを変える前に重要なメモをJSONで書き出してください。"
          },
          {
            "type": "link",
            "text": "プライバシーポリシー",
            "url": "privacy.html"
          }
        ]
      },
      {
        "id": "updates",
        "title": "詳細：更新・バックアップ・復元",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "更新前に、現在の画面と拡張機能の版、読み込んでいるフォルダーを確認します。重要な作業メモは書き出します。",
              "更新は同じLLMs-Monitorフォルダーへ行います。アンインストールや毎回別名のフォルダーを増やす方法は避けます。",
              "Mac更新アプリは初回に既存フォルダーを登録し、以後は検証とバックアップ付きで更新します。未変更のヘルパー・更新アプリを毎回入れ直す必要はありません。",
              "拡張機能とモニターの再読み込み後に版と取得状態を確認します。作業中の会話を更新のためだけに再読込しません。",
              "問題があれば更新アプリの復元手順で前のファイルへ戻します。コードのバックアップと、ブラウザーに保存した利用データの移行は別です。"
            ]
          },
          {
            "type": "p",
            "text": "配布ZIP、読み込み済み拡張機能、Web画面、GitHub、ブラウザーストアは別々に版が反映されます。ストア審査済み、一般公開済みという意味にはなりません。更新アプリの署名・公証やOSの案内は導入手順に従い、セキュリティ保護を一括で無効にしないでください。"
          },
          {
            "type": "link",
            "text": "Mac更新・復元の詳細",
            "url": "https://llmsmonitor.ntus.org/docs/MAC_UPDATER.md"
          }
        ]
      },
      {
        "id": "presentation",
        "title": "お客様へ説明する5分の流れ",
        "blocks": [
          {
            "type": "steps",
            "items": [
              "30秒：複数AIの余力・リセット・費用枠を一画面で見る目的を説明します。",
              "1分：使用量と残量を切り替え、週間とセッション、未取得と0の違いを見せます。",
              "1分：サブスク枠とAPI残高、月間上限と購入残高が別であることを説明します。",
              "1分：利用状況レポートでサービスと期間を切り替え、推移・観測減少・CSVを紹介します。実データを他者へ見せるときは事前に範囲を確認します。",
              "1分：サンプルまたは公開可能な作業で、お気に入り・次の一手のメモ・小窓を見せます。",
              "30秒：現在のβ対応範囲と、Gateway／PMO連携は段階的な構想であることを説明します。"
            ]
          },
          {
            "type": "p",
            "text": "説明の要点：「残量の見える化」と「作業の続きの整理」をまず体験できます。すべてのLLMの完全監視、自動最適振分け、利用枠の譲渡、API課金の自動承認が完成したと説明しないでください。"
          }
        ]
      },
      {
        "id": "index",
        "title": "機能一覧と関連する詳しい資料",
        "blocks": [
          {
            "type": "p",
            "text": "メイン表示／プラン／使用量・残量／週間・セッション／リセット／各種クレジット／変化履歴／グラフ／CSV・印刷／通知音／アドバイス／障害／公開更新／小窓・最前面・全画面／日英・テーマ／パネル／サービス選択・順序／接続／タスク一覧・状態・検索／お気に入り／メモ・引継ぎ・JSON／Codexヘルパー／チーム／Muse参考日時／Gateway参考書出し／サポート／プライバシー／更新・復元を、このガイドで扱っています。"
          },
          {
            "type": "p",
            "text": "API設定には、対応するClaude API参考情報を利用者の操作でJSON保存するGateway向け試作もあります。観測・期限・未確認を保持した参考値で、自動送信や支出許可ではありません。"
          },
          {
            "type": "link",
            "text": "ダウンロードできる取扱説明書（Markdown）",
            "url": "docs/USER_GUIDE.md"
          },
          {
            "type": "link",
            "text": "更新内容",
            "url": "docs/CHANGELOG.md"
          },
          {
            "type": "link",
            "text": "チーム操作",
            "url": "docs/TEAM_STATUS.md"
          },
          {
            "type": "link",
            "text": "サポート",
            "url": "docs/SUPPORT.md"
          },
          {
            "type": "link",
            "text": "モニターを開く",
            "url": "./"
          }
        ]
      }
    ]
  }
};
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
 function render(language){const c=GUIDE[language]||GUIDE.en,host=document.getElementById('usage-guide');if(!host)return;
  host.replaceChildren();
  const heading=el('div',undefined,'guide-heading'),eyebrow=el('p',c.eyebrow,'eyebrow'),title=el(host.dataset.standalone?'h1':'h2');title.id='guide-title';title.textContent=c.title.replace('<br>','\n');heading.append(eyebrow,title,el('p',c.intro,'guide-intro'),el('small',c.revision));host.append(heading);
  const layout=el('div',undefined,'guide-layout'),nav=el('nav',undefined,'guide-toc');nav.setAttribute('aria-label',c.toc);nav.append(el('strong',c.toc));const links=el('ol');for(const chapter of c.chapters){const li=el('li'),a=el('a',chapter.title);a.href='#guide-'+chapter.id;li.append(a);links.append(li)}nav.append(links);const body=el('div',undefined,'guide-chapters');
  for(const [i,chapter] of c.chapters.entries()){const article=el('article',undefined,'guide-chapter');article.id='guide-'+chapter.id;const h=el(host.dataset.standalone?'h2':'h3');h.append(el('span',String(i+1).padStart(2,'0')),el('span',chapter.title));article.append(h);
   for(const block of chapter.blocks){if(block.type==='steps'||block.type==='list'){const list=el(block.type==='steps'?'ol':'ul',undefined,block.type==='steps'?'guide-steps':'');for(const item of block.items)list.append(el('li',item));article.append(list)}else if(block.type==='table'){const box=el('div',undefined,'guide-table'),table=el('table'),head=el('thead'),tr=el('tr');for(const label of block.columns){const th=el('th',label);th.scope='col';tr.append(th)}head.append(tr);const tbody=el('tbody');for(const row of block.rows){const tr=el('tr');for(const [index,cell] of row.entries()){const td=el(index===0?'th':'td',cell);if(index===0)td.scope='row';tr.append(td)}tbody.append(tr)}table.append(head,tbody);box.append(table);article.append(box)}else if(block.type==='link'){const a=el('a',block.text,'guide-link');a.href=block.url;if(block.url.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer'}article.append(a)}else article.append(el('p',block.text,block.type==='note'?'guide-note':''))}
   body.append(article)}layout.append(nav,body);host.append(layout)
 }
 root.LLMProductGuide={render};
 if(typeof module==='object'&&module.exports)module.exports=GUIDE;
})(globalThis);
