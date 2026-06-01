"""
Auto-submit keptlocal.com to tool directories using Playwright.

DRY_RUN=true (default) fills forms and screenshots them without clicking Submit.
Set DRY_RUN=false in env to enable live submission.
"""
from __future__ import annotations

import asyncio
import base64
import datetime
import os
from pathlib import Path
from typing import Any

from playwright.async_api import Page, async_playwright

from config import KNOWN_DIRECTORIES, SITE_DESCRIPTION

# ── Constants ─────────────────────────────────────────────────────────────────

SITE_URL = "https://keptlocal.com"
SITE_NAME = "keptlocal"
SITE_TAGLINE = "Free PDF & image tools — files never leave your browser"
CONTACT_EMAIL = os.environ.get("SUBMISSION_EMAIL", "hitendra.patel2986@gmail.com")
DRY_RUN = os.environ.get("DRY_RUN", "true").lower() != "false"

SCREENSHOT_DIR = Path("marketing/screenshots") / datetime.date.today().isoformat()

# Fields to try filling for each logical slot
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


# ── Public entry point ────────────────────────────────────────────────────────

async def find_and_submit_directories() -> str:
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    results: list[str] = []
    mode = "DRY RUN — screenshots only" if DRY_RUN else "LIVE SUBMISSION"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        for directory in KNOWN_DIRECTORIES:
            handler = _HANDLERS.get(directory["name"])
            if not handler:
                results.append(f"**{directory['name']}** — No handler yet. Submit manually: {directory['submit_url']}")
                continue

            try:
                status = await handler(page, directory)
                results.append(f"**{directory['name']}** — {status} ({mode})")
            except Exception as e:
                await _screenshot(page, f"{directory['name'].lower().replace(' ', '-')}-error")
                results.append(f"**{directory['name']}** — Error: {e}. Submit manually: {directory['submit_url']}")

        await browser.close()

    header = f"_Mode: {mode}. Screenshots saved to {SCREENSHOT_DIR}_\n\n"
    return header + "\n".join(results)


# ── Per-directory handlers ────────────────────────────────────────────────────

async def _submit_tinytools(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)

    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)

    await _screenshot(page, "tinytools-filled")

    if not DRY_RUN:
        submitted = await _submit(page)
        await _screenshot(page, "tinytools-submitted")
        return "Submitted" if submitted else "Submit button not found — check screenshot"

    return "Form filled — screenshot saved"


async def _submit_uneed(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)

    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)

    await _screenshot(page, "uneed-filled")

    if not DRY_RUN:
        submitted = await _submit(page)
        await _screenshot(page, "uneed-submitted")
        return "Submitted" if submitted else "Submit button not found — check screenshot"

    return "Form filled — screenshot saved"


async def _submit_fazier(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)

    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)

    await _screenshot(page, "fazier-filled")

    if not DRY_RUN:
        submitted = await _submit(page)
        await _screenshot(page, "fazier-submitted")
        return "Submitted" if submitted else "Submit button not found — check screenshot"

    return "Form filled — screenshot saved"


async def _submit_saashub(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)

    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)

    await _screenshot(page, "saashub-filled")

    if not DRY_RUN:
        submitted = await _submit(page)
        await _screenshot(page, "saashub-submitted")
        return "Submitted" if submitted else "Submit button not found — check screenshot"

    return "Form filled — screenshot saved"


async def _submit_prototypr(page: Page, directory: dict) -> str:
    await _goto(page, directory["submit_url"])
    await _dismiss_cookie_banner(page)

    await _fill(page, "url", SITE_URL)
    await _fill(page, "name", SITE_NAME)
    await _fill(page, "tagline", SITE_TAGLINE)
    await _fill(page, "description", SITE_DESCRIPTION)
    await _fill(page, "email", CONTACT_EMAIL)

    await _screenshot(page, "prototypr-filled")

    if not DRY_RUN:
        submitted = await _submit(page)
        await _screenshot(page, "prototypr-submitted")
        return "Submitted" if submitted else "Submit button not found — check screenshot"

    return "Form filled — screenshot saved"


_HANDLERS: dict[str, Any] = {
    "Tinytools.directory": _submit_tinytools,
    "Uneed": _submit_uneed,
    "Fazier": _submit_fazier,
    "SaaSHub": _submit_saashub,
    "Prototypr": _submit_prototypr,
}


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _goto(page: Page, url: str) -> None:
    await page.goto(url, wait_until="domcontentloaded", timeout=25000)
    await asyncio.sleep(2)


async def _fill(page: Page, field_key: str, value: str) -> bool:
    """Try each selector for the field until one works. Returns True if filled."""
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
    """Click the first visible submit button."""
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
    """Accept/close cookie consent dialogs if present."""
    for selector in [
        'button:text("Accept")',
        'button:text("Accept all")',
        'button:text("Accept All")',
        'button:text("I agree")',
        'button:text("Got it")',
        'button:text("Close")',
        '[aria-label="Accept cookies"]',
        '#cookie-accept', '.cookie-accept',
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
    """Save a screenshot and return the file path."""
    path = str(SCREENSHOT_DIR / f"{name}.png")
    await page.screenshot(path=path, full_page=True)
    return path
