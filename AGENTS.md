# LLMs Monitor — Agent Instructions

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

This file is the starting point for every future Codex or LLM edit. Follow the user's current instructions while preserving existing features and browser-stored data.

## Read before every change

1. Read this entire `AGENTS.md`.
2. Read all of `SPECIFICATION.md`, including acceptance criteria and known limitations.
3. Read every requirement ID, data contract, and evidence item in `spec/requirements.json`.
4. Review `README.md`, `STORE_SUBMISSION.md`, `extension/manifest.json`, relevant source code, and existing tests.
5. Check `git status` and recent diffs; never overwrite user or parallel changes.

## Regression-prevention workflow

- Map the request to existing requirement IDs. Add IDs for missing requirements; never silently delete or weaken an old requirement.
- Update `SPECIFICATION.md` and `spec/requirements.json` with the implementation. Disclose limits and unverified behavior.
- Treat `extension/` as the source of truth for store-package UI. Web-only enhancements belong in `web/` and are composed into `dist/` by `build.py`; never edit generated `dist/` alone. A normal `python3 build.py` preserves the existing store ZIP. Use `python3 build.py --package` only for an intentional extension-package release.
- Preserve storage keys, history, limit labels, acquisition sources, account boundaries, and compatibility with older settings. New settings need optional defaults.
- Apply settings to the main page, public web app, normal popup, always-on-top view, and in-page panels. Hidden services must keep fetching and recording history so they can be restored.
- Check the existing acquisition paths, 60-second refresh, one-minute official service-status monitoring and status-log throttle, history, numeric-only change indicator, three sounds, localization, themes, opacity, fullscreen, explicit-only popup launch, unrestricted popup CSS sizing, and privacy before release. Read `SECURITY_REVIEW.md` and keep its permissions and manual-test limits current.
- Never replace an official provider value with an estimate. Tips and news require dates and primary-source links; never send private usage data or history to an external news source.
- Run meaningful tests, `node --test tests/*.test.cjs`, `python3 build.py`, ZIP inspection, version checks, and diff checks. Record any necessary manual verification in `SPECIFICATION.md`.
- Decide the version before building. If the store package changes, increment the minor component `y` in `x.y.z` and reset `z` to zero. If only lightweight non-package content changes, increment `z`; an explicitly version-neutral content update keeps the current version. Keep all changed release surfaces consistent and preserve the existing Site audience when deploying.

## Every deliverable

Keep this `AGENTS.md` in the repository and update it when a new acceptance rule or failure-prevention step arises. In the final report, link this file, the detailed specification, and the distribution package; distinguish verified behavior from live-account checks that remain unverified.

---

<a id="ja"></a>

# 日本語 — LLMs Monitor 作業指示

[🌍 EN](#en) · [🇯🇵 JP](#ja)

このファイルは将来の Codex / LLM に向けた、毎回の作業開始点です。ユーザーの最新指示を優先しつつ、既存機能と保存データを守ってください。

## 毎回、編集前に読む

1. この `AGENTS.md` を読む。
2. `SPECIFICATION.md` を全体通読し、対象機能の受入基準と既知の制約を確認する。
3. `spec/requirements.json` の全要件ID、データ契約、証跡を確認する。
4. `README.md`、`STORE_SUBMISSION.md`、`extension/manifest.json`、関連コードと既存テストを確認する。
5. `git status` と直近の差分を確認し、利用者または別作業の変更を上書きしない。

## デグレ防止の変更手順

- 依頼内容を既存の要件IDに対応付け、足りない要件は新しいIDを追加する。旧要件を黙って削除・弱体化しない。
- `SPECIFICATION.md` と `spec/requirements.json` を実装と同じ変更で更新する。仕様上の制約と未確認事項を隠さない。
- `extension/` をストア配布機能の正本とする。Web限定の追加は `web/` に置き、`build.py` で `dist/` へ合成し、生成後の `dist/` だけを直接直さない。通常の `python3 build.py` は既存ZIPを維持し、意図して拡張機能を更新するときだけ `python3 build.py --package` を使う。
- 保存キー、履歴、利用枠ラベル、取得元、アカウント境界、設定の旧データとの互換性を保つ。新しい設定は省略可能な既定値を持たせる。
- 設定変更はメイン画面、公開Web、通常小窓、最前面表示、サイト内パネルに反映する。非表示のサービスもバックグラウンド取得・履歴保存を続け、再表示時に既存データを戻す。
- 既存の取得経路、60秒更新、1分周期の障害監視とステータスログ抑制、履歴、数値だけの通知、3音、日英、テーマ、透明度、フルスクリーン、小窓の明示起動と自由リサイズ、プライバシーを変更前後で確認する。
- 公式サービス由来の値を推測値で置き換えない。外部情報やニュースは日付と一次情報へのリンクを付け、使用量・履歴を外部へ送信しない。
- 適切な意味のあるテストと `node --test tests/*.test.cjs` を実行し、`python3 build.py`、ZIP一覧、版番号、差分を確認する。必要な手動確認を `SPECIFICATION.md` に記録する。
- ビルド前に版を判定する。ストア公開用パッケージが変わる場合は `x.y.z` の `y` を1増やして `z=0`、パッケージを変えない軽微な変更は `z` を1増やす。ただし利用者が版据え置きを明示したコンテンツ更新は現行版を維持する。変更対象の版表記をそろえ、既存の公開範囲を保ってサイトを更新する。

## 毎回の成果物

`AGENTS.md` 自体をリポジトリに残し、新しい受入規則や失敗防止策が生じたら更新する。最終報告では、このファイル、詳細仕様書、配布物へリンクし、確認済み事項と実機で未確認の事項を区別する。
