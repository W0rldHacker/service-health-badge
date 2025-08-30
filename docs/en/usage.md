# Usage

[Русская версия](../usage.md)

## Basic Example

```html
<service-health-badge endpoint="/health"></service-health-badge>
```

## Key Attributes

- `endpoint` — URL for `GET /health` (required to actually poll)
- `interval` — polling period in ms (default `10000`)
- `timeout` — request timeout in ms (default `3000`)
- `variant` — `dot` | `chip` | `badge` (default `badge`)
- `labels` — JSON with status labels (merged with defaults)
- `show-latency` — set to `false` to hide latency in `badge`
- `degraded-threshold-ms` — if base is `ok` and latency exceeds threshold → render `degraded`
- `focusable` — makes the element keyboard focusable
- `dev-state` — force state for debugging (`unknown|ok|degraded|down|offline`)

## Example with i18n and threshold

```html
<service-health-badge
  endpoint="/health"
  variant="badge"
  degraded-threshold-ms="200"
  labels='{"ok":"OK","degraded":"Slow","down":"Down","unknown":"—","offline":"Offline"}'
></service-health-badge>
```

## JS props and methods

```js
const el = document.querySelector('service-health-badge');
el.interval = 8000;
el.timeout = 2500;
el.showLatency = true;
el.degradedThresholdMs = 150;
el.labels = { degraded: 'Reduced' };
await el.refresh();
```

See also: [API](./api.md), [Events & i18n](./api-events-and-i18n.md), [Variants](./variants.md), [Theming](./theming.md).
