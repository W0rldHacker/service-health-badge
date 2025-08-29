import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';

async function addNeighbors(page) {
  await page.evaluate(() => {
    document.body.innerHTML = '';
    const before = Object.assign(document.createElement('button'), {
      id: 'before',
      textContent: 'Before',
    });
    const el = document.createElement('service-health-badge');
    el.setAttribute('variant', 'chip');
    const after = Object.assign(document.createElement('button'), {
      id: 'after',
      textContent: 'After',
    });
    document.body.append(before, el, after);
  });
}

function activeId(page) {
  return page.evaluate(
    () =>
      (document.activeElement as HTMLElement | null)?.id ||
      (document.activeElement as HTMLElement | null)?.tagName
  );
}

test('по умолчанию элемент не в таб‑порядке', async ({ page }) => {
  await page.goto(DEMO);
  await addNeighbors(page);

  await page.keyboard.press('Tab');
  expect(await activeId(page)).toBe('before');

  await page.keyboard.press('Tab');
  expect(await activeId(page)).toBe('after');
});

test('с атрибутом focusable элемент попадает в таб‑порядок и рисует focus ring', async ({
  page,
}) => {
  await page.goto(DEMO);
  await addNeighbors(page);
  await page.evaluate(() => customElements.whenDefined('service-health-badge'));
  await page.evaluate(() =>
    document.querySelector('service-health-badge')!.setAttribute('focusable', '')
  );

  await page.waitForFunction(() => {
    const el = document.querySelector('service-health-badge') as HTMLElement | null;
    return !!el && el.tabIndex === 0;
  });

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const tag = await page.evaluate(() => document.activeElement?.tagName);
  expect(tag).toBe('SERVICE-HEALTH-BADGE');

  const outlineWidth = await page.evaluate(
    () => getComputedStyle(document.activeElement as Element).outlineWidth
  );
  expect(outlineWidth).not.toBe('0px');
});
