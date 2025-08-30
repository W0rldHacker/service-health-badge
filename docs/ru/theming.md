# Темизация `<service-health-badge>`

[English version](./en/theming.md)

Компонент настраивается через **CSS Custom Properties** (переменные). Задавайте их глобально (`:root`), для контейнера, или точечно на элементе `<service-health-badge>`.

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

\* Необязательный токен для тонкой настройки доступности.

## Примеры

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

### Точечная настройка на элементе

```html
<service-health-badge
  endpoint="/health"
  style="--health-bg-ok:#22c55e; --health-chip-bg:rgba(34,197,94,.08)"
></service-health-badge>
```

### Высокая контрастность / forced-colors

Компонент учитывает `@media (forced-colors: active)` и упрощает палитру до системных цветов (`Canvas`, `CanvasText`, `Highlight`). При необходимости подстройте `--health-focus-ring`.
