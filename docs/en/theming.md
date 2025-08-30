# Theming `<service-health-badge>`

[Русская версия](../theming.md)

Customize appearance via **CSS Custom Properties**. Define globally (`:root`), on a container, or inline per element.

## Tokens

| Token                   | Purpose                             | Default            |
| ----------------------- | ----------------------------------- | ------------------ |
| `--health-size`         | Base font/height                    | `0.875rem`         |
| `--health-radius`       | Border radius                       | `0.5rem`           |
| `--health-color-fg`     | Text/icon color                     | `currentColor`     |
| `--health-chip-bg`      | Chip/badge background               | `rgba(0,0,0,0.05)` |
| `--health-bg-ok`        | Dot color for `ok`                  | `#16a34a`          |
| `--health-bg-degraded`  | Dot color for `degraded`            | `#f59e0b`          |
| `--health-bg-down`      | Dot color for `down`                | `#ef4444`          |
| `--health-bg-unknown`   | Dot color for `unknown`             | `#6b7280`          |
| `--health-bg-offline`   | Dot color for `offline`             | `#94a3b8`          |
| `--health-focus-ring`\* | Focus ring color (`:focus-visible`) | `#2563eb`          |

\* Optional token to fine‑tune accessibility.

## Examples

### Light/Dark

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

### Per element

```html
<service-health-badge
  endpoint="/health"
  style="--health-bg-ok:#22c55e; --health-chip-bg:rgba(34,197,94,.08)"
></service-health-badge>
```

### High contrast / forced-colors

The component adapts under `@media (forced-colors: active)`, using system colors and a visible focus ring. You can tweak `--health-focus-ring`.
