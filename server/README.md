# Public X/Tibo intelligence — v1.32.0

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

**Current static Site: unconfigured. Live Tibo notifications are not verified or active.** Full app builds deliberately ship `api/intelligence.json` with status `unconfigured`; building/publishing static files does not deploy this Worker.

## Server setup

Deploy `intelligence-worker.mjs` to a Cloudflare-compatible Worker with: operator-managed secret `X_BEARER_TOKEN` for an approved X developer app with recent-search access; KV binding `INTELLIGENCE_CACHE`; cron `* * * * *`. Route `/api/intelligence.json` on the existing monitor origin to the Worker without changing the Site audience or other paths. A separate server deployment/routing arrangement is required for static Sites hosting. Do not paste the secret into chat, source, browser settings, hosting JSON or logs. Do not purchase API access automatically; confirm account access/cost with the owner. [Official X pagination documentation](https://docs.x.com/xdks/python/pagination).

No private usage, account, notes or prompts are sent to this server. It reads only fixed public company accounts plus `@thsottiaux` (OpenAI staff, not a company official account). Nerf Bench is excluded and link-only. The client receives bounded public summaries and original X links, never the credential.

## Detection and failure behavior

Classification checks full supported long-post text (up to 25,000 characters), case-insensitive fixed usernames, usage/reset/recovery signals and numeric post IDs. Generic password resets are excluded. A reset announcement is not proof that an individual user's quota changed. Wording changes, images/videos, replies without matching text, missed API access and provider omissions can cause false negatives; detection is not exhaustive. Summaries are capped at 360 characters; consult the original post for the complete context.

Initial server search covers the last 24 hours. Complete polls advance a public-post-ID cursor; subsequent polls request newer IDs. Up to four 100-result pages per attempt, eight seconds overall and 3 MB per response. Missing metadata, partial/API-error/over-limit pages fail rather than claim complete success. Commit feed before cursor; duplicate IDs preserve first detection time. Cache ≤50 alerts for seven days. The first successful **client** poll establishes a silent baseline; only later new IDs notify. Unconfigured/failed polls cannot establish that baseline. Repeated polls do not repeat an alert. Failures preserve prior alerts and show `unavailable`; a ready cache older than 125 seconds cannot claim current health. Browser sleep/queue/network delay can postpone one-minute checks.

## Required live acceptance before promotion

1. Verify deployed endpoint transitions from unconfigured to ready, with recent checkedAt and exact approved CORS. Confirm cron execution and X API capability without logging raw responses/secrets.
2. Verify a real Tibo usage-reset post is in the API response and produces the expected normalized account/kind/source. This depends on an eligible post existing; do not fabricate or publish a test tweet.
3. Open the monitor/extension: initial baseline stays silent; a later real matching post produces one popup; repeat polling stays silent. Check notifications permission and sound on/off. Confirm API failure keeps prior alerts without changing quota/history.
4. Record post URL, public timestamp, normalized ID/kind and notification time only. Never record provider tokens or personal chats. Until this passes, say **server setup required**, not “Tibo alerts live.”

Synthetic tests cover long posts, recovery vs reset, false-positive exclusions, paging/cursor, response limits, API failures, stale feeds, baseline/dedup, and the actual extension notification/sound dispatch. They do not prove a live API subscription, deployed cron or delivered production popup.

---


## v1.36 — Free Tibo public-page reading

In the monitor, choose **Tibo connections**, allow optional `https://x.com/*` access, then keep a signed-in Tibo profile/post open in Chrome. Only rendered public posts by `@thsottiaux` are inspected once per minute; there is no automatic reload, hidden crawl, paid API, credential extraction or DM/input reading. Undisplayed new posts are not discovered. Missing page/access restrictions show unavailable, preserving prior public alerts; first read is silent and later post IDs notify once. No private usage or notes are sent to X.

ChatGPT main and all shared subviews show **Tibo 𝕏 Reset? (YYYYMMDD HH:MM)** only when an announced future deadline can be parsed. Currently explicit “by EOD PST time” is converted from the posting day's fixed UTC−08:00 end (23:59) to the device timezone. It is an approximate deadline, not an exact execution time. Tooltip shows the announcement/timezone; click opens the exact source post. The mark disappears at the deadline. Short announcements without a deadline still enter the feed, but do not receive a dated mark. Personal quota recovery remains unverified until official usage changes.

The server feed remains unconfigured; this optional browser reader does not deploy or use it. Installed-package permission/notification acceptance is pending.
<a id="ja"></a>

# 日本語 — Tibo／公式X速報

**現行の静的サイトは未設定です。Tiboの実投稿通知は未稼働・未検証です。** フルビルドは意図的に未設定JSONを配布し、Workerを自動配置しません。

`intelligence-worker.mjs` を別のCloudflare互換Workerへ配置し、承認済みX開発アプリのrecent-search権限、Secret `X_BEARER_TOKEN`、KV `INTELLIGENCE_CACHE`、1分cronを設定します。既存originの `/api/intelligence.json` だけをWorkerへルーティングする構成が別途必要で、Sitesの公開範囲・他経路を勝手に変更しません。Secretをチャット・ソース・設定画面・ログへ入れず、API料金／権限は所有者が確認します。

個人使用量・メモ・本文・認証はサーバーへ送りません。固定の各社公式アカウントとTibo氏（OpenAIスタッフ）を区別し、Nerf Benchは対象外。長文最大25,000字と利用枠／リセット／復旧の語を照合し、パスワードリセットは除外。告知は個人の残量リセット済みという意味ではありません。画像・動画だけの投稿、語句変更、API欠落などは見落とす可能性があります。要約360字で、原文リンクから確認してください。

初回サーバー検索は直近24時間、その後は完全取得できた公開投稿IDより新しい投稿を確認。1回最大100件×4ページ・合計8秒・応答3MB。APIエラー・不完全ページ・上限は成功とせず、前回情報を保持して取得不可にします。最大50速報・7日保持。125秒より古いreadyは現在の正常取得としません。最初の成功したクライアント取得は無音の基準値、新しいIDだけ通知。同じ投稿は再通知せず、未設定／失敗は初回基準になりません。ブラウザー休止・待ち行列・通信で1分確認が遅れる場合があります。

**宣伝前の実機確認:** endpointがready・最新時刻になること、cron／X権限、実際のTiboリセット投稿のID・種類・出典、初回無音→以後の実投稿通知1回→再取得無音、失敗時の保持、通知許可・音ON/OFF、残量・履歴への影響なしを確認。対象投稿がなければ待ち、テスト投稿を勝手に公開しません。記録は公開URL・日時・ID・通知時刻だけです。模擬テストの通過を本番通知成功とは扱いません。

For v1.32, the fixed Tibo 𝕏 profile link is independent of this still-unconfigured feed. It does not enable deployment or verify resets. v1.32のTibo 𝕏プロフィールリンクは未設定の配信経路とは独立し、配信稼働／個人リセットの検証とは扱いません。

## v1.36 — 無料のTibo公開ページ読取り

メインの［Tibo連携］から任意の `https://x.com/*` アクセスを許可し、Chromeでログイン済みのTiboプロフィールまたは投稿を開いてください。1分ごとに、画面に表示済みの `@thsottiaux` 本人の公開投稿だけを確認します。自動リロード・裏の巡回・有料API・認証取得・DM／入力欄読取りは行いません。未表示の新着は検知できず、ページなし・アクセス制限は取得不能になります。初回は無音、以後の新しい投稿IDを一度だけ通知します。利用残量・メモをXへ送りません。

予定期限を読み取れる場合だけ、ChatGPTのメインと共通サブ画面に **Tibo 𝕏 Reset? (YYYYMMDD HH:MM)** を表示します。現在は明示的な「by EOD PST time」を、投稿日のPST（固定UTC−08:00）の当日末23:59という目安に解釈し、端末の現地時間へ換算します。正確な実施時刻ではありません。ツールチップで内容・タイムゾーンを確認でき、クリックで当該投稿へ移動、期限後は非表示です。日時のない短文告知は速報に表示しますが日時付きマークを出しません。個人の残量回復は公式使用量の変化で別途確認します。

サーバー配信は引き続き未設定です。この任意ブラウザ経路はサーバー配置・有料API利用をしません。更新済み拡張機能の権限・通知の実機確認は未完了です。
