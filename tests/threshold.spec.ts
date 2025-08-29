import { describe, it, expect } from 'vitest';
import '../src/index.js';

describe('degraded-threshold-ms', () => {
  it('converts ok→degraded when latency exceeds threshold', async () => {
    // @ts-ignore
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ status: 'ok', timings: { total_ms: 150 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('endpoint', '/fake');
    el.setAttribute('degraded-threshold-ms', '100');

    const ev = await new Promise<CustomEvent>((resolve) => {
      el.addEventListener('health-change', (e: any) => resolve(e), { once: true });
      (el as any).refresh();
    });

    expect(ev.detail.status).toBe('degraded');
  });
});
