namespace Dy4s.E2E.Tests;

/// <summary>Layout sanity on common screen sizes.</summary>
[TestFixture, Category("ui")]
public class ResponsiveTests : SiteTest
{
    private async Task<IPage> NewPageAsync(int width, int height)
    {
        var context = await Browser.NewContextAsync(new BrowserNewContextOptions
        {
            Locale = "uk-UA",
            BaseURL = Env.BaseUrl,
            ViewportSize = new ViewportSize { Width = width, Height = height },
        });
        var page = await context.NewPageAsync();
        page.SetDefaultTimeout(15_000);
        return page;
    }

    [TestCase("iphone-se", 375, 667)]
    [TestCase("pixel-7", 412, 915)]
    [TestCase("ipad", 768, 1024)]
    [TestCase("laptop", 1366, 768)]
    public async Task No_horizontal_scroll(string name, int width, int height)
    {
        var page = await NewPageAsync(width, height);
        try
        {
            await OpenHomeAsync(page);
            var overflow = await page.EvaluateAsync<int>("document.documentElement.scrollWidth - window.innerWidth");
            Assert.That(overflow, Is.LessThanOrEqualTo(1), $"{name}: page is {overflow}px wider than the screen");
        }
        finally
        {
            await page.Context.CloseAsync();
        }
    }

    [Test]
    public async Task Mobile_booking_buttons_lead_to_contact_form()
    {
        var page = await NewPageAsync(375, 667);
        try
        {
            await OpenHomeAsync(page);
            var hrefs = await page.EvaluateAsync<string[]>(
                "Array.from(document.querySelectorAll('a')).filter(a => a.innerText.trim() === 'ЗАПИСАТИСЯ').map(a => a.getAttribute('href'))");
            Assert.That(hrefs, Is.Not.Empty);
            Assert.That(hrefs, Is.All.EqualTo("#contact"), "booking buttons must lead to the contact form");
        }
        finally
        {
            await page.Context.CloseAsync();
        }
    }
}
