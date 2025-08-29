import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';
const INTERVAL = 200;

async function setupFetchCounter(page) {
  await page.addInitScript(() => {
    // @ts-ignore
    window.__fetchCount = 0;
    // @ts-ignore
    const origFetch = window.fetch;
    // @ts-ignore
    window.fetch = async (...args) => {
      // @ts-ignore
      window.__fetchCount++;
      return new Response(JSON.stringify({ status: 'ok', timings: { total_ms: 10 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    // @ts-ignore
    window.__getCount = () => window.__fetchCount;
  });
}

async function getCount(page) {
  return await page.evaluate(() => (window as any).__getCount());
}

async function waitDataS(page, expected: string) {
  await page.waitForFunction(
    (exp) => {
      const el = document.querySelector('service-health-badge');
      const wrap = el && (el.shadowRoot as any)?.querySelector('.wrap');
      return wrap && wrap.getAttribute('data-s') === exp;
    },
    expected,
    { timeout: 5000 }
  );
}

test('no network attempts while offline; resumes on online', async ({ page, context }) => {
  await setupFetchCounter(page);
  await page.goto(DEMO);
  await page.evaluate(() => customElements.whenDefined('service-health-badge'));

  await page.evaluate((interval) => {
    const el = document.createElement('service-health-badge');
    el.setAttribute('endpoint', '/fake');
    el.setAttribute('interval', String(interval));
    el.setAttribute('variant', 'badge');
    document.body.appendChild(el);
  }, INTERVAL);

  await page.waitForTimeout(INTERVAL * 2 + 50);
  const onlineCount = await getCount(page);
  expect(onlineCount).toBeGreaterThanOrEqual(1);

  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await waitDataS(page, 'offline');
  await page.waitForTimeout(20);

  const countAtOffline = await getCount(page);

  await page.waitForTimeout(INTERVAL * 2 + 50);
  const stillAtOffline = await getCount(page);
  expect(stillAtOffline).toBe(countAtOffline);

  await context.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));

  await page.waitForFunction((prev) => (window as any).__getCount() > prev, countAtOffline, {
    timeout: 5000,
  });

  await page.waitForTimeout(700);
  const s = await page.evaluate(() => {
    const el = document.querySelector('service-health-badge');
    const wrap = el && (el.shadowRoot as any)?.querySelector('.wrap');
    return wrap && wrap.getAttribute('data-s');
  });
  expect.soft(s).not.toBe('offline');

  const afterOnline = await getCount(page);
  expect(afterOnline).toBeGreaterThan(countAtOffline);
});
