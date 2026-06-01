"""Track Google SERP rankings for keptlocal.com target keywords."""
from __future__ import annotations

import asyncio
import os

from playwright.async_api import async_playwright

from config import TARGET_KEYWORDS

# Injected into every new page to remove the webdriver fingerprint
_STEALTH_SCRIPT = """
Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3]});
Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
window.chrome = {runtime: {}};
"""

# Selectors that indicate Google is showing a captcha / bot-detection page
_CAPTCHA_SIGNALS = [
    "form#captcha-form",
    "#recaptcha",
    "div.g-recaptcha",
    'input[name="captcha"]',
]


async def track_keyword_rankings(github_token: str | None = None, github_repo: str | None = None) -> str:
    prev: dict[str, int | None] = {}
    if github_token and github_repo:
        try:
            from tools.report_parser import get_previous_rankings
            prev = get_previous_rankings(github_token, github_repo)
        except Exception:
            pass  # first run — no previous data

    results: list[dict] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
            locale="en-US",
        )
        await context.add_init_script(_STEALTH_SCRIPT)
        page = await context.new_page()

        for keyword in TARGET_KEYWORDS:
            position = await _check_rank(page, keyword)
            results.append({"keyword": keyword, "position": position})
            await asyncio.sleep(3)

        await browser.close()

    if not results:
        return "No ranking data collected."

    lines = ["| Keyword | Position | Change |", "|---------|----------|--------|"]
    for r in results:
        kw = r["keyword"]
        pos = r["position"]
        pos_str = str(pos) if pos is not None else "—"

        prev_pos = prev.get(kw)
        if pos is None or prev_pos is None:
            delta = "—"
        elif pos < prev_pos:
            delta = f"▲ {prev_pos - pos}"
        elif pos > prev_pos:
            delta = f"▼ {pos - prev_pos}"
        else:
            delta = "="

        lines.append(f"| {kw} | {pos_str} | {delta} |")

    return "\n".join(lines)


async def _check_rank(page, keyword: str) -> int | None:
    """Return 1-based organic Google position for keptlocal.com, or None if not in top 30."""
    try:
        query = keyword.replace(" ", "+")
        await page.goto(
            f"https://www.google.com/search?q={query}&num=30&hl=en&gl=us",
            wait_until="domcontentloaded",
            timeout=25000,
        )
        await asyncio.sleep(2)

        # Accept EU cookie consent if present
        for btn_name in ("Accept all", "Reject all", "I agree"):
            try:
                btn = page.get_by_role("button", name=btn_name)
                if await btn.is_visible(timeout=1500):
                    await btn.click()
                    await asyncio.sleep(1)
                    break
            except Exception:
                pass

        # Detect captcha — skip this keyword if blocked
        for selector in _CAPTCHA_SIGNALS:
            try:
                el = await page.query_selector(selector)
                if el and await el.is_visible():
                    return None  # captcha detected, skip gracefully
            except Exception:
                pass

        # Count only organic results (skip ads: data-text-ad, .ads-ad, #tads)
        position = 0
        all_result_divs = await page.query_selector_all(
            "div.g:not([data-text-ad]):not(.ads-ad) a[href^='http'], "
            "div[data-hveid]:not([data-text-ad]) a[href^='http']"
        )
        seen_hrefs: set[str] = set()
        for el in all_result_divs:
            href = (await el.get_attribute("href") or "").strip()
            if not href or href in seen_hrefs:
                continue
            # Skip Google-internal links and ad URLs
            if "google.com" in href or "/aclk?" in href:
                continue
            seen_hrefs.add(href)
            position += 1
            if "keptlocal.com" in href:
                return position
            if position >= 30:
                break

        return None
    except Exception:
        return None
