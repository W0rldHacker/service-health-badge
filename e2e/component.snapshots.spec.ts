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
    const el = document.querySelector('service-health-badge')!;
    el.setAttribute('dev-state', s);
  }, state);
  await page.waitForTimeout(DEBOUNCE_WAIT);
}

function canonicalize(html: string) {
  const oneLine = html.replace(/>\s+</g, '><').trim();
  const m = oneLine.match(/^<div([^>]*)>([\s\S]*?)<\/div>$/);
  if (!m) return oneLine;
  const [, attrs, inner] = m;
  return `<div${attrs}>\n  ${inner}\n</div>`;
}

async function shadowHTML(page) {
  return await page.evaluate(() => {
    const el = document.querySelector('service-health-badge')!;
    const sr = (el as any).shadowRoot as ShadowRoot;

    const container = document.createElement('div');
    container.innerHTML = sr.innerHTML;

    container.querySelectorAll('style').forEach((n) => n.remove());
    const wrap = container.querySelector('.wrap') as HTMLElement | null;
    if (wrap) wrap.removeAttribute('title');

    return container.innerHTML;
  });
}

test.describe('Shadow DOM snapshots', () => {
  for (const v of VARIANTS) {
    for (const s of STATES) {
      test(`${v} • ${s}`, async ({ page }) => {
        console.log(test.info().snapshotPath('probe.txt'));
        await page.goto(DEMO);
        await page.evaluate(() => customElements.whenDefined('service-health-badge'));
        await mountComponent(page, v);
        await setState(page, s);
        const raw = await shadowHTML(page);
        const html = canonicalize(raw);
        await expect(html).toMatchSnapshot(`${v}__${s}.html`);
      });
    }
  }
});
