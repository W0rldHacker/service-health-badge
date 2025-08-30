# FAQ

[Русская версия](../faq.md)

- Can I use it without bundling? — Yes, via CDN ESM script.
- Do I need polyfills? — Modern browsers don’t. For very old ones add Custom Elements/Shadow DOM polyfills.
- Where do I set polling interval? — `interval` (ms), default `10000`.
- How do I configure degraded threshold? — `degraded-threshold-ms` or `el.degradedThresholdMs`.
- Which events are available? — `health-change`, `health-error`.
- How to hide latency? — Set `show-latency="false"` (only in `variant='badge'`).
- Where is the demo? — `npm run preview` → open `/demo/index.html`.
