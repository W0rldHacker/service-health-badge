# Testing

[Русская версия](../../guides/testing.md)

## Unit

- Use `vitest` with `happy-dom` for DOM‑less logic.
- Mock `fetch` and `performance.now` where needed.

## E2E

- Playwright tests are included: visual snapshots, a11y (axe), status flows.
- Run: `npm run test:e2e` or `npm run test:a11y`.

## Mock server

- Local `/health` server: `npm run mock` (see `mock/server.mjs`).
- Supports `?status=ok|degraded|down&latency=NN`.

## Tips

- Do not cache `/health`: use `Cache-Control: no-store` in tests and prod.
- Assert `health-change` and `health-error` events and their `detail` payloads.
