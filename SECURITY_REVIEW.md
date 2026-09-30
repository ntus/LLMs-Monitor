# Security review — v1.6.4 beta

[🌍 EN](#en) · [🇯🇵 JP](#ja)

<a id="en"></a>

This review records the checks performed for the 1.6.4 beta; it is not a guarantee that no vulnerabilities exist. A release owner should also test the packaged extension in current Chrome and Edge with real accounts and submit it to store review.

## Attack surface and controls

- **Origins and permissions:** `externally_connectable` permits only the published HTTPS monitor. Provider content scripts run only on the three official AI sites. Public status feeds have fixed HTTPS URLs and credential-free requests. The only added permissions are `notifications` and the three status hosts.
- **Message validation:** service snapshots are accepted only from the matching provider origin. The arrays, percentages, labels, and counts are bounded before storage. State-changing settings and window commands require the extension's own origin or the approved monitor origin.
- **Untrusted content:** incident text and provider-derived labels are escaped before HTML rendering. Links are fixed to official HTTPS status pages. No remote scripts, `eval`, or arbitrary URL navigation are used for status content.
- **Network and storage:** status responses have an 8-second timeout and a 3 MB cap. Incident requests omit credentials. Account data, history, and the last status summary remain in browser storage; no developer analytics endpoint receives them. Existing stored history is not migrated or deleted.
- **Notification behavior:** a new issue signature triggers one browser popup and one audio sequence. Repeated ten-minute checks of the same signature do not retrigger. Unknown source state is shown as unavailable, not as healthy. Recovery is based only on a subsequent official healthy response and is retained for ten minutes.

## Verification and limits

`node --test tests/*.test.cjs` exercises the status parser, hostile summary escaping, service filtering, duplicate-incident signature, and existing regression contracts. `python3 build.py` checks version alignment and packages only the `extension/` tree. This is static and unit-level review; live provider responses, browser permission dialogs, accessibility, and store policy acceptance still require manual review. Google's Workspace status feed may not report every Gemini consumer issue. False negatives remain possible when providers omit incidents or change their feeds.

---

<a id="ja"></a>

# 日本語 — セキュリティ検証記録

[🌍 EN](#en) · [🇯🇵 JP](#ja)

v1.6.4 βで確認した範囲の記録です。「脆弱性が存在しない」という保証ではありません。正式公開前には最新版Chrome／Edgeの実アカウントで配布ZIPを確認し、ストア審査を受けてください。

外部接続先は公開モニターのHTTPS origin、ページ内スクリプトは3社の公式サイトに限定しています。障害情報は固定した公式HTTPS URLから認証情報なしで取得し、8秒でタイムアウト、3 MB超の応答を拒否します。受信したスナップショットの型・件数・数値範囲を検証します。障害の文章はHTML表示時にエスケープし、リンク先は公式URLに固定します。新しい障害だけ通知し、同じ障害を1分ごとに鳴らし直しません。取得失敗は正常扱いせず「確認できません」と表示します。

自動テストとZIP生成で回帰を確認しますが、実サービス応答、ブラウザー権限表示、アクセシビリティ、ストア規約は手動検証が必要です。Google Workspaceの公開情報にはGemini個別の障害がすべて載るとは限りません。
