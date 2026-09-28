# LLMs Token Usage Monitor — Privacy Policy

Last updated: 2026-09-28

The extension reads plan names, usage limits, remaining percentages, reset times, and related credit balances from the official ChatGPT, Claude, and Gemini services for accounts already signed in within the browser profile.

For ChatGPT usage retrieval, the extension temporarily uses the access token exposed to the signed-in official ChatGPT page. The token is kept only in memory for the duration of the request. It is never stored, logged, displayed, or sent to the developer or any third party. Passwords are never read.

Usage snapshots, change history (up to 1,000 changed values per usage window), the selected Claude organization identifier, and display preferences are stored locally through the browser extension storage API. Historical logs remain available after logout; the comparison baseline is reset before the next signed-in snapshot. This information is not uploaded to NT MicroSystems,Inc. or sold, shared, or used for advertising, profiling, credit decisions, or unrelated purposes.

The extension communicates only with the official service domains listed in its manifest and its companion monitor page at `https://ai-usage-glance.ntusnog.chatgpt.site`. When the user connects that page with the extension ID, the extension returns the plan, usage, credit, history, and display-setting fields required to render the monitor locally in the browser. The companion has no application code that uploads these values to NT MicroSystems,Inc. The extension does not submit prompts, purchase credits, exercise reset entitlements, or change account settings.

Users can remove all stored data by uninstalling the extension or clearing its extension storage.

Contact: NT MicroSystems,Inc.
