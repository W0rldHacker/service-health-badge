import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../src/index.js';

const DEBOUNCE_MS = 500;

const makeEl = (interval = 100) => {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  el.setAttribute('interval', String(interval));
  return el;
};

const getTitle = (el: any) => el.shadowRoot!.querySelector('.wrap')!.getAttribute('title');

const flush = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  vi.runOnlyPendingTimers();
  await Promise.resolve();
};

describe('stale-guard title + threshold hint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0) as unknown as number
    );
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) =>
      clearTimeout(id as any)
    );
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('adds «Данные устарели» after >2×interval without valid data', async () => {
    const el = makeEl(120);

    (el as any).setState('unknown', null);
    await flush(DEBOUNCE_MS + 5);
    expect(getTitle(el) || '').not.toContain('Данные устарели');

    await flush(250);

    (el as any).setState('ok', 10);
    await flush(DEBOUNCE_MS + 5);

    expect(getTitle(el) || '').toContain('Данные устарели');
  });

  it('includes threshold mark when degraded-threshold-ms is set', async () => {
    const el = makeEl(100);
    el.setAttribute('degraded-threshold-ms', '500');
    (el as any).setState('ok', 600);
    await flush(DEBOUNCE_MS + 5);
    expect(getTitle(el) || '').toContain('Degraded≥500 ms');
  });
});
