import { describe, it, expect } from 'vitest';
import '../src/index.js';

describe('2xx with status "down"', () => {
  it('sets state to down and returns false', async () => {
    // @ts-ignore
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ status: 'down', timings: { total_ms: 12 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('endpoint', '/fake');

    const ok = await (el as any).refresh();
    expect(ok).toBe(false);
    expect((el as any)._stateActual).toBe('down');
  });
});
