"""
Auto-submit keptlocal.com to tool directories using Playwright.

Each directory is submitted only once — submissions are tracked in
marketing/submitted-directories.json in the GitHub repo.
"""
from __future__ import annotations

import asyncio
import base64
import datetime
import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from playwright.async_api import Page, async_playwright

from config import KNOWN_DIRECTORIES, SITE_DESCRIPTION

SITE_URL = "https://keptlocal.com"
SITE_NAME = "keptlocal"
SITE_TAGLINE = "Free PDF & image tools — files never leave your browser"
CONTACT_EMAIL = os.environ.get("SUBMISSION_EMAIL", "hitendra.patel2986@gmail.com")

SCREENSHOT_DIR = Path("marketing/screenshots") / datetime.date.today().isoformat()
_TRACKING_PATH = "marketing/submitted-directories.json"

_FIELD_SELECTORS: dict[str, list[str]] = {
    "url": [
        'input[name="url"]', 'input[name="website"]', 'input[name="link"]',
        'input[type="url"]', 'input[placeholder*="url" i]',
        'input[placeholder*="website" i]', 'input[placeholder*="link" i]',
        'input[placeholder*="http" i]',
    ],
    "name": [
        'input[name="name"]', 'input[name="title"]', 'input[name="product_name"]',
        'input[name="tool_name"]', 'input[placeholder*="name" i]',
        'input[placeholder*="product" i]', 'input[placeholder*="tool" i]',
    ],
    "tagline": [
        'input[name="tagline"]', 'input[name="short_description"]',
        'input[name="headline"]', 'input[name="subtitle"]',
        'input[placeholder*="tagline" i]', 'input[placeholder*="short" i]',
        'input[placeholder*="headline" i]', 'input[placeholder*="one line" i]',
    ],
    "description": [
        'textarea[name="description"]', 'textarea[name="about"]',
        'textarea[name="details"]', 'textarea',
        'input[name="description"]', '[contenteditable="true"]',
    ],
    "email": [
        'input[type="email"]', 'input[name="email"]',
        'input[placeholder*="email" i]',
    ],
    "category": [
        'select[name="category"]', 'select[name="type"]',
        'input[name="category"]', 'input[placeholder*="category" i]',
    ],
}


async def find_and_submit_directories(
    github_token: str | None = None,
    github_repo: str | None = None,
) -> str:
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

    submitted = _load_submitted(github_token, github_repo)
    results: list[str] = []
    newly_submitted: list[str] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
            ignore_https_errors=True,
        )
        page = await context.new_page()

        for directory in KNOWN_DIRECTORIES:
            name = directory["name"]

            if name in submitted:
                results.append(f"**{name}** — Already submitted on {submitted[name]}, skipping")
                continue

            handler = _HANDLERS.get(name)
            if not handler:
                results.append(f"**{name}** — No handler yet. Submit manually: {directory['submit_url']}")
                continue

            try:
                status = await handler(page, directory)
                results.append(f"**{name}** — {status}")
                if "Submitted" in status:
                    newly_submitted.append(name)
                    submitted[name] = datetime.date.today().isoformat()
            except Exception as e:
                await _screenshot(page, f"{name.lower().replace(' ', '-')}-error")
                results.append(f"**{name}** — Error: {e}. Submit manually: {directory['submit_url']}")

        await browser.close()

    if newly_submitted and github_token and github_repo:
        _save_submitted(github_token, github_repo, submitted)

    return "\n".join(results)


# ── Per-directory handlers ─────────────────────────────────────────────────────

async def _submit_tinytools(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)
    if not await _has_form(page):
        await _screenshot(page, "tinytools-page")
        return f"Login required or page changed — submit manually: {directory['submit_url']}"
    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)
    await _screenshot(page, "tinytools-filled")
    submitted = await _submit(page)
    await _screenshot(page, "tinytools-submitted")
    return "Submitted" if submitted else f"Submit button not found — submit manually: {directory['submit_url']}"


async def _submit_uneed(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)
    if not await _has_form(page):
        await _screenshot(page, "uneed-page")
        return f"Login required or page changed — submit manually: {directory['submit_url']}"
    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)
    await _screenshot(page, "uneed-filled")
    submitted = await _submit(page)
    await _screenshot(page, "uneed-submitted")
    return "Submitted" if submitted else f"Submit button not found — submit manually: {directory['submit_url']}"


