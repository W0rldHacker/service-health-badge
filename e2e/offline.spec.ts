import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';

const initScript = () => {
  // @ts-ignore
  window.__fetchCount = 0;
  const responseBody = JSON.stringify({ status: 'ok', timings: { total_ms: 10 } });
  const fakeResponse = () =>
    new Response(responseBody, { status: 200, headers: { 'Content-Type': 'application/json' } });
  const orig = window.fetch;
  window.fetch = async (...args) => {
    // @ts-ignore
    window.__fetchCount++;
    return fakeResponse();
  };
  // @ts-ignore
  window.__getFetchCount = () => window.__fetchCount;
};

const getCount = async (page: any) => await page.evaluate(() => (window as any).__getFetchCount());

test('no network attempts while offline; resumes on online', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(initScript);
  await page.goto(DEMO);

  await page.evaluate(() => {
    const el = document.createElement('service-health-badge');
    el.setAttribute('interval', '200');
    el.setAttribute('endpoint', '/fake');
    document.body.appendChild(el);
  });

  await page.waitForTimeout(600);
  const onlineCount = await getCount(page);
  expect(onlineCount).toBeGreaterThan(0);

  await context.setOffline(true);
  await page.waitForTimeout(800);
  const afterOffline = await getCount(page);
  expect(afterOffline).toBe(onlineCount);

  await context.setOffline(false);
  await page.waitForTimeout(250);
  const afterOnline = await getCount(page);
  expect(afterOnline).toBeGreaterThan(onlineCount);
});
