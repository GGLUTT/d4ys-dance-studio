"""Shared fixtures: one browser per session, a fresh page per test.

BASE_URL      site under test (default: production site of the studio)
CHROME_PATH   optional path to a local Chrome/Chromium; otherwise Playwright's own
HEADED=1      show the browser window
"""
import os
from pathlib import Path

import pytest
from playwright.sync_api import sync_playwright

BASE_URL = os.getenv("BASE_URL", "https://www.d4ys-bc.com").rstrip("/")
ARTIFACTS = Path(__file__).resolve().parent.parent / "artifacts"


@pytest.fixture(scope="session")
def base_url() -> str:
    return BASE_URL


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        kwargs = {"headless": os.getenv("HEADED") != "1"}
        if os.getenv("CHROME_PATH"):
            kwargs["executable_path"] = os.environ["CHROME_PATH"]
        b = p.chromium.launch(**kwargs)
        yield b
        b.close()


@pytest.fixture
def context(browser):
    ctx = browser.new_context(viewport={"width": 1366, "height": 800}, locale="uk-UA")
    yield ctx
    ctx.close()


@pytest.fixture
def page(context, request):
    pg = context.new_page()
    pg.set_default_timeout(15_000)
    yield pg
    # keep a screenshot of every failed UI test, so a failure is easy to understand
    rep = getattr(request.node, "rep_call", None)
    if rep is not None and rep.failed:
        ARTIFACTS.mkdir(exist_ok=True)
        pg.screenshot(path=str(ARTIFACTS / f"{request.node.name}.png"), full_page=True)


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    setattr(item, f"rep_{outcome.get_result().when}", outcome.get_result())


def open_home(page, base_url: str):
    """Open the home page and wait until the preloader is gone and content is rendered."""
    page.goto(base_url + "/")
    page.wait_for_function(
        "document.body.innerText.includes('ОБЕРИ СВІЙ СТИЛЬ')", timeout=30_000
    )


@pytest.fixture
def home(page, base_url):
    open_home(page, base_url)
    return page
