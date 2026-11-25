"""Layout sanity on common screen sizes."""
import pytest

from conftest import open_home

pytestmark = [pytest.mark.ui]

SIZES = {
    "iphone-se": (375, 667),
    "pixel-7": (412, 915),
    "ipad": (768, 1024),
    "laptop": (1366, 768),
}


@pytest.mark.parametrize("name,size", SIZES.items())
def test_no_horizontal_scroll(browser, base_url, name, size):
    ctx = browser.new_context(viewport={"width": size[0], "height": size[1]}, locale="uk-UA")
    page = ctx.new_page()
    try:
        open_home(page, base_url)
        overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        assert overflow <= 1, f"{name}: page is {overflow}px wider than the screen"
    finally:
        ctx.close()


def test_mobile_booking_cta_is_visible(browser, base_url):
    ctx = browser.new_context(viewport={"width": 375, "height": 667}, locale="uk-UA")
    page = ctx.new_page()
    try:
        open_home(page, base_url)
        hrefs = page.eval_on_selector_all(
            "a", "els => els.filter(a => a.innerText.trim() === 'ЗАПИСАТИСЯ').map(a => a.getAttribute('href'))"
        )
        assert hrefs and all(h == "#contact" for h in hrefs), "booking buttons must lead to the contact form"
    finally:
        ctx.close()
