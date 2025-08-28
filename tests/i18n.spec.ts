import { describe, it, expect } from 'vitest';
import '../src/index.js';

const nextFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof (globalThis as any).requestAnimationFrame === 'function') {
      (globalThis as any).requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe('labels (i18n)', () => {
  it('merges labels and re-renders on change', async () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);

    // дефолт
    expect(el.shadowRoot!.querySelector('.label')!.textContent).toBe('—');

    // смена unknown
    el.setAttribute('labels', JSON.stringify({ unknown: 'Неизв.' }));
    await nextFrame();
    expect(el.shadowRoot!.querySelector('.label')!.textContent).toBe('Неизв.');

    // смена degraded + ожидание дебаунса визуала (≥500мс)
    el.labels = { degraded: 'Медленно' };
    el.setState('degraded', 800);
    await sleep(600);
    await nextFrame();

    const label3 = el.shadowRoot!.querySelector('.label')!.textContent;
    expect(label3).toBe('Медленно');
  });

  it('ignores invalid JSON and keeps defaults', async () => {
    const el = document.createElement('service-health-badge') as any;
    document.body.appendChild(el);
    el.setAttribute('labels', '{broken');
    await nextFrame();
    expect(el.shadowRoot!.querySelector('.label')!.textContent).toBe('—');
  });
});
