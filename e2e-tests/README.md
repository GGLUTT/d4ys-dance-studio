# DY4S Dance Studio: automated tests

Automated tests for my web project [DY4S Dance Studio](https://www.d4ys-bc.com) (React, TypeScript, Supabase).
Written in Python with **Pytest** and **Playwright**; `requests` is used for HTTP-level checks.

## What is covered

| File | What it checks |
|---|---|
| `test_api_smoke.py` | home and `/cabinet` respond with 200, HTML, fast, SEO meta, `lang="uk"` |
| `test_home_ui.py` | menu anchors, directions, coaches, 4 pricing plans and prices, 7 FAQ items, phone and map links |
| `test_contact_form.py` | field validation messages, nothing is sent when invalid, valid form creates a `bookings` record and a Telegram alert (payload checked), success message, backend error keeps the typed data |
| `test_cabinet.py` | login / registration tabs, empty and wrong credentials show an error and keep the user logged out, registration form fields |
| `test_responsive.py` | no horizontal scroll on phone, tablet and laptop sizes |

All requests that would change data (contact form, login) are **intercepted**, so nothing real is sent
to the production backend. Failed UI tests save a full-page screenshot to `artifacts/`.

## Run

```bash
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium

pytest                      # everything
pytest -m smoke             # fast checks only
pytest -m api               # no browser
HEADED=1 pytest tests/test_cabinet.py     # watch the browser (Windows: set HEADED=1)
BASE_URL=http://localhost:3000 pytest     # run against a local build
```

CI: GitHub Actions runs the suite on every push and every Monday (`.github/workflows/tests.yml`).

## Notes

* Expected behaviour (validation messages, requests sent by the form, auth errors) was checked by hand on the live site before writing the tests.
* Selectors are based on visible UI texts, roles and form field names, so if a label changes the matching test should be updated.
* This is a smoke and regression suite for the public part of the site. Booking inside the logged-in cabinet needs a test account and is the next step.
