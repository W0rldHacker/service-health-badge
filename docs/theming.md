# Темизация `<service-health-badge>`

Компонент поддерживает настройку внешнего вида через **CSS Custom Properties** (переменные). Их можно задавать глобально (`:root`), на контейнере, или **точечно** на каждом элементе `<service-health-badge>`.

## Карта токенов

| Токен                   | Назначение                           | Значение по умолчанию |
| ----------------------- | ------------------------------------ | --------------------- |
| `--health-size`         | Базовый размер шрифта/высоты бейджа  | `0.875rem`            |
| `--health-radius`       | Скругления углов                     | `0.5rem`              |
| `--health-color-fg`     | Цвет текста/иконок                   | `currentColor`        |
| `--health-chip-bg`      | Фон плашки (варианты `chip`/`badge`) | `rgba(0,0,0,0.05)`    |
| `--health-bg-ok`        | Цвет индикатора для `ok`             | `#16a34a`             |
| `--health-bg-degraded`  | Цвет индикатора для `degraded`       | `#f59e0b`             |
| `--health-bg-down`      | Цвет индикатора для `down`           | `#ef4444`             |
| `--health-bg-unknown`   | Цвет индикатора для `unknown`        | `#6b7280`             |
| `--health-bg-offline`   | Цвет индикатора для `offline`        | `#94a3b8`             |
| `--health-focus-ring`\* | Цвет фокус‑кольца (`:focus-visible`) | `#2563eb`             |

\* Дополнительный токен (необязательный), введён для удобства настройки доступности.

## Примеры переопределений

### Глобальная тема (светлая/тёмная)

```css
:root {
  --health-size: 0.875rem;
  --health-radius: 0.5rem;
  --health-chip-bg: rgba(0, 0, 0, 0.05);
}
@media (prefers-color-scheme: dark) {
  :root {
    --health-color-fg: #e5e7eb;
    --health-chip-bg: rgba(255, 255, 255, 0.08);
  }
}
```
