import { test, expect } from '@playwright/test';

test.describe('HTTP smoke checks @smoke @api', () => {
  test('home returns 200 and HTML quickly', async ({ request }) => {
    const started = Date.now();
    const response = await request.get('/');
    const elapsed = Date.now() - started;
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(elapsed).toBeLessThan(5000); // generous limit: smoke check, not a load test
  });

  test('title, language and SEO meta are present', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
    expect(title).toContain('D4YS');
    expect(html).toContain('uk_UA');
    expect(html).toContain('name="description"');
    expect(html).toContain('rel="canonical"');
  });

  test('cabinet route is served when opened directly', async ({ request }) => {
    const response = await request.get('/cabinet');
    expect(response.status()).toBe(200);
  });
});
