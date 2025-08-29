import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../src/index.js';

function makeEl(interval = 100) {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  el.setAttribute('interval', String(interval));
  el.setAttribute('endpoint', '/fake');
  el.refresh = vi.fn(async () => true);
  return el;
}

const setOnline = (v: boolean) => {
  Object.defineProperty(navigator, 'onLine', { value: v, configurable: true });
};

const setVis = (state: 'visible' | 'hidden') => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
};

describe('offline/online + visibility scheduler behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    setOnline(true);
    setVis('visible');
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('stops polling on offline and resumes on online (immediate tick)', async () => {
    const el = makeEl(100);
    vi.advanceTimersByTime(1);

    vi.advanceTimersByTime(0);
    expect(el.refresh).toHaveBeenCalledTimes(1);

    setOnline(false);
    window.dispatchEvent(new Event('offline'));

    vi.advanceTimersByTime(500);
    expect(el.refresh).toHaveBeenCalledTimes(1);

    setOnline(true);
    window.dispatchEvent(new Event('online'));
    vi.advanceTimersByTime(0);
    expect(el.refresh).toHaveBeenCalledTimes(2);
  });

  it('applies ×3 delay when hidden, then immediate refresh when visible', async () => {
    const el = makeEl(100);
    vi.advanceTimersByTime(1);
    vi.advanceTimersByTime(0);
    expect(el.refresh).toHaveBeenCalledTimes(1);

    setVis('hidden');
    vi.advanceTimersByTime(299);
    expect(el.refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(el.refresh).toHaveBeenCalledTimes(2);

    setVis('visible');
    vi.advanceTimersByTime(0);
    expect(el.refresh).toHaveBeenCalledTimes(3);
  });
});
