# Backend CORS Checklist for `/health`

[Русская версия](../backend-cors-checklist.md)

Purpose: a concise checklist for configuring CORS and caching on `GET /health` used by `<service-health-badge>`.

---

## 0) TL;DR (minimum viable)

- [ ] `Access-Control-Allow-Origin: *` (or a whitelist)
- [ ] `Cache-Control: no-store` (avoid caching along the path)
- [ ] Methods: `GET, OPTIONS` (OPTIONS for preflight)
- [ ] Allow-Headers: at least `Content-Type` (or the actual ones used)
- [ ] Preflight Max-Age: e.g. `600–3600` seconds (optional)
- [ ] `Vary: Origin` if Allow‑Origin is dynamic

> The component does not use cookies/Authorization — no credentials required, so `Allow-Origin: *` is fine and `Allow-Credentials` should not be set.

---

## 1) Policy choices

- Open policy (recommended): `Access-Control-Allow-Origin: *` — fits public `/health` with non-sensitive data.
- Whitelist: reflect `Origin` from a list and add `Vary: Origin`.
- Credentials: not needed; if you ever enable them, you cannot use `*` and must reflect origin + add `Access-Control-Allow-Credentials: true`.

---

## 2) Server responses

### 2.1 Successful `GET /health`

- `200 OK` (or `503` for “down” if that’s your policy)
- `Content-Type: application/json; charset=utf-8`
- `Access-Control-Allow-Origin: *` (or specific origin)
- `Cache-Control: no-store`

### 2.2 Preflight `OPTIONS /health`

- `204 No Content` (or `200 OK` with empty body)
- `Access-Control-Allow-Origin: *` (or specific origin)
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type` (and others actually used)
- `Access-Control-Max-Age: 600`
- If dynamic per‑origin response: add `Vary: Origin`

---

## 3) How to test

### 3.1 Quick curl

```bash
curl -si -H "Origin: https://example.com" http://127.0.0.1:8080/health | sed -n '1,20p'
curl -si -X OPTIONS -H "Origin: https://example.com" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" http://127.0.0.1:8080/health | sed -n '1,40p'
```

### 3.2 In-browser

```js
fetch('http://127.0.0.1:8080/health', {
  method: 'GET',
  mode: 'cors',
  headers: { 'Content-Type': 'application/json' },
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## 4) Config snippets

See the Russian page for complete nginx/Express/Workers examples with headers. Adapt to your infra.

---

## 5) Common pitfalls

- `Allow-Origin: *` together with `Allow-Credentials: true` — disallowed by spec.
- Missing preflight handling → browser blocks the request.
- No `Cache-Control: no-store` → stale data and sticky status.
- Dynamic `Allow-Origin` without `Vary: Origin` → CDN/proxy cache issues.
- Allowing unnecessary methods/headers → larger attack surface.
