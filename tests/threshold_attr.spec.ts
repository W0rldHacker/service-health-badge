import { describe, it, expect } from 'vitest';
import '../src/index.js';

describe('threshold recompute on attribute change', () => {
  it('re-evaluates ok→degraded when threshold lowered', async () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);

    (el as any).setState('ok', 700);
    await new Promise((r) => setTimeout(r, 550));
    expect((el as any)._stateActual).toBe('ok');

    el.setAttribute('degraded-threshold-ms', '500');
    await new Promise((r) => setTimeout(r, 0));
    expect((el as any)._stateActual).toBe('degraded');
  });
});
