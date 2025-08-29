import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../src/index.js';

const DEBOUNCE_MS = 500;

function makeEl() {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  return el;
}

describe('FSM transitions & debounce', () => {
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

  it('emits health-change immediately; visual updates after 500ms', async () => {
    const el = makeEl();

    let events = 0;
    el.addEventListener('health-change', () => events++);

    (el as any).setState('ok', 10);
    (el as any).setState('degraded', 20);
    (el as any).setState('ok', 15);

    expect(events).toBe(3);
    expect(el.shadowRoot!.querySelector('.wrap')!.getAttribute('data-s')).toBe('unknown');

    // дебаунс + rAF
    vi.advanceTimersByTime(DEBOUNCE_MS + 10);
    vi.runOnlyPendingTimers();

    expect(el.shadowRoot!.querySelector('.wrap')!.getAttribute('data-s')).toBe('ok');
  });

  it('offline/down override threshold logic (priority)', async () => {
    const el = makeEl();
    el.setAttribute('degraded-threshold-ms', '50');
    (el as any).setState('offline', null);
    expect((el as any)._stateActual).toBe('offline');
    (el as any).setState('ok', 9999);
    // дебаунс
    vi.advanceTimersByTime(DEBOUNCE_MS + 10);
    vi.runOnlyPendingTimers();
    expect((el as any)._stateActual).toBe('degraded');
  });
});
