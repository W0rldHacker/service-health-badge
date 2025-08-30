# Начало работы

[English version](./en/getting-started.md)

## Требования

- Современный браузер с поддержкой Web Components (Custom Elements, Shadow DOM).
- Эндпойнт `GET /health` с CORS (см. чек‑лист) и `Cache-Control: no-store`.

## Установка

Через npm:

```bash
npm i @worldhacker/service-health-badge
```

Импорт в приложении:

```js
import '@worldhacker/service-health-badge';
```

Через CDN:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@worldhacker/service-health-badge/dist/service-health-badge.js"
></script>
```

## Первый рендер

```html
<service-health-badge endpoint="/health" variant="badge"></service-health-badge>
```

При недоступной сети компонент перейдёт в статус `offline`. При ошибках парсинга/тайм‑аута сработает событие `health-error`.

## Проверка окружения

- Откройте демо: `npm run preview` → `/demo/index.html`.
- Для локального сервера: `npm run mock` (см. подсказку в консоли).
