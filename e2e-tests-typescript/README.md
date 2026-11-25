# DY4S Dance Studio: Playwright + TypeScript tests

End-to-end and HTTP tests for my web project [DY4S Dance Studio](https://www.d4ys-bc.com) (React, TypeScript, Supabase),
written with **Playwright Test** and **TypeScript**. The same scenarios also exist in Python (`../e2e-tests`) and C# (`../e2e-tests-csharp`).

## What is covered

| File | What it checks |
|---|---|
| `tests/api-smoke.spec.ts` | home and `/cabinet` respond with 200, HTML, fast, title, SEO meta, `uk_UA` locale |
| `tests/home.spec.ts` | menu anchors, directions, coaches, 4 pricing plans and prices, 7 FAQ items, phone and map links |
| `tests/contact-form.spec.ts` | validation messages, nothing is sent when invalid, valid form creates a `bookings` record and a Telegram alert (payloads checked), success message, backend error keeps the typed data |
| `tests/cabinet.spec.ts` | login / registration tabs, empty and wrong credentials show an error and keep the user logged out, registration form fields |
| `tests/responsive.spec.ts` | no horizontal scroll on phone, tablet and laptop sizes |

All requests that would change data (contact form, login) are **intercepted** with `page.route`, so nothing real is sent to the production backend.
Failed tests keep a screenshot and a trace in `test-results/`.

## Run

```bash
npm install
npx playwright install chromium

npm test                  # everything
npm run test:smoke        # fast checks only
npm run test:headed       # watch the browser
BASE_URL=http://localhost:3000 npm test    # run against a local build (Windows: set BASE_URL=...)
npm run report            # open the HTML report
```

CI: GitHub Actions workflow `.github/workflows/e2e-typescript.yml` runs the suite manually, on every change in this folder and weekly.
