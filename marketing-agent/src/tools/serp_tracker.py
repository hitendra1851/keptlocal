"""Track Google SERP rankings for keptlocal.com target keywords.

Prefers the Serper.dev API when SERPER_API_KEY is set — Google blocks
headless-browser scraping (it redirects straight to /sorry/), so the
Playwright path exists only as a fallback and reports blocked checks
honestly instead of pretending the site isn't ranked.
"""
from __future__ import annotations

import asyncio
import json
import os
import random
import urllib.parse
import urllib.request

from playwright.async_api import async_playwright

from config import TARGET_KEYWORDS

# Sentinel outcomes for a rank check that did not produce a position.
# "not ranked" means the SERP parsed fine and keptlocal.com wasn't in it;
# "blocked" means Google served a captcha/empty page, so the rank is UNKNOWN.
NOT_RANKED = "not_ranked"
BLOCKED = "blocked"

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

    serper_key = os.environ.get("SERPER_API_KEY")
    if serper_key:
        results = _check_ranks_serper(serper_key)
    else:
        results = await _check_ranks_playwright()

    if not results:
        return "No ranking data collected."

    blocked_count = 0
    lines = ["| Keyword | Position | Change |", "|---------|----------|--------|"]
    for r in results:
        kw = r["keyword"]
        pos = r["position"]
        if isinstance(pos, int):
            pos_str = str(pos)
        elif pos == NOT_RANKED:
            pos_str = "not in top 30"
        else:
            pos_str = "check failed"
            blocked_count += 1

        prev_pos = prev.get(kw)
        if not isinstance(pos, int) or prev_pos is None:
            delta = "—"
        elif pos < prev_pos:
            delta = f"▲ {prev_pos - pos}"
        elif pos > prev_pos:
            delta = f"▼ {pos - prev_pos}"
        else:
            delta = "="

        lines.append(f"| {kw} | {pos_str} | {delta} |")

    table = "\n".join(lines)
    if blocked_count:
        if serper_key:
            table += (
                f"\n\n_{blocked_count} of {len(results)} Serper API checks failed — "
                "verify the API key and remaining credits at serper.dev._"
            )
        else:
            table += (
                f"\n\n_{blocked_count} of {len(results)} checks were blocked by Google bot "
                "detection — those rankings are unknown, not absent. Set SERPER_API_KEY "
                "to use the Serper.dev API for reliable data._"
            )
    return table


def _check_ranks_serper(api_key: str) -> list[dict]:
    """Look up rankings via the Serper.dev Google Search API (no scraping)."""
    results: list[dict] = []
    for keyword in TARGET_KEYWORDS:
        results.append({"keyword": keyword, "position": _serper_rank(api_key, keyword)})
    return results


def _serper_rank(api_key: str, keyword: str) -> int | str:
    body = json.dumps({"q": keyword, "num": 30, "gl": "us", "hl": "en"}).encode()
    req = urllib.request.Request(
        "https://google.serper.dev/search",
        data=body,
        headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read())
    except Exception:
        return BLOCKED
    for item in data.get("organic", []):
        if "keptlocal.com" in item.get("link", ""):
            return int(item.get("position", 0)) or NOT_RANKED
    return NOT_RANKED


async def _check_ranks_playwright() -> list[dict]:
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

        blocked_streak = 0
        for keyword in TARGET_KEYWORDS:
            position = await _check_rank(page, keyword)
            results.append({"keyword": keyword, "position": position})
            if position == BLOCKED:
                blocked_streak += 1
                # Google has flagged this session — further checks will all fail.
                if blocked_streak >= 5:
                    for kw in TARGET_KEYWORDS[len(results):]:
                        results.append({"keyword": kw, "position": BLOCKED})
                    break
            else:
                blocked_streak = 0
            await asyncio.sleep(random.uniform(4, 9))

        await browser.close()

    return results


async def _check_rank(page, keyword: str) -> int | str:
    """Return 1-based organic Google position for keptlocal.com,
    NOT_RANKED if the SERP parsed but keptlocal.com isn't in the top 30,
    or BLOCKED if Google refused to serve results (captcha, empty page, error)."""
    try:
        query = urllib.parse.quote_plus(keyword)
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

        # Google's bot-detection page redirects to /sorry/
        if "/sorry/" in page.url:
            return BLOCKED
        body_text = (await page.inner_text("body"))[:2000].lower()
        if "unusual traffic" in body_text or "not a robot" in body_text:
            return BLOCKED
        for selector in _CAPTCHA_SIGNALS:
            try:
                el = await page.query_selector(selector)
                if el and await el.is_visible():
                    return BLOCKED
            except Exception:
                pass

        # Organic results: external anchors wrapping an h3 title inside the
        # results container. Ads ("/aclk?") and Google-internal links are skipped.
        anchors = await page.query_selector_all(
            "#search a[href^='http']:has(h3), #rso a[href^='http']:has(h3)"
        )
        if not anchors:
            anchors = await page.query_selector_all("a[href^='http']:has(h3)")

        position = 0
        seen_hrefs: set[str] = set()
        for el in anchors:
            href = (await el.get_attribute("href") or "").strip()
            if not href or href in seen_hrefs:
                continue
            if "google.com" in href or "/aclk?" in href:
                continue
            seen_hrefs.add(href)
            position += 1
            if "keptlocal.com" in href:
                return position
            if position >= 30:
                break

        # Zero organic results parsed means Google served a captcha/empty page
        # (or changed markup) — the rank is unknown, not absent.
        if position == 0:
            return BLOCKED
        return NOT_RANKED
    except Exception:
        return BLOCKED
