"""Home page: navigation, directions, team, pricing, FAQ."""
import pytest

pytestmark = [pytest.mark.ui]

NAV = {"НАПРЯМКИ": "#directions", "КОМАНДА": "#team", "ГОЛОВНА": "#home"}


@pytest.mark.smoke
def test_home_renders_key_blocks(home):
    text = home.inner_text("body")
    for block in ("ОБЕРИ СВІЙ СТИЛЬ", "ОБЕРИ СВІЙ ПЛАН", "ЧАСТІ ПИТАННЯ", "ЗВ'ЯЖІТЬСЯ З НАМИ"):
        assert block in text, f"missing block: {block}"


@pytest.mark.smoke
def test_title_contains_studio_name(home):
    assert "D4YS" in home.title()


@pytest.mark.parametrize("label,anchor", NAV.items())
def test_menu_links_point_to_sections(home, label, anchor):
    link = home.locator("a", has_text=label).first
    assert link.get_attribute("href") == anchor


def test_cabinet_link_leads_to_login(home):
    home.locator("a[href='/cabinet']").first.click()
    home.wait_for_url("**/cabinet")
    home.get_by_text("ОСОБИСТИЙ КАБІНЕТ").wait_for()


def test_two_dance_directions_are_shown(home):
    text = home.inner_text("body")
    assert "ХОРЕО" in text and "JAZZFUNK" in text


def test_two_coaches_are_shown(home):
    text = home.inner_text("body")
    assert "НАДІЯ" in text and "ВЕРОНІКА" in text


def test_pricing_has_four_plans_with_prices(home):
    text = home.inner_text("body")
    for price in ("150грн", "200грн", "1200грн/міс", "2000грн/міс"):
        assert price in text, f"price not found: {price}"
    assert home.get_by_role("button", name="ОБРАТИ").count() == 4


def test_popular_plan_is_marked(home):
    assert "ПОПУЛЯРНИЙ" in home.inner_text("body")


def test_faq_has_seven_questions(home):
    questions = home.locator("button", has_text="?")
    assert questions.count() == 7


def test_faq_question_opens_answer(home):
    q = home.get_by_role("button", name="Як записатися на пробне заняття?")
    before = len(home.inner_text("body"))
    q.click()
    home.wait_for_timeout(800)  # accordion animation
    assert len(home.inner_text("body")) > before, "answer text should appear after the click"


def test_phone_link_is_valid(home):
    tel = home.locator("a[href^='tel:']").first.get_attribute("href")
    assert tel == "tel:+380684649487"


def test_map_link_opens_google_maps(home):
    href = home.locator("a", has_text="ВІДКРИТИ НА МАПІ").get_attribute("href")
    assert href.startswith("https://www.google.com/maps/")
