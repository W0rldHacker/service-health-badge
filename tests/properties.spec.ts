import { describe, it, expect } from 'vitest';
import '../src/index.js';

describe('public property setters', () => {
  it('labels setter merges defaults and reflects attribute', () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.labels = { degraded: 'Slowish' };
    const attr = el.getAttribute('labels')!;
    expect(attr).toContain('"degraded":"Slowish"');
    (el as any).setState('degraded', 100);
  });

  it('variant setter normalizes unknown to badge', () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.variant = 'oops';
    expect(el.getAttribute('variant')).toBe('badge');
  });

  it('timeout/interval setters coerce to defaults on invalid input', () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.timeout = -10 as any;
    el.interval = NaN as any;
    expect(el.timeout).toBe(3000);
    expect(el.interval).toBe(10000);
  });
});
