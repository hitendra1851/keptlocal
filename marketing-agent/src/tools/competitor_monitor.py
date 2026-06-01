"""Scrape competitor blogs for recently published content."""
from __future__ import annotations

import asyncio

from playwright.async_api import async_playwright

from config import COMPETITORS

_BLOG_URLS: dict[str, str] = {
    "ilovepdf.com": "https://www.ilovepdf.com/blog",
    "smallpdf.com": "https://smallpdf.com/blog",
    "pdf24.org": "https://www.pdf24.org/en/blog/",
    "iloveimg.com": "https://www.iloveimg.com/blog",
}


async def monitor_competitors() -> str:
    findings: list[str] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for domain in COMPETITORS:
            posts = await _scrape_recent_posts(page, domain)
            if posts:
                findings.append(f"**{domain}** — {len(posts)} recent post(s):")
                for post in posts:
                    findings.append(f"  - [{post['title']}]({post['url']})")
            else:
                findings.append(f"**{domain}** — no recent posts detected")

        await browser.close()

    return "\n".join(findings) if findings else "No competitor content detected."


async def _scrape_recent_posts(page, domain: str) -> list[dict]:
    url = _BLOG_URLS.get(domain)
    if not url:
        return []

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(2)

        links = await page.query_selector_all("article a, .post a, h2 a, h3 a, .entry-title a")
        posts: list[dict] = []
        seen: set[str] = set()

        for link in links[:30]:
            href = (await link.get_attribute("href") or "").strip()
            title = (await link.inner_text()).strip()
            if not title or not href or href in seen or len(title) < 10:
                continue
            seen.add(href)
            if not href.startswith("http"):
                href = f"https://{domain}{href}"
            posts.append({"title": title, "url": href})
            if len(posts) >= 5:
                break

        return posts
    except Exception:
        return []
