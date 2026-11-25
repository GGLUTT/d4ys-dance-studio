import { Page, Request } from '@playwright/test';

/** Open the home page and wait until the preloader is gone and content is rendered. */
export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForFunction(() => document.body.innerText.includes('ОБЕРИ СВІЙ СТИЛЬ'), null, { timeout: 30_000 });
}

/**
 * Answer every POST locally and return the list of captured requests.
 * Nothing reaches the production backend, so the tests are safe to run against the live site.
 */
export async function interceptPosts(page: Page, status = 200, body = '{}'): Promise<Request[]> {
  const seen: Request[] = [];
  await page.route('**/*', (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      seen.push(request);
      return route.fulfill({ status, contentType: 'application/json', body });
    }
    return route.continue();
  });
  return seen;
}
