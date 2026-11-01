# 状態JSON / Offline status schema

現在の実装は `schemaVersion: 1` の厳密な読取り形式です。ファイルは32KiB以下、追加のキーは拒否します。認証情報、任意URL、本文、件名、作業指示は受け入れません。

| フィールド / Field | 型・制約 / Type and constraint |
|---|---|
| `schemaVersion` | 数値 `1` / number `1` |
| `source.repository` | 固定 `ntus/ai-bus` |
| `source.commit` | 読取り元の小文字40桁commit SHA / lowercase40hex |
| `collectedAt` | タイムゾーン付きISO日時 / ISO timestamp with timezone |
| `complete` | boolean。trueなら5受け口すべてが必要。falseは一部取得 / partial read |
| `agents` | 最大5件、id重複不可 / at most5 unique receiver IDs |
| `agents[].id` | `chatgpt`, `claude`, `codex`, `grok`, `muse` のみ |
| `agents[].level` | `available`, `caution`, `low`, `unknown` のみ |
| `agents[].updatedAt` | 申告時刻。ISO日時かnull / report time or null |
| `agents[].resetAt` | 自己申告リセット日時。ISO日時かnull / reported reset or null |

## 画面上の判定 / Presentation

- JSON収集時刻と、各AIの申告時刻は別に表示します。読込み直しても申告時刻は書き換えません。
- 収集時刻または申告時刻が24時間を超えた場合、申告なし、時刻なし、5分を超える未来時刻は未確認です。欠けた受け口を正常や0として扱いません。
- 正規値でない申告は、ローカル出力ツールでunknownになります。説明付きの曖昧な値から残量や状態を推定しません。
- リセット予定は公式のquota回復証拠ではありません。日時を過ぎただけで回復音・通知・新規作業を起動しません。
- 出典リンクは、固定リポジトリ・検証済みcommit・固定statusパスから生成します。入力の任意リンクは使いません。

Collection time and report time are independent. Reports or snapshots older than24h are unknown. Missing, undated, invalid or excessively future reports are unknown; they are never converted to healthy/zero. Reset time is a self-report, not official recovery evidence. Source links are generated from a fixed repository, validated commit and fixed status path.

## 更新方法 / Updating

[ローカル出力ツール](../../tools/ai-bus/README.md)で、新しい安全なファイル名に出力し、パネルで選択します。自動GitHub読取りや自動同期はありません。ファイルの処理・保存・消去はそのブラウザー内だけで完結します。

No automatic GitHub fetch or sync is implemented. Export from the existing trusted local checkout and explicitly choose the resulting JSON. Processing and storage remain local to that browser.

## 将来の拡張 / Future changes

人・スレッド・アカウントを増やす場合は、別の版の識別子・登録簿・閲覧権限・重複集計防止・移行の設計が必要です。既存のidへ勝手に人を詰め込んだり、同じアカウントの枠を足し算しないでください。現行UIはその機能を実装していません。
