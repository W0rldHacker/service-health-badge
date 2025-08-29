import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';

async function waitForDataS(page, expected: string) {
  await page.waitForFunction(
    (exp) => {
      const el = document.querySelector('service-health-badge');
      const wrap = el && (el.shadowRoot as any)?.querySelector('.wrap');
      return wrap && wrap.getAttribute('data-s') === exp;
    },
    expected,
    { timeout: 2000 }
  );
}

async function watch(page) {
  await page.evaluate(() => {
    const el = document.querySelector('service-health-badge')!;
    const wrap = (el.shadowRoot as any).querySelector('.wrap')!;
    // @ts-ignore
    window.__changes = [] as Array<{ s: string; t: number }>;
    const mo = new MutationObserver(() => {
      // @ts-ignore
      window.__changes.push({ s: wrap.getAttribute('data-s')!, t: performance.now() });
    });
    mo.observe(wrap, { attributes: true, attributeFilter: ['data-s'] });
    // @ts-ignore
    window.__getChanges = () => window.__changes;
  });
}

async function getChanges(page) {
  return await page.evaluate(() => (window as any).__getChanges());
}

test('rapid toggles do not cause intermediate flashing', async ({ page }) => {
  await page.goto(DEMO);
  await page.evaluate(() => customElements.whenDefined('service-health-badge'));

  await page.evaluate(() => {
    const el = document.createElement('service-health-badge');
    el.setAttribute('variant', 'badge');
    document.body.appendChild(el);
  });

  await watch(page);

  await page.evaluate(() => {
    const el = document.querySelector('service-health-badge') as any;
    el.setState('ok', 10); // t≈0
    setTimeout(() => el.setState('down', null), 100);
    setTimeout(() => el.setState('ok', 20), 200);
  });

  await waitForDataS(page, 'ok');

  const changes = await getChanges(page);
  expect(changes.find((c: any) => c.s === 'down')).toBeFalsy();
  expect(changes.length).toBeGreaterThanOrEqual(1);
});
