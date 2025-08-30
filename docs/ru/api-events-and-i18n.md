# События и локализация `<service-health-badge>`

[English version](./en/api-events-and-i18n.md)

## События

- `health-change` — выбрасывается при изменении эффективного статуса (учитывает порог деградации).
  - `detail`: `{ status: 'ok'|'degraded'|'down'|'unknown'|'offline', latencyMs: number|null, at: string }`
  - Всплывает и проходит сквозь Shadow DOM: `{ bubbles: true, composed: true }`.
- `health-error` — при сетевой/тайм‑аут/JSON‑ошибке.
  - `detail`: `{ error: string }`

### Пример (чистый JS)

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

### Пример (TypeScript)

```ts
import '@worldhacker/service-health-badge';

const el = document.querySelector('service-health-badge')!;
el.addEventListener('health-change', (e) => {
  const { status, latencyMs } = (e as CustomEvent).detail;
});
```

## Локализация (`labels`)

- Атрибут `labels` принимает JSON и сливается с дефолтами.
- Непарсибельный JSON игнорируется (останутся дефолты).

```html
<service-health-badge
  endpoint="/health"
  labels='{"ok":"OK","degraded":"Медленно","down":"Недоступен","unknown":"—","offline":"Нет сети"}'
></service-health-badge>
```

Динамическая подмена (без перезагрузки):

```js
const el = document.querySelector('service-health-badge');
el.setAttribute('labels', JSON.stringify({ degraded: 'Понижено' }));
// или через свойство (предпочтительно):
el.labels = { degraded: 'Понижено', offline: 'Оффлайн' };
```
