# Store submission checklist — v1.5.3

`dist/LLMs-Token-Usage-Monitor-v1.5.3.zip` is the Chrome Web Store and Microsoft Edge Add-ons submission package. Its manifest and complete runtime UI are localized as “LLMs トークン残量モニタ” in Japanese and “LLMs TOKEN USAGE MONITOR” in English.

Developer-mode-free installation requires the owner to complete both stores' account, review, and publication process. Building or hosting the ZIP does not publish an installable store extension.

## Required owner actions

1. Register the owner developer accounts and enable two-step verification where required.
2. Upload `LLMs-Token-Usage-Monitor-v1.5.3.zip`, the 128px icon, screenshots, Japanese and English descriptions, and reviewer test instructions.
3. Use the deployed privacy policy at `https://ai-usage-glance.ntusnog.chatgpt.site/privacy.html` and verify that it is reachable without sign-in.
4. Submit for manual review in each store. After approval, replace the website package-only guidance with the approved store URLs.

## Permission declarations

- `storage`: keeps normalized usage snapshots, changed-value history, the selected Claude organization ID, and display preferences locally.
- `alarms`: starts the approximately 60-second background refresh schedule.
- `offscreen`: plays three short local notification tones when a numeric value changes; it is not used for hidden network access or tracking.
- `https://chatgpt.com/*`: reads the signed-in account's official usage, plan, reset entitlement, and related credit fields. The first-party access token is held only in memory for the usage request and is never stored, logged, displayed, or shared.
- `https://claude.ai/*`: reads the active signed-in organization's official usage, plan, cloud-session credit, project-setup credit, and prepaid/extra credit fields.
- `https://gemini.google.com/*`: reads the currently signed-in Google account's official usage and Google AI plan fields, including account-prefixed `/u/N` pages.
- `https://one.google.com/*`: reads the currently signed-in Google account's current Google AI membership name when Gemini does not expose it directly.
- `externally_connectable`: limited to `https://ai-usage-glance.ntusnog.chatgpt.site/*`; localhost is excluded from the production package.

## Reviewer test flow

1. Sign in to one or more of ChatGPT, Claude, and Gemini in the same browser profile.
2. Install the submitted package and open the extension action. Confirm that no password or API-key form appears.
3. Close the provider tabs and use “今すぐ更新”. Confirm that supported usage remains available from the signed-in sessions and signed-out providers show a login action.
4. Confirm 60-second refresh, saved-value fallback, plan labels, reset times, credit extras, changed-value history, and the three-tone notification.
5. Compare dark and standard themes and opacity 15/55/100% in the embedded panel and floating views.
6. Confirm that startup opens one normal popup, “最前面に固定” opens Document Picture-in-Picture after a user click, and the normal popup closes.
7. Confirm that the production companion page connects only after a valid 32-character extension ID is entered.

Before uploading, run `node --test tests/*.test.cjs`, `python3 build.py`, inspect the ZIP contents, and perform the manual acceptance checklist in `SPECIFICATION.md`.
