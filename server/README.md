# Social intelligence worker

This Cloudflare-compatible Worker is the server-side part of the one-minute provider/Tibo X alert feed. It keeps the X credential out of the extension and public Site.

Required runtime configuration:

- Secret `X_BEARER_TOKEN`: X API bearer token for an approved X developer app.
- KV binding `INTELLIGENCE_CACHE`: stores only public post summaries and the latest normalized feed.
- Cron trigger `* * * * *`: refreshes once per minute.

Deploy it at the same origin as the monitor so `/api/intelligence.json` is available. Never put the bearer token in `.openai/hosting.json`, the extension, the repository, logs, or a client-side settings field. A missing secret returns `unconfigured`; API failure preserves the cached alerts and returns `unavailable` after the scheduled handler records the failure.

The watched list distinguishes company accounts and Tibo (`@thsottiaux`) as an OpenAI staff account. Nerf Bench is link-only and is excluded from this feed.
