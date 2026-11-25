using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Dy4s.E2E.Tests;

/// <summary>HTTP-level checks, no browser needed.</summary>
[TestFixture, Category("smoke"), Category("api")]
public class ApiSmokeTests
{
    private static readonly HttpClient Http = new() { BaseAddress = new Uri(Env.BaseUrl + "/"), Timeout = TimeSpan.FromSeconds(15) };

    [Test]
    public async Task Home_returns_200_and_html_quickly()
    {
        var watch = Stopwatch.StartNew();
        using var response = await Http.GetAsync("");
        watch.Stop();

        Assert.That((int)response.StatusCode, Is.EqualTo(200));
        Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("text/html"));
        Assert.That(watch.Elapsed.TotalSeconds, Is.LessThan(5), "generous limit: smoke check, not a load test");
    }

    [Test]
    public async Task Title_language_and_seo_meta_are_present()
    {
        var html = await Http.GetStringAsync("");
        var title = Regex.Match(html, "<title>(.*?)</title>", RegexOptions.Singleline).Groups[1].Value;

        Assert.That(title, Does.Contain("D4YS"));
        Assert.That(html, Does.Contain("uk_UA"));
        Assert.That(html, Does.Contain("name=\"description\""));
        Assert.That(html, Does.Contain("rel=\"canonical\""));
    }

    [Test]
    public async Task Cabinet_route_is_served_when_opened_directly()
    {
        using var response = await Http.GetAsync("cabinet");
        Assert.That((int)response.StatusCode, Is.EqualTo(200));
    }
}
