import { defineConfig, devices } from '@playwright/test';

/**
 * BASE_URL  site under test (default: production site of the studio)
 * Failed tests keep a screenshot and a trace in test-results/.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: (process.env.BASE_URL ?? 'https://www.d4ys-bc.com').replace(/\/$/, ''),
    locale: 'uk-UA',
    viewport: { width: 1366, height: 800 },
    actionTimeout: 15_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 800 } } }],
});
