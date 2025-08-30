# FAQ

[English version](./en/faq.md)

- Можно ли использовать без сборки? — Да, через CDN ESM‑скрипт.
- Нужны ли полифилы? — Для современных браузеров нет. Для очень старых — добавьте полифилы Custom Elements/Shadow DOM.
- Где задаётся интервал опроса? — `interval` (мс), по умолчанию `10000`.
- Как меняется порог «degraded»? — `degraded-threshold-ms` или через `el.degradedThresholdMs`.
- Какие события есть? — `health-change`, `health-error` (см. раздел событий).
- Как отключить показ задержки? — Установите `show-latency="false"` (только для `variant='badge'`).
- Где посмотреть демо? — Соберите проект `npm run preview` и откройте `/demo/index.html`.
