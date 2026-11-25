namespace Dy4s.E2E.Tests;

/// <summary>
/// Contact form ("Зв'яжіться з нами"). Every POST is intercepted in the browser: nothing is saved in the
/// production database and no message reaches the studio's Telegram.
/// </summary>
[TestFixture, Category("ui")]
public class ContactFormTests : SiteTest
{
    private const string OkMessage = "Повідомлення надіслано!";
    private const string ErrorMessage = "Не вдалося надіслати форму";

    private record FormData(string Name, string Email, string Phone, string Message);

    private static readonly FormData Valid = new(
        "Тест Тестович", "qa@example.com", "+380501112233", "Тестове повідомлення для перевірки форми");

    [SetUp]
    public async Task OpenHome() => await OpenHomeAsync(Page);

    private async Task FillFormAsync(FormData data)
    {
        await Page.FillAsync("input[name='name']", data.Name);
        await Page.FillAsync("input[name='email']", data.Email);
        await Page.FillAsync("input[name='phone']", data.Phone);
        await Page.FillAsync("textarea[name='message']", data.Message);
    }

    private async Task SubmitAsync()
    {
        await Page.GetByRole(AriaRole.Button, new() { Name = "НАДІСЛАТИ" }).ClickAsync();
        await Page.WaitForTimeoutAsync(1500);
    }

    [Test]
    public async Task Has_all_fields()
    {
        foreach (var selector in new[] { "input[name='name']", "input[name='email']", "input[name='phone']", "textarea[name='message']" })
            await Expect(Page.Locator(selector)).ToHaveCountAsync(1);
        await Expect(Page.GetByRole(AriaRole.Button, new() { Name = "НАДІСЛАТИ" })).ToHaveCountAsync(1);
    }

    [Test]
    public async Task Message_counter_starts_at_zero()
    {
        Assert.That(await BodyTextAsync(Page), Does.Contain("0/500"));
    }

    [Test]
    public async Task Message_counter_follows_typing()
    {
        await Page.FillAsync("textarea[name='message']", "1234567890");
        Assert.That(await BodyTextAsync(Page), Does.Contain("10/500"));
    }

    [Test]
    public async Task Empty_form_shows_all_validation_messages_and_sends_nothing()
    {
        var seen = await InterceptPostsAsync(Page);
        await SubmitAsync();

        var text = await BodyTextAsync(Page);
        Assert.That(text, Does.Contain("Ім'я повинно містити мінімум 2 символи"));
        Assert.That(text, Does.Contain("Невірний формат email"));
        Assert.That(text, Does.Contain("Телефон повинен містити мінімум 10 цифр"));
        Assert.That(text, Does.Contain("Повідомлення повинно містити мінімум 10 символів"));
        Assert.That(seen, Is.Empty);
    }

    [TestCase("name", "А")]
    [TestCase("email", "not-an-email")]
    [TestCase("phone", "12345")]
    [TestCase("message", "коротко")]
    public async Task Single_invalid_field_blocks_sending(string field, string badValue)
    {
        var seen = await InterceptPostsAsync(Page);
        var data = field switch
        {
            "name" => Valid with { Name = badValue },
            "email" => Valid with { Email = badValue },
            "phone" => Valid with { Phone = badValue },
            _ => Valid with { Message = badValue },
        };
        await FillFormAsync(data);
        await SubmitAsync();

        Assert.That(seen, Is.Empty, $"form with invalid {field} must not be sent");
        Assert.That(await BodyTextAsync(Page), Does.Not.Contain(OkMessage));
    }

    [Test]
    public async Task Valid_form_sends_booking_to_database()
    {
        var seen = await InterceptPostsAsync(Page);
        await FillFormAsync(Valid);
        await SubmitAsync();

        var bookings = seen.Where(r => r.Url.Contains("/rest/v1/bookings")).ToList();
        Assert.That(bookings, Has.Count.EqualTo(1), "exactly one insert into `bookings` expected");
        var payload = JsonBody(bookings[0]);
        Assert.That(payload.GetProperty("name").GetString(), Is.EqualTo(Valid.Name));
        Assert.That(payload.GetProperty("email").GetString(), Is.EqualTo(Valid.Email));
        Assert.That(payload.GetProperty("phone").GetString(), Is.EqualTo(Valid.Phone));
        Assert.That(payload.GetProperty("status").GetString(), Is.EqualTo("pending"));
    }

    [Test]
    public async Task Valid_form_notifies_telegram()
    {
        var seen = await InterceptPostsAsync(Page);
        await FillFormAsync(Valid);
        await SubmitAsync();

        var telegram = seen.Where(r => r.Url.EndsWith("/api/telegram")).ToList();
        Assert.That(telegram, Has.Count.EqualTo(1));
        var message = JsonBody(telegram[0]).GetProperty("message").GetString();
        Assert.That(message, Does.Contain(Valid.Name));
        Assert.That(message, Does.Contain(Valid.Phone));
        Assert.That(message, Does.Contain(Valid.Email));
    }

    [Test]
    public async Task Valid_form_shows_success_message()
    {
        await InterceptPostsAsync(Page);
        await FillFormAsync(Valid);
        await SubmitAsync();

        Assert.That(await BodyTextAsync(Page), Does.Contain(OkMessage));
    }

    [Test]
    public async Task Backend_error_shows_message_and_keeps_typed_data()
    {
        var seen = await InterceptPostsAsync(Page, 500, "{\"message\":\"fail\"}");
        await FillFormAsync(Valid);
        await SubmitAsync();

        var text = await BodyTextAsync(Page);
        Assert.That(text, Does.Contain(ErrorMessage));
        Assert.That(text, Does.Not.Contain(OkMessage));
        Assert.That(await Page.InputValueAsync("input[name='name']"), Is.EqualTo(Valid.Name), "typed data must not be lost");
        Assert.That(seen.Where(r => r.Url.EndsWith("/api/telegram")), Is.Empty, "no Telegram alert when saving failed");
    }
}
