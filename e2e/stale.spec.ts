import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';

test('shows stale hint after 2×interval without valid data', async ({ page }) => {
  // 1) Глобальный мок fetch: сначала "ok", потом по переключателю — ошибка
  await page.addInitScript(() => {
    // @ts-ignore
    window.__mode = 'ok';
    const okBody = JSON.stringify({ status: 'ok', timings: { total_ms: 10 } });
    const okRes = () =>
      new Response(okBody, { status: 200, headers: { 'Content-Type': 'application/json' } });
    const fail = () => Promise.reject(new TypeError('Network down'));
    // @ts-ignore
    window.fetch = () => (window.__mode === 'ok' ? okRes() : fail());
  });

  await page.goto(DEMO);

  // 2) Создаём уникальный экземпляр компонента с маленьким интервалом
  await page.evaluate(() => {
    const el = document.createElement('service-health-badge');
    el.id = 'sut';
    el.setAttribute('variant', 'badge');
    el.setAttribute('interval', '250'); // маленький interval для быстрого теста
    el.setAttribute('endpoint', '/fake'); // уйдёт в наш мок
    document.body.appendChild(el);
  });

  const host = page.locator('#sut');

  // 3) Принудительно запускаем первый запрос, чтобы точно получить валидные данные
  await page.evaluate(() => (document.getElementById('sut') as any).refresh());

  // 4) Дожидаемся, пока title подтвердит УСПЕШНОЕ состояние (именно это сбросит "свежесть")
  await expect
    .poll(async () => (await host.locator('.wrap').getAttribute('title')) || '', { timeout: 4000 })
    .toContain('Status: OK');

  // 5) Переводим мок в ошибки и ждём > 2×interval, чтобы включился stale-guard
  await page.evaluate(() => {
    (window as any).__mode = 'fail';
  });

  await expect
    .poll(
      async () => (await host.locator('.wrap').getAttribute('title')) || '',
      { timeout: 4000 } // 4s хватит с запасом при interval=250ms
    )
    .toContain('Данные устарели');
});
