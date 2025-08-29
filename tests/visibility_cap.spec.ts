import { describe, it, expect, vi } from 'vitest';
import '../src/index.js';

const advance = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  await Promise.resolve();
};

function forceHidden() {
  Object.defineProperty(document, 'visibilityState', {
    value: 'hidden',
    configurable: true,
  });
}

describe('cap at 60s with hidden multiplier', () => {
  it('hidden ×3 is capped at 60s when scheduling next tick', async () => {
    vi.useFakeTimers();

    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);

    const pollSpy = vi.spyOn(el as any, '_pollOnce');

    forceHidden();
    (el as any)._backoffMs = 60000;
    (el as any)._queueNext(60000);

    await advance(59999);
    expect(pollSpy).toHaveBeenCalledTimes(0);

    await advance(1);
    expect(pollSpy).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
