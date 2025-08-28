# События и локализация `<service-health-badge>`

## События

- `health-change` — выбрасывается при изменении **эффективного** статуса (учитывает порог деградации).  
  `detail: { status: 'ok'|'degraded'|'down'|'unknown'|'offline', latencyMs: number|null, at: string }`.
- `health-error` — при сетевой/тайм-аут/парсинг ошибке.  
  `detail: { error: string }`.

Оба события: `{ bubbles: true, composed: true }`.

### Пример (чистый JS)

```html
<service-health-badge id="hb" endpoint="/health"></service-health-badge>
<script>
  const el = document.getElementById('hb');
  el.addEventListener('health-change', (e) => {
    const { status, latencyMs, at } = e.detail;
    console.log('status =', status, 'latency =', latencyMs, 'at =', at);
  });
  el.addEventListener('health-error', (e) => {
    console.warn('health-error:', e.detail.error);
  });
</script>
```

### Пример (TypeScript)

```ts
import 'service-health-badge';

const el = document.querySelector('service-health-badge')!;
el.addEventListener('health-change', (e) => {
  const { status, latencyMs } = (e as CustomEvent).detail;
});
```

## Локализация (`labels`)

Атрибут `labels` принимает JSON и **сливается** с дефолтами. Непарсибельный JSON игнорируется (останутся дефолты).

```html
<service-health-badge
  endpoint="/health"
  labels='{"ok":"OK","degraded":"Медленно","down":"Недоступен","unknown":"—","offline":"Нет сети"}'
>
</service-health-badge>
```

Динамическая подмена (без перезагрузки):

```js
const el = document.querySelector('service-health-badge')!;
el.setAttribute('labels', JSON.stringify({ degraded: 'Понижено' }));
// или через свойство (предпочтительно):
el.labels = { degraded: 'Понижено', offline: 'Оффлайн' };
```
