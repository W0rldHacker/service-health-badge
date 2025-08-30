# Performance & polling behavior

[Русская версия](../../guides/performance.md)

## Interval & backoff

- Base interval is `interval` (default 10 000 ms).
- On success it stays as is; on errors it doubles up to 60 s (exponential backoff).

## In background (tab hidden)

- When the page is hidden, delays are multiplied by ×3 and capped at 60 s to save resources.

## Offline

- With `navigator.onLine === false` the component switches to `offline` and cancels polling until connectivity is restored.

## Debounced visual updates

- Visual and SR announcements are debounced ≈500 ms to prevent chattiness.

## Latency

- Taken from `timings.total_ms` if present; otherwise measured RTT is used.
- Only displayed in `badge` when `show-latency` isn’t disabled.
