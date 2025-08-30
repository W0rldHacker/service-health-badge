# Events & i18n for `<service-health-badge>`

[Русская версия](../api-events-and-i18n.md)

## Events

- `health-change` — fired when the effective status changes (threshold applied).
  - `detail`: `{ status: 'ok'|'degraded'|'down'|'unknown'|'offline', latencyMs: number|null, at: string }`
  - Bubbles and crosses shadow root: `{ bubbles: true, composed: true }`.
- `health-error` — on network/timeout/JSON errors.
  - `detail`: `{ error: string }`

### Example (plain JS)

```html
<service-health-badge id="hb" endpoint="/health"></service-health-badge>
<script>
  const el = document.getElementById('hb');
  el.addEventListener('health-change', (e) => {
    const { status, latencyMs, at } = e.detail;
    console.log('status =', status, 'latency =', latencyMs, 'at =', at);
  });
  el.addEventListener('health-error', (e) => console.warn('health-error:', e.detail.error));
</script>
```

### Example (TypeScript)

```ts
import '@worldhacker/service-health-badge';

const el = document.querySelector('service-health-badge')!;
el.addEventListener('health-change', (e) => {
  const { status, latencyMs } = (e as CustomEvent).detail;
});
```

## Localization (`labels`)

- `labels` attribute accepts JSON and merges with defaults.
- Invalid JSON is ignored (defaults remain).

```html
<service-health-badge
  endpoint="/health"
  labels='{"ok":"OK","degraded":"Slow","down":"Down","unknown":"—","offline":"Offline"}'
></service-health-badge>
```

Dynamic update (no reload):

```js
const el = document.querySelector('service-health-badge');
el.setAttribute('labels', JSON.stringify({ degraded: 'Reduced' }));
// or via property (preferred):
el.labels = { degraded: 'Reduced', offline: 'Offline' };
```
