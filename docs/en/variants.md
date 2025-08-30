# Variants

[Русская версия](../variants.md)

The component has three visual variants with different information density. Switching variants rebuilds the inner DOM but preserves effective visual state.

- `variant="dot"` — minimal indicator (dot only). Accessibility via container `aria-label`.
- `variant="chip"` — indicator + status label.
- `variant="badge"` — indicator + label + latency (when available and `show-latency` isn’t disabled).

## Examples

```html
<service-health-badge variant="dot" endpoint="/health"></service-health-badge>
<service-health-badge variant="chip" endpoint="/health"></service-health-badge>
<service-health-badge variant="badge" endpoint="/health"></service-health-badge>
```

## Latency display

- In `badge` variant latency is shown when known and `show-latency` isn’t `false`.
- Source: `timings.total_ms` from `/health` response or measured RTT fallback.

## A11y notes

- Container uses `role="status"`, `aria-live="polite"`, `aria-atomic="true"` with ~500 ms debounce.
- In `dot`, make sure `labels` provide meaningful text for `aria-label`.
