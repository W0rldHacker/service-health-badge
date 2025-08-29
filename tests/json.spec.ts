import { describe, it, expect, vi } from 'vitest';
import '../src/index.js';

const ok = (body: any, status = 200) =>
  new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function makeEl() {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  el.setAttribute('endpoint', '/fake');
  return el;
}

describe('JSON parsing & status/latency', () => {
  it('valid JSON: status ok + timings.total_ms propagated', async () => {
    // @ts-ignore
    globalThis.fetch = async () => ok({ status: 'ok', timings: { total_ms: 23 } });
    const el = makeEl();

    const ev = await new Promise<CustomEvent>((resolve) => {
      el.addEventListener('health-change', (e: any) => resolve(e), { once: true });
      (el as any).refresh();
    });
    expect(ev.detail.status).toBe('ok');
    expect(ev.detail.latencyMs).toBe(23);
  });

  it('empty 2xx body treated as {} → default ok, latency uses perf fallback', async () => {
    const orig = performance.now;
    let t = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => (t += 5));
    // @ts-ignore
    globalThis.fetch = async () => ok('');
    const el = makeEl();
    const ev = await new Promise<CustomEvent>((resolve) => {
      el.addEventListener('health-change', (e: any) => resolve(e), { once: true });
      (el as any).refresh();
    });
    expect(ev.detail.status).toBe('ok');
    expect(ev.detail.latencyMs).toBeGreaterThan(0);
    performance.now = orig;
  });

  it('malformed JSON: emits health-error and sets unknown', async () => {
    // @ts-ignore
    globalThis.fetch = async () => ok('{');
    const el = makeEl();

    const errP = new Promise<CustomEvent>((resolve) =>
      el.addEventListener('health-error', (e: any) => resolve(e), { once: true })
    );
    await (el as any).refresh();
    const errEv = await errP;
    expect(String(errEv.detail.error)).toContain('JSON parse error');

    // визуал обновится с дебаунсом; но текущий статус — unknown
    expect((el as any)._stateActual).toBe('unknown');
  });
});