async def _submit_fazier(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)
    if not await _has_form(page):
        await _screenshot(page, "fazier-page")
        return f"Login required — submit manually: {directory['submit_url']}"
    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)
    await _screenshot(page, "fazier-filled")
    submitted = await _submit(page)
    await _screenshot(page, "fazier-submitted")
    return "Submitted" if submitted else f"Submit button not found — submit manually: {directory['submit_url']}"


async def _submit_saashub(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)
    if not await _has_form(page):
        await _screenshot(page, "saashub-page")
        return f"Login required or page changed — submit manually: {directory['submit_url']}"
    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)
    await _screenshot(page, "saashub-filled")
    submitted = await _submit(page)
    await _screenshot(page, "saashub-submitted")
    return "Submitted" if submitted else f"Submit button not found — submit manually: {directory['submit_url']}"


async def _submit_prototypr(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)
    if not await _has_form(page):
        await _screenshot(page, "prototypr-page")
        return f"Login required — submit manually: {directory['submit_url']}"
    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)
    await _screenshot(page, "prototypr-filled")
    submitted = await _submit(page)
    await _screenshot(page, "prototypr-submitted")
    return "Submitted" if submitted else f"Submit button not found — submit manually: {directory['submit_url']}"


_HANDLERS: dict[str, Any] = {
    "Tinytools.directory": _submit_tinytools,
    "Uneed": _submit_uneed,
    "Fazier": _submit_fazier,
    "SaaSHub": _submit_saashub,
    "Prototypr": _submit_prototypr,
}


# ── Submission tracking ────────────────────────────────────────────────────────

def _load_submitted(github_token: str | None, github_repo: str | None) -> dict[str, str]:
    if not github_token or not github_repo:
        return {}
    url = f"https://api.github.com/repos/{github_repo}/contents/{_TRACKING_PATH}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            content = base64.b64decode(data["content"]).decode()
            return json.loads(content)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return {}
        raise


def _save_submitted(github_token: str, github_repo: str, submitted: dict[str, str]) -> None:
    url = f"https://api.github.com/repos/{github_repo}/contents/{_TRACKING_PATH}"
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    content = base64.b64encode(json.dumps(submitted, indent=2).encode()).decode()

    sha = None
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            sha = json.loads(resp.read()).get("sha")
    except urllib.error.HTTPError as e:
        if e.code != 404:
            raise

    body: dict = {"message": "chore: update submitted-directories tracking", "content": content}
    if sha:
        body["sha"] = sha

    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method="PUT")
    with urllib.request.urlopen(req) as resp:
        resp.read()


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _has_form(page: Page) -> bool:
    """Return True if the page has at least one visible text/url/email input or textarea."""
    for selector in ['input[type="url"]', 'input[type="text"]', 'input[type="email"]', 'textarea']:
        try:
            el = await page.query_selector(selector)
            if el and await el.is_visible():
                return True
        except Exception:
            continue
    return False


async def _goto(page: Page, url: str) -> None:
    await page.goto(url, wait_until="domcontentloaded", timeout=25000)
    await asyncio.sleep(2)


async def _fill(page: Page, field_key: str, value: str) -> bool:
    for selector in _FIELD_SELECTORS.get(field_key, []):
        try:
            el = await page.query_selector(selector)
            if el and await el.is_visible():
                tag = (await el.evaluate("el => el.tagName")).lower()
                if tag == "select":
                    await el.select_option(label=value[:40])
                else:
                    await el.fill(value)
                return True
        except Exception:
            continue
    return False


async def _submit(page: Page) -> bool:
    for selector in [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:text("Submit")',
        'button:text("Add")',
        'button:text("Launch")',
        'button:text("Send")',
        'button:text("Publish")',
    ]:
        try:
            btn = await page.query_selector(selector)
            if btn and await btn.is_visible():
                await btn.click()
                await asyncio.sleep(3)
                return True
        except Exception:
            continue
    return False


async def _dismiss_cookie_banner(page: Page) -> None:
    for selector in [
        'button:text("Accept")', 'button:text("Accept all")',
        'button:text("Accept All")', 'button:text("I agree")',
        'button:text("Got it")', 'button:text("Close")',
        '[aria-label="Accept cookies"]', '#cookie-accept', '.cookie-accept',
    ]:
        try:
            btn = await page.query_selector(selector)
            if btn and await btn.is_visible(timeout=2000):
                await btn.click()
                await asyncio.sleep(1)
                return
        except Exception:
            continue


async def _screenshot(page: Page, name: str) -> str:
    path = str(SCREENSHOT_DIR / f"{name}.png")
    await page.screenshot(path=path, full_page=True)
    return path
