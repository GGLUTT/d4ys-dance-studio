"""Contact form ("Зв'яжіться з нами").

Every POST is intercepted in the browser, so nothing is saved in the production
database and no message reaches the studio's Telegram. Safe to run against production.

Behaviour checked here was verified manually on the live site:
 * validation messages appear on an invalid form and nothing is sent;
 * a valid form makes two requests: Supabase `bookings` insert and `/api/telegram`;
 * on success the user sees "Повідомлення надіслано!";
 * on a backend error the user sees an error message and keeps the typed data.
"""
import pytest

pytestmark = [pytest.mark.ui]

OK_MESSAGE = "Повідомлення надіслано!"
ERROR_MESSAGE = "Не вдалося надіслати форму"

VALID = {
    "name": "Тест Тестович",
    "email": "qa@example.com",
    "phone": "+380501112233",
    "message": "Тестове повідомлення для перевірки форми",
}


def intercept_posts(page, status=200, body="{}"):
    """Answer every non-GET request locally and return the list of captured requests."""
    seen = []

    def handler(route, request):
        if request.method == "POST":
            seen.append(request)
            route.fulfill(status=status, content_type="application/json", body=body)
        else:
            route.continue_()

    page.route("**/*", handler)
    return seen


def fill_form(page, **overrides):
    data = {**VALID, **overrides}
    page.fill("input[name='name']", data["name"])
    page.fill("input[name='email']", data["email"])
    page.fill("input[name='phone']", data["phone"])
    page.fill("textarea[name='message']", data["message"])


def submit(page):
    page.get_by_role("button", name="НАДІСЛАТИ").click()
    page.wait_for_timeout(1500)


def test_form_has_all_fields(home):
    for sel in ("input[name='name']", "input[name='email']", "input[name='phone']", "textarea[name='message']"):
        assert home.locator(sel).count() == 1, f"field missing: {sel}"
    assert home.get_by_role("button", name="НАДІСЛАТИ").count() == 1


def test_message_counter_starts_at_zero(home):
    assert "0/500" in home.inner_text("body")


def test_message_counter_follows_typing(home):
    home.fill("textarea[name='message']", "1234567890")
    assert "10/500" in home.inner_text("body")


def test_empty_form_shows_all_validation_messages(home):
    seen = intercept_posts(home)
    submit(home)
    text = home.inner_text("body")
    assert "Ім'я повинно містити мінімум 2 символи" in text
    assert "Невірний формат email" in text
    assert "Телефон повинен містити мінімум 10 цифр" in text
    assert "Повідомлення повинно містити мінімум 10 символів" in text
    assert seen == [], "invalid form must not send anything"


@pytest.mark.parametrize(
    "field,bad_value",
    [
        ("name", "А"),
        ("email", "not-an-email"),
        ("phone", "12345"),
        ("message", "коротко"),
    ],
)
def test_single_invalid_field_blocks_sending(home, field, bad_value):
    seen = intercept_posts(home)
    fill_form(home, **{field: bad_value})
    submit(home)
    assert seen == [], f"form with invalid {field} must not be sent"
    assert OK_MESSAGE not in home.inner_text("body")


def test_valid_form_sends_booking_to_database(home):
    seen = intercept_posts(home)
    fill_form(home)
    submit(home)
    bookings = [r for r in seen if "/rest/v1/bookings" in r.url]
    assert len(bookings) == 1, "exactly one insert into `bookings` expected"
    payload = bookings[0].post_data_json
    assert payload["name"] == VALID["name"]
    assert payload["email"] == VALID["email"]
    assert payload["phone"] == VALID["phone"]
    assert payload["status"] == "pending"


def test_valid_form_notifies_telegram(home):
    seen = intercept_posts(home)
    fill_form(home)
    submit(home)
    tg = [r for r in seen if r.url.endswith("/api/telegram")]
    assert len(tg) == 1
    message = tg[0].post_data_json["message"]
    assert VALID["name"] in message and VALID["phone"] in message and VALID["email"] in message


def test_valid_form_shows_success_message(home):
    intercept_posts(home)
    fill_form(home)
    submit(home)
    assert OK_MESSAGE in home.inner_text("body")


def test_backend_error_shows_message_and_keeps_data(home):
    seen = intercept_posts(home, status=500, body='{"message":"fail"}')
    fill_form(home)
    submit(home)
    text = home.inner_text("body")
    assert ERROR_MESSAGE in text
    assert OK_MESSAGE not in text
    assert home.input_value("input[name='name']") == VALID["name"], "typed data must not be lost"
    assert not [r for r in seen if r.url.endswith("/api/telegram")], "no Telegram alert when saving failed"
