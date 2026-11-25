import { test, expect, Page } from '@playwright/test';
import { openHome, interceptPosts } from './helpers';

/**
 * Contact form ("Зв'яжіться з нами").
 * Every POST is intercepted in the browser: nothing is saved in the production database and
 * no message reaches the studio's Telegram.
 */
const OK_MESSAGE = 'Повідомлення надіслано!';
const ERROR_MESSAGE = 'Не вдалося надіслати форму';

const VALID = {
  name: 'Тест Тестович',
  email: 'qa@example.com',
  phone: '+380501112233',
  message: 'Тестове повідомлення для перевірки форми',
};

async function fillForm(page: Page, overrides: Partial<typeof VALID> = {}) {
  const data = { ...VALID, ...overrides };
  await page.fill("input[name='name']", data.name);
  await page.fill("input[name='email']", data.email);
  await page.fill("input[name='phone']", data.phone);
  await page.fill("textarea[name='message']", data.message);
}

async function submit(page: Page) {
  await page.getByRole('button', { name: 'НАДІСЛАТИ' }).click();
  await page.waitForTimeout(1500);
}

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await openHome(page);
  });

  test('has all fields', async ({ page }) => {
    for (const selector of ["input[name='name']", "input[name='email']", "input[name='phone']", "textarea[name='message']"]) {
      await expect(page.locator(selector), `field missing: ${selector}`).toHaveCount(1);
    }
    await expect(page.getByRole('button', { name: 'НАДІСЛАТИ' })).toHaveCount(1);
  });

  test('message counter starts at zero', async ({ page }) => {
    expect(await page.innerText('body')).toContain('0/500');
  });

  test('message counter follows typing', async ({ page }) => {
    await page.fill("textarea[name='message']", '1234567890');
    expect(await page.innerText('body')).toContain('10/500');
  });

  test('empty form shows all validation messages and sends nothing', async ({ page }) => {
    const seen = await interceptPosts(page);
    await submit(page);
    const text = await page.innerText('body');
    expect(text).toContain("Ім'я повинно містити мінімум 2 символи");
    expect(text).toContain('Невірний формат email');
    expect(text).toContain('Телефон повинен містити мінімум 10 цифр');
    expect(text).toContain('Повідомлення повинно містити мінімум 10 символів');
    expect(seen).toHaveLength(0);
  });

  const invalidCases: Array<[keyof typeof VALID, string]> = [
    ['name', 'А'],
    ['email', 'not-an-email'],
    ['phone', '12345'],
    ['message', 'коротко'],
  ];
  for (const [field, badValue] of invalidCases) {
    test(`invalid ${field} blocks sending`, async ({ page }) => {
      const seen = await interceptPosts(page);
      await fillForm(page, { [field]: badValue });
      await submit(page);
      expect(seen, `form with invalid ${field} must not be sent`).toHaveLength(0);
      expect(await page.innerText('body')).not.toContain(OK_MESSAGE);
    });
  }

  test('valid form sends the booking to the database', async ({ page }) => {
    const seen = await interceptPosts(page);
    await fillForm(page);
    await submit(page);
    const bookings = seen.filter((r) => r.url().includes('/rest/v1/bookings'));
    expect(bookings, 'exactly one insert into `bookings` expected').toHaveLength(1);
    const payload = bookings[0].postDataJSON();
    expect(payload.name).toBe(VALID.name);
    expect(payload.email).toBe(VALID.email);
    expect(payload.phone).toBe(VALID.phone);
    expect(payload.status).toBe('pending');
  });

  test('valid form notifies Telegram', async ({ page }) => {
    const seen = await interceptPosts(page);
    await fillForm(page);
    await submit(page);
    const telegram = seen.filter((r) => r.url().endsWith('/api/telegram'));
    expect(telegram).toHaveLength(1);
    const message: string = telegram[0].postDataJSON().message;
    expect(message).toContain(VALID.name);
    expect(message).toContain(VALID.phone);
    expect(message).toContain(VALID.email);
  });

  test('valid form shows the success message', async ({ page }) => {
    await interceptPosts(page);
    await fillForm(page);
    await submit(page);
    expect(await page.innerText('body')).toContain(OK_MESSAGE);
  });

  test('backend error shows a message and keeps the typed data', async ({ page }) => {
    const seen = await interceptPosts(page, 500, '{"message":"fail"}');
    await fillForm(page);
    await submit(page);
    const text = await page.innerText('body');
    expect(text).toContain(ERROR_MESSAGE);
    expect(text).not.toContain(OK_MESSAGE);
    expect(await page.inputValue("input[name='name']")).toBe(VALID.name);
    expect(seen.filter((r) => r.url().endsWith('/api/telegram')), 'no Telegram alert when saving failed').toHaveLength(0);
  });
});
