# Варианты представления

[English version](./en/variants.md)

Компонент поддерживает три визуальных варианта c разной насыщенностью информации. Переключение варианта на лету перестраивает внутренний DOM и сохраняет текущее визуальное состояние.

- `variant="dot"` — минимальный индикатор (только точка). Доступность обеспечивается через `aria-label` на контейнере.
- `variant="chip"` — индикатор + текст статуса.
- `variant="badge"` — индикатор + текст статуса + задержка (если доступна и `show-latency` не отключён).

## Примеры

```html
<!-- Только точка (скрыт текст, но есть aria-label) -->
<service-health-badge variant="dot" endpoint="/health"></service-health-badge>

<!-- Плашка с лейблом -->
<service-health-badge variant="chip" endpoint="/health"></service-health-badge>

<!-- Полный бейдж с латентностью -->
<service-health-badge variant="badge" endpoint="/health"></service-health-badge>
```

## Показ задержки

- Для варианта `badge` задержка отображается при `show-latency !== 'false'` и когда она известна.
- Источник задержки: `timings.total_ms` из ответа `/health` либо измеренная RTT до сервера (фолбэк).

## A11y заметки

- Контейнер имеет `role="status"`, `aria-live="polite"`, `aria-atomic="true"` — изменения статуса анонсируются скринридерами с лёгким дебаунсом (~500 мс).
- В варианте `dot` важно наличие корректного `aria-label` (проставляется автоматически из `labels`).
