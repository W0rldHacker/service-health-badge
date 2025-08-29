import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = 'http://localhost:8000/demo/index.html';
const VARIANTS = ['dot', 'chip', 'badge'] as const;
const STATES = ['unknown', 'ok', 'degraded', 'down', 'offline'] as const;
const DEBOUNCE = 600;

async function mount(page, variant: (typeof VARIANTS)[number]) {
  await page.evaluate((v) => {
    const el = document.createElement('service-health-badge');
    el.setAttribute('variant', v);
    el.setAttribute(
      'labels',
      JSON.stringify({
        ok: 'OK',
        degraded: 'Degraded',
        down: 'Down',
        unknown: '—',
        offline: 'Offline',
      })
    );
    document.body.appendChild(el);
  }, variant);
}

async function setState(page, state: (typeof STATES)[number]) {
  await page.evaluate(
    (s) => document.querySelector('service-health-badge')!.setAttribute('dev-state', s),
    state
  );
  await page.waitForTimeout(DEBOUNCE);
}

for (const v of VARIANTS) {
  for (const s of STATES) {
    test(`axe: ${v} • ${s}`, async ({ page }) => {
      await page.goto(DEMO);
      await mount(page, v);
      await setState(page, s);

      const results = await new AxeBuilder({ page })
        .include('service-health-badge')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
}
