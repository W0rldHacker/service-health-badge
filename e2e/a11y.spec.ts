import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEMO = 'http://localhost:8000/demo/index.html';

test('component has no critical a11y issues', async ({ page }) => {
  await page.goto(DEMO);
  const results = await new AxeBuilder({ page }).include('service-health-badge').analyze();
  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );
  expect(critical, JSON.stringify(critical, null, 2)).toHaveLength(0);
});

test('focus ring is visible when focusable', async ({ page }) => {
  await page.goto(DEMO);
  const el = page.locator('#badge-focus');
  await el.focus();
  const outline = await el.evaluate((n) => getComputedStyle(n).outlineStyle);
  expect(outline).not.toBe('none');
});
