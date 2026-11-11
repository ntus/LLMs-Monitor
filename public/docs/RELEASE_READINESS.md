Canonical guide / 正本: https://github.com/ntus/LLMs-Monitor/blob/main/docs/RELEASE_READINESS.md

# First-release readiness / 初版公開前確認

Updated8 November2026 · app/extension package **v1.110.0**. Existing owner-restricted Site and fixed-folder files updated to **v1.110.0**; the most recent Chrome runtime check still reported **v1.109.0**, so file installation is not runtime acceptance. This checklist does not declare general availability or browser-store approval.

## Verified baseline / 確認済みの基準

- v1.110.0:724 automated tests passed before the subsequent documentation and offline contract-prototype changes. ZIP integrity, update digest and fixed-folder backup were checked.
- Separate report tab verified against real hosted history; Japanese/English, graph selection, lazy tables and bounded graph projections were checked. This is not a whole-Chrome heap or IME performance measurement.
- Existing owner-restricted Site deployment succeeded; audience retained. General-public and store distribution remain separate gates.
- Customer manual provides overview-first instructions, detailed reference, coverage limits, troubleshooting and a five-minute demonstration plan.

## Gates before general announcement / 一般向け告知前の必須確認

| Gate | Current status | Completion condition |
| --- | --- | --- |
| Candidate build | v1.110.0 built/deployed;724 tests passed before later guide/prototype changes. Runtime reload and additional-provider acceptance remain pending | Tests, consistent versions, source/flat/fixed-folder ZIP equality and update SHA; changed manuals included |
| Public site | Restricted owner access retained | Owner explicitly decides audience; separate signed-out browser verifies monitor/product/privacy/manual/download access. Do not widen by this checklist |
| GitHub version/downloads | Public main verified at1.64.0 on2026-11-03; restricted Site deployment of1.99.0 recorded locally | Review and synchronize approved source/docs/artifacts, verify public download version and digest. No push/merge is implied by local build |
| License/distribution terms | No LICENSE established in this check | Owner decides applicable source/binary use terms. Do not claim MIT/open-source/free redistribution without an established license |
| Installation/update | Existing Mac Chrome verified; wider matrix pending | New profile follows guide; Chrome/Edge and supported OS matrix recorded, same-folder update/rollback and optional grants checked |
| Store publication | Not verified/published by this work | Owner account/reviewer requirements, accessible privacy page and store approval; only then use store links |
| Provider claims | Coverage table documents partial/experimental fields | Compare claimed fields against actual provider/account/plan, unknown/login/ambiguity/stale cases. Exclude unverified features from release claims |
| Privacy/support | Local report draft available; public Issues visibility confirmed | Verify public wording, safe-report guidance, contact/repository destination and optional attachment handling |
| Performance/accessibility | Automated and limited UI checks | Relevant widths/themes/keyboard/focus/reduced-motion/IME and same-condition CPU observations recorded |
| Announcement | Draft only | Final version, actual public URL, package, terms and limitations match; owner approves target accounts and final text before posting |

## Features that are not release claims / 告知しない未提供機能

Gemini payments iframe balance, complete added-provider coverage, unseen-X comprehensive collection, Muse automatic questions, authenticated live Bus/Gateway transport, automatic GitHub/screenshot support submission, training-control autodetection and quota transfer remain incomplete. A narrower clearly labelled beta can be announced only after its own distribution/access gates are complete; it must not imply these features work.

## Rollout sequence / 公開までの順序

