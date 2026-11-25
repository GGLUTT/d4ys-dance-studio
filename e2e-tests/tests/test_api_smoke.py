"""HTTP-level checks, no browser needed."""
import re

import pytest
import requests

pytestmark = [pytest.mark.api, pytest.mark.smoke]


@pytest.fixture(scope="module")
def response(base_url):
    return requests.get(base_url + "/", timeout=15)


def test_home_returns_200(response):
    assert response.status_code == 200


def test_home_is_html(response):
    assert "text/html" in response.headers.get("content-type", "")


def test_home_responds_fast(response):
    # generous limit: this is a smoke check, not a load test
    assert response.elapsed.total_seconds() < 5


def test_title_and_language(response):
    html = response.text
    assert "D4YS" in re.search(r"<title>(.*?)</title>", html, re.S).group(1)
    assert "uk_UA" in html, "og:locale should declare Ukrainian"


def test_seo_meta_present(response):
    html = response.text
    assert 'name="description"' in html
    assert 'rel="canonical"' in html


def test_cabinet_route_is_served(base_url):
    # SPA route must not 404 when opened directly
    r = requests.get(base_url + "/cabinet", timeout=15)
    assert r.status_code == 200
