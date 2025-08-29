import { describe, it, expect } from 'vitest';
import '../src/index.js';

describe('setState event gating', () => {
  it('does not emit health-change when status remains the same', async () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);

    let cnt = 0;
    el.addEventListener('health-change', () => cnt++);

    (el as any).setState('ok', 10);
    (el as any).setState('ok', 20);

    expect(cnt).toBe(1);
  });

  it('2xx with unknown status string maps to unknown (no event needed)', async () => {
    // @ts-ignore
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ status: 'weird' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('endpoint', '/fake');

    const ok = await (el as any).refresh();
    expect(ok).toBe(false);
    expect((el as any)._stateActual).toBe('unknown');
  });
});
