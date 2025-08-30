# API (attributes, properties, methods)

[Русская версия](../api.md)

## Attributes (HTML)

- `endpoint: string` — URL for `GET /health`.
- `interval: number` — polling period (ms), default `10000`.
- `timeout: number` — request timeout (ms), default `3000`.
- `labels: JSON` — status labels, merged with defaults `{ ok:'OK', degraded:'Degraded', down:'Down', unknown:'—', offline:'Offline' }`.
- `variant: 'dot'|'chip'|'badge'` — visual variant, default `badge`.
- `show-latency: 'false'|any` — controls latency display in `badge` (enabled by default).
- `degraded-threshold-ms: number` — threshold (ms): if base is `ok` and latency is higher → render `degraded`.
- `focusable` — makes the component focusable with a visible focus ring.
- `dev-state: 'unknown'|'ok'|'degraded'|'down'|'offline'` — force state for debugging.

## Properties (JS)

- `endpoint: string|null`
- `interval: number`
- `timeout: number`
- `labels: Record<string,string>`
- `variant: 'dot'|'chip'|'badge'`
- `showLatency: boolean`
- `degradedThresholdMs: number`
- `focusable: boolean`

## Methods

- `refresh(): Promise<boolean>` — poll immediately. Resolves to `true` if base is `ok` or `degraded`.
- `setState(status: HealthStatus, latencyMs?: number): void` — set state manually.

## Statuses

`'unknown' | 'ok' | 'degraded' | 'down' | 'offline'`

## Events

See: [Events & i18n](./api-events-and-i18n.md).
