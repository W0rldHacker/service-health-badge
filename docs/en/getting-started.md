# Getting Started

[Русская версия](../getting-started.md)

## Requirements

- Modern browsers with Web Components (Custom Elements, Shadow DOM) support.
- `GET /health` endpoint with proper CORS and `Cache-Control: no-store`.

## Install

```bash
npm i @worldhacker/service-health-badge
```

Import in your app:

```js
import '@worldhacker/service-health-badge';
```

Via CDN (ESM):

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@worldhacker/service-health-badge/dist/service-health-badge.js"
></script>
```

## First Render

```html
<service-health-badge endpoint="/health" variant="badge"></service-health-badge>
```

If the browser is offline, the component shows `offline`. On timeout/parse/network errors it emits `health-error`.

## Verify locally

- Preview: `npm run preview` → open `/demo/index.html`.
- Local mock server: `npm run mock`.
