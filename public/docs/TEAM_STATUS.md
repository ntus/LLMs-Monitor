Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/docs/TEAM_STATUS.md

# チーム状況 / Team status

チーム表示はヘッダーの［チーム］から開く任意機能です。現在は、既存ai-busからローカル出力した状態JSONをブラウザー内だけで読むMVPです。自動同期・自動割当・AI呼出し・GitHub書込みはありません。未接続でも通常モニターは動作します。

Open **Team** in the header. The current MVP reads an offline ai-bus status JSON only in this browser. No automatic sync, dispatch, AI call or GitHub write is implemented. Normal monitoring works without connecting.

- [使い方 / Local export and import](https://github.com/ntus/LLMs-Monitor/blob/main/tools/ai-bus/README.md)
- [JSON・鮮度・出典 / Schema and freshness](https://github.com/ntus/LLMs-Monitor/blob/main/docs/team/STATUS_SCHEMA.md)
- [協業コンテンツ / Collaboration materials](https://github.com/ntus/LLMs-Monitor/blob/main/docs/team/README.md)
- [能力と余力による分担案 / Allocation proposal](https://github.com/ntus/LLMs-Monitor/blob/main/docs/team/TASK_ALLOCATION.md)

状態は自己申告です。実行中・完了・障害とは区別し、24時間を超えた申告や欠損は未確認にします。リセット予定が過ぎただけで回復とは判定しません。各参加者は自分の契約・自分の認証を使い、利用枠やキーを他人へ移すものではありません。

Capacity is self-reported, separate from runtime/completion/incidents. Stale or missing data is unconfirmed. Reset estimates alone do not prove recovery. Participants use their own plans and credentials; this does not transfer quota or keys.

## v1.97 first-release scope / 初版準備の範囲
The optional team file is a self-report, not authenticated live activity. The team panel also opens a separate Muse usage-timing.v1 reference importer. This does not synchronize team status, query Muse or dispatch work. Normal monitoring remains independent. See [roadmap](https://github.com/ntus/LLMs-Monitor/blob/main/docs/ROADMAP.md) and [safe support](https://github.com/ntus/LLMs-Monitor/blob/main/docs/SUPPORT.md).
日本語：チーム状態とMuse参考日時は別のローカル読込みです。ライブ認証・自動質問・自動割当はありません。通常モニターに接続は必須ではありません。
