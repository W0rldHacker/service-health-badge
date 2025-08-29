import { describe, it, expect, vi } from 'vitest';
import '../src/index.js';

describe('_stopPolling clears timer and aborts inflight', () => {
  it('clears scheduled timeout and aborts inflight request', async () => {
    vi.useFakeTimers();
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);

    el.refresh = vi.fn(async () => true);

    (el as any)._queueNext(50);
    (el as any)._stopPolling();

    vi.advanceTimersByTime(100);
    expect(el.refresh).toHaveBeenCalledTimes(0);

    const ctrl = new AbortController();
    const spy = vi.spyOn(ctrl, 'abort');
    (el as any)._inflight = ctrl;
    (el as any)._stopPolling();
    expect(spy).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