1. Finalize documentation and build candidate locally; keep known-good release/backup.
2. Complete independent review and owner decisions on audience, distribution terms and publication scope.
3. Synchronize GitHub/hosting deliberately, preserving credentials and user data outside artifacts.
4. Verify public paths/downloads from a separate session; record version, SHA and actual acceptance matrix.
5. Publish the approved LINE/SNS announcement using [drafts](https://github.com/ntus/LLMs-Monitor/blob/main/docs/release/ANNOUNCEMENT_DRAFTS.md). Do not post automatically.
6. Collect reproducible issues and monitor release health; retain rollback and list known issues.

Historical investigation records remain in [the pre-v1.97 archive](https://github.com/ntus/LLMs-Monitor/blob/main/docs/archive/RELEASE_READINESS_PRE_197.md). They are dated evidence, not the current release status; no personal account snapshots are included in the new public-facing guide.

## v1.111.0 integration prototype checkpoint (8 November2026)

Full regression suite736/736 passed; a subsequently added synthetic-producer-fixture reproducibility test and focused contract/UI checks also passed. The built ZIP passed integrity/version/digest checks. Gateway's current receiver accepted the synthetic three-provider envelope without execution permission. This is not live account pairing, authenticated transport or browser download acceptance. New preview/save UI is beta; Chrome connection ended before its live acceptance. Installed files were last verified v1.110.0 and loaded runtime v1.109.0; neither is asserted updated by a Web deployment.


## v1.112.0 — 2026-11-09 installation and hosted acceptance
- Full regression after version/build:739/739 passed; package SHA256, stable-folder identity and unchanged permission sets verified.
- Restricted existing Site deployment succeeded: appgdep_6af187b2fcdc8191a50f91c6aba4a67b, source02f2f82af08956dcfb722b467c5cc92da1c3d78c. Audience unchanged.
- Existing ~/Downloads/LLMs-Monitor updated from1.111.0 to1.112.0 with official updater and backup .LLMs-Monitor.llms-backup-20261109-174144-f62a90. Chrome extension management visibly confirmed runtime1.112.0 after reload. Main hosted page visibly confirmed Web1.112.0 and browser connected.
- Live Grok rollback acceptance remains incomplete: existing official usage tab still rendered an old weekly cycle. During the read-only refresh attempt Chrome foreground switched to unrelated user work. Browser operation stopped per AGENTS.md, without further navigation or settings changes. No claim that new-cycle live collection was verified.
- Previous historical records remain unchanged. The new cycle guard rejects older reset-labelled snapshots only; unknown labels and same-cycle stale DOM are still unclassified.


### v1.112.0 live Grok follow-up — 2026-11-09 18:00 JST
Chrome verification resumed with NT authorization. Official Overview displayed13% used and Resets Nov15. Returning to the hosted Monitor preserved13% / Nov15. Explicit Refresh now and two subsequent observations over approximately2minutes preserved the same current-cycle display; no rollback to the earlier100% / Nov8 was observed. Web1.112.0 and browser-connected state remained visible. Screenshot is private local evidence at /private/tmp/llms-monitor-112-grok-live.png, not a deployed asset or fixture. This bounded observation does not establish indefinite background freshness or distinguish stale values within one cycle. Previous failed history records were not deleted.


## 2026-11-09 — Gateway Native MVP v1.114.0 preparation

Monitor-side explicit consent, selected current-quota sharing, account continuity status, bounded Native transport and immediate revoke are implemented. The original v1.113.0 candidate was built, deployed and its Chrome runtime version verified. v1.114.0 additionally locks selection during approval and gives progress/expiry feedback. Full automated and synthetic cross-process results are recorded in the handoff; do not infer real pairing from these checks.

The fixed-host Gateway candidate was separately built and reviewed. Dedicated Keychain creation/host registration were not performed: automatic approval review requested specific human authorization. Chrome UI acceptance also awaits Mac unlock and a user-opened extension settings page; the browser tool forbids directly opening that extension URL and no workaround was used. No real-data sharing, API execution or spending has been enabled.

Validation of the v1.114.0 candidate: 758/758 Node regression tests passed; the fixed-permission package manifest, archive inclusion and digest checks passed. Candidate Gateway receiver f/e composition was tested separately with synthetic inputs, original observation age and denied execution/spending. Files in the fixed extension directory are updated to114; loaded runtime was last visually verified113 before the Mac locked. The next reload must be verified, not assumed.
