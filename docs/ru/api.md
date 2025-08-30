# API (атрибуты, свойства, методы)

[English version](./en/api.md)

## Атрибуты (HTML)

- `endpoint: string` — URL `GET /health`.
- `interval: number` — период опроса (мс), по умолчанию `10000`.
- `timeout: number` — тайм‑аут запроса (мс), по умолчанию `3000`.
- `labels: JSON` — подписи статусов, слияние с дефолтами `{ ok:'OK', degraded:'Degraded', down:'Down', unknown:'—', offline:'Offline' }`.
- `variant: 'dot'|'chip'|'badge'` — визуальный вариант, по умолчанию `badge`.
- `show-latency: 'false'|any` — управляет отображением задержки для `badge` (по умолчанию включено).
- `degraded-threshold-ms: number` — порог (мс): если `ok` и задержка больше — визуально `degraded`.
- `focusable` — делает компонент фокусируемым, включает видимое focus‑кольцо.
- `dev-state: 'unknown'|'ok'|'degraded'|'down'|'offline'` — форсирует состояние для отладки.

## Свойства (JS)

- `endpoint: string|null`
- `interval: number`
- `timeout: number`
- `labels: Record<string,string>`
- `variant: 'dot'|'chip'|'badge'`
- `showLatency: boolean`
- `degradedThresholdMs: number`
- `focusable: boolean` (через наличия атрибута)

## Методы

- `refresh(): Promise<boolean>` — выполнить опрос немедленно. Возвращает `true`, если базовый статус `ok` или `degraded`.
- `setState(status: HealthStatus, latencyMs?: number): void` — вручную задать состояние.

## Статусы

`'unknown' | 'ok' | 'degraded' | 'down' | 'offline'`

## События

См. раздел: [События и локализация](./api-events-and-i18n.md).
