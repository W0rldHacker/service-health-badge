import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';

// Глобальный счётчик fetch
const initScript = () => {
  // @ts-ignore
  window.__fetchCount = 0;
  const okBody = JSON.stringify({ status: 'ok', timings: { total_ms: 10 } });
  const okRes = () =>
    new Response(okBody, { status: 200, headers: { 'Content-Type': 'application/json' } });
  window.fetch = async (...args) => {
    // @ts-ignore
    window.__fetchCount++;
    return okRes();
  };
  // @ts-ignore
  window.__getFetchCount = () => window.__fetchCount;
};

const getCount = (page: any) => page.evaluate(() => (window as any).__getFetchCount());

// Ждём, пока компонент не делает запрос (нет _inflight)
const waitForIdle = (page: any) =>
  expect
    .poll(() => page.evaluate(() => (document.getElementById('sut') as any)?._inflight == null), {
      timeout: 2000,
    })
    .toBe(true);

test('no network attempts while offline; resumes on online', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(initScript);
  await page.goto(DEMO);

  // Создаём SUT с небольшим интервалом
  await page.evaluate(() => {
    const el = document.createElement('service-health-badge');
    el.id = 'sut';
    el.setAttribute('interval', '200');
    el.setAttribute('endpoint', '/fake');
    document.body.appendChild(el);
  });

  // Дать сделать пару запросов
  await page.waitForTimeout(600);

  // ВАЖНО: дождаться idle-паузы, чтобы не было "висячего" запроса
  await waitForIdle(page);

  // Снимок перед оффлайном
  const onlineCount = await getCount(page);

  // В оффлайн + принудительно кинем событие (на случай если браузер не эмитит)
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));

  // Проверяем, что счётчик НЕ растёт в течение 800 мс
  const start = Date.now();
  let last = onlineCount;
  await expect
    .poll(
      async () => {
        const cur = await getCount(page);
        // Защита от скрытого роста: сохраняем последний и возвращаем пару "cur|delta"
        const delta = cur - last;
        last = cur;
        return { cur, delta, elapsed: Date.now() - start };
      },
      { timeout: 800, intervals: [100, 150, 200] }
    )
    .toEqual(
      expect.objectContaining({ delta: 0 }) // ни одного инкремента в оффлайне
    );

  const afterOffline = await getCount(page);
  expect(afterOffline).toBe(onlineCount);

  // Возвращаемся онлайн + эмитим event; ждём мгновенный опрос
  await context.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));

  await expect
    .poll(async () => await getCount(page), { timeout: 1000 })
    .toBeGreaterThan(afterOffline);
});
