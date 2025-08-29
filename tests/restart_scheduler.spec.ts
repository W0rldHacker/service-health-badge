import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../src/index.js';

const mk = () => {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  el.setAttribute('endpoint', '/e1');
  el.refresh = vi.fn(async () => true);
  return el;
};

const flush = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  vi.runOnlyPendingTimers();
  await Promise.resolve();
};

describe('scheduler restarts on critical attribute changes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('restarts immediately when endpoint changes', async () => {
    const el = mk();
    await flush(0);
    expect(el.refresh).toHaveBeenCalledTimes(1);

    el.setAttribute('endpoint', '/e2');
    await flush(0);
    expect(el.refresh).toHaveBeenCalledTimes(2);
  });

  it('restarts when interval changes', async () => {
    const el = mk();
    await flush(0);
    el.setAttribute('interval', '50');
    await flush(0);
    expect(el.refresh).toHaveBeenCalledTimes(2);
  });

  it('restarts when timeout changes', async () => {
    const el = mk();
    await flush(0);
    el.setAttribute('timeout', '1234');
    await flush(0);
    expect(el.refresh).toHaveBeenCalledTimes(2);
  });
});
