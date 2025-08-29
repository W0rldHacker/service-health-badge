import { describe, it, expect } from 'vitest';
import '../src/index.js';

const mk = () => {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  return el;
};

describe('refresh() special branches', () => {
  it('returns false and sets offline when navigator.onLine === false', async () => {
    const el = mk();
    el.setAttribute('endpoint', '/fake');
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    const ok = await (el as any).refresh();
    expect(ok).toBe(false);
    expect((el as any)._stateActual).toBe('offline');
  });

  it('returns true when no endpoint is set (noop)', async () => {
    const el = mk();
    const ok = await (el as any).refresh();
    expect(ok).toBe(true);
  });
});
