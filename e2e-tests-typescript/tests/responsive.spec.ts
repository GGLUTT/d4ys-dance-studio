import { test, expect } from '@playwright/test';
import { openHome } from './helpers';

const SIZES: Record<string, { width: number; height: number }> = {
  'iphone-se': { width: 375, height: 667 },
  'pixel-7': { width: 412, height: 915 },
  ipad: { width: 768, height: 1024 },
  laptop: { width: 1366, height: 768 },
};

test.describe('Responsive layout', () => {
  for (const [name, size] of Object.entries(SIZES)) {
    test(`no horizontal scroll on ${name}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: size, locale: 'uk-UA', baseURL: process.env.BASE_URL ?? 'https://www.d4ys-bc.com' });
      const page = await context.newPage();
      try {
        await openHome(page);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${name}: page is ${overflow}px wider than the screen`).toBeLessThanOrEqual(1);
      } finally {
        await context.close();
      }
    });
  }

  test('mobile booking buttons lead to the contact form', async ({ browser }) => {
    const context = await browser.newContext({ viewport: SIZES['iphone-se'], locale: 'uk-UA', baseURL: process.env.BASE_URL ?? 'https://www.d4ys-bc.com' });
    const page = await context.newPage();
    try {
      await openHome(page);
      const hrefs = await page.$$eval('a', (els) => els.filter((a) => (a as HTMLElement).innerText.trim() === 'ЗАПИСАТИСЯ').map((a) => a.getAttribute('href')));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) expect(href).toBe('#contact');
    } finally {
      await context.close();
    }
  });
});
