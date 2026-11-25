# DY4S Dance Studio: Playwright + C# tests

End-to-end and HTTP tests for my web project [DY4S Dance Studio](https://www.d4ys-bc.com) (React, TypeScript, Supabase),
written in **C# (.NET 8)** with **NUnit** and **Microsoft.Playwright**. The same scenarios also exist in Python (`../e2e-tests`) and TypeScript (`../e2e-tests-typescript`).

## What is covered

| File | What it checks |
|---|---|
| `Tests/ApiSmokeTests.cs` | home and `/cabinet` respond with 200, HTML, fast (HttpClient), title, SEO meta, `uk_UA` locale |
| `Tests/HomeTests.cs` | menu anchors, directions, coaches, 4 pricing plans and prices, 7 FAQ items, phone and map links |
| `Tests/ContactFormTests.cs` | validation messages, nothing is sent when invalid, valid form creates a `bookings` record and a Telegram alert (payloads checked with System.Text.Json), success message, backend error keeps the typed data |
| `Tests/CabinetTests.cs` | login / registration tabs, empty and wrong credentials show an error and keep the user logged out, registration form fields |
| `Tests/ResponsiveTests.cs` | no horizontal scroll on phone, tablet and laptop sizes |

`SiteTest.cs` is the shared base class (locale, viewport, screenshot on failure, `OpenHomeAsync`, `InterceptPostsAsync`).
All requests that would change data (contact form, login) are **intercepted** with `RouteAsync`, so nothing real is sent to the production backend.
Failed UI tests save a full-page screenshot to `artifacts/`.

## Run

```bash
dotnet build
pwsh bin/Debug/net8.0/playwright.ps1 install chromium     # once (needs PowerShell 7)

dotnet test                                    # everything
dotnet test --filter Category=smoke            # fast checks only
dotnet test --filter Category=api              # no browser
BASE_URL=http://localhost:3000 dotnet test     # run against a local build (Windows: set BASE_URL=...)
HEADED=1 dotnet test                           # watch the browser
```

CI: GitHub Actions workflow `.github/workflows/e2e-csharp.yml` runs the suite manually, on every change in this folder and weekly.
