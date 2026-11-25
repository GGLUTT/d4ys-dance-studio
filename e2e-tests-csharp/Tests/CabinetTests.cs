namespace Dy4s.E2E.Tests;

/// <summary>Personal cabinet (/cabinet). Auth requests are intercepted: no real account is used or created.</summary>
[TestFixture, Category("ui")]
public class CabinetTests : SiteTest
{
    [SetUp]
    public async Task OpenCabinet()
    {
        await Page.GotoAsync("/cabinet");
        await Page.GetByText("ОСОБИСТИЙ КАБІНЕТ").WaitForAsync(new LocatorWaitForOptions { Timeout = 30_000 });
    }

    [Test, Category("smoke")]
    public async Task Login_screen_elements()
    {
        await Expect(Page.GetByRole(AriaRole.Tab, new() { Name = "Вхід" })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Tab, new() { Name = "Реєстрація" })).ToBeVisibleAsync();
        await Expect(Page.Locator("input[type='email']")).ToBeVisibleAsync();
        await Expect(Page.Locator("input[type='password']")).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Увійти в кабінет" })).ToBeVisibleAsync();
        await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "Забули пароль?" })).ToBeVisibleAsync();
    }

    [Test]
    public async Task Login_tab_is_active_by_default()
    {
        await Expect(Page.GetByRole(AriaRole.Tab, new() { Name = "Вхід" })).ToHaveAttributeAsync("data-state", "active");
    }

    [Test]
    public async Task Password_field_is_masked()
    {
        await Expect(Page.Locator("input[type='password']")).ToHaveAttributeAsync("type", "password");
    }

    [Test]
    public async Task Empty_login_shows_message_and_sends_nothing()
    {
        var seen = await InterceptPostsAsync(Page, 400);
        await Page.GetByRole(AriaRole.Button, new() { Name = "Увійти в кабінет" }).ClickAsync();
        await Page.WaitForTimeoutAsync(800);

        Assert.That(await BodyTextAsync(Page), Does.Contain("Вкажіть email і пароль"));
        Assert.That(seen, Is.Empty);
    }

    [Test]
    public async Task Wrong_credentials_show_error_and_keep_user_on_login_form()
    {
        var seen = await InterceptPostsAsync(Page, 400, "{\"error\":\"invalid_grant\",\"msg\":\"Invalid login credentials\"}");
        await Page.FillAsync("input[type='email']", "nobody@example.com");
        await Page.FillAsync("input[type='password']", "wrong-password-123");
        await Page.GetByRole(AriaRole.Button, new() { Name = "Увійти в кабінет" }).ClickAsync();
        await Page.WaitForTimeoutAsync(1500);

        Assert.That(seen.Any(r => r.Url.Contains("/auth/v1/token")), Is.True, "login must call the auth endpoint");
        Assert.That(await BodyTextAsync(Page), Does.Contain("Невірний email або пароль"));
        Assert.That(Page.Url, Does.EndWith("/cabinet"));
        await Expect(Page.Locator("input[type='password']")).ToBeVisibleAsync();
    }

    [Test]
    public async Task Registration_tab_shows_registration_form()
    {
        await Page.GetByRole(AriaRole.Tab, new() { Name = "Реєстрація" }).ClickAsync();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Створити акаунт" }).WaitForAsync();

        await Expect(Page.GetByRole(AriaRole.Tab, new() { Name = "Реєстрація" })).ToHaveAttributeAsync("data-state", "active");
        var text = await BodyTextAsync(Page);
        foreach (var label in new[] { "НІКНЕЙМ", "EMAIL", "ПАРОЛЬ", "ПІДТВЕРДЖЕННЯ ПАРОЛЮ" })
            Assert.That(text, Does.Contain(label), $"registration field missing: {label}");
        await Expect(Page.Locator("input[type='password']")).ToHaveCountAsync(2);
    }

    [Test]
    public async Task Can_switch_back_to_login()
    {
        await Page.GetByRole(AriaRole.Tab, new() { Name = "Реєстрація" }).ClickAsync();
        await Page.GetByRole(AriaRole.Tab, new() { Name = "Вхід" }).ClickAsync();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Увійти в кабінет" }).WaitForAsync();

        await Expect(Page.Locator("input[type='password']")).ToHaveCountAsync(1);
    }
}
