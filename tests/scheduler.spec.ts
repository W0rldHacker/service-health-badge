import { describe, it, expect, vi } from 'vitest';
import '../src/index.js';

function makeEl(interval = 100) {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  el.setAttribute('interval', String(interval));
  el.setAttribute('endpoint', '/fake');
  return el;
}

const flush = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  await Promise.resolve();
};

describe('scheduler backoff + reset using refresh() outcome', () => {
  it('doubles on failures and resets on success', async () => {
    vi.useFakeTimers();
    const el = makeEl(100);

    const seq = [false, false, false, true];
    let i = 0;
    (el as any).refresh = vi.fn(async () => seq[i++] ?? true);

    (el as any)._startPolling(true);

    await flush(0);
    expect((el as any).refresh).toHaveBeenCalledTimes(1);

    await flush(200);
    expect((el as any).refresh).toHaveBeenCalledTimes(2);

    await flush(400);
    expect((el as any).refresh).toHaveBeenCalledTimes(3);

    await flush(800);
    expect((el as any).refresh).toHaveBeenCalledTimes(4);

    await flush(100);
    expect((el as any).refresh).toHaveBeenCalledTimes(5);

    vi.useRealTimers();
  });
});
