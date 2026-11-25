"""Personal cabinet (/cabinet): login and registration screen.

Auth requests (Supabase `/auth/v1/...`) are intercepted, no real account is used or created.
The tabs are Radix UI tabs (role="tab"), they react to mouse down, which Playwright's click does.
"""
import pytest

pytestmark = [pytest.mark.ui]


@pytest.fixture
def cabinet(page, base_url):
    page.goto(base_url + "/cabinet")
    page.get_by_text("ОСОБИСТИЙ КАБІНЕТ").wait_for(timeout=30_000)
    return page


def intercept_posts(page, status=400, body='{"error":"invalid_grant","msg":"Invalid login credentials"}'):
    seen = []

    def handler(route, request):
        if request.method == "POST":
            seen.append(request)
            route.fulfill(status=status, content_type="application/json", body=body)
        else:
            route.continue_()

    page.route("**/*", handler)
    return seen


@pytest.mark.smoke
def test_login_screen_elements(cabinet):
    assert cabinet.get_by_role("tab", name="Вхід").is_visible()
    assert cabinet.get_by_role("tab", name="Реєстрація").is_visible()
    assert cabinet.locator("input[type='email']").is_visible()
    assert cabinet.locator("input[type='password']").is_visible()
    assert cabinet.get_by_role("button", name="Увійти в кабінет").is_visible()
    assert cabinet.get_by_role("button", name="Забули пароль?").is_visible()


def test_login_tab_is_active_by_default(cabinet):
    assert cabinet.get_by_role("tab", name="Вхід").get_attribute("data-state") == "active"


def test_password_field_is_masked(cabinet):
    assert cabinet.locator("input[type='password']").get_attribute("type") == "password"


def test_empty_login_shows_message_and_sends_nothing(cabinet):
    seen = intercept_posts(cabinet)
    cabinet.get_by_role("button", name="Увійти в кабінет").click()
    cabinet.wait_for_timeout(800)
    assert "Вкажіть email і пароль" in cabinet.inner_text("body")
    assert seen == []


def test_wrong_credentials_show_error_and_keep_user_on_login(cabinet):
    seen = intercept_posts(cabinet)
    cabinet.fill("input[type='email']", "nobody@example.com")
    cabinet.fill("input[type='password']", "wrong-password-123")
    cabinet.get_by_role("button", name="Увійти в кабінет").click()
    cabinet.wait_for_timeout(1500)
    assert [r for r in seen if "/auth/v1/token" in r.url], "login must call the auth endpoint"
    assert "Невірний email або пароль" in cabinet.inner_text("body")
    assert cabinet.url.endswith("/cabinet")
    assert cabinet.locator("input[type='password']").is_visible()


def test_registration_tab_shows_registration_form(cabinet):
    cabinet.get_by_role("tab", name="Реєстрація").click()
    cabinet.get_by_role("button", name="Створити акаунт").wait_for()
    assert cabinet.get_by_role("tab", name="Реєстрація").get_attribute("data-state") == "active"
    text = cabinet.inner_text("body")
    for label in ("НІКНЕЙМ", "EMAIL", "ПАРОЛЬ", "ПІДТВЕРДЖЕННЯ ПАРОЛЮ"):
        assert label in text, f"registration field missing: {label}"
    assert cabinet.locator("input[type='password']").count() == 2


def test_can_switch_back_to_login(cabinet):
    cabinet.get_by_role("tab", name="Реєстрація").click()
    cabinet.get_by_role("tab", name="Вхід").click()
    cabinet.get_by_role("button", name="Увійти в кабінет").wait_for()
    assert cabinet.locator("input[type='password']").count() == 1
