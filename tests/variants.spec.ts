import { describe, it, expect } from 'vitest';
import '../src/index.js';

const DEBOUNCE_PAD_MS = 550; // визуальный дебаунс = 500мс → ждём с запасом
const waitDebounced = (ms = DEBOUNCE_PAD_MS) => new Promise((r) => setTimeout(r, ms));

function makeEl(variant: 'dot' | 'chip' | 'badge') {
  const el = document.createElement('service-health-badge') as any;
  document.body.appendChild(el);
  el.setAttribute('variant', variant);
  return el;
}

describe('variants', () => {
  it('dot has minimal DOM (no label/lat)', () => {
    const el = makeEl('dot');
    const sr = el.shadowRoot!;
    expect(sr.querySelector('.dot')).toBeTruthy();
    expect(sr.querySelector('.label')).toBeNull();
    expect(sr.querySelector('.lat')).toBeNull();
    const wrap = sr.querySelector('.wrap')!;
    expect(wrap.getAttribute('aria-label')).toBeTruthy();
  });

  it('chip has label but no latency', () => {
    const el = makeEl('chip');
    const sr = el.shadowRoot!;
    expect(sr.querySelector('.dot')).toBeTruthy();
    expect(sr.querySelector('.label')).toBeTruthy();
    expect(sr.querySelector('.lat')).toBeNull();
  });

  it('badge has label and latency', () => {
    const el = makeEl('badge');
    const sr = el.shadowRoot!;
    expect(sr.querySelector('.dot')).toBeTruthy();
    expect(sr.querySelector('.label')).toBeTruthy();
    expect(sr.querySelector('.lat')).toBeTruthy();
  });

  it('switching variant rebuilds DOM and preserves state text', async () => {
    const el = makeEl('badge');
    (el as any).setState('degraded', 777);
    // ждём визуальный дебаунс
    await waitDebounced();
    expect(el.shadowRoot!.querySelector('.label')!.textContent).toBe('Degraded');

    el.setAttribute('variant', 'dot'); // перестроить DOM
    // дождёмся микротика, чтобы Shadow DOM перестроился
    await new Promise((r) => setTimeout(r, 0));
    expect(el.shadowRoot!.querySelector('.label')).toBeNull();
    // aria-label должен содержать корректный текст статуса
    const wrap = el.shadowRoot!.querySelector('.wrap')!;
    expect(wrap.getAttribute('aria-label')).toContain('Degraded');
  });
});
