import { test, expect } from '@playwright/test';
import { interceptPosts } from './helpers';

/** Personal cabinet (/cabinet). Auth requests are intercepted: no real account is used or created. */
test.describe('Cabinet: login and registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cabinet');
    await page.getByText('ОСОБИСТИЙ КАБІНЕТ').waitFor({ timeout: 30_000 });
  });

  test('login screen elements @smoke', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Вхід' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Реєстрація' })).toBeVisible();
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Увійти в кабінет' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Забули пароль?' })).toBeVisible();
  });

  test('login tab is active by default', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Вхід' })).toHaveAttribute('data-state', 'active');
  });

  test('password field is masked', async ({ page }) => {
    await expect(page.locator("input[type='password']")).toHaveAttribute('type', 'password');
  });

  test('empty login shows a message and sends nothing', async ({ page }) => {
    const seen = await interceptPosts(page, 400);
    await page.getByRole('button', { name: 'Увійти в кабінет' }).click();
    await page.waitForTimeout(800);
    expect(await page.innerText('body')).toContain('Вкажіть email і пароль');
    expect(seen).toHaveLength(0);
  });

  test('wrong credentials show an error and keep the user on the login form', async ({ page }) => {
    const seen = await interceptPosts(page, 400, '{"error":"invalid_grant","msg":"Invalid login credentials"}');
    await page.fill("input[type='email']", 'nobody@example.com');
    await page.fill("input[type='password']", 'wrong-password-123');
    await page.getByRole('button', { name: 'Увійти в кабінет' }).click();
    await page.waitForTimeout(1500);
    expect(seen.some((r) => r.url().includes('/auth/v1/token')), 'login must call the auth endpoint').toBeTruthy();
    expect(await page.innerText('body')).toContain('Невірний email або пароль');
    expect(page.url()).toMatch(/\/cabinet$/);
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test('registration tab shows the registration form', async ({ page }) => {
    await page.getByRole('tab', { name: 'Реєстрація' }).click();
    await page.getByRole('button', { name: 'Створити акаунт' }).waitFor();
    await expect(page.getByRole('tab', { name: 'Реєстрація' })).toHaveAttribute('data-state', 'active');
    const text = await page.innerText('body');
    for (const label of ['НІКНЕЙМ', 'EMAIL', 'ПАРОЛЬ', 'ПІДТВЕРДЖЕННЯ ПАРОЛЮ']) {
      expect(text, `registration field missing: ${label}`).toContain(label);
    }
    await expect(page.locator("input[type='password']")).toHaveCount(2);
  });

  test('can switch back to login', async ({ page }) => {
    await page.getByRole('tab', { name: 'Реєстрація' }).click();
    await page.getByRole('tab', { name: 'Вхід' }).click();
    await page.getByRole('button', { name: 'Увійти в кабінет' }).waitFor();
    await expect(page.locator("input[type='password']")).toHaveCount(1);
  });
});
