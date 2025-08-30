# Backend CORS Checklist для `/health`

[English version](./en/backend-cors-checklist.md)

**Путь файла:** `docs/backend-cors-checklist.md`  
**Назначение:** чек‑лист для корректной настройки CORS и кэширования `GET /health`, используемого `<service-health-badge>`.

---

## 0) TL;DR (минимально необходимое)

- [ ] **Allow-Origin:** `*` (или белый список Origin’ов) **обязательно**
- [ ] **Cache-Control:** `no-store` (исключить кэш на пути клиент ⇄ CDN ⇄ браузер)
- [ ] **Методы:** `GET, OPTIONS` (OPTIONS для preflight)
- [ ] **Allow-Headers:** как минимум `Content-Type` (или фактически используемые)
- [ ] **Max-Age (preflight):** разумное значение (например `600`–`3600` секунд) — опционально
- [ ] **Vary:** `Origin` — если выдаём **динамический** Allow-Origin

> Компонент не использует cookies/Authorization — **credentials не требуются**. Можно ставить `Access-Control-Allow-Origin: *` и не указывать `Access-Control-Allow-Credentials`.

---

## 1) Решения по политике CORS

- **Открытая политика (рекомендовано):**
  - `Access-Control-Allow-Origin: *`
  - Подходит для публичного `/health` без чувствительных данных.

- **Белый список доменов:**
  - `Access-Control-Allow-Origin: https://site-a.example, https://admin.example` (или отражение Origin по списку)
  - Добавьте `Vary: Origin` при динамическом ответе.

- **Credentials:**
  - Не используем. Если вдруг потребуются, **нельзя** ставить `*` — придётся отражать конкретный Origin и добавлять `Access-Control-Allow-Credentials: true`.

---

## 2) Ответы сервера

### 2.1 Успешный GET `/health`

- [ ] `200 OK` (или `503` при «down», согласно вашей бизнес‑логике)
- [ ] `Content-Type: application/json; charset=utf-8`
- [ ] `Access-Control-Allow-Origin: *` (или конкретный origin)
- [ ] `Cache-Control: no-store`

### 2.2 Preflight `OPTIONS /health`

- [ ] `204 No Content` (или `200 OK` без тела)
- [ ] `Access-Control-Allow-Origin: *` (или конкретный origin)
- [ ] `Access-Control-Allow-Methods: GET, OPTIONS`
- [ ] `Access-Control-Allow-Headers: Content-Type` (и иные реально используемые)
- [ ] `Access-Control-Max-Age: 600` (или больше; по требованиям безопасности вашей компании)
- [ ] (Если ответ динамический по Origin) **`Vary: Origin`**

> **Access-Control-Expose-Headers** для `/health` обычно не нужен. Добавляйте только при реальной необходимости читать нестандартные заголовки из JS.

---

## 3) Тесты «как проверить»

### 3.1 Быстрые `curl` проверки

```bash
# 1) Простой CORS GET
curl -si \
  -H "Origin: https://example.com" \
  http://127.0.0.1:8080/health | sed -n '1,20p'

# 2) Preflight OPTIONS
curl -si -X OPTIONS \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://127.0.0.1:8080/health | sed -n '1,40p'
```

Проверьте наличие заголовков в ответах, коды и отсутствие тела в preflight.

### 3.2 Тест в браузере/консоли

```js
fetch('http://127.0.0.1:8080/health', {
  method: 'GET',
  mode: 'cors',
  headers: { 'Content-Type': 'application/json' },
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

Ошибок CORS быть не должно (смотрите вкладку Network → Headers).

---

## 4) Типовые конфиги

### 4.1 Nginx (упрощённо)

```nginx
location /health {
  add_header Access-Control-Allow-Origin * always;
  add_header Cache-Control "no-store" always;
  default_type application/json;

  if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type" always;
    add_header Access-Control-Max-Age 600 always;
    return 204;
  }

  # proxy_pass http://app/health;  # если нужен апстрим
}
```

> В продакшне избегайте лишних `if`, учитывайте вашу схему проксирования и заголовки с апстрима.

### 4.2 Express.js (через middleware `cors`)

```js
import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok', timings: { total_ms: 23 } });
});
app.options('/health', (req, res) => {
  res.set('Access-Control-Max-Age', '600');
  res.sendStatus(204);
});
```

### 4.3 Cloudflare Workers (пример)

```js
export default {
  async fetch(req) {
    const o = new URL(req.url);
    if (o.pathname === '/health') {
      const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
      });
      if (req.method === 'OPTIONS') {
        headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type');
        headers.set('Access-Control-Max-Age', '600');
        return new Response(null, { status: 204, headers });
      }
      return new Response(JSON.stringify({ status: 'ok' }), { status: 200, headers });
    }
    return new Response('Not found', { status: 404 });
  },
};
```

---

## 5) Частые ошибки и как их избежать

- [ ] `Allow-Origin: *` **вместе** с `Allow-Credentials: true` — **запрещено** спецификацией.
- [ ] Отсутствует preflight-обработка `OPTIONS` → браузер заблокирует запрос.
- [ ] Нет `Cache-Control: no-store` → устаревшие данные, «залипание» статуса.
- [ ] Динамический Allow-Origin без `Vary: Origin` → проблемы кэширования на CDN/прокси.
- [ ] Разрешены лишние методы/заголовки → лишние поверхности атаки.

---

## 6) Решения по кэшированию

- Для **контента `/health`** — **`Cache-Control: no-store`**.
- Для **preflight (OPTIONS)** — можно кэшировать с `Access-Control-Max-Age` (например 600–3600s), чтобы снизить нагрузку.
- Если работаете за CDN, убедитесь, что CDN не переопределяет/кэширует ответ `/health`.

---

## 7) Готово к приёмке (DoD)

- [ ] Выбран и настроен режим: открытый (`*`) или белый список Origin’ов.
- [ ] Для GET `/health` выставляются: **Allow-Origin** и **no-store**.
- [ ] Preflight OPTIONS корректно отвечает с нужными заголовками и кодом `204/200`.
- [ ] При динамическом списке доменов — добавлен `Vary: Origin`.
- [ ] Пройдены проверки из раздела 3 (curl + браузер).
