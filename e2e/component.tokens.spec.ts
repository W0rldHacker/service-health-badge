import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';
const DEBOUNCE_WAIT = 600;

async function create(page, attrs: Record<string, string>) {
  await page.evaluate((a) => {
    const el = document.createElement('service-health-badge');
    // @ts-ignore
    for (const [k, v] of Object.entries(a)) el.setAttribute(k, v);
    document.body.appendChild(el);
  }, attrs);
}

function rgb(r: number, g: number, b: number) {
  return `rgb(${r}, ${g}, ${b})`;
}

async function styles(page) {
  return await page.evaluate(() => {
    const el = document.querySelector('service-health-badge')! as HTMLElement & {
      shadowRoot: ShadowRoot;
    };
    const sr = el.shadowRoot;
    const wrap = sr.querySelector('.wrap') as HTMLElement;
    const dot = sr.querySelector('.dot') as HTMLElement;
    const hostCS = getComputedStyle(el);
    const wrapCS = getComputedStyle(wrap);
    const dotCS = getComputedStyle(dot);
    return {
      hostFontSize: hostCS.fontSize,
      wrapBg: wrapCS.backgroundColor,
      dotBg: dotCS.backgroundColor,
    };
  });
}

test.describe('CSS tokens (computed styles)', () => {
  test('overrides health-bg-ok', async ({ page }) => {
    await page.goto(DEMO);
    await create(page, { variant: 'badge' });
    await page.evaluate(() => {
      const el = document.querySelector('service-health-badge') as HTMLElement & any;
      el.style.setProperty('--health-bg-ok', 'rgb(3, 102, 20)');
      el.setState('ok', 10);
    });
    await page.waitForTimeout(DEBOUNCE_WAIT);
    const s = await styles(page);
    expect(s.dotBg).toBe(rgb(3, 102, 20));
  });

  test('overrides health-chip-bg on chip variant', async ({ page }) => {
    await page.goto(DEMO);
    await create(page, { variant: 'chip' });
    await page.evaluate(() => {
      const el = document.querySelector('service-health-badge') as HTMLElement & any;
      el.style.setProperty('--health-chip-bg', 'rgba(10, 20, 30, 0.5)');
      el.setState('ok', 5);
    });
    await page.waitForTimeout(DEBOUNCE_WAIT);
    const s = await styles(page);
    expect(s.wrapBg).toBe('rgba(10, 20, 30, 0.5)');
  });

  test('overrides health-size (font-size via :host)', async ({ page }) => {
    await page.goto(DEMO);
    await create(page, { variant: 'dot' });
    await page.evaluate(() => {
      const el = document.querySelector('service-health-badge') as HTMLElement & any;
      el.style.setProperty('--health-size', '20px');
      el.setState('unknown', null);
    });
    await page.waitForTimeout(DEBOUNCE_WAIT);
    const s = await styles(page);
    expect(s.hostFontSize).toBe('20px');
  });
});
