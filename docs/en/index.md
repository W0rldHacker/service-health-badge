---
title: service-health-badge — documentation
---

[Русская версия](../index.md)

# Overview

`<service-health-badge>` is an embeddable Web Component that renders service status using `GET /health`.

Highlights:

- Lightweight ESM bundle (≤ 5 KB gzip), zero deps
- Three UI variants: `dot` • `chip` • `badge`
- A11y ready: `role=status`, `aria-live=polite`, debounced announcements
- Theming via CSS custom properties, forced‑colors support
- Emits `health-change` and `health-error`

## Quick Start

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

## Sections

- Intro: [Getting Started](./getting-started.md) • [Usage](./usage.md)
- API: [Attributes/Props/Methods](./api.md) • [Events & i18n](./api-events-and-i18n.md)
- UI: [Variants](./variants.md) • [Theming](./theming.md) • [A11y checklist](./a11y-manual-checklist.md)
- Server: [CORS checklist for /health](./backend-cors-checklist.md)
- Practice: [React integration](./integrations/react.md) • [Performance](./guides/performance.md) • [Testing](./guides/testing.md)
- Support: [FAQ](./faq.md) • [Troubleshooting](./troubleshooting.md)
