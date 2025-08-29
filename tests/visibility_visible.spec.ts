import { describe, it, expect, vi } from 'vitest';
import '../src/index.js';

const advance = async (ms = 0) => {
  vi.advanceTimersByTime(ms);
  await Promise.resolve();
};

describe('visible scheduling without multiplier', () => {
  it('fires exactly at scheduled delay (no ×3)', async () => {
    vi.useFakeTimers();
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);

    const pollSpy = vi.spyOn(el as any, '_pollOnce');

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });

    (el as any)._queueNext(60000);
    await advance(59999);
    expect(pollSpy).toHaveBeenCalledTimes(0);
    await advance(1);
    expect(pollSpy).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
