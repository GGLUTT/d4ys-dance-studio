import { test, expect } from '@playwright/test';
import { openHome } from './helpers';

const NAV: Record<string, string> = { 'НАПРЯМКИ': '#directions', 'КОМАНДА': '#team', 'ГОЛОВНА': '#home' };

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await openHome(page);
  });

  test('renders key blocks @smoke', async ({ page }) => {
    const text = await page.innerText('body');
    for (const block of ['ОБЕРИ СВІЙ СТИЛЬ', 'ОБЕРИ СВІЙ ПЛАН', 'ЧАСТІ ПИТАННЯ', "ЗВ'ЯЖІТЬСЯ З НАМИ"]) {
      expect(text, `missing block: ${block}`).toContain(block);
    }
  });

  test('title contains the studio name @smoke', async ({ page }) => {
    expect(await page.title()).toContain('D4YS');
  });

  for (const [label, anchor] of Object.entries(NAV)) {
    test(`menu link "${label}" points to ${anchor}`, async ({ page }) => {
      const href = await page.locator('a', { hasText: label }).first().getAttribute('href');
      expect(href).toBe(anchor);
    });
  }

  test('cabinet link leads to the login screen', async ({ page }) => {
    await page.locator("a[href='/cabinet']").first().click();
    await page.waitForURL('**/cabinet');
    await expect(page.getByText('ОСОБИСТИЙ КАБІНЕТ')).toBeVisible();
  });

  test('two dance directions are shown', async ({ page }) => {
    const text = await page.innerText('body');
    expect(text).toContain('ХОРЕО');
    expect(text).toContain('JAZZFUNK');
  });

  test('two coaches are shown', async ({ page }) => {
    const text = await page.innerText('body');
    expect(text).toContain('НАДІЯ');
    expect(text).toContain('ВЕРОНІКА');
  });

  test('pricing has four plans with prices', async ({ page }) => {
    const text = await page.innerText('body');
    for (const price of ['150грн', '200грн', '1200грн/міс', '2000грн/міс']) {
      expect(text, `price not found: ${price}`).toContain(price);
    }
    await expect(page.getByRole('button', { name: 'ОБРАТИ' })).toHaveCount(4);
  });

  test('popular plan is marked', async ({ page }) => {
    expect(await page.innerText('body')).toContain('ПОПУЛЯРНИЙ');
  });

  test('FAQ has seven questions', async ({ page }) => {
    await expect(page.locator('button', { hasText: '?' })).toHaveCount(7);
  });

  test('FAQ question opens its answer', async ({ page }) => {
    const before = (await page.innerText('body')).length;
    await page.getByRole('button', { name: 'Як записатися на пробне заняття?' }).click();
    await page.waitForTimeout(800); // accordion animation
    expect((await page.innerText('body')).length).toBeGreaterThan(before);
  });

  test('phone link is valid', async ({ page }) => {
    expect(await page.locator("a[href^='tel:']").first().getAttribute('href')).toBe('tel:+380684649487');
  });

  test('map link opens Google Maps', async ({ page }) => {
    const href = await page.locator('a', { hasText: 'ВІДКРИТИ НА МАПІ' }).getAttribute('href');
    expect(href).toMatch(/^https:\/\/www\.google\.com\/maps\//);
  });
});
