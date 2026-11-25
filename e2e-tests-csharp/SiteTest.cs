using System.Text.Json;

namespace Dy4s.E2E;

/// <summary>
/// Base class for browser tests: a fresh page per test, Ukrainian locale, a screenshot on failure,
/// and helpers to open the home page and to intercept POST requests.
/// </summary>
public abstract class SiteTest : PageTest
{
    public override BrowserNewContextOptions ContextOptions() => new()
    {
        Locale = "uk-UA",
        BaseURL = Env.BaseUrl,
        ViewportSize = new ViewportSize { Width = 1366, Height = 800 },
    };

    [SetUp]
    public void SetTimeouts()
    {
        Page.SetDefaultTimeout(15_000);
        Assertions.SetDefaultExpectTimeout(15_000);
    }

    [TearDown]
    public async Task ScreenshotOnFailure()
    {
        if (TestContext.CurrentContext.Result.Outcome.Status != NUnit.Framework.Interfaces.TestStatus.Failed) return;
        Directory.CreateDirectory("artifacts");
        var name = string.Concat(TestContext.CurrentContext.Test.Name.Select(c => char.IsLetterOrDigit(c) ? c : '_'));
        await Page.ScreenshotAsync(new PageScreenshotOptions { Path = $"artifacts/{name}.png", FullPage = true });
    }

    protected static async Task OpenHomeAsync(IPage page)
    {
        await page.GotoAsync("/");
        await page.WaitForFunctionAsync(
            "document.body.innerText.includes('ОБЕРИ СВІЙ СТИЛЬ')", null, new PageWaitForFunctionOptions { Timeout = 30_000 });
    }

    /// <summary>Answer every POST locally and return the captured requests. Nothing reaches production.</summary>
    protected static async Task<List<IRequest>> InterceptPostsAsync(IPage page, int status = 200, string body = "{}")
    {
        var seen = new List<IRequest>();
        await page.RouteAsync("**/*", async route =>
        {
            if (route.Request.Method == "POST")
            {
                seen.Add(route.Request);
                await route.FulfillAsync(new RouteFulfillOptions { Status = status, ContentType = "application/json", Body = body });
            }
            else
            {
                await route.ContinueAsync();
            }
        });
        return seen;
    }

    protected static JsonElement JsonBody(IRequest request) => JsonDocument.Parse(request.PostData ?? "{}").RootElement;

    protected static async Task<string> BodyTextAsync(IPage page) => await page.InnerTextAsync("body");
}
