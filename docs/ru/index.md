---
title: service-health-badge — документация
---

[English version](./en/index.md)

# Обзор

`<service-health-badge>` — встраиваемый Web Component для отображения состояния сервиса по `GET /health`.

Особенности:

- Лёгкий ESM‑бандл (≤ 5 KB gzip), без зависимостей
- Три варианта UI: `dot` • `chip` • `badge`
- A11y‑готовность: `role=status`, `aria-live=polite`, дебаунс анонсов
- Темизация через CSS‑переменные, поддержка forced‑colors
- События `health-change` и `health-error`

## Быстрый старт

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@worldhacker/service-health-badge/dist/service-health-badge.js"
></script>
<service-health-badge
  endpoint="/health"
  variant="badge"
  degraded-threshold-ms="150"
></service-health-badge>
```

## Разделы

- Введение: [Начало работы](./getting-started.md) • [Использование](./usage.md)
- API: [Атрибуты/свойства/методы](./api.md) • [События и i18n](./api-events-and-i18n.md)
- Внешний вид: [Варианты](./variants.md) • [Темизация](./theming.md) • [A11y чек‑лист](./a11y-manual-checklist.md)
- Сервер: [CORS чек‑лист для /health](./backend-cors-checklist.md)
- Практика: [Интеграция с React](./integrations/react.md) • [Производительность](./guides/performance.md) • [Тестирование](./guides/testing.md)
- Поддержка: [FAQ](./faq.md) • [Troubleshooting](./troubleshooting.md)
