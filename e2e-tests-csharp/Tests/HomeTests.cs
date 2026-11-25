namespace Dy4s.E2E.Tests;

[TestFixture, Category("ui")]
public class HomeTests : SiteTest
{
    [SetUp]
    public async Task OpenHome() => await OpenHomeAsync(Page);

    [Test, Category("smoke")]
    public async Task Renders_key_blocks()
    {
        var text = await BodyTextAsync(Page);
        foreach (var block in new[] { "ОБЕРИ СВІЙ СТИЛЬ", "ОБЕРИ СВІЙ ПЛАН", "ЧАСТІ ПИТАННЯ", "ЗВ'ЯЖІТЬСЯ З НАМИ" })
            Assert.That(text, Does.Contain(block), $"missing block: {block}");
    }

    [Test, Category("smoke")]
    public async Task Title_contains_studio_name()
    {
        Assert.That(await Page.TitleAsync(), Does.Contain("D4YS"));
    }

    [TestCase("НАПРЯМКИ", "#directions")]
    [TestCase("КОМАНДА", "#team")]
    [TestCase("ГОЛОВНА", "#home")]
    public async Task Menu_links_point_to_sections(string label, string anchor)
    {
        var href = await Page.Locator("a", new PageLocatorOptions { HasTextString = label }).First.GetAttributeAsync("href");
        Assert.That(href, Is.EqualTo(anchor));
    }

    [Test]
    public async Task Cabinet_link_leads_to_login_screen()
    {
        await Page.Locator("a[href='/cabinet']").First.ClickAsync();
        await Page.WaitForURLAsync("**/cabinet");
        await Expect(Page.GetByText("ОСОБИСТИЙ КАБІНЕТ")).ToBeVisibleAsync();
    }

    [Test]
    public async Task Two_dance_directions_are_shown()
    {
        var text = await BodyTextAsync(Page);
        Assert.That(text, Does.Contain("ХОРЕО"));
        Assert.That(text, Does.Contain("JAZZFUNK"));
    }

    [Test]
    public async Task Two_coaches_are_shown()
    {
        var text = await BodyTextAsync(Page);
        Assert.That(text, Does.Contain("НАДІЯ"));
        Assert.That(text, Does.Contain("ВЕРОНІКА"));
    }

    [Test]
    public async Task Pricing_has_four_plans_with_prices()
    {
        var text = await BodyTextAsync(Page);
        foreach (var price in new[] { "150грн", "200грн", "1200грн/міс", "2000грн/міс" })
            Assert.That(text, Does.Contain(price), $"price not found: {price}");
        await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "ОБРАТИ" })).ToHaveCountAsync(4);
    }

    [Test]
    public async Task Popular_plan_is_marked()
    {
        Assert.That(await BodyTextAsync(Page), Does.Contain("ПОПУЛЯРНИЙ"));
    }

    [Test]
    public async Task Faq_has_seven_questions()
    {
        await Expect(Page.Locator("button", new PageLocatorOptions { HasTextString = "?" })).ToHaveCountAsync(7);
    }

    [Test]
    public async Task Faq_question_opens_its_answer()
    {
        var before = (await BodyTextAsync(Page)).Length;
        await Page.GetByRole(AriaRole.Button, new() { Name = "Як записатися на пробне заняття?" }).ClickAsync();
        await Page.WaitForTimeoutAsync(800); // accordion animation
        Assert.That((await BodyTextAsync(Page)).Length, Is.GreaterThan(before), "answer text should appear after the click");
    }

    [Test]
    public async Task Phone_link_is_valid()
    {
        var tel = await Page.Locator("a[href^='tel:']").First.GetAttributeAsync("href");
        Assert.That(tel, Is.EqualTo("tel:+380684649487"));
    }

    [Test]
    public async Task Map_link_opens_google_maps()
    {
        var href = await Page.Locator("a", new PageLocatorOptions { HasTextString = "ВІДКРИТИ НА МАПІ" }).GetAttributeAsync("href");
        Assert.That(href, Does.StartWith("https://www.google.com/maps/"));
    }
}
