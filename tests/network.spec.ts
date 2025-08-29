import { describe, it, expect, vi } from 'vitest';
import '../src/index.js';

function makeEl(timeout = 50) {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  el.setAttribute('endpoint', '/slow');
  el.setAttribute('timeout', String(timeout));
  return el;
}

describe('network errors & timeout', () => {
  it('timeout → AbortError → health-error + status down', async () => {
    vi.useFakeTimers();
    // @ts-ignore
    globalThis.fetch = (input: any, init: any) =>
      new Promise((_, reject) => {
        const s: AbortSignal | undefined = init?.signal;
        const onAbort = () => {
          const err: any = new Error('Timeout exceeded');
          err.name = 'AbortError';
          reject(err);
        };
        if (s?.aborted) onAbort();
        else s?.addEventListener('abort', onAbort);
      });

    const el = makeEl(30);

    const errP = new Promise<CustomEvent>((resolve) =>
      el.addEventListener('health-error', (e: any) => resolve(e), { once: true })
    );
    const p = (el as any).refresh();
    vi.advanceTimersByTime(35); // триггерим abort timeout
    await p;
    const errEv = await errP;
    expect(String(errEv.detail.error)).toContain('Timeout');
    expect((el as any)._stateActual).toBe('down');
    vi.useRealTimers();
  });

  it('HTTP 500 → health-error + status down', async () => {
    // @ts-ignore
    globalThis.fetch = async () => new Response('oops', { status: 500 });
    const el = makeEl(1000);

    const errP = new Promise<CustomEvent>((resolve) =>
      el.addEventListener('health-error', (e: any) => resolve(e), { once: true })
    );
    await (el as any).refresh();
    const errEv = await errP;
    expect(String(errEv.detail.error)).toContain('HTTP 500');
    expect((el as any)._stateActual).toBe('down');
  });
});
