import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';

const initScript = () => {
  // @ts-ignore
  window.__fetchCount = 0;
  const responseBody = JSON.stringify({ status: 'ok', timings: { total_ms: 10 } });
  const fakeResponse = () =>
    new Response(responseBody, { status: 200, headers: { 'Content-Type': 'application/json' } });
  const origFetch = window.fetch;
  // @ts-ignore
  window.fetch = async (...args) => {
    // @ts-ignore
    window.__fetchCount++;
    return fakeResponse();
  };
  // @ts-ignore
  window.__getFetchCount = () => window.__fetchCount;
};

const getCount = async (page: any) => await page.evaluate(() => (window as any).__getFetchCount());

async function setVisibility(page: any, state: 'visible' | 'hidden') {
  await page.evaluate((s) => {
    Object.defineProperty(document, 'visibilityState', { value: s, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  }, state);
}

test('polling slows down in hidden tabs', async ({ page }) => {
  await page.addInitScript(initScript);
  await page.goto(DEMO);

  await page.evaluate(() => {
    const el = document.createElement('service-health-badge');
    el.setAttribute('variant', 'badge');
    el.setAttribute('interval', '200');
    el.setAttribute('timeout', '2000');
    el.setAttribute('endpoint', '/fake');
    document.body.appendChild(el);
  });

  await page.waitForTimeout(1200);
  const visibleCount = await getCount(page);

  await setVisibility(page, 'hidden');
  await page.waitForTimeout(1200);
  const hiddenCount = (await getCount(page)) - visibleCount;

  await setVisibility(page, 'visible');
  await page.waitForTimeout(200);
  const afterVisibleCount = await getCount(page);

  expect(visibleCount).toBeGreaterThanOrEqual(4);
  expect(hiddenCount * 2).toBeLessThanOrEqual(visibleCount);
  expect(afterVisibleCount).toBeGreaterThan(visibleCount + hiddenCount);
});
