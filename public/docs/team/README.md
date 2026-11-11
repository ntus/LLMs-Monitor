# チーム協業 / Team collaboration

**実装済み / Available:** 任意のローカル状態JSONを読むチームパネル。通常の残量モニターはai-busなしでも動きます。サーバー送信、自動同期、自動割当、AI呼出し、GitHub書込みはありません。

**検討段階 / Proposal:** GitHub上で作業案・担当範囲・成果物を共有し、能力と余力に応じて協力する運用。以下の文書は、そのための原案です。新たな権限や公開範囲の承認を意味しません。

| 確認したいこと / Need | 文書 / Document |
|---|---|
| 状態パネルを使う / Use the panel | [既存ローカル出力手順 / Offline instructions](../../tools/ai-bus/README.md) |
| 参加するときの境界 / Participation boundaries | [参加ガイド / Participation](PARTICIPATION.md) |
| 読めるデータ・鮮度 / Data and freshness | [状態JSON / Status schema](STATUS_SCHEMA.md) |
| 能力と余力で分担 / Allocate by capability and capacity | [割当案 / Allocation proposal](TASK_ALLOCATION.md) |
| 改善案を共有 / Propose an improvement | [提案テンプレート / Proposal template](PROPOSAL_TEMPLATE.md) |
| 担当と引継ぎ / Scope and handoff | [引継ぎテンプレート / Handoff template](TASK_HANDOFF_TEMPLATE.md) |

## 最初の流れ / First steps

1. 既存の権限で参加できるリポジトリと、公開範囲を確認する。個人の会話、残量履歴、認証情報はGitHubに貼らない。
2. まず再現手順・期待結果・確認方法を提案テンプレートに書く。作業の開始や課金の承認とは分ける。
3. 合意した担当が**自分の契約・自分の認証**で範囲を実行する。作業結果を最小限の差分・テスト・根拠としてレビューへ出す。
4. 別の確認者がレビューし、既存のリポジトリ規則に沿って反映する。自己申告の「余裕あり」を、作業完了・レビュー済み・公開許可と扱わない。

Verify repository access/audience first. Propose a bounded change with acceptance evidence. The assignee works under their own plan and credentials; share a minimal artifact or diff for independent review. Capacity is not execution, completion, review, or permission to publish.

## 実装との境界 / Implementation boundary

現在のパネルは5つの固定AI受け口の自己申告を読むだけです。個人・スレッド・組織の識別、公式のlive残量、封筒の未応答/終端照合、権限付き自動collectorは未実装です。GitHubへ提案を投稿しただけでは担当に自動実行されません。私有ai-busの内容を公開リポジトリへコピーしないでください。

The panel reads five fixed AI receivers' self-reported capacity. It does not identify people, threads or organizations, monitor live official balances, reconcile tasks, or provide an authenticated automatic collector. A GitHub proposal is not an execution command. Never mirror private ai-bus contents into a public repository.
