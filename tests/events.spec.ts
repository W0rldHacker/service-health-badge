import { describe, it, expect } from 'vitest';
import '../src/index.js';

function okResponse() {
  const body = JSON.stringify({ status: 'ok', timings: { total_ms: 7 } });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
}

function failOnce(setup: { abort?: boolean } = {}) {
  if (setup.abort) {
    return () =>
      Promise.reject(Object.assign(new Error('Timeout exceeded'), { name: 'AbortError' }));
  }
  return () => Promise.reject(new TypeError('Network error'));
}

describe('events', () => {
  it('emits health-change with correct detail and bubbles/composed', async () => {
    // @ts-ignore
    globalThis.fetch = async () => okResponse();
    const el = document.createElement('service-health-badge') as HTMLElement;
    document.body.appendChild(el);
    el.setAttribute('endpoint', '/fake');

    const p = new Promise<CustomEvent>((resolve) => {
      el.addEventListener('health-change', (e) => resolve(e as CustomEvent), { once: true });
    });

    await (el as any).refresh();
    const ev = await p;
    expect(ev.detail.status).toBe('ok');
    expect(typeof ev.detail.at).toBe('string');
    expect(ev.bubbles).toBe(true);
    expect(ev.composed).toBe(true);
  });

  it('emits health-error on network/timeout errors', async () => {
    // @ts-ignore
    globalThis.fetch = failOnce();
    const el = document.createElement('service-health-badge') as HTMLElement;
    document.body.appendChild(el);
    el.setAttribute('endpoint', '/fake');

    const p = new Promise<CustomEvent>((resolve) => {
      el.addEventListener('health-error', (e) => resolve(e as CustomEvent), { once: true });
    });

    await (el as any).refresh();
    const ev = await p;
    expect(typeof ev.detail.error).toBe('string');
  });
});
