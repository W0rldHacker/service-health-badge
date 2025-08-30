# Тестирование

[English version](../en/guides/testing.md)

## Модульные тесты

- Для логики без DOM можно использовать `vitest` и `happy-dom` (см. скрипт `npm run test`).
- При необходимости мокайте `fetch` и `performance.now`.

## Интеграционные (e2e)

- В репо есть примеры с Playwright: визуальные снапшоты, доступность (axe), сценарии статусов.
- Запуск: `npm run test:e2e` или адресные `npm run test:a11y`.

## Mock‑сервер

- Локальный сервер `/health`: `npm run mock` (см. `mock/server.mjs`).
- Поддерживает параметры `?status=ok|degraded|down&latency=NN`.

## Рекомендации

- Не кэшируйте `/health`: в тестах и в проде используйте `Cache-Control: no-store`.
- Проверяйте события `health-change` и `health-error` и их `detail`.
