import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';
const STATES = ['unknown', 'ok', 'degraded', 'down', 'offline'] as const;
const VARIANTS = ['dot', 'chip', 'badge'] as const;
const DEBOUNCE_WAIT = 600;

async function mountComponent(page, variant: (typeof VARIANTS)[number]) {
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
  await page.evaluate((s) => {
    const el = document.querySelector('service-health-badge') as any;
    el.setState(s, s === 'unknown' ? null : 123);
  }, state);
  await page.waitForTimeout(DEBOUNCE_WAIT);
}

async function shadowHTML(page) {
  return await page.evaluate(() => {
    const el = document.querySelector('service-health-badge')! as any;
    const sr: ShadowRoot = el.shadowRoot;
    let html = sr.innerHTML;
    html = html.replace(/<style[\s\S]*?<\/style>/g, '');
    html = html.replace(/\s+title="[^"]*"/g, '');
    html = html.replace(/>\s+</g, '><').trim();
    return html;
  });
}

test.describe('Shadow DOM snapshots', () => {
  for (const v of VARIANTS) {
    for (const s of STATES) {
      test(`${v} • ${s}`, async ({ page }) => {
        await page.goto(DEMO);
        await mountComponent(page, v);
        await setState(page, s);
        const html = await shadowHTML(page);
        await expect.soft(html).toMatchSnapshot(`${v}__${s}.snap.html`);
      });
    }
  }
});
