# Использование

[English version](./en/usage.md)

## Базовый пример

```html
<service-health-badge endpoint="/health"></service-health-badge>
```

## Основные атрибуты

- `endpoint` — URL `GET /health` (обязательно для реальной работы)
- `interval` — период опроса, мс (по умолчанию `10000`)
- `timeout` — тайм‑аут запроса, мс (по умолчанию `3000`)
- `variant` — `dot` | `chip` | `badge` (по умолчанию `badge`)
- `labels` — JSON с локализацией статусов (сливается с дефолтами)
- `show-latency` — `false` чтобы скрыть задержку в варианте `badge`
- `degraded-threshold-ms` — если статус `ok`, но задержка > порога → отображать `degraded`
- `focusable` — делает элемент фокусируемым (клавиатура/скринридер)
- `dev-state` — принудительное состояние для отладки (`unknown|ok|degraded|down|offline`)

## Пример с локализацией и порогом

```html
<service-health-badge
  endpoint="/health"
  variant="badge"
  degraded-threshold-ms="200"
  labels='{"ok":"OK","degraded":"Медленно","down":"Недоступен","unknown":"—","offline":"Нет сети"}'
></service-health-badge>
```

## JS‑свойства и методы

```js
const el = document.querySelector('service-health-badge');
el.interval = 8000; // мс
el.timeout = 2500; // мс
el.showLatency = true; // только для variant='badge'
el.degradedThresholdMs = 150;
el.labels = { degraded: 'Понижено' };
await el.refresh(); // одноразовый опрос сейчас
```

Подробнее: [API](./api.md), [События и i18n](./api-events-and-i18n.md), [Варианты](./variants.md), [Темизация](./theming.md).
