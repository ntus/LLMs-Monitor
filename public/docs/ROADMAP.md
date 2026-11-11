Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/docs/ROADMAP.md

# Roadmap / 今後の計画

Updated5 November2026. Release-preparation candidate1.100.0; installed files/restricted Site updated to1.99.0, with Chrome runtime acceptance pending. This is a plan, not a delivery-date or compatibility guarantee. No new account access, paid API, automatic transmission or publication is authorized by this document.

2026年11月5日更新。初版準備候補v1.100.0、設置ファイル／限定Siteはv1.99.0、Chrome実行時の確認は未完了。日程・全プラン対応の保証ではありません。優先度は取得の正確さ、既存データ保全、導入の分かりやすさを先にします。

| Stage / 段階 | Scope / 内容 | Completion evidence / 完了条件 |
| --- | --- | --- |
| Available beta / 現行β | 対応枠のモニター、別のAPI残高、履歴／レポート／CSV、作業メモ、小窓、定型サポート下書き、ローカルのチーム／Muse参考JSON | 自動テストと限定的な実機確認。サービス別の未確認項目を取説に明記 |
| First public release / 初版公開前 | 一般利用者向け導入手順、版と配布元の統一、プライバシー／サポート導線、利用許諾と公開範囲の確認 | [公開前チェックリスト](https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md)完了。別プロファイルで案内通りに導入・更新できること |
| Acquisition quality / 取得の改善 | Gemini API決済iframeの最小読取り、Copilot／DeepSeek／Perplexity／Gensparkの項目別正式受入、期限・ログイン・複数アカウントの扱い | 同一アカウントの公式表示と照合、曖昧／未取得を0にしない、必要な権限を個別レビュー |
| Public updates / 新着情報 | 公開投稿の取得条件・最終確認日時を分かりやすくし、追加費用を優先せず取得元を検討 | 未表示投稿まで取得するなら、実際に動く取得元と重複・遅延・障害試験が必要。現行の表示済み投稿読取りと区別 |
| LLMs Bus / Gateway cooperation | 観測形式、鮮度、出典、送受信先、相関ID・重複・失効・取消を共通化。まず既存観測の読取り専用連携 | 共同仕様・独立レビュー・明示的な接続・アカウント対応付け・送信停止／消去を確認。オフライン試験と実接続を区別 |
| Muse timing automation / Muse日時連携 | 必要時に参考リセット日時を取得し、手動転記を減らす | 既存観測の読取りと新規質問を別capabilityにする。質問送信は別の権限・費用・データ範囲の合意後。自己申告を公式証拠にしない |
| Support and collaboration / サポートセンター | 共有範囲を選択、正確なプレビュー、必要な再現手順・任意の伏字済み画像をGitHub等へ集約 | 公開先・保存・削除・権限を確認。現行の端末内下書きから、利用者が理解して送信できる段階へ |
| Team dashboard / チーム利用 | 全体／個別の自己申告状態、担当・待ち・引継ぎ・成果物レビューを分かりやすく | 能力・余力・権限と、実行／完了／承認を別表示。未接続でも通常モニターを維持 |
| Performance / 負荷 | DOM走査・描画・裏タブ処理を同条件で計測し、入力を妨げにくくする | 同タブ数／データ量で前後比較、端末ごとの実測。根拠なしに「入力遅延の原因は解消」としない |

## Working together / 協力の仕方

Share reproducible issues, minimal synthetic examples and bounded proposals using the [support guide](https://github.com/ntus/LLMs-Monitor/blob/main/docs/SUPPORT.md) and [team collaboration guide](https://github.com/ntus/LLMs-Monitor/blob/main/docs/team/README.md). Participants use their own plans and credentials. Capacity reports are advisory and do not start work.

「余った使用量の活用」は、本人の契約・認証で実行できる担当へ小さな作業を分担する方向を検討します。利用枠／クレジットの移転、アカウントやAPIキーの貸借、上限回避を提供する計画ではありません。料金が発生する実行と、参考情報の表示は分離します。

## Not yet available / 未提供

Authenticated live Bus transport, automatic Muse questions, universal training/privacy-setting detection, automatic GitHub issue/screenshot upload, automatic paid inference, quota pooling and universal provider coverage are not implemented in this candidate. Browser-store approval and the planned aimon.ntus.info migration remain separate release operations.
