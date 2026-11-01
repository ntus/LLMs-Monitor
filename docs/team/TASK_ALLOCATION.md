# 能力と余力による作業分担案 / Allocation proposal

**運用案・自動実装なし / Proposal, not automatic dispatch.** パネルは作業を実行・送信・再開しません。

## 候補の選び方 / Choosing a candidate

1. **できること**：必要なツール、環境、専門性、データの閲覧権限があるかを確かめる。AIの銘柄やモデル名だけで能力を決めない。
2. **得意なこと**：過去の検証例・成果物・評価方法を確認する。実装と独立レビューの担当は分ける。
3. **今の余力**：本人が公式値や警告を再確認する。古い申告・unknownは割当可能の根拠にしない。
4. **費用と機密**：追加API料金と共有可能な成果物の範囲を確認する。余力があっても、許可のないデータを別サービスへ送らない。
5. **範囲と期限**：目的、触る場所、禁止範囲、完了条件、期限、途中停止時の引継ぎ先を合意してから始める。

Check tool/environment access first, demonstrated strengths next, current capacity next, then cost and data boundaries. Agree a bounded task and acceptance criteria before starting. Model branding alone is not proof of capability.

| 状態 / Capacity | 相談する作業 / Appropriate discussion |
|---|---|
| 余裕あり / Available | 具体的な範囲を示して候補を相談。着手前の本人確認は省かない / Discuss a bounded candidate; recheck before starting |
| 注意 / Caution | 短い調査や小さな差分を検討。大きな作業を分ける / Consider short work and split large tasks |
| 枯渇に近い / Near limit | 重い新規作業より、安全な区切り・保存・引継ぎを優先 / Prefer a safe checkpoint and handoff |
| 未確認 / Unconfirmed | 申告や実際の可用性を確認。空いていると決めつけない / Verify capacity, never assume idle or available |

## 引継ぎと結果 / Handoff and evidence

[引継ぎテンプレート](TASK_HANDOFF_TEMPLATE.md)に、変更済みファイル・テスト・未確認・次の操作を記録します。レビューまたはマージの許可は既存規則に従います。完了や失敗は実際の成果物・テスト・外部操作の記録で確認し、capacityやidle表示から推測しません。

Use the handoff template. Review/merge authorization follows existing rules. Verify real artifacts/tests/action evidence; a capacity state or idle runtime never proves completion. Sharing the output of work is different from sharing credentials or moving quotas.

## 小さく始める協業アイデア / Pilot ideas

- **レビュー待ちキュー**：余力がある参加者が、小さな差分の再現確認・日英UI・テストを独立レビューする。
- **残量が少ない担当の引継ぎ**：5%以下など合意した合図で安全な区切りを保存し、別の担当が自分の認証で続きを担当する。利用枠自体を移すものではない。
- **余力への相談ボード**：Issueに目的、範囲、必要ツール、出力、期限、機密・追加費用を記載して参加を募る。受諾前に自動実行しない。
- **ペア調査**：一方が仕様や取得根拠を調べ、別の担当が反例・欠測・リセット境界を検証する。
- **集計レポートの持ち寄り**：本人が公開範囲を確認した要点のみ共有する。個人のCSVを公開Issueへ自動添付しない。

Start with a review queue, safe handoffs, opt-in bounded task proposals and independent counterexample checks. Share only reviewed report summaries; never automatically attach personal CSV histories to public issues. A future scheduler or paid API gateway requires its own identity, data-access and cost design.
