import { test, expect } from '@playwright/test';

const DEMO = 'http://localhost:8000/demo/index.html';
const DEBOUNCE = 600;

async function mount(
  page,
  variant: 'dot' | 'chip' | 'badge',
  state?: 'unknown' | 'ok' | 'degraded' | 'down' | 'offline'
) {
  await page.evaluate(
    ([v, s]) => {
      document.body.innerHTML = '';
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
      if (s) (el as any).setState(s, 10);
    },
    [variant, state]
  );
}

function findNode(node: any, predicate: (n: any) => boolean): any | null {
  if (predicate(node)) return node;
  for (const ch of node.children || []) {
    const r = findNode(ch, predicate);
    if (r) return r;
  }
  return null;
}

test('role="status" и корректное имя в variant="dot"', async ({ page }) => {
  await page.goto(DEMO);
  await mount(page, 'dot', 'ok');
  await page.waitForTimeout(DEBOUNCE);
  const tree = await page.accessibility.snapshot({ interestingOnly: false });
  const node = findNode(tree, (n) => n.role === 'status');
  expect(node?.name).toBe('OK');
});

test('role="status" и текст лейбла в "chip"', async ({ page }) => {
  await page.goto(DEMO);
  await mount(page, 'chip', 'unknown');
  await page.waitForTimeout(DEBOUNCE);
  const tree = await page.accessibility.snapshot({ interestingOnly: false });
  const node = findNode(tree, (n) => n.role === 'status');
  expect(node?.name).toBe('—');
});
