import { describe, it, expect } from 'vitest';
import '../src/index.js';

describe('attributes & setters reflection', () => {
  it('interval/timeout default on invalid values', () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('interval', 'not-a-number');
    el.setAttribute('timeout', '-5');
    expect((el as any).interval).toBe(10000);
    expect((el as any).timeout).toBe(3000);
  });

  it('focusable toggles tabindex', () => {
    const el = document.createElement('service-health-badge');
    document.body.appendChild(el);
    el.setAttribute('focusable', '');
    expect(el.getAttribute('tabindex')).toBe('0');
    el.removeAttribute('focusable');
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('show-latency=false hides latency and property setter removes attribute', async () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('variant', 'badge');
    el.setAttribute('show-latency', 'false');
    (el as any).setState('ok', 42);
    await new Promise((r) => setTimeout(r, 550));
    const lat = el.shadowRoot!.querySelector('.lat')!.textContent;
    expect(lat).toBe('');
    (el as any).showLatency = true;
    expect(el.hasAttribute('show-latency')).toBe(false);
  });

  it('dot variant updates aria-label when status changes', async () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('variant', 'dot');
    (el as any).setState('degraded', 300);
    await new Promise((r) => setTimeout(r, 550));
    const wrap = el.shadowRoot!.querySelector('.wrap')!;
    expect(wrap.getAttribute('aria-label')).toContain('Degraded');
  });
});
