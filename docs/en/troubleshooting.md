# Troubleshooting

[Русская версия](../troubleshooting.md)

## CORS errors in console

- Check headers for `GET /health` and preflight `OPTIONS`: see [Backend CORS Checklist](./backend-cors-checklist.md).

## Sticky status / stale data

- Ensure the server sets `Cache-Control: no-store`.
- Make sure CDN/proxies do not cache `/health`.

## `unknown` after successful fetch

- Payload is not JSON or `status` is invalid. Only `ok|degraded|down` map to known base states; others become `unknown`.

## Frequent `down` with high latency

- Increase `timeout` or reduce server processing time. On timeout, the fetch is aborted and `health-error` is emitted.

## `offline` immediately after mount

- Browser reports offline (`navigator.onLine === false`). The component won’t poll until connectivity is restored.

## Latency not shown

- Only for `variant='badge'` and when `show-latency !== 'false'`.
- Latency source is `timings.total_ms` or measured RTT; on errors it may be unknown.

## “Chattery” announcements/visual

- Updates are debounced ≈500 ms by design for better SR UX.
