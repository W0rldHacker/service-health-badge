import { describe, it, expect } from 'vitest';
import '../src/index.js';

describe('Network/CORS error branch', () => {
  it('emits health-error with Network/CORS on generic rejection', async () => {
    // @ts-ignore
    globalThis.fetch = () => Promise.reject(new Error('boom'));
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('endpoint', '/fake');

    const errP = new Promise<CustomEvent>((resolve) =>
      el.addEventListener('health-error', (e: any) => resolve(e), { once: true })
    );
    await (el as any).refresh();
    const ev = await errP;
    expect(String(ev.detail.error)).toContain('Network/CORS error');
    expect((el as any)._stateActual).toBe('down');
  });
});
